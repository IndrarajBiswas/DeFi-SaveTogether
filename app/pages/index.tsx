import Link from 'next/link'

export default function Home() {
  return (
    <div className="grid">
      <section className="card">
        <h1>Welcome to DIDLab Microfinance</h1>
        <p>
          A Grameen-inspired group lending network deployed on the DIDLab Trust testnet. This portal connects
          eligible borrowers, group captains, and administrators to the on-chain savings and credit system.
        </p>
        <div className="notice">
          <strong>Network:</strong> DIDLab (Chain ID 252501) using LabUSDT (6 decimals) as the savings and loan
          asset.
        </div>
      </section>

      <section className="card">
        <h2>Implementation Overview</h2>
        <ul className="list">
          <li>Smart contracts: `AttestationRegistry`, `SavingsPool`, `GroupVault`, `CreditLine`, `Treasury`, `GovernanceLite`.</li>
          <li>Deployment scripts under <code>script/</code> wire roles and issuers.</li>
          <li>Subgraph tracks groups, loans, repayments, and savings streaks.</li>
          <li>Docs in <code>docs/</code> cover parameters, threat model, and runbook.</li>
        </ul>
      </section>

      <section className="card">
        <h2>User Journey</h2>
        <ol className="list">
          <li>Get attested via pilot administrator (level ≥ 1).</li>
          <li>Build savings streak (minimum four consecutive weeks for first loan).</li>
          <li>Create or join a lending group and lock stake.</li>
          <li>Request loan, gather approvals (M-of-N), receive disbursement.</li>
          <li>Repay weekly; reschedule once if needed; defaults trigger stake slash.</li>
        </ol>
      </section>

      <section className="card">
        <h2>Quick Links</h2>
        <div className="grid grid--two">
          <Link href="/savings" className="nav__link">Savings Workflow</Link>
          <Link href="/groups" className="nav__link">Group Management</Link>
          <Link href="/loans" className="nav__link">Loan Desk</Link>
          <Link href="/admin" className="nav__link">Admin Console</Link>
        </div>
      </section>
    </div>
  )
}
