/**
 * Smart Contract Integration
 *
 * This file provides contract addresses and ABIs for the DeFi SaveTogether platform.
 * To use these contracts, you'll need to:
 * 1. Compile contracts with `forge build` to generate ABIs
 * 2. Copy ABIs from `out/` directory
 * 3. Import and use with wagmi hooks
 */

// Contract addresses from .env
export const CONTRACTS = {
  labUSDT: {
    address: (process.env.NEXT_PUBLIC_STABLE_TOKEN || '0x196352460396EE701e419439837FDFf5C451A4c6') as `0x${string}`,
    abi: [
      // Standard ERC20 ABI (minimal - add full ABI after compilation)
      'function balanceOf(address owner) view returns (uint256)',
      'function approve(address spender, uint256 amount) returns (bool)',
      'function allowance(address owner, address spender) view returns (uint256)',
      'function transfer(address to, uint256 amount) returns (bool)',
      'function decimals() view returns (uint8)',
      'function symbol() view returns (string)',
      'function name() view returns (string)',
    ],
  },

  savingsPool: {
    address: (process.env.NEXT_PUBLIC_CONTRACT_SAVINGS_POOL || '0x585EE16799bEE3cE0A221B2D4aC12313158344cE') as `0x${string}`,
    abi: [
      // TODO: Replace with actual ABI from out/SavingsPool.sol/SavingsPool.json
      // For now, using minimal interface
      'function deposit(uint256 amount) external',
      'function withdraw(uint256 amount) external',
      'function balanceOf(address user) view returns (uint256)',
      'function streak(address user) view returns (uint40)',
      'function lastWeek(address user) view returns (uint40)',
      'function consecutiveWeeks(address user) view returns (uint40)',
      'event Deposited(address indexed user, uint256 amount, uint40 week)',
      'event Withdrawn(address indexed user, uint256 amount)',
    ],
  },

  groupVault: {
    address: (process.env.NEXT_PUBLIC_CONTRACT_GROUP_VAULT || '0xa0F8BFa8aa5E0a6Cbe7EB8c6BCF56E0e75Bfb39B') as `0x${string}`,
    abi: [
      // TODO: Replace with actual ABI
      'function createGroup(address[] calldata members, uint256 minApprovals) external returns (uint256)',
      'function lockStake(uint256 gid, uint256 amount) external',
      'function approveLoan(uint256 gid, uint256 pseudoId) external',
      'function groupCount() view returns (uint256)',
      'function getGroup(uint256 gid) view returns (tuple(address[] members, uint256 minApprovals, uint256 stake, bool active))',
      'event GroupCreated(uint256 indexed gid, address[] members, uint256 minApprovals)',
      'event GroupStakeLocked(uint256 indexed gid, uint256 amount)',
      'event LoanApproved(uint256 indexed gid, uint256 pseudoId, address approver)',
    ],
  },

  creditLine: {
    address: (process.env.NEXT_PUBLIC_CONTRACT_CREDIT_LINE || '0xD7A9Ed10c7A50C8eD3A6cC450A7cDcDE7Fb9eDAa') as `0x${string}`,
    abi: [
      // TODO: Replace with actual ABI
      'function openLoan(uint256 gid, address borrower, uint256 principal, uint256 rateBps, uint40 termWeeks) external returns (uint256)',
      'function repay(uint256 loanId, uint256 amount) external',
      'function reschedule(uint256 loanId, uint40 extraWeeks) external',
      'function markDefault(uint256 loanId) external',
      'function totalDue(uint256 loanId) view returns (uint256)',
      'function dueAt(uint256 loanId, uint40 weekIdx) view returns (uint256)',
      'function loans(uint256 loanId) view returns (tuple(address borrower, uint256 principal, uint256 rateBps, uint40 start, uint40 termWeeks, uint256 repaid, uint256 groupId, bool defaulted))',
      'event LoanOpened(uint256 indexed loanId, address indexed borrower, uint256 principal, uint256 groupId)',
      'event Repayment(uint256 indexed loanId, uint256 amount)',
      'event LoanDefaulted(uint256 indexed loanId)',
    ],
  },

  attestationRegistry: {
    address: (process.env.NEXT_PUBLIC_CONTRACT_ATTESTATION_REGISTRY || '0x2a9775Ea77751580c749b79cD611Eb6e30Fa9Bbd') as `0x${string}`,
    abi: [
      'function attest(address user, uint8 level) external',
      'function levelOf(address user) view returns (uint8)',
      'event Attested(address indexed user, uint8 level, address indexed issuer)',
    ],
  },

  governanceLite: {
    address: (process.env.NEXT_PUBLIC_CONTRACT_GOVERNANCE || '0xE518d5027558cF834B5A50D06ABAC82979DA3112') as `0x${string}`,
    abi: [
      'function setParam(string calldata key, uint256 value) external',
      'function pause() external',
      'function unpause() external',
      'function groupMaxExposure() view returns (uint256)',
      'function minPrincipal() view returns (uint256)',
      'function maxPrincipal() view returns (uint256)',
      'function rateBpsPer4Weeks() view returns (uint256)',
      'function paused() view returns (bool)',
      'event ParamUpdated(string key, uint256 value)',
    ],
  },

  treasury: {
    address: (process.env.NEXT_PUBLIC_CONTRACT_TREASURY || '0x3111F51e8cd05E27157F16eE5DfC235B19808352') as `0x${string}`,
    abi: [
      'function sweep(address payable to) external',
    ],
  },

  achievementBadges: {
    address: (process.env.NEXT_PUBLIC_CONTRACT_ACHIEVEMENT_BADGES || '0x0000000000000000000000000000000000000000') as `0x${string}`,
    abi: [
      // View functions
      'function getUserBadges(address user) view returns (uint256[])',
      'function getBadgeInfo(uint256 badgeId) view returns (string name, string description)',
      'function hasBadge(address user, uint256 badgeId) view returns (bool)',
      'function badgeNames(uint256 badgeId) view returns (string)',
      'function badgeDescriptions(uint256 badgeId) view returns (string)',
      'function balanceOf(address account, uint256 id) view returns (uint256)',
      'function uri(uint256 badgeId) view returns (string)',

      // Badge ID constants
      'function FIRST_DEPOSIT() view returns (uint256)',
      'function FIVE_WEEK_STREAK() view returns (uint256)',
      'function TEN_WEEK_STREAK() view returns (uint256)',
      'function FIRST_LOAN() view returns (uint256)',
      'function LOAN_REPAID() view returns (uint256)',
      'function GROUP_LEADER() view returns (uint256)',
      'function SAVINGS_HERO() view returns (uint256)',
      'function CREDIT_BUILDER() view returns (uint256)',
      'function COMMUNITY_PILLAR() view returns (uint256)',

      // Admin functions
      'function awardBadge(address user, uint256 badgeId) external',
      'function awardBadges(address user, uint256[] calldata badgeIds) external',
      'function setAuthorizedMinter(address minter, bool authorized) external',
      'function setBadgeMetadata(uint256 badgeId, string calldata name, string calldata description) external',

      // Events
      'event BadgeAwarded(address indexed user, uint256 indexed badgeId, string badgeName)',
      'event MinterAuthorized(address indexed minter, bool authorized)',
      'event BadgeMetadataUpdated(uint256 indexed badgeId, string name, string description)',
    ],
  },
} as const

