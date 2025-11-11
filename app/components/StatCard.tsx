interface StatCardProps {
  value: string | number
  label: string
  icon?: string
  loading?: boolean
}

export default function StatCard({ value, label, icon, loading }: StatCardProps) {
  if (loading) {
    return <div className="skeleton skeleton-stat" />
  }

  return (
    <div className="stat-card">
      {icon && <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{icon}</div>}
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  )
}
