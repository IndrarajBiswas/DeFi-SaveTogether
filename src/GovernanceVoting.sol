// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./SaveToken.sol";

/**
 * @title GovernanceVoting
 * @notice On-chain governance for DeFi SaveTogether DAO
 * @dev Simple voting system with SAVE token weighted voting
 */
contract GovernanceVoting {
    SaveToken public immutable saveToken;

    // Proposal states
    enum ProposalState {
        Pending,
        Active,
        Canceled,
        Defeated,
        Succeeded,
        Executed
    }

    // Vote choices
    enum VoteChoice {
        Against,
        For,
        Abstain
    }

    struct Proposal {
        uint256 id;
        address proposer;
        string title;
        string description;
        uint256 forVotes;
        uint256 againstVotes;
        uint256 abstainVotes;
        uint256 startBlock;
        uint256 endBlock;
        bool executed;
        bool canceled;
        mapping(address => bool) hasVoted;
    }

    // Parameters
    uint256 public constant VOTING_DELAY = 1;  // blocks before voting starts
    uint256 public constant VOTING_PERIOD = 50400;  // ~1 week of blocks (12s per block)
    uint256 public constant PROPOSAL_THRESHOLD = 10000 * 10**18;  // 10,000 SAVE to propose
    uint256 public constant QUORUM = 100000 * 10**18;  // 100,000 SAVE minimum participation

    // State
    uint256 public proposalCount;
    mapping(uint256 => Proposal) public proposals;
    mapping(address => uint256[]) public userProposals;

    // Events
    event ProposalCreated(
        uint256 indexed proposalId,
        address indexed proposer,
        string title,
        uint256 startBlock,
        uint256 endBlock
    );
    event VoteCast(
        address indexed voter,
        uint256 indexed proposalId,
        VoteChoice choice,
        uint256 weight
    );
    event ProposalExecuted(uint256 indexed proposalId);
    event ProposalCanceled(uint256 indexed proposalId);

    constructor(address _saveToken) {
        saveToken = SaveToken(_saveToken);
    }

    /**
     * @notice Create a new governance proposal
     * @param title Title of the proposal
     * @param description Detailed description of the proposal
     * @return proposalId ID of the created proposal
     */
    function propose(string calldata title, string calldata description) external returns (uint256) {
        require(
            saveToken.getVotes(msg.sender) >= PROPOSAL_THRESHOLD,
            "Insufficient voting power to propose"
        );

        proposalCount++;
        uint256 proposalId = proposalCount;

        Proposal storage newProposal = proposals[proposalId];
        newProposal.id = proposalId;
        newProposal.proposer = msg.sender;
        newProposal.title = title;
        newProposal.description = description;
        newProposal.startBlock = block.number + VOTING_DELAY;
        newProposal.endBlock = block.number + VOTING_DELAY + VOTING_PERIOD;

        userProposals[msg.sender].push(proposalId);

        emit ProposalCreated(proposalId, msg.sender, title, newProposal.startBlock, newProposal.endBlock);

        return proposalId;
    }

    /**
     * @notice Cast a vote on a proposal
     * @param proposalId ID of the proposal
     * @param choice Vote choice (Against, For, Abstain)
     */
    function castVote(uint256 proposalId, VoteChoice choice) external {
        require(state(proposalId) == ProposalState.Active, "Voting is not active");

        Proposal storage proposal = proposals[proposalId];
        require(!proposal.hasVoted[msg.sender], "Already voted");

        uint256 weight = saveToken.getPastVotes(msg.sender, proposal.startBlock);
        require(weight > 0, "No voting power");

        proposal.hasVoted[msg.sender] = true;

        if (choice == VoteChoice.Against) {
            proposal.againstVotes += weight;
        } else if (choice == VoteChoice.For) {
            proposal.forVotes += weight;
        } else {
            proposal.abstainVotes += weight;
        }

        emit VoteCast(msg.sender, proposalId, choice, weight);
    }

    /**
     * @notice Execute a successful proposal
     * @param proposalId ID of the proposal to execute
     */
    function execute(uint256 proposalId) external {
        require(state(proposalId) == ProposalState.Succeeded, "Proposal not succeeded");

        Proposal storage proposal = proposals[proposalId];
        proposal.executed = true;

        emit ProposalExecuted(proposalId);
    }

    /**
     * @notice Cancel a proposal (proposer only)
     * @param proposalId ID of the proposal to cancel
     */
    function cancel(uint256 proposalId) external {
        Proposal storage proposal = proposals[proposalId];
        require(msg.sender == proposal.proposer, "Only proposer can cancel");
        require(state(proposalId) == ProposalState.Pending || state(proposalId) == ProposalState.Active, "Cannot cancel");

        proposal.canceled = true;

        emit ProposalCanceled(proposalId);
    }

    /**
     * @notice Get the current state of a proposal
     * @param proposalId ID of the proposal
     * @return Current proposal state
     */
    function state(uint256 proposalId) public view returns (ProposalState) {
        require(proposalId > 0 && proposalId <= proposalCount, "Invalid proposal ID");

        Proposal storage proposal = proposals[proposalId];

        if (proposal.canceled) {
            return ProposalState.Canceled;
        }

        if (proposal.executed) {
            return ProposalState.Executed;
        }

        if (block.number < proposal.startBlock) {
            return ProposalState.Pending;
        }

        if (block.number <= proposal.endBlock) {
            return ProposalState.Active;
        }

        // Calculate results
        uint256 totalVotes = proposal.forVotes + proposal.againstVotes + proposal.abstainVotes;

        if (totalVotes < QUORUM) {
            return ProposalState.Defeated;
        }

        if (proposal.forVotes > proposal.againstVotes) {
            return ProposalState.Succeeded;
        } else {
            return ProposalState.Defeated;
        }
    }

    /**
     * @notice Get proposal details
     * @param proposalId ID of the proposal
     * @return id Proposal ID
     * @return proposer Address of proposer
     * @return title Proposal title
     * @return description Proposal description
     * @return forVotes Number of for votes
     * @return againstVotes Number of against votes
     * @return abstainVotes Number of abstain votes
     * @return startBlock Block when voting starts
     * @return endBlock Block when voting ends
     */
    function getProposal(uint256 proposalId)
        external
        view
        returns (
            uint256 id,
            address proposer,
            string memory title,
            string memory description,
            uint256 forVotes,
            uint256 againstVotes,
            uint256 abstainVotes,
            uint256 startBlock,
            uint256 endBlock
        )
    {
        Proposal storage proposal = proposals[proposalId];
        return (
            proposal.id,
            proposal.proposer,
            proposal.title,
            proposal.description,
            proposal.forVotes,
            proposal.againstVotes,
            proposal.abstainVotes,
            proposal.startBlock,
            proposal.endBlock
        );
    }

    /**
     * @notice Check if an address has voted on a proposal
     * @param proposalId ID of the proposal
     * @param voter Address to check
     * @return Whether the address has voted
     */
    function hasVoted(uint256 proposalId, address voter) external view returns (bool) {
        return proposals[proposalId].hasVoted[voter];
    }

    /**
     * @notice Get all proposals by a user
     * @param user Address to query
     * @return Array of proposal IDs
     */
    function getUserProposals(address user) external view returns (uint256[] memory) {
        return userProposals[user];
    }

    /**
     * @notice Get proposal vote counts
     * @param proposalId ID of the proposal
     * @return forVotes Number of for votes
     * @return againstVotes Number of against votes
     * @return abstainVotes Number of abstain votes
     */
    function getProposalVotes(uint256 proposalId)
        external
        view
        returns (uint256 forVotes, uint256 againstVotes, uint256 abstainVotes)
    {
        Proposal storage proposal = proposals[proposalId];
        return (proposal.forVotes, proposal.againstVotes, proposal.abstainVotes);
    }

    /**
     * @notice Calculate percentage of votes in favor
     * @param proposalId ID of the proposal
     * @return Percentage (0-100)
     */
    function getApprovalPercentage(uint256 proposalId) external view returns (uint256) {
        Proposal storage proposal = proposals[proposalId];
        uint256 totalVotes = proposal.forVotes + proposal.againstVotes;

        if (totalVotes == 0) return 0;

        return (proposal.forVotes * 100) / totalVotes;
    }
}
