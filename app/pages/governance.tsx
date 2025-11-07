import { FormEvent, useState } from 'react'
import { useAccount } from 'wagmi'

// Proposal states matching contract
enum ProposalState {
  Pending = 'Pending',
  Active = 'Active',
  Canceled = 'Canceled',
  Defeated = 'Defeated',
  Succeeded = 'Succeeded',
  Executed = 'Executed',
}

// Mock proposals - replace with actual contract reads
const MOCK_PROPOSALS = [
  {
    id: 1,
    title: 'Reduce Loan Interest Rate to 1.5%',
    description:
      'Proposal to reduce the platform interest rate from 2% to 1.5% per 4-week block to make loans more accessible to users.',
    proposer: '0x1234...5678',
    state: ProposalState.Active,
    forVotes: 125000,
    againstVotes: 45000,
    abstainVotes: 10000,
    startBlock: 1000,
    endBlock: 51400,
    currentBlock: 25000,
  },
  {
    id: 2,
    title: 'Increase Savings Rewards',
    description:
      'Increase SAVE token rewards for savings deposits from 100 to 150 SAVE per 1000 LabUSDT saved per week.',
    proposer: '0xabcd...efgh',
    state: ProposalState.Succeeded,
    forVotes: 200000,
    againstVotes: 50000,
    abstainVotes: 15000,
    startBlock: 500,
    endBlock: 50900,
    currentBlock: 52000,
  },
  {
    id: 3,
    title: 'Launch Community Grant Program',
    description:
      'Allocate 1M SAVE tokens from treasury to fund community initiatives and regional pilot programs.',
    proposer: '0x9876...4321',
    state: ProposalState.Pending,
    forVotes: 0,
    againstVotes: 0,
    abstainVotes: 0,
    startBlock: 60000,
    endBlock: 110400,
    currentBlock: 52000,
  },
]

