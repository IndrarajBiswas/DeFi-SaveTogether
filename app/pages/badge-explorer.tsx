import { useAccount, useReadContract } from 'wagmi'
import { useState } from 'react'
import { CONTRACTS } from '../lib/contracts'
import { isAddress } from 'viem'

// Badge definitions matching smart contract
const BADGE_INFO = [
  {
    id: 1,
    name: 'First Deposit',
    description: 'Made their first deposit to the savings pool',
    icon: '💰',
    color: '#FFD700',
  },
  {
    id: 2,
    name: '5-Week Streak',
    description: 'Maintained 5 consecutive weeks of savings',
    icon: '🔥',
    color: '#FF6B6B',
  },
  {
    id: 3,
    name: '10-Week Streak',
    description: 'Maintained 10 consecutive weeks of savings',
    icon: '⚡',
    color: '#4ECDC4',
  },
  {
    id: 4,
    name: 'First Loan',
    description: 'Opened their first microfinance loan',
    icon: '🏦',
    color: '#95E1D3',
  },
  {
    id: 5,
    name: 'Loan Repaid',
    description: 'Successfully repaid a loan in full',
    icon: '✅',
    color: '#38A169',
  },
  {
    id: 6,
    name: 'Group Leader',
    description: 'Created and leads a savings group',
    icon: '👑',
    color: '#9B59B6',
  },
  {
    id: 7,
    name: 'Savings Hero',
    description: 'Saved over 1000 LabUSDT',
    icon: '🦸',
    color: '#3498DB',
  },
  {
    id: 8,
    name: 'Credit Builder',
    description: 'Repaid 3 or more loans successfully',
    icon: '📈',
    color: '#E74C3C',
  },
  {
    id: 9,
    name: 'Community Pillar',
    description: 'Active member of 5+ savings groups',
    icon: '🌟',
    color: '#F39C12',
  },
]

