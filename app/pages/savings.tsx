import { FormEvent, useState } from 'react'

export default function SavingsPage() {
  const [depositAmount, setDepositAmount] = useState('25')
  const [withdrawAmount, setWithdrawAmount] = useState('0')

  const handleDeposit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    window.alert(`Simulated deposit of ${depositAmount} LabUSDT. Replace with SavingsPool.deposit call.`)
  }

  const handleWithdraw = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    window.alert(`Simulated withdrawal of ${withdrawAmount} LabUSDT. Replace with SavingsPool.withdraw call.`)
  }

  return (
    <div className="grid">
      <section className="card">
        <h1>Savings Workflow</h1>
        <p>
          Savings streaks are tracked on-chain via <code>SavingsPool</code>. Each weekly deposit advances the
          streak; missing a week resets to one. You must complete four consecutive deposits before requesting
          your first loan.
        </p>
        <div className="notice">
          <strong>Reminder:</strong> Ensure your wallet has approved LabUSDT allowance for the SavingsPool
          contract before calling <code>deposit</code>.
        </div>
      </section>

      <section className="card">
        <h2>Deposit</h2>
        <form className="form" onSubmit={handleDeposit}>
          <label>
            Amount (LabUSDT)
            <input value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} min="1" type="number" step="0.01" />
          </label>
          <label>
            Memo (optional)
            <input placeholder="Savings goal or reference" />
          </label>
          <button type="submit">Simulate deposit()</button>
        </form>
      </section>

      <section className="card">
        <h2>Withdraw</h2>
        <form className="form" onSubmit={handleWithdraw}>
          <label>
            Amount (LabUSDT)
            <input value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} min="0" type="number" step="0.01" />
          </label>
          <div className="notice">
            Withdrawals are allowed as long as they keep the streak intact (you can withdraw after the weekly
            deposit clears).
          </div>
          <button type="submit">Simulate withdraw()</button>
        </form>
      </section>

      <section className="card">
        <h2>Eligibility Checklist</h2>
        <ul className="list">
          <li>Streak ≥ 4 weeks for first loan (≥ 2 for subsequent loans).</li>
          <li>Wallet carries `AttestationRegistry` level ≥ 1.</li>
          <li>No active loans open against your address.</li>
        </ul>
      </section>
    </div>
  )
}