export default function GovernancePage() {
  const { address, isConnected } = useAccount()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [proposalTitle, setProposalTitle] = useState('')
  const [proposalDescription, setProposalDescription] = useState('')

  // Mock user voting power - replace with actual contract read
  const userVotingPower = 25000 // SAVE tokens

  const handleCreateProposal = (evt: FormEvent) => {
    evt.preventDefault()

    if (!proposalTitle.trim() || !proposalDescription.trim()) {
      return
    }

    // Call governance contract createProposal
    console.log('Creating proposal:', { proposalTitle, proposalDescription })

    // Reset form
    setProposalTitle('')
    setProposalDescription('')
    setShowCreateModal(false)
  }

  const handleVote = (proposalId: number, choice: 'for' | 'against' | 'abstain') => {
    console.log(`Voting ${choice} on proposal ${proposalId}`)
    // Call governance contract castVote
  }

  const getStateColor = (state: ProposalState): string => {
    switch (state) {
      case ProposalState.Active:
        return '#3b82f6'
      case ProposalState.Succeeded:
        return '#38a169'
      case ProposalState.Defeated:
        return '#e53e3e'
      case ProposalState.Pending:
        return '#f59e0b'
      case ProposalState.Executed:
        return '#805ad5'
      case ProposalState.Canceled:
        return '#718096'
      default:
        return '#000'
    }
  }

  const calculateProgress = (proposal: typeof MOCK_PROPOSALS[0]) => {
    const total = proposal.forVotes + proposal.againstVotes + proposal.abstainVotes
    if (total === 0) return { for: 0, against: 0, abstain: 0 }

    return {
      for: Math.round((proposal.forVotes / total) * 100),
      against: Math.round((proposal.againstVotes / total) * 100),
      abstain: Math.round((proposal.abstainVotes / total) * 100),
    }
  }

  return (
    <div className="grid">
      {/* Hero Section */}
      <section className="card-hero">
        <h1>DAO Governance</h1>
        <p>Shape the future of DeFi SaveTogether through decentralized voting</p>
      </section>

      {isConnected ? (
        <>
          {/* Voting Power Card */}
          <section className="card stagger-item">
            <h2>Your Voting Power</h2>
            <div className="stats-grid" style={{ marginTop: '1.5rem' }}>
              <div className="stat-card">
                <div className="stat-value">{userVotingPower.toLocaleString()}</div>
                <div className="stat-label">SAVE Tokens</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">
                  {MOCK_PROPOSALS.filter((p) => p.state === ProposalState.Active).length}
                </div>
                <div className="stat-label">Active Votes</div>
              </div>
            </div>

            <button
              className="button"
              style={{ width: '100%', marginTop: 'var(--space-6)' }}
              onClick={() => setShowCreateModal(true)}
              disabled={userVotingPower < 10000}
            >
              Create Proposal
            </button>

            {userVotingPower < 10000 && (
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-600)', marginTop: 'var(--space-2)' }}>
                Need 10,000 SAVE tokens to create proposals
              </p>
            )}
          </section>

          {/* Stats Overview */}
          <section className="card stagger-item">
            <h2>Platform Stats</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginTop: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 600 }}>Total Proposals</span>
                <span style={{ fontWeight: 800 }}>{MOCK_PROPOSALS.length}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 600 }}>Quorum Required</span>
                <span style={{ fontWeight: 800 }}>100,000 SAVE</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 600 }}>Voting Period</span>
                <span style={{ fontWeight: 800 }}>~7 days</span>
              </div>
            </div>
          </section>

          {/* Proposals List */}
          <section className="card stagger-item" style={{ gridColumn: '1 / -1' }}>
            <h2>Active Proposals</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', marginTop: '1.5rem' }}>
              {MOCK_PROPOSALS.map((proposal) => {
                const progress = calculateProgress(proposal)

                return (
                  <div
                    key={proposal.id}
                    className="card"
                    style={{
                      padding: 'var(--space-6)',
                      background: 'var(--gray-50)',
                      border: '2px solid var(--gray-300)',
                    }}
                  >
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
                          <h3 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-2)' }}>
                            {proposal.title}
                          </h3>
                        </div>
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-600)', margin: 0 }}>
                          by {proposal.proposer}
                        </p>
                      </div>

                      <div
                        className="badge-lg"
                        style={{
                          background: getStateColor(proposal.state),
                          color: 'var(--white)',
                          border: 'none',
                        }}
                      >
                        {proposal.state}
                      </div>
                    </div>

                    {/* Description */}
                    <p
                      style={{
                        marginTop: 'var(--space-4)',
                        marginBottom: 'var(--space-6)',
                        color: 'var(--gray-700)',
                      }}
                    >
                      {proposal.description}
                    </p>

                    {/* Voting Stats */}
                    <div style={{ marginBottom: 'var(--space-6)' }}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginBottom: 'var(--space-2)',
                          fontSize: 'var(--text-sm)',
                          fontWeight: 700,
                        }}
                      >
                        <span>For: {proposal.forVotes.toLocaleString()}</span>
                        <span>Against: {proposal.againstVotes.toLocaleString()}</span>
                      </div>

                      {/* Vote Progress Bars */}
                      <div style={{ display: 'flex', gap: '4px', height: '8px', borderRadius: 'var(--radius-full)' }}>
                        <div
                          style={{
                            width: `${progress.for}%`,
                            background: '#38a169',
                            borderRadius: 'var(--radius-full)',
                          }}
                        ></div>
                        <div
                          style={{
                            width: `${progress.against}%`,
                            background: '#e53e3e',
                            borderRadius: 'var(--radius-full)',
                          }}
                        ></div>
                        <div
                          style={{
                            width: `${progress.abstain}%`,
                            background: '#cbd5e0',
                            borderRadius: 'var(--radius-full)',
                          }}
                        ></div>
                      </div>

                      <div
                        style={{
                          marginTop: 'var(--space-2)',
                          fontSize: 'var(--text-sm)',
                          color: 'var(--gray-600)',
                        }}
                      >
                        Abstain: {proposal.abstainVotes.toLocaleString()}
                      </div>
                    </div>

                    {/* Voting Buttons */}
                    {proposal.state === ProposalState.Active && (
                      <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                        <button
                          className="button"
                          style={{
                            flex: 1,
                            background: '#38a169',
                            minWidth: '150px',
                          }}
                          onClick={() => handleVote(proposal.id, 'for')}
                        >
                          ✓ Vote For
                        </button>
                        <button
                          className="button"
                          style={{
                            flex: 1,
                            background: '#e53e3e',
                            minWidth: '150px',
                          }}
                          onClick={() => handleVote(proposal.id, 'against')}
                        >
                          ✗ Vote Against
                        </button>
                        <button
                          className="button button-outline"
                          style={{
                            flex: 1,
                            minWidth: '150px',
                          }}
                          onClick={() => handleVote(proposal.id, 'abstain')}
                        >
                          Abstain
                        </button>
                      </div>
                    )}

                    {proposal.state === ProposalState.Succeeded && (
                      <button className="button" style={{ width: '100%', background: '#805ad5' }}>
                        Execute Proposal
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        </>
      ) : (
        <section className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 'var(--space-12)' }}>
          <div style={{ fontSize: '4rem', marginBottom: 'var(--space-4)' }}>🗳️</div>
          <h2>Connect Your Wallet</h2>
          <p style={{ color: 'var(--gray-600)', maxWidth: '500px', margin: '0 auto' }}>
            Connect your wallet to participate in governance and vote on platform proposals.
          </p>
        </section>
      )}

      {/* Create Proposal Modal */}
      {showCreateModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 'var(--space-6)',
          }}
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="card"
            style={{
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Create Proposal</h2>

            <form className="form" onSubmit={handleCreateProposal}>
              <label>
                Title
                <input
                  type="text"
                  placeholder="E.g., Reduce loan interest rate"
                  value={proposalTitle}
                  onChange={(e) => setProposalTitle(e.target.value)}
                  required
                />
              </label>

              <label>
                Description
                <textarea
                  placeholder="Provide a detailed description of your proposal..."
                  rows={6}
                  value={proposalDescription}
                  onChange={(e) => setProposalDescription(e.target.value)}
                  required
                ></textarea>
              </label>

              <div className="notice">
                Creating a proposal requires 10,000 SAVE tokens. Voting will begin immediately and last ~7 days.
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                <button type="submit" className="button" style={{ flex: 1 }}>
                  Create Proposal
                </button>
                <button
                  type="button"
                  className="button button-outline"
                  style={{ flex: 1 }}
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
