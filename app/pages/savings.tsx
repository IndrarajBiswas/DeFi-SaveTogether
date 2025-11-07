import { FormEvent, useState } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useBalance } from 'wagmi'
import { CONTRACTS, parseLabUSDT, formatLabUSDT } from '../lib/contracts'

export default function SavingsPage() {
  const { address, isConnected } = useAccount()
  const [depositAmount, setDepositAmount] = useState('100')
  const [withdrawAmount, setWithdrawAmount] = useState('0')
  const [error, setError] = useState<string | null>(null)

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

  // Refetch data after successful transactions
  if (approveSuccess) {
    refetchAllowance()
  }
  if (depositSuccess) {
    refetchSavingsBalance()
    refetchStreak()
  }
  if (withdrawSuccess) {
    refetchSavingsBalance()
  }

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

    if (savingsBalance && parseLabUSDT(amount) > savingsBalance) {
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
      </section>

      {/* User Stats */}
      {isConnected ? (
        <section className="card">
          <h2>Your Savings</h2>
          <div className="stats-grid" style={{ marginTop: '1.5rem' }}>
            <div className="stat-card">
              <div className="stat-value">
                {usdtBalance ? Number(usdtBalance.formatted).toFixed(2) : '0.00'}
              </div>
              <div className="stat-label">Wallet Balance</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                {savingsBalance ? formatLabUSDT(savingsBalance as bigint) : '0.00'}
              </div>
              <div className="stat-label">Savings Balance</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{streak?.toString() || '0'}</div>
              <div className="stat-label">Current Streak</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{consecutiveWeeks?.toString() || '0'}</div>
              <div className="stat-label">Consecutive Weeks</div>
            </div>
          </div>

          {streak && Number(streak) >= 5 && (
            <div className="alert alert-success" style={{ marginTop: '1.5rem' }}>
              ✅ <strong>Loan Eligible!</strong> You have {streak.toString()} weeks of savings streak. You can now
              request loans.
            </div>
          )}

          {streak && Number(streak) < 5 && Number(streak) > 0 && (
            <div className="alert alert-info" style={{ marginTop: '1.5rem' }}>
              💪 Keep going! You need {5 - Number(streak)} more weeks of consecutive savings to unlock loan
              eligibility.
            </div>
          )}
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
            <p style={{ marginBottom: '1rem', color: 'var(--gray-700)' }}>
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
        <p style={{ marginBottom: '1rem', color: 'var(--gray-700)' }}>
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
            disabled={!isConnected || isWithdrawing || !savingsBalance || savingsBalance === 0n}
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

      {/* How it Works */}
      <section className="card-dark">
        <h2>How Savings Work</h2>
        <ul className="list" style={{ marginTop: '1rem' }}>
          <li>
            <strong>Deposit Weekly:</strong> Make deposits every week to build your savings streak
          </li>
          <li>
            <strong>Build Reputation:</strong> A 5-week consecutive streak unlocks loan eligibility
          </li>
          <li>
            <strong>Maintain Streak:</strong> Missing a week resets your streak back to zero
          </li>
          <li>
            <strong>Withdrawing Resets:</strong> Any withdrawal will reset your streak counter
          </li>
          <li>
            <strong>Earn Interest:</strong> Future: Earn yield on your savings balance
          </li>
        </ul>
      </section>

      {/* FAQ */}
      <section className="card">
        <h2>Frequently Asked Questions</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>What is a savings streak?</h3>
            <p style={{ margin: 0, color: 'var(--gray-700)' }}>
              Your savings streak is the number of consecutive weeks you've made deposits. It demonstrates financial
              discipline and is required to access loans.
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Why do I need 5 weeks?</h3>
            <p style={{ margin: 0, color: 'var(--gray-700)' }}>
              The 5-week minimum streak requirement shows consistent savings behavior and reduces default risk. It's
              based on proven microfinance principles.
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Can I deposit multiple times per week?</h3>
            <p style={{ margin: 0, color: 'var(--gray-700)' }}>
              Yes! Multiple deposits in the same week count as one week for your streak. Your total balance increases
              with each deposit.
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>What happens if I miss a week?</h3>
            <p style={{ margin: 0, color: 'var(--gray-700)' }}>
              If you skip a week, your streak resets to 1 when you make your next deposit. You'll need to build back
              up to 5 consecutive weeks.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
