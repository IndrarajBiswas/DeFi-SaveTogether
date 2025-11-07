/**
 * Badge Monitoring Script
 *
 * Monitors platform events and automatically awards achievement badges
 * to users when they reach milestones.
 *
 * Run with: npx ts-node script/badge-monitor.ts
 */

import { createPublicClient, createWalletClient, http, parseAbi } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { didlabChain } from '../app/lib/chains'

// Load environment variables
const RPC_URL = process.env.DIDLAB_RPC_URL || 'https://eth.didlab.org'
const PRIVATE_KEY = process.env.BADGE_MINTER_PRIVATE_KEY as `0x${string}`
const SAVINGS_POOL_ADDRESS = process.env.SAVINGS_POOL as `0x${string}`
const CREDIT_LINE_ADDRESS = process.env.CREDIT_LINE as `0x${string}`
const GROUP_VAULT_ADDRESS = process.env.GROUP_VAULT as `0x${string}`
const ACHIEVEMENT_BADGES_ADDRESS = process.env.ACHIEVEMENT_BADGES as `0x${string}`

// Badge IDs
const BADGES = {
  FIRST_DEPOSIT: 1,
  FIVE_WEEK_STREAK: 2,
  TEN_WEEK_STREAK: 3,
  FIRST_LOAN: 4,
  LOAN_REPAID: 5,
  GROUP_LEADER: 6,
  SAVINGS_HERO: 7,
  CREDIT_BUILDER: 8,
  COMMUNITY_PILLAR: 9,
}

// ABIs
const savingsPoolAbi = parseAbi([
  'event Deposited(address indexed user, uint256 amount, uint40 week)',
  'function balanceOf(address user) view returns (uint256)',
  'function consecutiveWeeks(address user) view returns (uint16)',
])

const creditLineAbi = parseAbi([
  'event LoanOpened(uint256 indexed loanId, address borrower, uint256 principal, uint256 rateBps, uint40 termWeeks, uint256 gid)',
  'event Repaid(uint256 indexed loanId, address payer, uint256 amount, uint256 newRepaid)',
  'function loans(uint256 loanId) view returns (tuple(address borrower, uint256 principal, uint256 rateBps, uint40 start, uint40 termWeeks, uint256 repaid, uint256 groupId, bool defaulted))',
])

const groupVaultAbi = parseAbi([
  'event GroupCreated(uint256 indexed gid, address[] members, uint8 minApprovals)',
])

const badgesAbi = parseAbi([
  'function awardBadge(address user, uint256 badgeId) external',
  'function hasBadge(address user, uint256 badgeId) view returns (bool)',
])

// Tracking state
const userStats = new Map<string, {
  firstDeposit: boolean
  loansOpened: number
  loansRepaid: number
  groupsCreated: number
  groupsMemberOf: number
}>()

async function main() {
  console.log('🎖️  Starting Badge Monitor...')

  // Create clients
  const publicClient = createPublicClient({
    chain: didlabChain,
    transport: http(RPC_URL),
  })

  const account = privateKeyToAccount(PRIVATE_KEY)
  const walletClient = createWalletClient({
    account,
    chain: didlabChain,
    transport: http(RPC_URL),
  })

  console.log(`Monitoring from account: ${account.address}`)

  // Monitor deposits
  publicClient.watchContractEvent({
    address: SAVINGS_POOL_ADDRESS,
    abi: savingsPoolAbi,
    eventName: 'Deposited',
    onLogs: async (logs) => {
      for (const log of logs) {
        const { user, amount } = log.args as { user: `0x${string}`, amount: bigint }
        await handleDeposit(publicClient, walletClient, user, amount)
      }
    },
  })

  // Monitor loan opens
  publicClient.watchContractEvent({
    address: CREDIT_LINE_ADDRESS,
    abi: creditLineAbi,
    eventName: 'LoanOpened',
    onLogs: async (logs) => {
      for (const log of logs) {
        const { borrower } = log.args as { borrower: `0x${string}` }
        await handleLoanOpened(publicClient, walletClient, borrower)
      }
    },
  })

  // Monitor loan repayments
  publicClient.watchContractEvent({
    address: CREDIT_LINE_ADDRESS,
    abi: creditLineAbi,
    eventName: 'Repaid',
    onLogs: async (logs) => {
      for (const log of logs) {
        const { loanId } = log.args as { loanId: bigint }
        await handleRepayment(publicClient, walletClient, loanId)
      }
    },
  })

  // Monitor group creations
  publicClient.watchContractEvent({
    address: GROUP_VAULT_ADDRESS,
    abi: groupVaultAbi,
    eventName: 'GroupCreated',
    onLogs: async (logs) => {
      for (const log of logs) {
        const { members } = log.args as { members: `0x${string}`[] }
        if (members.length > 0) {
          await handleGroupCreated(publicClient, walletClient, members[0])
        }
      }
    },
  })

  console.log('✅ Monitoring active. Press Ctrl+C to stop.')
}

