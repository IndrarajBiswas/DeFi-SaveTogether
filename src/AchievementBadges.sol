// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title AchievementBadges
 * @notice ERC1155 NFT badges for platform milestones
 * @dev Badges are soulbound (non-transferable) achievement tokens
 */
contract AchievementBadges is ERC1155, Ownable {
    using Strings for uint256;

    // Badge IDs
    uint256 public constant FIRST_DEPOSIT = 1;
    uint256 public constant FIVE_WEEK_STREAK = 2;
    uint256 public constant TEN_WEEK_STREAK = 3;
    uint256 public constant FIRST_LOAN = 4;
    uint256 public constant LOAN_REPAID = 5;
    uint256 public constant GROUP_LEADER = 6;
    uint256 public constant SAVINGS_HERO = 7;  // 1000+ LabUSDT saved
    uint256 public constant CREDIT_BUILDER = 8;  // 3+ loans repaid
    uint256 public constant COMMUNITY_PILLAR = 9;  // Active in 5+ groups

    // Authorized minters (SavingsPool, CreditLine, etc.)
    mapping(address => bool) public authorizedMinters;

    // Badge metadata
    mapping(uint256 => string) public badgeNames;
    mapping(uint256 => string) public badgeDescriptions;

    // Track which badges each user has earned
    mapping(address => mapping(uint256 => bool)) public hasBadge;

    // Events
    event BadgeAwarded(address indexed user, uint256 indexed badgeId, string badgeName);
    event MinterAuthorized(address indexed minter, bool authorized);
    event BadgeMetadataUpdated(uint256 indexed badgeId, string name, string description);

    constructor() ERC1155("https://savetogether.defi/api/badge/{id}.json") Ownable(msg.sender) {
        // Initialize badge metadata
        _setBadgeMetadata(FIRST_DEPOSIT, "First Deposit", "Made their first deposit to the savings pool");
        _setBadgeMetadata(FIVE_WEEK_STREAK, "5-Week Streak", "Maintained 5 consecutive weeks of savings");
        _setBadgeMetadata(TEN_WEEK_STREAK, "10-Week Streak", "Maintained 10 consecutive weeks of savings");
        _setBadgeMetadata(FIRST_LOAN, "First Loan", "Opened their first microfinance loan");
        _setBadgeMetadata(LOAN_REPAID, "Loan Repaid", "Successfully repaid a loan in full");
        _setBadgeMetadata(GROUP_LEADER, "Group Leader", "Created and leads a savings group");
        _setBadgeMetadata(SAVINGS_HERO, "Savings Hero", "Saved over 1000 LabUSDT");
        _setBadgeMetadata(CREDIT_BUILDER, "Credit Builder", "Repaid 3 or more loans successfully");
        _setBadgeMetadata(COMMUNITY_PILLAR, "Community Pillar", "Active member of 5+ savings groups");
    }

    /**
     * @notice Award a badge to a user
     * @param user Address to receive the badge
     * @param badgeId ID of the badge to award
     */
    function awardBadge(address user, uint256 badgeId) external {
        require(authorizedMinters[msg.sender] || msg.sender == owner(), "Not authorized to mint");
        require(!hasBadge[user][badgeId], "User already has this badge");
        require(badgeId >= 1 && badgeId <= COMMUNITY_PILLAR, "Invalid badge ID");

        hasBadge[user][badgeId] = true;
        _mint(user, badgeId, 1, "");

        emit BadgeAwarded(user, badgeId, badgeNames[badgeId]);
    }

    /**
     * @notice Award multiple badges to a user at once
     * @param user Address to receive badges
     * @param badgeIds Array of badge IDs to award
     */
    function awardBadges(address user, uint256[] calldata badgeIds) external {
        require(authorizedMinters[msg.sender] || msg.sender == owner(), "Not authorized to mint");

        uint256[] memory amounts = new uint256[](badgeIds.length);

        for (uint256 i = 0; i < badgeIds.length; i++) {
            uint256 badgeId = badgeIds[i];
            require(badgeId >= 1 && badgeId <= COMMUNITY_PILLAR, "Invalid badge ID");
            require(!hasBadge[user][badgeId], "User already has one of these badges");

            hasBadge[user][badgeId] = true;
            amounts[i] = 1;
            emit BadgeAwarded(user, badgeId, badgeNames[badgeId]);
        }

        _mintBatch(user, badgeIds, amounts, "");
    }

    /**
     * @notice Authorize/deauthorize a contract to mint badges
     * @param minter Address to authorize
     * @param authorized Whether to authorize or revoke
     */
    function setAuthorizedMinter(address minter, bool authorized) external onlyOwner {
        authorizedMinters[minter] = authorized;
        emit MinterAuthorized(minter, authorized);
    }

    /**
     * @notice Update badge metadata
     * @param badgeId ID of the badge
     * @param name Name of the badge
     * @param description Description of the achievement
     */
    function setBadgeMetadata(uint256 badgeId, string calldata name, string calldata description) external onlyOwner {
        _setBadgeMetadata(badgeId, name, description);
    }

    /**
     * @notice Get all badges earned by a user
     * @param user Address to query
     * @return Array of badge IDs the user has earned
     */
    function getUserBadges(address user) external view returns (uint256[] memory) {
        uint256 count = 0;

        // Count badges
        for (uint256 i = 1; i <= COMMUNITY_PILLAR; i++) {
            if (hasBadge[user][i]) {
                count++;
            }
        }

        // Populate array
        uint256[] memory badges = new uint256[](count);
        uint256 index = 0;
        for (uint256 i = 1; i <= COMMUNITY_PILLAR; i++) {
            if (hasBadge[user][i]) {
                badges[index] = i;
                index++;
            }
        }

        return badges;
    }

    /**
     * @notice Get badge details
     * @param badgeId ID of the badge
     * @return name Name of the badge
     * @return description Description of the achievement
     */
    function getBadgeInfo(uint256 badgeId) external view returns (string memory name, string memory description) {
        return (badgeNames[badgeId], badgeDescriptions[badgeId]);
    }

    /**
     * @notice Override URI to include badge ID
     */
    function uri(uint256 badgeId) public view override returns (string memory) {
        return string(abi.encodePacked("https://savetogether.defi/api/badge/", badgeId.toString(), ".json"));
    }

    /**
     * @notice Badges are soulbound - disable transfers
     */
    function _update(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory values
    ) internal override {
        // Allow minting (from = 0) but block transfers
        require(from == address(0), "Badges are soulbound and cannot be transferred");
        super._update(from, to, ids, values);
    }

    /**
     * @dev Internal function to set badge metadata
     */
    function _setBadgeMetadata(uint256 badgeId, string memory name, string memory description) internal {
        badgeNames[badgeId] = name;
        badgeDescriptions[badgeId] = description;
        emit BadgeMetadataUpdated(badgeId, name, description);
    }
}
