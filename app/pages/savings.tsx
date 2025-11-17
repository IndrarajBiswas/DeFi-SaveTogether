import { FormEvent, useState, useEffect } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useBalance } from 'wagmi'
import { CONTRACTS, parseLabUSDT, formatLabUSDT } from '../lib/contracts'
import HelpDialog from '../components/HelpDialog'
import StatCard from '../components/StatCard'
import FormInput from '../components/FormInput'
import ProgressBar from '../components/ProgressBar'
import TransactionModal from '../components/TransactionModal'
import { useToast } from '../components/Toast'

export default function SavingsPage() {
  const { address, isConnected } = useAccount()
  const [depositAmount, setDepositAmount] = useState('100')
  const [withdrawAmount, setWithdrawAmount] = useState('0')
  const [error, setError] = useState<string | null>(null)
  const [showSavingsHelp, setShowSavingsHelp] = useState(false)
  const [showTxModal, setShowTxModal] = useState(false)
  const [txStatus, setTxStatus] = useState<'pending' | 'success' | 'error' | 'loading'>('loading')
  const toast = useToast()

  // Read user's LabUSDT balance
  const { data: usdtBalance } = useBalance({
    address: address,
    token: CONTRACTS.labUSDT.address,
  })

  // Read user's savings balance
  const { data: savingsBalance, refetch: refetchSavingsBalance } = useReadContract({
    ...CONTRACTS.savingsPool,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  })

  // Read user's streak
  const { data: streak, refetch: refetchStreak } = useReadContract({
    ...CONTRACTS.savingsPool,
    functionName: 'streak',
    args: address ? [address] : undefined,
  })

  // Read consecutive weeks
  const { data: consecutiveWeeks } = useReadContract({
    ...CONTRACTS.savingsPool,
    functionName: 'consecutiveWeeks',
    args: address ? [address] : undefined,
  })

  // Read allowance
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    ...CONTRACTS.labUSDT,
    functionName: 'allowance',
    args: address ? [address, CONTRACTS.savingsPool.address] : undefined,
  })

  // Write functions
  const { writeContract: approve, data: approveHash } = useWriteContract()
  const { writeContract: deposit, data: depositHash } = useWriteContract()
  const { writeContract: withdraw, data: withdrawHash } = useWriteContract()

  // Wait for transactions
  const { isLoading: isApproving, isSuccess: approveSuccess } = useWaitForTransactionReceipt({ hash: approveHash })
  const { isLoading: isDepositing, isSuccess: depositSuccess } = useWaitForTransactionReceipt({ hash: depositHash })
  const { isLoading: isWithdrawing, isSuccess: withdrawSuccess } = useWaitForTransactionReceipt({ hash: withdrawHash })

  // Handle transaction successes with toast notifications
  useEffect(() => {
    if (approveSuccess) {
      refetchAllowance()
      toast.success('Approval Successful', 'You can now deposit LabUSDT to your savings.')
    }
  }, [approveSuccess, refetchAllowance, toast])

  useEffect(() => {
    if (depositSuccess) {
      refetchSavingsBalance()
      refetchStreak()
      toast.success('Deposit Successful', 'Your savings streak has been updated!')
      setDepositAmount('100')
    }
  }, [depositSuccess, refetchSavingsBalance, refetchStreak, toast])

  useEffect(() => {
    if (withdrawSuccess) {
      refetchSavingsBalance()
      toast.warning('Withdrawal Successful', 'Your savings streak has been reset to zero.')
      setWithdrawAmount('0')
    }
  }, [withdrawSuccess, refetchSavingsBalance, toast])

  const handleApprove = () => {
    setError(null)
    approve({
      ...CONTRACTS.labUSDT,
      functionName: 'approve',
      args: [CONTRACTS.savingsPool.address, parseLabUSDT(10000)], // Approve 10k
    })
  }

  const handleDeposit = (evt: FormEvent) => {
    evt.preventDefault()
    setError(null)

    if (!isConnected) {
      setError('Please connect your wallet first')
      return
    }

    const amount = parseFloat(depositAmount)
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid deposit amount')
      return
    }

    deposit({
      ...CONTRACTS.savingsPool,
      functionName: 'deposit',
      args: [parseLabUSDT(amount)],
    })
  }

  const handleWithdraw = (evt: FormEvent) => {
    evt.preventDefault()
    setError(null)

    const amount = parseFloat(withdrawAmount)
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid withdrawal amount')
      return
    }

    if (savingsBalance && parseLabUSDT(amount) > (savingsBalance as bigint)) {
      setError('Insufficient savings balance')
      return
    }

    withdraw({
      ...CONTRACTS.savingsPool,
      functionName: 'withdraw',
      args: [parseLabUSDT(amount)],
    })
  }

  const needsApproval = !allowance || (allowance as bigint) < parseLabUSDT(parseFloat(depositAmount) || 0)

  return (
    <div className="grid">
      {/* Hero */}
      <section className="card-hero">
        <h1>💰 Savings Pool</h1>
        <p>Build your savings streak to unlock loan eligibility. Deposit weekly to maintain your reputation.</p>
        <button
          className="help-button"
          onClick={() => setShowSavingsHelp(true)}
          style={{ marginTop: '1rem' }}
        >
          <span className="help-button-icon">?</span>
          How Savings Work
        </button>
      </section>

      {/* User Stats */}
      {isConnected ? (
        <section className="card">
          <h2>Your Savings</h2>
          <div className="stats-grid" style={{ marginTop: '1.5rem' }}>
            <StatCard
              value={usdtBalance ? Number(usdtBalance.formatted).toFixed(2) : '0.00'}
              label="Wallet Balance"
              icon="💵"
            />
            <StatCard
              value={savingsBalance ? formatLabUSDT(savingsBalance as bigint) : '0.00'}
              label="Savings Balance"
              icon="💰"
            />
            <StatCard
              value={streak?.toString() || '0'}
              label="Current Streak"
              icon="🔥"
            />
            <StatCard
              value={consecutiveWeeks?.toString() || '0'}
              label="Consecutive Weeks"
              icon="📅"
            />
          </div>

          {/* Streak Progress Bar */}
          <div style={{ marginTop: '1.5rem' }}>
            <ProgressBar
              value={Number(streak || 0)}
              max={5}
              label="Loan Eligibility Progress"
              variant={Number(streak || 0) >= 5 ? 'success' : 'default'}
            />
          </div>

          {streak && Number(streak) >= 5 ? (
            <div className="alert alert-success" style={{ marginTop: '1.5rem' }}>
              ✅ <strong>Loan Eligible!</strong> You have {streak.toString()} weeks of savings streak. You can now
              request loans.
            </div>
          ) : null}

          {streak && Number(streak) < 5 && Number(streak) > 0 ? (
            <div className="alert alert-info" style={{ marginTop: '1.5rem' }}>
              💪 Keep going! You need {5 - Number(streak)} more weeks of consecutive savings to unlock loan
              eligibility.
            </div>
          ) : null}
        </section>
      ) : (
        <section className="card">
          <h2>Connect Wallet</h2>
          <p>Please connect your wallet to view your savings and make deposits.</p>
        </section>
      )}

      {/* Deposit */}
      <section className="card">
        <h2>Deposit Savings</h2>
        {error && <div className="alert alert-error">{error}</div>}

        {needsApproval && isConnected && (
          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ marginBottom: '1rem' }}>
              First, you need to approve the SavingsPool contract to spend your LabUSDT.
            </p>
            <button onClick={handleApprove} disabled={isApproving} className="button">
              {isApproving ? (
                <>
                  <span className="spinner" /> Approving...
                </>
              ) : (
                'Approve LabUSDT'
              )}
            </button>
          </div>
        )}

        <form className="form" onSubmit={handleDeposit}>
          <label>
            Amount (LabUSDT)
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder="100"
              step="0.01"
              min="0"
            />
          </label>
          <button type="submit" disabled={!isConnected || needsApproval || isDepositing} className="button">
            {isDepositing ? (
              <>
                <span className="spinner spinner-white" /> Depositing...
              </>
            ) : (
              'Deposit to Savings'
            )}
          </button>
        </form>

        {depositHash && (
          <a
            href={`https://explorer.didlab.org/tx/${depositHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="tx-link"
          >
            View Transaction →
          </a>
        )}

        {depositSuccess && (
          <div className="alert alert-success" style={{ marginTop: '1rem' }}>
            ✅ Deposit successful! Your streak has been updated.
          </div>
        )}
      </section>

      {/* Withdraw */}
      <section className="card">
        <h2>Withdraw Savings</h2>
        <p style={{ marginBottom: '1rem' }}>
          ⚠️ <strong>Warning:</strong> Withdrawing will reset your savings streak to zero!
        </p>

        <form className="form" onSubmit={handleWithdraw}>
          <label>
            Amount (LabUSDT)
            <input
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="0"
              step="0.01"
              min="0"
              max={savingsBalance ? formatLabUSDT(savingsBalance as bigint) : '0'}
            />
          </label>
          <button
            type="submit"
            disabled={!isConnected || isWithdrawing || !savingsBalance || savingsBalance === BigInt(0)}
            className="button button-outline"
          >
            {isWithdrawing ? (
              <>
                <span className="spinner" /> Withdrawing...
              </>
            ) : (
              'Withdraw Savings'
            )}
          </button>
        </form>

        {withdrawHash && (
          <a
            href={`https://explorer.didlab.org/tx/${withdrawHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="tx-link"
          >
            View Transaction →
          </a>
        )}

        {withdrawSuccess && (
          <div className="alert alert-success" style={{ marginTop: '1rem' }}>
            ✅ Withdrawal successful!
          </div>
        )}
      </section>

      {/* FAQ */}
      <section className="card" style={{ gridColumn: '1 / -1' }}>
        <h2>Frequently Asked Questions</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>What is a savings streak?</h3>
            <p style={{ margin: 0 }}>
              Your savings streak is the number of consecutive weeks you&apos;ve made deposits. It demonstrates financial
              discipline and is required to access loans.
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Why do I need 5 weeks?</h3>
            <p style={{ margin: 0 }}>
              The 5-week minimum streak requirement shows consistent savings behavior and reduces default risk. It&apos;s
              based on proven microfinance principles.
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Can I deposit multiple times per week?</h3>
            <p style={{ margin: 0 }}>
              Yes! Multiple deposits in the same week count as one week for your streak. Your total balance increases
              with each deposit.
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>What happens if I miss a week?</h3>
            <p style={{ margin: 0 }}>
              If you skip a week, your streak resets to 1 when you make your next deposit. You&apos;ll need to build back
              up to 5 consecutive weeks.
            </p>
          </div>
        </div>
      </section>

      {/* How Savings Work Help Dialog */}
      <HelpDialog
        isOpen={showSavingsHelp}
        onClose={() => setShowSavingsHelp(false)}
        title="How Savings Work"
        icon="💰"
      >
        <div>
          <h3>Deposit Weekly</h3>
          <p>
            Make deposits every week to build your savings streak. The amount can vary, but consistency
            is key. Each deposit within a 7-day period counts toward your streak.
          </p>

          <h3>Build Reputation</h3>
          <p>
            A 5-week consecutive streak unlocks loan eligibility. This demonstrates financial discipline
            and reduces default risk. Your streak is your reputation in the SaveTogether ecosystem.
          </p>

          <h3>Maintain Streak</h3>
          <p>
            Missing a week resets your streak back to zero. If you skip a week, you&apos;ll need to start over
            and build back up to 5 consecutive weeks. Plan ahead to maintain your streak.
          </p>

          <h3>Withdrawing Resets</h3>
          <p>
            Any withdrawal will reset your streak counter to zero. This is an important safeguard in the
            system. Only withdraw when absolutely necessary, as you&apos;ll lose your loan eligibility until you
            rebuild your streak.
          </p>

          <h3>Earn Interest (Coming Soon)</h3>
          <p>
            In future updates, you&apos;ll earn yield on your savings balance. Your funds will work for you while
            building your reputation, creating a win-win scenario for savers.
          </p>
        </div>
      </HelpDialog>
    </div>
  )
}
