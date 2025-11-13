import { useAccount, useReadContract, useBalance } from 'wagmi'
import { useEffect, useState } from 'react'
import { CONTRACTS, formatLabUSDT } from '../lib/contracts'
import Link from 'next/link'
import HelpDialog from '../components/HelpDialog'
import AccountSetupGuide from '../components/AccountSetupGuide'
import StatCard from '../components/StatCard'
import ProgressBar from '../components/ProgressBar'

export default function Dashboard() {
  const { address, isConnected } = useAccount()
  const [hydrated, setHydrated] = useState(false)
  const [showQuickActionsHelp, setShowQuickActionsHelp] = useState(false)
  const [showAccountSetup, setShowAccountSetup] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

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
        {!hydrated ? (
          <div style={{ marginTop: '2rem', color: 'var(--gray-300)' }}>Loading wallet state…</div>
        ) : isConnected ? (
          <div className="stats-grid" style={{ marginTop: '2rem' }}>
            <StatCard
              value={usdtBalance ? Number(usdtBalance.formatted).toFixed(2) : '0.00'}
              label="LabUSDT Balance"
              icon="💵"
              loading={!hydrated}
            />
            <StatCard
              value={savingsBalance ? formatLabUSDT(savingsBalance as bigint) : '0.00'}
              label="Savings Balance"
              icon="💰"
              loading={!hydrated}
            />
            <StatCard
              value={streak?.toString() || '0'}
              label="Week Streak"
              icon="🔥"
              loading={!hydrated}
            />
            <StatCard
              value={attestationLevel?.toString() || '0'}
              label="Attestation Level"
              icon="🎖️"
              loading={!hydrated}
            />
          </div>
        ) : (
          <div style={{ marginTop: '2rem' }}>
            <p style={{ color: 'var(--gray-300)', marginBottom: '1.5rem', fontSize: '1.125rem' }}>
              New to DeFi? Start here!
            </p>
            <button
              className="button button-lg"
              onClick={() => setShowAccountSetup(true)}
              style={{ marginBottom: '1rem' }}
            >
              🔐 Account Setup Guide
            </button>
            <p style={{ color: 'var(--gray-400)', fontSize: '0.875rem', marginTop: '1rem' }}>
              Learn how to install MetaMask, create an account, and connect to SaveTogether
            </p>
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h2 style={{ margin: 0 }}>Getting Started</h2>
          <button
            className="button-outline button-sm"
            onClick={() => setShowAccountSetup(true)}
          >
            🔐 Account Setup
          </button>
        </div>
        <ol className="list" style={{ marginTop: '1rem' }}>
          <li>
            <strong>Set Up Your Account:</strong> Install MetaMask, create a wallet, and connect to the DIDLab Trust Testnet
          </li>
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
      <section className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0 }}>Quick Actions</h2>
          <button className="help-button" onClick={() => setShowQuickActionsHelp(true)}>
            <span className="help-button-icon">?</span>
            Help
          </button>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
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
          {address && attestationLevel && Number(attestationLevel) >= 2 ? (
            <Link href="/admin" className="button button-outline" style={{ width: '100%' }}>
              ⚙️ Admin Panel
            </Link>
          ) : null}
        </div>
      </section>

      {/* Account Setup Guide */}
      <AccountSetupGuide
        isOpen={showAccountSetup}
        onClose={() => setShowAccountSetup(false)}
      />

      {/* Quick Actions Help Dialog */}
      <HelpDialog
        isOpen={showQuickActionsHelp}
        onClose={() => setShowQuickActionsHelp(false)}
        title="Quick Actions Guide"
        icon="🚀"
      >
        <div>
          <h3>💰 Manage Savings</h3>
          <p>
            Visit the Savings page to deposit funds weekly, track your savings streak, and build your
            financial reputation. A 5-week consecutive streak unlocks loan eligibility.
          </p>

          <h3>👥 My Groups</h3>
          <p>
            Create or join lending groups of 5-8 members. Groups provide peer accountability and are
            required to access loans. Each member locks stake to share default risk.
          </p>

          <h3>🏦 Request Loan</h3>
          <p>
            Once you have a 5-week savings streak and are part of an active group, you can request
            microfinance loans. Your group must approve the loan, and you repay weekly with 2% interest.
          </p>

          <h3>⚙️ Admin Panel</h3>
          <p>
            Available only to users with attestation level 2 or higher. Manage platform governance,
            issue attestations, and configure system parameters.
          </p>
        </div>
      </HelpDialog>

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
