import { FormEvent, useMemo, useState } from 'react'
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
  const [principal, setPrincipal] = useState(100)
  const [term, setTerm] = useState(8)
  const [error, setError] = useState<string | null>(null)
  const weeklyPayment = useMemo(() => computeInstallment(principal, term, RATE_BPS), [principal, term])

  const handlePrincipalChange = (value: string): void => {
    const num = Number(value)
    if (!isNaN(num)) {
      setPrincipal(num)
      if (error) setError(null)
    }
  }

  const handleRequestLoan = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    setError(null)

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

    window.alert(`Mock openLoan for ${principal} LabUSDT over ${term} weeks`)
  }

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

      <section className="card">
        <h2>Request Loan</h2>
        {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
        <form className="form" onSubmit={handleRequestLoan}>
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
          <button type="submit">Simulate openLoan()</button>
        </form>
        <p className="tag">Estimated weekly payment: {weeklyPayment.toFixed(2)} LabUSDT</p>
      </section>

      <section className="card">
        <h2>Approval Process</h2>
        <ol className="list">
          <li>Borrower submits request and shares pseudo loan ID (borrower address) with group.</li>
          <li>Peers call <code>GroupVault.approveLoan</code> until minimum approvals reached.</li>
          <li>Borrower executes <code>openLoan</code>; LabUSDT transfers from CreditLine treasury balance.</li>
        </ol>
      </section>

      <section className="card">
        <h2>Repayment & Reschedule</h2>
        <ul className="list">
          <li>Use <code>CreditLine.dueAt(loanId, week)</code> to fetch expected installment.</li>
          <li>`repay(loanId, amount)` accepts partial amounts; totals tracked in `Loan.repaid`.</li>
          <li>`reschedule(loanId, extraWeeks)` allowed once; fee = 0.5% of principal.</li>
          <li>Failure to repay within grace triggers `markDefault` and stake slashing.</li>
        </ul>
      </section>
    </div>
  )
}
