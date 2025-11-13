import { useAccount, useReadContract, useBalance } from 'wagmi'
import { useEffect, useState } from 'react'
import { CONTRACTS, formatLabUSDT } from '../lib/contracts'
import Link from 'next/link'
import {
  Wallet,
  Users,
  Landmark,
  CheckCircle2,
  TrendingUp,
  Shield,
  Zap,
  BookOpen
} from 'lucide-react'

import {
  Container,
  HeroCard,
  StatCard,
  SectionCard,
  MetricRow,
  Button,
  Badge,
  Card
} from '../components/ui'
import AccountSetupGuide from '../components/AccountSetupGuide'

export default function Dashboard() {
  const { address, isConnected } = useAccount()
  const [hydrated, setHydrated] = useState(false)
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
    <Container>
      {/* Hero Section */}
      <HeroCard
        title="SaveTogether"
        subtitle="Blockchain-powered microfinance for the unbanked. Build savings, form groups, access credit with on-chain transparency."
      >
        {!hydrated ? (
          <div className="text-text-muted">Loading wallet state…</div>
        ) : !isConnected ? (
          <div className="max-w-2xl mx-auto space-y-6">
            <p className="text-text-secondary text-lg">
              New to DeFi? Get started in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="primary"
                size="lg"
                icon={BookOpen}
                onClick={() => setShowAccountSetup(true)}
              >
                Account Setup Guide
              </Button>
              <Button variant="outline" size="lg">
                Demo Mode
              </Button>
            </div>
            <p className="text-text-muted text-sm">
              Learn how to install MetaMask, create an account, and connect to SaveTogether
            </p>
          </div>
        ) : null}
      </HeroCard>

      {/* User Stats (only when connected) */}
      {isConnected && hydrated && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-8">
          <StatCard
            value={usdtBalance ? Number(usdtBalance.formatted).toFixed(2) : '0.00'}
            label="LabUSDT Balance"
            icon={Wallet}
            loading={!hydrated}
          />
          <StatCard
            value={savingsBalance ? formatLabUSDT(savingsBalance as bigint) : '0.00'}
            label="Total Savings"
            icon={TrendingUp}
            loading={!hydrated}
          />
          <StatCard
            value={streak?.toString() || '0'}
            label="Week Streak"
            icon={Zap}
            loading={!hydrated}
          />
          <StatCard
            value={attestationLevel?.toString() || '0'}
            label="Attestation Level"
            icon={Shield}
            loading={!hydrated}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Platform Status */}
        <SectionCard
          title="Platform Status"
          subtitle="Live protocol parameters"
        >
          <div className="space-y-1">
            <MetricRow
              label="Status"
              value={
                <Badge variant={isPaused ? 'warning' : 'success'} dot>
                  {isPaused ? 'PAUSED' : 'ACTIVE'}
                </Badge>
              }
            />
            <MetricRow
              label="Interest Rate"
              value={rateBps ? `${Number(rateBps) / 100}% per 4 weeks` : '2% per 4 weeks'}
            />
            <MetricRow
              label="Loan Range"
              value={`${minPrincipal ? formatLabUSDT(minPrincipal as bigint) : '25'} - ${
                maxPrincipal ? formatLabUSDT(maxPrincipal as bigint) : '250'
              } LabUSDT`}
            />
            <MetricRow
              label="Network"
              value="DIDLab Trust Testnet (252501)"
            />
          </div>
        </SectionCard>

        {/* Getting Started */}
        <SectionCard
          title="Getting Started"
          subtitle="5 steps to access credit"
          action={
            <Button
              variant="outline"
              size="sm"
              icon={BookOpen}
              onClick={() => setShowAccountSetup(true)}
            >
              Setup Guide
            </Button>
          }
        >
          <div className="space-y-4">
            {[
              {
                step: 1,
                title: 'Set Up Your Wallet',
                description: 'Install MetaMask and connect to DIDLab Testnet',
                icon: <Wallet className="w-5 h-5 text-accent" />,
              },
              {
                step: 2,
                title: 'Get Attested',
                description: 'Request identity verification (Level ≥ 1)',
                icon: <Shield className="w-5 h-5 text-accent" />,
              },
              {
                step: 3,
                title: 'Build Savings',
                description: 'Deposit weekly for 5 consecutive weeks',
                icon: <TrendingUp className="w-5 h-5 text-accent" />,
              },
              {
                step: 4,
                title: 'Join a Group',
                description: 'Form or join a lending circle (5-8 members)',
                icon: <Users className="w-5 h-5 text-accent" />,
              },
              {
                step: 5,
                title: 'Request a Loan',
                description: 'Access credit with group approval',
                icon: <Landmark className="w-5 h-5 text-accent" />,
              },
            ].map((item) => (
              <div
                key={item.step}
                className="flex items-start gap-4 p-4 rounded-lg border border-border-subtle hover:border-accent transition-colors"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center border border-accent/30">
                  <span className="text-sm font-bold text-accent">{item.step}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {item.icon}
                    <h4 className="font-semibold text-text-primary">{item.title}</h4>
                  </div>
                  <p className="text-sm text-text-secondary">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Quick Actions */}
      <SectionCard
        title="Quick Actions"
        subtitle="Jump to key features"
        className="mt-8"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/savings" className="block group">
            <Card interactive className="text-center p-6">
              <Wallet className="w-12 h-12 text-accent mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-text-primary mb-1">Manage Savings</h3>
              <p className="text-sm text-text-muted">Deposit & track your savings</p>
            </Card>
          </Link>
          <Link href="/groups" className="block group">
            <Card interactive className="text-center p-6">
              <Users className="w-12 h-12 text-accent mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-text-primary mb-1">My Groups</h3>
              <p className="text-sm text-text-muted">View & manage your groups</p>
            </Card>
          </Link>
          <Link href="/loans" className="block group">
            <Card interactive className="text-center p-6">
              <Landmark className="w-12 h-12 text-accent mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-text-primary mb-1">Request Loan</h3>
              <p className="text-sm text-text-muted">Apply for microfinance</p>
            </Card>
          </Link>
          {address && attestationLevel && Number(attestationLevel) >= 2 && (
            <Link href="/admin" className="block group">
              <Card interactive className="text-center p-6">
                <Shield className="w-12 h-12 text-accent mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-text-primary mb-1">Admin Panel</h3>
                <p className="text-sm text-text-muted">Manage platform settings</p>
              </Card>
            </Link>
          )}
        </div>
      </SectionCard>

      {/* Why SaveTogether */}
      <SectionCard
        title="Why SaveTogether?"
        subtitle="Built for financial inclusion"
        className="mt-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              icon: <TrendingUp className="w-6 h-6 text-emerald-400" />,
              title: 'Financial Inclusion',
              description: 'Access credit without traditional credit scores. Build reputation through savings behavior and community trust.',
            },
            {
              icon: <Zap className="w-6 h-6 text-amber-400" />,
              title: 'Fair Interest Rates',
              description: '2% per 4-week period vs 30-50% charged by traditional microfinance. 95% cost reduction through DeFi.',
            },
            {
              icon: <Users className="w-6 h-6 text-blue-400" />,
              title: 'Community Trust',
              description: 'Group-based lending with peer accountability. Your community vouches for you and shares responsibility.',
            },
            {
              icon: <CheckCircle2 className="w-6 h-6 text-accent" />,
              title: 'Fully Transparent',
              description: 'All transactions on-chain. Smart contracts enforce rules. No hidden fees, no gatekeepers, just code.',
            },
          ].map((feature, index) => (
            <div key={index} className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-card-hover flex items-center justify-center border border-border-subtle">
                {feature.icon}
              </div>
              <div>
                <h3 className="font-semibold text-text-primary mb-1">{feature.title}</h3>
                <p className="text-sm text-text-secondary">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Network Info */}
      <Card className="mt-8">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Network Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="block text-text-muted uppercase tracking-wide text-xs mb-1">Chain ID</span>
            <code className="text-text-primary font-mono">252501</code>
          </div>
          <div>
            <span className="block text-text-muted uppercase tracking-wide text-xs mb-1">RPC URL</span>
            <code className="text-text-primary font-mono text-xs">https://eth.didlab.org</code>
          </div>
          <div>
            <span className="block text-text-muted uppercase tracking-wide text-xs mb-1">Explorer</span>
            <a
              href="https://explorer.didlab.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-accent-hover font-mono text-xs underline"
            >
              explorer.didlab.org
            </a>
          </div>
        </div>
      </Card>

      {/* Account Setup Guide Modal */}
      <AccountSetupGuide
        isOpen={showAccountSetup}
        onClose={() => setShowAccountSetup(false)}
      />
    </Container>
  )
}
