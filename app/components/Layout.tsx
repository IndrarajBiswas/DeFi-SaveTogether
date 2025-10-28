import Link from 'next/link'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'
import dynamic from 'next/dynamic'
const WalletControls = dynamic(() => import('./WalletControls'), { ssr: false })

const NAV_ITEMS = [
  { href: '/', label: 'Overview' },
  { href: '/savings', label: 'Savings' },
  { href: '/groups', label: 'Groups' },
  { href: '/loans', label: 'Loans' },
  { href: '/admin', label: 'Admin' }
]

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter()
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <span className="brand__title">Linea Microfinance</span>
          <span className="brand__subtitle">Grameen-style group lending pilot</span>
        </div>
        <nav className="nav">
          {NAV_ITEMS.map((item) => {
            const active = router.pathname === item.href
            return (
              <Link key={item.href} href={item.href} className={active ? 'nav__link nav__link--active' : 'nav__link'}>
                {item.label}
              </Link>
            )
          })}
          <div style={{ marginLeft: 'auto' }} />
          <WalletControls />
        </nav>
      </header>
      <main className="app-main">{children}</main>
      <footer className="app-footer">
        <span>Linea Sepolia → Linea Mainnet rollout. See docs/runbook.md for deployment steps.</span>
      </footer>
    </div>
  )
}
