import { ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'

interface CardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  interactive?: boolean
}

export function Card({ children, className = '', onClick, interactive = false }: CardProps) {
  const baseClass = interactive ? 'card-interactive' : 'card'
  return (
    <div className={`${baseClass} ${className}`} onClick={onClick}>
      {children}
    </div>
  )
}

interface HeroCardProps {
  title: string
  subtitle?: string
  children?: ReactNode
  className?: string
}

export function HeroCard({ title, subtitle, children, className = '' }: HeroCardProps) {
  return (
    <div className={`card-hero ${className}`}>
      <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-br from-zinc-50 to-zinc-400">
        {title}
      </h1>
      {subtitle && (
        <p className="text-lg md:text-xl text-text-secondary max-w-3xl mx-auto mb-8">
          {subtitle}
        </p>
      )}
      {children}
    </div>
  )
}

interface StatCardProps {
  value: string | number
  label: string
  icon?: LucideIcon
  trend?: {
    value: string
    positive: boolean
  }
  loading?: boolean
  className?: string
}

export function StatCard({ value, label, icon: Icon, trend, loading, className = '' }: StatCardProps) {
  if (loading) {
    return (
      <div className={`stat-card ${className}`}>
        <div className="skeleton h-10 w-24 mx-auto mb-2" />
        <div className="skeleton h-4 w-16 mx-auto" />
      </div>
    )
  }

  return (
    <div className={`stat-card ${className}`}>
      {Icon && <Icon className="w-8 h-8 text-accent mx-auto mb-3" />}
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      {trend && (
        <div className={`mt-2 text-sm font-semibold ${trend.positive ? 'text-emerald-400' : 'text-red-400'}`}>
          {trend.positive ? '↑' : '↓'} {trend.value}
        </div>
      )}
    </div>
  )
}

interface SectionCardProps {
  title: string
  subtitle?: string
  action?: ReactNode
  children: ReactNode
  className?: string
}

export function SectionCard({ title, subtitle, action, children, className = '' }: SectionCardProps) {
  return (
    <Card className={className}>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">{title}</h2>
          {subtitle && <p className="text-text-muted mt-1">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
      {children}
    </Card>
  )
}

interface MetricRowProps {
  label: string
  value: string | ReactNode
  icon?: ReactNode
}

export function MetricRow({ label, value, icon }: MetricRowProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border-subtle last:border-0">
      <div className="flex items-center gap-2">
        {icon && <span className="text-text-muted">{icon}</span>}
        <span className="text-sm font-semibold text-text-secondary uppercase tracking-wide">
          {label}
        </span>
      </div>
      <div className="font-mono font-semibold text-text-primary">{value}</div>
    </div>
  )
}
