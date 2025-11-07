import { useReadContract } from 'wagmi'
import { CONTRACTS, formatLabUSDT } from '../lib/contracts'

export default function AnalyticsPage() {
  // Read platform statistics
  const { data: groupCount } = useReadContract({
    ...CONTRACTS.groupVault,
    functionName: 'groupCount',
  })

  const { data: loanCount } = useReadContract({
    ...CONTRACTS.creditLine,
    functionName: 'loanCount',
  })

  // Note: These would ideally come from a subgraph for historical aggregation
  // For now, showing live contract data

  return (
    <div className="grid">
      <section className="card-hero">
        <h1>📊 Platform Analytics</h1>
        <p>Real-time statistics and insights for the SaveTogether platform.</p>
      </section>

      {/* Platform Overview */}
      <section className="card" style={{ gridColumn: '1 / -1' }}>
        <h2>Platform Overview</h2>
        <div className="stats-grid" style={{ marginTop: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          <div className="stat-card">
            <div className="stat-value">{groupCount?.toString() || '0'}</div>
            <div className="stat-label">Total Groups</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{loanCount?.toString() || '0'}</div>
            <div className="stat-label">Total Loans</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">-</div>
            <div className="stat-label">Total Savings</div>
            <div className="tag">Requires Subgraph</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">-</div>
            <div className="stat-label">Active Users</div>
            <div className="tag">Requires Subgraph</div>
          </div>
        </div>
      </section>

      {/* Loans */}
      <section className="card">
        <h2>Loan Metrics</h2>
        <div style={{ marginTop: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--gray-700)' }}>Total Loans Opened</span>
            <strong>{loanCount?.toString() || '0'}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--gray-700)' }}>Active Loans</span>
            <strong className="tag">Requires Subgraph</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--gray-700)' }}>Total Disbursed</span>
            <strong className="tag">Requires Subgraph</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--gray-700)' }}>Total Repaid</span>
            <strong className="tag">Requires Subgraph</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--gray-700)' }}>Default Rate</span>
            <strong className="tag">Requires Subgraph</strong>
          </div>
        </div>
      </section>

      {/* Groups */}
      <section className="card">
        <h2>Group Metrics</h2>
        <div style={{ marginTop: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--gray-700)' }}>Total Groups</span>
            <strong>{groupCount?.toString() || '0'}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--gray-700)' }}>Active Groups</span>
            <strong className="tag">Requires Subgraph</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--gray-700)' }}>Avg Group Size</span>
            <strong className="tag">Requires Subgraph</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--gray-700)' }}>Total Stake Locked</span>
            <strong className="tag">Requires Subgraph</strong>
          </div>
        </div>
      </section>

      {/* Savings */}
      <section className="card" style={{ gridColumn: '1 / -1' }}>
        <h2>Savings Metrics</h2>
        <div className="stats-grid" style={{ marginTop: '1.5rem' }}>
          <div className="stat-card">
            <div className="stat-value" style={{ fontSize: '1.5rem' }}>-</div>
            <div className="stat-label">Total Deposited</div>
            <div className="tag">Requires Subgraph</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ fontSize: '1.5rem' }}>-</div>
            <div className="stat-label">Total Withdrawn</div>
            <div className="tag">Requires Subgraph</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ fontSize: '1.5rem' }}>-</div>
            <div className="stat-label">Net Savings</div>
            <div className="tag">Requires Subgraph</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ fontSize: '1.5rem' }}>-</div>
            <div className="stat-label">Avg Streak</div>
            <div className="tag">Requires Subgraph</div>
          </div>
        </div>
      </section>

      {/* Badges & Engagement */}
      <section className="card">
        <h2>Badge & Engagement</h2>
        <div style={{ marginTop: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--gray-700)' }}>Total Badges Awarded</span>
            <strong className="tag">Requires Subgraph</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--gray-700)' }}>Most Common Badge</span>
            <strong className="tag">Requires Subgraph</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--gray-700)' }}>Users with 5+ Badges</span>
            <strong className="tag">Requires Subgraph</strong>
          </div>
        </div>
      </section>

      {/* Chart Placeholder */}
      <section className="card">
        <h2>Growth Trends</h2>
        <div style={{ marginTop: '1.5rem', padding: '3rem', textAlign: 'center', background: 'var(--gray-50)', borderRadius: '8px' }}>
          <p style={{ color: 'var(--gray-500)', marginBottom: '1rem' }}>📈 Charts Coming Soon</p>
          <p style={{ color: 'var(--gray-400)', fontSize: '0.875rem' }}>
            Historical charts require subgraph deployment
          </p>
          <p style={{ color: 'var(--gray-400)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            Deploy subgraph to visualize:
          </p>
          <ul style={{ color: 'var(--gray-400)', fontSize: '0.875rem', textAlign: 'left', marginTop: '1rem', listStyle: 'none', padding: 0 }}>
            <li>• Daily deposit trends</li>
            <li>• Loan origination over time</li>
            <li>• Group growth rate</li>
            <li>• Default rate trends</li>
          </ul>
        </div>
      </section>

      {/* Info */}
      <section className="card" style={{ gridColumn: '1 / -1' }}>
        <h2>🚀 Unlock Full Analytics</h2>
        <p style={{ marginBottom: '1rem' }}>
          Deploy the SaveTogether subgraph to enable historical data aggregation and advanced analytics.
        </p>
        <div style={{ background: 'var(--gray-50)', padding: '1.5rem', borderRadius: '8px' }}>
          <h3 style={{ marginTop: 0, fontSize: '1rem' }}>What you&apos;ll get:</h3>
          <ul style={{ marginBottom: 0, paddingLeft: '1.5rem' }}>
            <li>Historical transaction data</li>
            <li>User growth and retention metrics</li>
            <li>Loan performance analytics</li>
            <li>Real-time dashboard updates</li>
            <li>Custom GraphQL queries</li>
            <li>Time-series charts and visualizations</li>
          </ul>
          <p style={{ marginTop: '1rem', marginBottom: 0 }}>
            <strong>Getting Started:</strong> See <code>/subgraph/README.md</code> for deployment instructions.
          </p>
        </div>
      </section>
    </div>
  )
}