// Helper: Get all contract addresses for easy reference
export const CONTRACT_ADDRESSES = {
  labUSDT: CONTRACTS.labUSDT.address,
  savingsPool: CONTRACTS.savingsPool.address,
  groupVault: CONTRACTS.groupVault.address,
  creditLine: CONTRACTS.creditLine.address,
  attestationRegistry: CONTRACTS.attestationRegistry.address,
  governanceLite: CONTRACTS.governanceLite.address,
  treasury: CONTRACTS.treasury.address,
  achievementBadges: CONTRACTS.achievementBadges.address,
} as const

// Constants from contracts
export const CONSTANTS = {
  MIN_PRINCIPAL: 25_000000, // 25 LabUSDT (6 decimals)
  MAX_PRINCIPAL: 250_000000, // 250 LabUSDT
  PRINCIPAL_STEP: 5_000000, // 5 LabUSDT
  RATE_BPS: 200, // 2% per 4-week block
  LOAN_TERMS: [4, 8, 12] as const, // weeks
  MIN_GROUP_SIZE: 5,
  MAX_GROUP_SIZE: 8,
  MIN_APPROVALS: 3,
  LABUSDT_DECIMALS: 6,
} as const

// Helper functions
export function formatLabUSDT(amount: bigint): string {
  return (Number(amount) / 1_000000).toFixed(2)
}

export function parseLabUSDT(amount: number): bigint {
  return BigInt(Math.floor(amount * 1_000000))
}

export function calculateInterest(principal: number, termWeeks: number, rateBps: number = CONSTANTS.RATE_BPS): number {
  const blocks = Math.floor(termWeeks / 4)
  return (principal * rateBps * blocks) / 10000
}

export function calculateTotalDue(principal: number, termWeeks: number, rateBps: number = CONSTANTS.RATE_BPS): number {
  return principal + calculateInterest(principal, termWeeks, rateBps)
}

export function calculateWeeklyPayment(principal: number, termWeeks: number, rateBps: number = CONSTANTS.RATE_BPS): number {
  const total = calculateTotalDue(principal, termWeeks, rateBps)
  return termWeeks > 0 ? total / termWeeks : 0
}

/**
 * INSTRUCTIONS TO COMPLETE CONTRACT INTEGRATION:
 *
 * 1. Compile contracts:
 *    cd /home/user/DeFi-SaveTogether
 *    forge build
 *
 * 2. Extract ABIs:
 *    The ABIs will be in out/[ContractName].sol/[ContractName].json
 *    Example: out/SavingsPool.sol/SavingsPool.json
 *
 * 3. Replace the minimal ABIs above with full ABIs from compilation
 *
 * 4. Use in components with wagmi hooks:
 *    import { useReadContract, useWriteContract } from 'wagmi'
 *    import { CONTRACTS } from '../lib/contracts'
 *
 *    // Read example
 *    const { data: balance } = useReadContract({
 *      ...CONTRACTS.savingsPool,
 *      functionName: 'balanceOf',
 *      args: [address],
 *    })
 *
 *    // Write example
 *    const { writeContract } = useWriteContract()
 *    writeContract({
 *      ...CONTRACTS.savingsPool,
 *      functionName: 'deposit',
 *      args: [parseLabUSDT(100)],
 *    })
 */
