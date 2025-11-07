import { useAccount, useReadContract, useBalance } from 'wagmi'
import { CONTRACTS, formatLabUSDT } from '../lib/contracts'
import Link from 'next/link'

export default function Dashboard() {
  const { address, isConnected } = useAccount()

  // Read user's LabUSDT balance
  const { data: usdtBalance } = useBalance({
    address: address,
    token: CONTRACTS.labUSDT.address,
  })

  // Read user's savings balance
  const { data: savingsBalance } = useReadContract({
    ...CONTRACTS.savingsPool,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  })

  // Read user's streak
  const { data: streak } = useReadContract({
    ...CONTRACTS.savingsPool,
    functionName: 'streak',
    args: address ? [address] : undefined,
  })

  // Read user's attestation level
  const { data: attestationLevel } = useReadContract({
    ...CONTRACTS.attestationRegistry,
    functionName: 'levelOf',
    args: address ? [address] : undefined,
  })

  // Read governance parameters
  const { data: minPrincipal } = useReadContract({
    ...CONTRACTS.governanceLite,
    functionName: 'minPrincipal',
  })

  const { data: maxPrincipal } = useReadContract({
    ...CONTRACTS.governanceLite,
    functionName: 'maxPrincipal',
  })

  const { data: rateBps } = useReadContract({
    ...CONTRACTS.governanceLite,
    functionName: 'rateBpsPer4Weeks',
  })

  const { data: isPaused } = useReadContract({
    ...CONTRACTS.governanceLite,
    functionName: 'paused',
  })

  return (
    <div className="grid">
      {/* Hero Card */}
      <section className="card-hero">
        <h1>SaveTogether</h1>
        <p>
          Blockchain-powered microfinance for the unbanked. Build savings, form groups, access credit.
        </p>
        {!isConnected && (
          <div style={{ marginTop: '2rem' }}>
            <p style={{ color: 'var(--gray-300)', marginBottom: '1rem' }}>
              Connect your wallet to get started
            </p>
          </div>
        )}
        {isConnected && (
          <div className="stats-grid" style={{ marginTop: '2rem' }}>
            <div className="stat-card">
              <div className="stat-value">
                {usdtBalance ? Number(usdtBalance.formatted).toFixed(2) : '0.00'}
              </div>
              <div className="stat-label">LabUSDT Balance</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                {savingsBalance ? formatLabUSDT(savingsBalance as bigint) : '0.00'}
              </div>
              <div className="stat-label">Savings Balance</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{streak?.toString() || '0'}</div>
              <div className="stat-label">Week Streak</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{attestationLevel?.toString() || '0'}</div>
              <div className="stat-label">Attestation Level</div>
            </div>
          </div>
        )}
      </section>

      {/* Platform Status */}
      <section className="card">
        <h2>Platform Status</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.875rem' }}>
              Status:
            </span>
            <span className={isPaused ? 'badge' : 'badge badge-outline'}>
              {isPaused ? '⏸️ PAUSED' : '✅ ACTIVE'}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.875rem' }}>
              Interest Rate:
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
              {rateBps ? `${Number(rateBps) / 100}%` : '2%'} per 4 weeks
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.875rem' }}>
              Loan Range:
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
              {minPrincipal ? formatLabUSDT(minPrincipal as bigint) : '25'} -{' '}
              {maxPrincipal ? formatLabUSDT(maxPrincipal as bigint) : '250'} LabUSDT
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.875rem' }}>
              Network:
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
              DIDLab Trust Testnet (252501)
            </span>
          </div>
        </div>
      </section>

      {/* Getting Started */}
      <section className="card">
        <h2>Getting Started</h2>
        <ol className="list" style={{ marginTop: '1rem' }}>
          <li>
            <strong>Get Attested:</strong> Request attestation from admin to verify your identity (Level ≥ 1
            required)
          </li>
          <li>
            <strong>Build Savings:</strong> Deposit LabUSDT weekly to build your savings streak (5 weeks minimum)
          </li>
          <li>
            <strong>Join a Group:</strong> Form or join a lending group of 5-8 members and lock your stake
          </li>
          <li>
            <strong>Access Credit:</strong> Request loans with group approval, repay weekly to build reputation
          </li>
        </ol>
      </section>

      {/* Quick Actions */}
      <section className="card-dark">
        <h2>Quick Actions</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginTop: '1.5rem',
          }}
        >
          <Link href="/savings" className="button button-outline" style={{ width: '100%' }}>
            💰 Manage Savings
          </Link>
          <Link href="/groups" className="button button-outline" style={{ width: '100%' }}>
            👥 My Groups
          </Link>
          <Link href="/loans" className="button button-outline" style={{ width: '100%' }}>
            🏦 Request Loan
          </Link>
          {address && attestationLevel && Number(attestationLevel) >= 2 && (
            <Link href="/admin" className="button button-outline" style={{ width: '100%' }}>
              ⚙️ Admin Panel
            </Link>
          )}
        </div>
      </section>

      {/* Key Features */}
      <section className="card">
        <h2>Why SaveTogether?</h2>
        <div style={{ display: 'grid', gap: '1.5rem', marginTop: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>🌍 Financial Inclusion</h3>
            <p style={{ color: 'var(--gray-700)', margin: 0 }}>
              Access credit without traditional credit scores. Build reputation through savings behavior.
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>💸 Fair Interest Rates</h3>
            <p style={{ color: 'var(--gray-700)', margin: 0 }}>
              2% per 4-week period vs 30-50% charged by traditional microfinance. 95% cost reduction.
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>👥 Community Trust</h3>
            <p style={{ color: 'var(--gray-700)', margin: 0 }}>
              Group-based lending with peer accountability. Your community vouches for you.
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>🔒 Fully Transparent</h3>
            <p style={{ color: 'var(--gray-700)', margin: 0 }}>
              All transactions on-chain. Smart contracts enforce rules. No hidden fees or gatekeepers.
            </p>
          </div>
        </div>
      </section>

      {/* Network Info */}
      <section className="card">
        <h2>Network Information</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
          <div>
            <strong style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
              Chain ID:
            </strong>
            <code>252501</code>
          </div>
          <div>
            <strong style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
              RPC URL:
            </strong>
            <code>https://eth.didlab.org</code>
          </div>
          <div>
            <strong style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
              Block Explorer:
            </strong>
            <a
              href="https://explorer.didlab.org"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}
            >
              explorer.didlab.org
            </a>
          </div>
          <div>
            <strong style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
              Faucet:
            </strong>
            <a
              href="https://faucet.didlab.org"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}
            >
              faucet.didlab.org
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