async function handleDeposit(
  publicClient: any,
  walletClient: any,
  user: `0x${string}`,
  amount: bigint
) {
  console.log(`📥 Deposit detected: ${user}`)

  // Award FIRST_DEPOSIT badge
  const hasFirstDeposit = await publicClient.readContract({
    address: ACHIEVEMENT_BADGES_ADDRESS,
    abi: badgesAbi,
    functionName: 'hasBadge',
    args: [user, BigInt(BADGES.FIRST_DEPOSIT)],
  })

  if (!hasFirstDeposit) {
    await awardBadge(walletClient, user, BADGES.FIRST_DEPOSIT, 'First Deposit')
  }

  // Check streak milestones
  const consecutiveWeeks = await publicClient.readContract({
    address: SAVINGS_POOL_ADDRESS,
    abi: savingsPoolAbi,
    functionName: 'consecutiveWeeks',
    args: [user],
  }) as number

  if (consecutiveWeeks >= 5) {
    const hasFiveWeek = await publicClient.readContract({
      address: ACHIEVEMENT_BADGES_ADDRESS,
      abi: badgesAbi,
      functionName: 'hasBadge',
      args: [user, BigInt(BADGES.FIVE_WEEK_STREAK)],
    })

    if (!hasFiveWeek) {
      await awardBadge(walletClient, user, BADGES.FIVE_WEEK_STREAK, '5-Week Streak')
    }
  }

  if (consecutiveWeeks >= 10) {
    const hasTenWeek = await publicClient.readContract({
      address: ACHIEVEMENT_BADGES_ADDRESS,
      abi: badgesAbi,
      functionName: 'hasBadge',
      args: [user, BigInt(BADGES.TEN_WEEK_STREAK)],
    })

    if (!hasTenWeek) {
      await awardBadge(walletClient, user, BADGES.TEN_WEEK_STREAK, '10-Week Streak')
    }
  }

  // Check savings hero (1000+ LabUSDT)
  const balance = await publicClient.readContract({
    address: SAVINGS_POOL_ADDRESS,
    abi: savingsPoolAbi,
    functionName: 'balanceOf',
    args: [user],
  }) as bigint

  if (balance >= 1000_000000n) {  // 1000 LabUSDT (6 decimals)
    const hasSavingsHero = await publicClient.readContract({
      address: ACHIEVEMENT_BADGES_ADDRESS,
      abi: badgesAbi,
      functionName: 'hasBadge',
      args: [user, BigInt(BADGES.SAVINGS_HERO)],
    })

    if (!hasSavingsHero) {
      await awardBadge(walletClient, user, BADGES.SAVINGS_HERO, 'Savings Hero')
    }
  }
}

async function handleLoanOpened(
  publicClient: any,
  walletClient: any,
  borrower: `0x${string}`
) {
  console.log(`💳 Loan opened: ${borrower}`)

  const hasFirstLoan = await publicClient.readContract({
    address: ACHIEVEMENT_BADGES_ADDRESS,
    abi: badgesAbi,
    functionName: 'hasBadge',
    args: [borrower, BigInt(BADGES.FIRST_LOAN)],
  })

  if (!hasFirstLoan) {
    await awardBadge(walletClient, borrower, BADGES.FIRST_LOAN, 'First Loan')
  }
}

async function handleRepayment(
  publicClient: any,
  walletClient: any,
  loanId: bigint
) {
  console.log(`💰 Repayment detected for loan #${loanId}`)

  // Get loan details
  const loan = await publicClient.readContract({
    address: CREDIT_LINE_ADDRESS,
    abi: creditLineAbi,
    functionName: 'loans',
    args: [loanId],
  }) as any

  const borrower = loan.borrower as `0x${string}`
  const principal = loan.principal as bigint
  const repaid = loan.repaid as bigint

  // Check if loan is fully repaid
  if (repaid >= principal) {
    const hasLoanRepaid = await publicClient.readContract({
      address: ACHIEVEMENT_BADGES_ADDRESS,
      abi: badgesAbi,
      functionName: 'hasBadge',
      args: [borrower, BigInt(BADGES.LOAN_REPAID)],
    })

    if (!hasLoanRepaid) {
      await awardBadge(walletClient, borrower, BADGES.LOAN_REPAID, 'Loan Repaid')
    }

    // TODO: Track multiple repaid loans for CREDIT_BUILDER badge
  }
}

async function handleGroupCreated(
  publicClient: any,
  walletClient: any,
  creator: `0x${string}`
) {
  console.log(`👥 Group created by: ${creator}`)

  const hasGroupLeader = await publicClient.readContract({
    address: ACHIEVEMENT_BADGES_ADDRESS,
    abi: badgesAbi,
    functionName: 'hasBadge',
    args: [creator, BigInt(BADGES.GROUP_LEADER)],
  })

  if (!hasGroupLeader) {
    await awardBadge(walletClient, creator, BADGES.GROUP_LEADER, 'Group Leader')
  }
}

async function awardBadge(
  walletClient: any,
  user: `0x${string}`,
  badgeId: number,
  badgeName: string
) {
  try {
    const hash = await walletClient.writeContract({
      address: ACHIEVEMENT_BADGES_ADDRESS,
      abi: badgesAbi,
      functionName: 'awardBadge',
      args: [user, BigInt(badgeId)],
    })

    console.log(`🎖️  Awarded "${badgeName}" badge to ${user}`)
    console.log(`   Transaction: https://explorer.didlab.org/tx/${hash}`)
  } catch (error) {
    console.error(`❌ Failed to award badge to ${user}:`, error)
  }
}

// Error handling
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled error:', error)
  process.exit(1)
})

// Run
main().catch((error) => {
  console.error('❌ Fatal error:', error)
  process.exit(1)
})
