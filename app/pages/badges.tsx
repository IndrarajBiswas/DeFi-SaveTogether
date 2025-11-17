import { useAccount, useReadContract } from 'wagmi'
import { useState } from 'react'
import { CONTRACTS } from '../lib/contracts'
import HelpDialog from '../components/HelpDialog'

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

export default function BadgesPage() {
  const { address, isConnected } = useAccount()
  const [showBadgesHelp, setShowBadgesHelp] = useState(false)

  // Read user's badges from contract
  const { data: userBadgesData } = useReadContract({
    ...CONTRACTS.achievementBadges,
    functionName: 'getUserBadges',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && isConnected,
    },
  })

  // Convert BigInt array to number array
  const userBadges = userBadgesData ? (userBadgesData as bigint[]).map((id) => Number(id)) : []

  const hasBadge = (badgeId: number) => userBadges.includes(badgeId)

  const earnedCount = userBadges.length
  const totalCount = BADGE_INFO.length
  const completionPercent = Math.round((earnedCount / totalCount) * 100)

  return (
    <div className="grid">
      {/* Hero Section */}
      <section className="card-hero">
        <h1>Achievement Badges</h1>
        <p>Earn NFT badges by reaching milestones on your savings journey</p>
        <button
          className="help-button"
          onClick={() => setShowBadgesHelp(true)}
          style={{ marginTop: '1rem' }}
        >
          <span className="help-button-icon">?</span>
          How to Earn Badges
        </button>
      </section>

      {isConnected ? (
        <>
          {/* Progress Overview */}
          <section className="card stagger-item">
            <h2>Your Progress</h2>
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
              Unlock achievements by participating in the platform. All badges are soulbound NFTs (non-transferable).
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
                        🔒 Locked
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </section>

        </>
      ) : (
        <section className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 'var(--space-12)' }}>
          <div style={{ fontSize: '4rem', marginBottom: 'var(--space-4)' }}>🎖️</div>
          <h2>Connect Your Wallet</h2>
          <p style={{ color: 'var(--gray-600)', maxWidth: '500px', margin: '0 auto' }}>
            Connect your wallet to view your achievement badges and track your progress through the platform milestones.
          </p>
        </section>
      )}

      {/* How to Earn Badges Help Dialog */}
      <HelpDialog
        isOpen={showBadgesHelp}
        onClose={() => setShowBadgesHelp(false)}
        title="How to Earn Badges"
        icon="🎖️"
      >
        <div>
          <h3>💰 Savings Milestones</h3>
          <p>
            Deposit regularly to earn savings-related badges. Your first deposit earns you the
            <strong> First Deposit</strong> badge. Maintain streaks for 5 and 10 consecutive weeks to unlock
            the <strong>5-Week Streak</strong> and <strong>10-Week Streak</strong> badges. Reach a total
            savings balance of 1000 LabUSDT to earn the <strong>Savings Hero</strong> badge.
          </p>

          <h3>🏦 Loan Activity</h3>
          <p>
            Build your credit reputation through loan activity. Request your first loan to earn the
            <strong> First Loan</strong> badge. Repay on time to unlock the <strong>Loan Repaid</strong> badge.
            Successfully repay 3 or more loans to earn the prestigious <strong>Credit Builder</strong> badge,
            demonstrating your commitment to financial responsibility.
          </p>

          <h3>👥 Community Engagement</h3>
          <p>
            Participate actively in the SaveTogether community. Create a savings group to earn the
            <strong> Group Leader</strong> badge. Join and actively participate in 5 or more different groups
            to earn the <strong>Community Pillar</strong> badge, recognizing your role in building the
            community.
          </p>

          <h3>🔒 Soulbound NFTs</h3>
          <p>
            All badges are soulbound NFTs, meaning they cannot be transferred or sold. They permanently
            represent your achievements and reputation within the SaveTogether ecosystem. Your badges are a
            true reflection of your financial journey and commitment.
          </p>
        </div>
      </HelpDialog>
    </div>
  )
}
