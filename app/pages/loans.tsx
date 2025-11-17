import { FormEvent, useMemo, useState } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { CONTRACTS, formatLabUSDT, parseLabUSDT } from '../lib/contracts'
import { isInRange, isMultipleOf } from '../lib/validation'

const TERMS = [4, 8, 12]
const RATE_BPS = 200
const MIN_PRINCIPAL = 25
const MAX_PRINCIPAL = 250
const PRINCIPAL_STEP = 5

function computeInstallment(principal: number, termWeeks: number, rateBps: number) {
  const blocks = Math.floor(termWeeks / 4)
  const interest = (principal * rateBps * blocks) / 10000
  const total = principal + interest
  return termWeeks > 0 ? total / termWeeks : 0
}

export default function LoansPage() {
  const { address, isConnected } = useAccount()
  const [principal, setPrincipal] = useState(100)
  const [term, setTerm] = useState(8)
  const [groupId, setGroupId] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [repayAmount, setRepayAmount] = useState('')
  const [rescheduleWeeks, setRescheduleWeeks] = useState(4)

  const weeklyPayment = useMemo(() => computeInstallment(principal, term, RATE_BPS), [principal, term])

  // Read borrower's loan ID first
  const { data: borrowerLoanIdData, refetch: refetchLoanId } = useReadContract({
    ...CONTRACTS.creditLine,
    functionName: 'borrowerLoanId',
    args: address ? [address] : undefined,
  })

  const borrowerLoanId = borrowerLoanIdData ? BigInt(borrowerLoanIdData.toString()) : BigInt(0)

  // Read user's active loan using the loan ID
  const { data: loanData, refetch: refetchLoan } = useReadContract({
    ...CONTRACTS.creditLine,
    functionName: 'loans',
    args: borrowerLoanId > BigInt(0) ? [borrowerLoanId] : undefined,
  })

  // Read allowance for repayment
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    ...CONTRACTS.labUSDT,
    functionName: 'allowance',
    args: address ? [address, CONTRACTS.creditLine.address] : undefined,
  })

  // Contract writes
  const { writeContract: approve, data: approveHash } = useWriteContract()
  const { writeContract: openLoan, data: openLoanHash } = useWriteContract()
  const { writeContract: repay, data: repayHash } = useWriteContract()
  const { writeContract: reschedule, data: rescheduleHash } = useWriteContract()

  // Transaction status
  const { isLoading: isApproving, isSuccess: approveSuccess } = useWaitForTransactionReceipt({
    hash: approveHash,
  })

  const { isLoading: isOpeningLoan, isSuccess: loanOpened } = useWaitForTransactionReceipt({
    hash: openLoanHash,
  })

  const { isLoading: isRepaying, isSuccess: repaySuccess } = useWaitForTransactionReceipt({
    hash: repayHash,
  })

  const { isLoading: isRescheduling, isSuccess: rescheduleSuccess } = useWaitForTransactionReceipt({
    hash: rescheduleHash,
  })

  // Auto-refresh after successful transactions
  if (approveSuccess) {
    refetchAllowance()
  }
  if (loanOpened || repaySuccess || rescheduleSuccess) {
    refetchLoanId()
    refetchLoan()
  }

  const handlePrincipalChange = (value: string): void => {
    const num = Number(value)
    if (!isNaN(num)) {
      setPrincipal(num)
      if (error) setError(null)
    }
  }

  const handleApprove = () => {
    setError(null)
    approve({
      ...CONTRACTS.labUSDT,
      functionName: 'approve',
      args: [CONTRACTS.creditLine.address, parseLabUSDT(10000)], // Approve 10k
    })
  }

  const handleRequestLoan = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    setError(null)

    if (!isConnected || !address) {
      setError('Please connect your wallet')
      return
    }

    // Validate group ID
    const gid = Number(groupId)
    if (isNaN(gid) || gid < 0) {
      setError('Please enter a valid group ID')
      return
    }

    // Validate principal
    if (!isInRange(principal, MIN_PRINCIPAL, MAX_PRINCIPAL)) {
      setError(`Principal must be between ${MIN_PRINCIPAL} and ${MAX_PRINCIPAL} LabUSDT`)
      return
    }

    if (!isMultipleOf(principal, PRINCIPAL_STEP)) {
      setError(`Principal must be a multiple of ${PRINCIPAL_STEP} LabUSDT`)
      return
    }

    // Validate term
    if (!TERMS.includes(term)) {
      setError(`Term must be one of ${TERMS.join(', ')} weeks`)
      return
    }

    // Execute openLoan with all 5 parameters: gid, borrower, principal, rateBps, termWeeks
    openLoan({
      ...CONTRACTS.creditLine,
      functionName: 'openLoan',
      args: [BigInt(gid), address, parseLabUSDT(principal), BigInt(RATE_BPS), BigInt(term)],
    })
  }

  const handleRepay = () => {
    if (!isConnected || !address) {
      setError('Please connect your wallet')
      return
    }

    if (borrowerLoanId <= BigInt(0)) {
      setError('No active loan found')
      return
    }

    const amount = Number(repayAmount)
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid repayment amount')
      return
    }

    repay({
      ...CONTRACTS.creditLine,
      functionName: 'repay',
      args: [borrowerLoanId, parseLabUSDT(amount)],
    })
  }

  const handleReschedule = () => {
    if (!isConnected || !address) {
      setError('Please connect your wallet')
      return
    }

    if (borrowerLoanId <= BigInt(0)) {
      setError('No active loan found')
      return
    }

    reschedule({
      ...CONTRACTS.creditLine,
      functionName: 'reschedule',
      args: [borrowerLoanId, BigInt(rescheduleWeeks)],
    })
  }

  // Parse loan data if it exists
  const loan = loanData as any
  const hasActiveLoan = loan && loan.principal > BigInt(0)
  const needsApproval = !allowance || (allowance as bigint) < parseLabUSDT(parseFloat(repayAmount) || 0)

  return (
    <div className="grid">
      <section className="card">
        <h1>Loan Desk</h1>
        <p>
          All originations route through <code>CreditLine.openLoan</code>. Ensure your savings streak and
          attestation prerequisites are satisfied before requesting a disbursement.
        </p>
        <div className="notice">
          Platform rate: {RATE_BPS / 100}% simple interest per 4-week block. Grace period: 7 days after
          maturity.
        </div>
      </section>

      {!isConnected && (
        <section className="card">
          <p style={{ color: 'var(--gray-300)' }}>Connect your wallet to request loans</p>
        </section>
      )}

      {isConnected && hasActiveLoan && (
        <section className="card-hero">
          <h2>Your Active Loan</h2>
          <div className="stats-grid" style={{ marginTop: '1.5rem' }}>
            <div className="stat-card">
              <div className="stat-value">{formatLabUSDT(loan.principal)}</div>
              <div className="stat-label">Principal</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{formatLabUSDT(loan.repaid)}</div>
              <div className="stat-label">Repaid</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{loan.termWeeks?.toString() || '0'}</div>
              <div className="stat-label">Term (weeks)</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{loan.openedAt ? new Date(Number(loan.openedAt) * 1000).toLocaleDateString() : 'N/A'}</div>
              <div className="stat-label">Opened</div>
            </div>
          </div>
        </section>
      )}

      {isConnected && !hasActiveLoan && (
        <section className="card">
          <h2>Request Loan</h2>
          {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

          {isOpeningLoan && (
            <div className="notice" style={{ marginBottom: '1rem' }}>
              Opening loan... Check your wallet for transaction confirmation.
            </div>
          )}

          {loanOpened && openLoanHash && (
            <div className="notice" style={{ marginBottom: '1rem', background: '#d4edda' }}>
              Loan opened successfully!{' '}
              <a
                href={`https://explorer.didlab.org/tx/${openLoanHash}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'underline' }}
              >
                View transaction
              </a>
            </div>
          )}

          <form className="form" onSubmit={handleRequestLoan}>
            <label>
              Group ID
              <input
                type="number"
                min={0}
                step={1}
                value={groupId}
                onChange={(event) => setGroupId(event.target.value)}
                placeholder="Enter your group ID"
                required
              />
            </label>
            <label>
              Principal (LabUSDT)
              <input
                type="number"
                min={25}
                max={250}
                step={5}
                value={principal}
                onChange={(event) => handlePrincipalChange(event.target.value)}
              />
            </label>
            <label>
              Term (weeks)
              <select value={term} onChange={(event) => setTerm(Number(event.target.value))}>
                {TERMS.map((value) => (
                  <option key={value} value={value}>
                    {value} weeks
                  </option>
                ))}
              </select>
            </label>
            <button type="submit" disabled={isOpeningLoan}>
              {isOpeningLoan ? 'Opening Loan...' : 'Request Loan'}
            </button>
          </form>
          <p className="tag">Estimated weekly payment: {weeklyPayment.toFixed(2)} LabUSDT</p>
        </section>
      )}

      {isConnected && hasActiveLoan && (
        <>
          <section className="card">
            <h2>Make Repayment</h2>

            {needsApproval && isConnected && repayAmount && parseFloat(repayAmount) > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ marginBottom: '1rem' }}>
                  First, you need to approve the CreditLine contract to spend your LabUSDT for repayment.
                </p>
                <button onClick={handleApprove} disabled={isApproving} className="button">
                  {isApproving ? 'Approving...' : 'Approve LabUSDT'}
                </button>
              </div>
            )}

            {isRepaying && (
              <div className="notice" style={{ marginBottom: '1rem' }}>
                Processing repayment... Check your wallet.
              </div>
            )}

            {repaySuccess && repayHash && (
              <div className="notice" style={{ marginBottom: '1rem', background: '#d4edda' }}>
                Repayment successful!{' '}
                <a
                  href={`https://explorer.didlab.org/tx/${repayHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'underline' }}
                >
                  View transaction
                </a>
              </div>
            )}

            <div className="form">
              <label>
                Amount (LabUSDT)
                <input
                  type="number"
                  min={0.01}
                  step={0.01}
                  value={repayAmount}
                  onChange={(e) => setRepayAmount(e.target.value)}
                  placeholder="Enter repayment amount"
                />
              </label>
              <button onClick={handleRepay} disabled={isRepaying || !repayAmount || needsApproval}>
                {isRepaying ? 'Repaying...' : 'Repay Loan'}
              </button>
            </div>
          </section>

          <section className="card">
            <h2>Reschedule Loan</h2>
            <p style={{ color: 'var(--gray-700)', marginBottom: '1rem' }}>
              Extend your loan term. Fee: 0.5% of principal. Can only reschedule once.
            </p>

            {isRescheduling && (
              <div className="notice" style={{ marginBottom: '1rem' }}>
                Rescheduling... Check your wallet.
              </div>
            )}

            {rescheduleSuccess && rescheduleHash && (
              <div className="notice" style={{ marginBottom: '1rem', background: '#d4edda' }}>
                Loan rescheduled!{' '}
                <a
                  href={`https://explorer.didlab.org/tx/${rescheduleHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'underline' }}
                >
                  View transaction
                </a>
              </div>
            )}

            <div className="form">
              <label>
                Extra weeks
                <select value={rescheduleWeeks} onChange={(e) => setRescheduleWeeks(Number(e.target.value))}>
                  <option value={4}>4 weeks</option>
                  <option value={8}>8 weeks</option>
                </select>
              </label>
              <button onClick={handleReschedule} disabled={isRescheduling}>
                {isRescheduling ? 'Rescheduling...' : 'Reschedule Loan'}
              </button>
            </div>
          </section>
        </>
      )}

      <section className="card">
        <h2>Approval Process</h2>
        <ol className="list">
          <li>Borrower submits request and shares pseudo loan ID (borrower address) with group.</li>
          <li>Peers call <code>GroupVault.approveLoan</code> until minimum approvals reached.</li>
          <li>Borrower executes <code>openLoan</code>; LabUSDT transfers from CreditLine treasury balance.</li>
        </ol>
      </section>

      <section className="card">
        <h2>Loan Mechanics</h2>
        <ul className="list">
          <li>Use <code>CreditLine.dueAt(loanId, week)</code> to fetch expected installment.</li>
          <li><code>repay(loanId, amount)</code> accepts partial amounts; totals tracked in <code>Loan.repaid</code>.</li>
          <li><code>reschedule(loanId, extraWeeks)</code> allowed once; fee = 0.5% of principal.</li>
          <li>Failure to repay within grace triggers <code>markDefault</code> and stake slashing.</li>
        </ul>
      </section>
    </div>
  )
}