export default function BadgeExplorerPage() {
  const { address: connectedAddress, isConnected } = useAccount()
  const [searchAddress, setSearchAddress] = useState('')
  const [viewAddress, setViewAddress] = useState<`0x${string}` | null>(null)
  const [error, setError] = useState('')

  // Read badges for the viewed address
  const { data: userBadgesData, isLoading } = useReadContract({
    ...CONTRACTS.achievementBadges,
    functionName: 'getUserBadges',
    args: viewAddress ? [viewAddress] : undefined,
    query: {
      enabled: !!viewAddress,
    },
  })

  // Convert BigInt array to number array
  const userBadges = userBadgesData ? (userBadgesData as bigint[]).map((id) => Number(id)) : []

  const hasBadge = (badgeId: number) => userBadges.includes(badgeId)

  const earnedCount = userBadges.length
  const totalCount = BADGE_INFO.length
  const completionPercent = totalCount > 0 ? Math.round((earnedCount / totalCount) * 100) : 0

  const handleSearch = () => {
    setError('')

    if (!searchAddress) {
      setError('Please enter an address')
      return
    }

    if (!isAddress(searchAddress)) {
      setError('Invalid Ethereum address')
      return
    }

    setViewAddress(searchAddress as `0x${string}`)
  }

  const handleViewMyBadges = () => {
    if (connectedAddress) {
      setSearchAddress(connectedAddress)
      setViewAddress(connectedAddress)
      setError('')
    }
  }

  const shortenAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  return (
    <div className="grid">
      {/* Hero Section */}
      <section className="card-hero">
        <h1>🔍 Badge Explorer</h1>
        <p>Search and view achievement badges for any SaveTogether user</p>
      </section>

      {/* Search Section */}
      <section className="card stagger-item" style={{ gridColumn: '1 / -1' }}>
        <h2>Search for User Badges</h2>
        <p style={{ color: 'var(--gray-600)', marginBottom: '1.5rem' }}>
          Enter any Ethereum address to view their earned achievement badges
        </p>

        <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: '1rem' }}>
          <input
            type="text"
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
            placeholder="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
            className="input"
            style={{
              flex: 1,
              padding: 'var(--space-3)',
              border: '1px solid var(--gray-300)',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--text-base)',
            }}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={handleSearch} className="button-primary" style={{ whiteSpace: 'nowrap' }}>
            🔍 Search
          </button>
          {isConnected && (
            <button onClick={handleViewMyBadges} className="button-secondary" style={{ whiteSpace: 'nowrap' }}>
              View My Badges
            </button>
          )}
        </div>

        {error && (
          <div
            style={{
              padding: 'var(--space-3)',
              background: '#FEE2E2',
              color: '#991B1B',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--text-sm)',
            }}
          >
            {error}
          </div>
        )}
      </section>

      {/* Results Section */}
      {viewAddress && (
        <>
          {/* User Info */}
          <section className="card stagger-item" style={{ gridColumn: '1 / -1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--black) 0%, var(--gray-700) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                }}
              >
                👤
              </div>
              <div style={{ flex: 1 }}>
                <h2 style={{ marginBottom: 'var(--space-1)' }}>
                  {connectedAddress?.toLowerCase() === viewAddress.toLowerCase()
                    ? 'Your Badges'
                    : `User ${shortenAddress(viewAddress)}`}
                </h2>
                <p style={{ color: 'var(--gray-600)', fontSize: 'var(--text-sm)', marginBottom: 0 }}>
                  {viewAddress}
                </p>
              </div>
            </div>
          </section>

          {/* Progress Overview */}
          <section className="card stagger-item">
            <h2>Badge Progress</h2>
            <div style={{ marginTop: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 700 }}>
                  {earnedCount} / {totalCount} Badges Earned
                </span>
                <span style={{ fontWeight: 700, color: 'var(--gray-600)' }}>{completionPercent}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${completionPercent}%` }}></div>
              </div>
            </div>

            <div className="stats-grid" style={{ marginTop: '2rem' }}>
              <div className="stat-card">
                <div className="stat-value">{earnedCount}</div>
                <div className="stat-label">Earned</div>
              </div>
              <div className="stat-card" style={{ background: 'var(--gray-200)', color: 'var(--black)' }}>
                <div className="stat-value" style={{ color: 'var(--black)' }}>
                  {totalCount - earnedCount}
                </div>
                <div className="stat-label" style={{ color: 'inherit' }}>
                  Remaining
                </div>
              </div>
            </div>
          </section>

          {/* Badges Gallery */}
          <section className="card stagger-item" style={{ gridColumn: '1 / -1' }}>
            <h2>Badge Collection</h2>
            <p style={{ color: 'var(--gray-600)', marginBottom: '2rem' }}>
              {isLoading
                ? 'Loading badges...'
                : `This user has earned ${earnedCount} out of ${totalCount} available badges`}
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: 'var(--space-6)',
              }}
            >
              {BADGE_INFO.map((badge) => {
                const earned = hasBadge(badge.id)

                return (
                  <div
                    key={badge.id}
                    className="card"
                    style={{
                      padding: 'var(--space-6)',
                      opacity: earned ? 1 : 0.5,
                      filter: earned ? 'none' : 'grayscale(100%)',
                      transition: 'all var(--transition)',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {earned && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 'var(--space-4)',
                          right: 'var(--space-4)',
                          background: 'var(--black)',
                          color: 'var(--white)',
                          padding: 'var(--space-1) var(--space-3)',
                          borderRadius: 'var(--radius-full)',
                          fontSize: 'var(--text-xs)',
                          fontWeight: 800,
                        }}
                      >
                        EARNED
                      </div>
                    )}

                    <div
                      style={{
                        fontSize: '4rem',
                        textAlign: 'center',
                        marginBottom: 'var(--space-4)',
                      }}
                    >
                      {badge.icon}
                    </div>

                    <h3
                      style={{
                        fontSize: 'var(--text-xl)',
                        marginBottom: 'var(--space-2)',
                        textAlign: 'center',
                      }}
                    >
                      {badge.name}
                    </h3>

                    <p
                      style={{
                        color: 'var(--gray-600)',
                        fontSize: 'var(--text-sm)',
                        textAlign: 'center',
                        marginBottom: '0',
                      }}
                    >
                      {badge.description}
                    </p>

                    {!earned && (
                      <div
                        style={{
                          marginTop: 'var(--space-4)',
                          padding: 'var(--space-3)',
                          background: 'var(--gray-100)',
                          borderRadius: 'var(--radius-md)',
                          textAlign: 'center',
                          fontSize: 'var(--text-sm)',
                          fontWeight: 600,
                          color: 'inherit',
                        }}
                      >
                        🔒 Not Earned
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        </>
      )}

      {/* No Address Selected */}
      {!viewAddress && (
        <section
          className="card stagger-item"
          style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 'var(--space-12)' }}
        >
          <div style={{ fontSize: '5rem', marginBottom: 'var(--space-4)' }}>🔍</div>
          <h2>Search to Get Started</h2>
          <p style={{ color: 'var(--gray-600)', maxWidth: '500px', margin: '0 auto' }}>
            Enter an Ethereum address above to explore their achievement badges and see their progress in the
            SaveTogether platform.
          </p>
        </section>
      )}
    </div>
  )
}
