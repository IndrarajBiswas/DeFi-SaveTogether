// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SaveToken
 * @notice ERC20 governance token for DeFi SaveTogether DAO
 * @dev Includes voting power delegation and snapshot capabilities
 */
contract SaveToken is ERC20, ERC20Votes, Ownable {
    // Total supply cap: 100 million tokens
    uint256 public constant MAX_SUPPLY = 100_000_000 * 10**18;

    // Emission schedule
    uint256 public constant INITIAL_SUPPLY = 10_000_000 * 10**18;  // 10M for initial distribution
    uint256 public constant COMMUNITY_ALLOCATION = 50_000_000 * 10**18;  // 50M for community rewards
    uint256 public constant TEAM_ALLOCATION = 20_000_000 * 10**18;  // 20M for team
    uint256 public constant TREASURY_ALLOCATION = 20_000_000 * 10**18;  // 20M for treasury

    // Reward parameters
    uint256 public savingsRewardRate = 100 * 10**18;  // 100 SAVE per 1000 LabUSDT saved per week
    uint256 public loanRepaymentReward = 50 * 10**18;  // 50 SAVE per loan repaid on time
    uint256 public groupParticipationReward = 25 * 10**18;  // 25 SAVE per month active in group

    // Authorized reward distributors
    mapping(address => bool) public rewardDistributors;

    // Community rewards pool tracking
    uint256 public communityRewardsDistributed;

    // Events
    event RewardDistributed(address indexed user, uint256 amount, string reason);
    event RewardDistributorUpdated(address indexed distributor, bool authorized);
    event RewardRatesUpdated(uint256 savings, uint256 loan, uint256 group);

    constructor()
        ERC20("SaveTogether", "SAVE")
        ERC20Permit("SaveTogether")
        Ownable(msg.sender)
    {
        // Mint initial supply to deployer for distribution
        _mint(msg.sender, INITIAL_SUPPLY);
    }

    /**
     * @notice Distribute rewards to users for platform participation
     * @param user Address to receive rewards
     * @param amount Amount of SAVE tokens to distribute
     * @param reason Description of why reward is being given
     */
    function distributeReward(address user, uint256 amount, string calldata reason) external {
        require(rewardDistributors[msg.sender], "Not authorized to distribute rewards");
        require(communityRewardsDistributed + amount <= COMMUNITY_ALLOCATION, "Exceeds community allocation");

        communityRewardsDistributed += amount;
        _mint(user, amount);

        emit RewardDistributed(user, amount, reason);
    }

    /**
     * @notice Batch distribute rewards to multiple users
     * @param users Array of addresses to receive rewards
     * @param amounts Array of reward amounts
     * @param reason Description of reward distribution
     */
    function batchDistributeRewards(
        address[] calldata users,
        uint256[] calldata amounts,
        string calldata reason
    ) external {
        require(rewardDistributors[msg.sender], "Not authorized to distribute rewards");
        require(users.length == amounts.length, "Array length mismatch");

        uint256 totalAmount = 0;
        for (uint256 i = 0; i < amounts.length; i++) {
            totalAmount += amounts[i];
        }

        require(communityRewardsDistributed + totalAmount <= COMMUNITY_ALLOCATION, "Exceeds community allocation");

        communityRewardsDistributed += totalAmount;

        for (uint256 i = 0; i < users.length; i++) {
            _mint(users[i], amounts[i]);
            emit RewardDistributed(users[i], amounts[i], reason);
        }
    }

    /**
     * @notice Calculate savings reward for a user
     * @param savingsAmount Amount saved in LabUSDT (6 decimals)
     * @param weeks Number of weeks saved
     * @return Reward amount in SAVE tokens
     */
    function calculateSavingsReward(uint256 savingsAmount, uint256 weeks) public view returns (uint256) {
        // Convert LabUSDT (6 decimals) to thousands
        uint256 thousands = savingsAmount / 1000_000;
        return (thousands * savingsRewardRate * weeks) / 1000;
    }

    /**
     * @notice Authorize/deauthorize reward distributor
     * @param distributor Address to authorize
     * @param authorized Whether to authorize or revoke
     */
    function setRewardDistributor(address distributor, bool authorized) external onlyOwner {
        rewardDistributors[distributor] = authorized;
        emit RewardDistributorUpdated(distributor, authorized);
    }

    /**
     * @notice Update reward rates
     * @param savings Savings reward rate per 1000 LabUSDT per week
     * @param loan Loan repayment reward
     * @param group Monthly group participation reward
     */
    function setRewardRates(uint256 savings, uint256 loan, uint256 group) external onlyOwner {
        savingsRewardRate = savings;
        loanRepaymentReward = loan;
        groupParticipationReward = group;
        emit RewardRatesUpdated(savings, loan, group);
    }

    /**
     * @notice Mint team allocation (owner only, one-time)
     * @param teamWallet Address to receive team tokens
     */
    function mintTeamAllocation(address teamWallet) external onlyOwner {
        require(totalSupply() < INITIAL_SUPPLY + TEAM_ALLOCATION, "Team allocation already minted");
        _mint(teamWallet, TEAM_ALLOCATION);
    }

    /**
     * @notice Mint treasury allocation (owner only, one-time)
     * @param treasury Address to receive treasury tokens
     */
    function mintTreasuryAllocation(address treasury) external onlyOwner {
        require(totalSupply() < INITIAL_SUPPLY + TEAM_ALLOCATION + TREASURY_ALLOCATION, "Treasury allocation already minted");
        _mint(treasury, TREASURY_ALLOCATION);
    }

    /**
     * @notice Get voting power of an account
     * @param account Address to query
     * @return Current voting power
     */
    function getVotingPower(address account) external view returns (uint256) {
        return getVotes(account);
    }

    /**
     * @notice Get past voting power at a specific block
     * @param account Address to query
     * @param blockNumber Historical block number
     * @return Past voting power
     */
    function getPastVotingPower(address account, uint256 blockNumber) external view returns (uint256) {
        return getPastVotes(account, blockNumber);
    }

    // Required overrides for ERC20Votes
    function _update(address from, address to, uint256 value) internal override(ERC20, ERC20Votes) {
        super._update(from, to, value);
    }

    function nonces(address owner) public view override(ERC20Permit, Nonces) returns (uint256) {
        return super.nonces(owner);
    }
}
