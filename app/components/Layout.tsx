import Link from 'next/link'
import { useRouter } from 'next/router'
import { ReactNode, useState } from 'react'
import dynamic from 'next/dynamic'

const WalletControls = dynamic(() => import('./WalletControls'), { ssr: false })
const DarkModeToggle = dynamic(() => import('./DarkModeToggle'), { ssr: false })

const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', icon: '📊' },
  { href: '/savings', label: 'Savings', icon: '💰' },
  { href: '/groups', label: 'Groups', icon: '👥' },
  { href: '/loans', label: 'Loans', icon: '🏦' },
  { href: '/badges', label: 'Badges', icon: '🏆' },
  { href: '/badge-explorer', label: 'Explorer', icon: '🔍' },
  { href: '/governance', label: 'Governance', icon: '🗳️' },
  { href: '/admin', label: 'Admin', icon: '⚙️' }
]

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Skip to main content link for accessibility */}
      <a href="#main-content" className="skip-to-main">
        Skip to main content
      </a>

      {/* Header */}
      <header
        style={{
          borderBottom: '2px solid var(--color-border)',
          background: 'var(--color-card)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          boxShadow: '0 4px 0 var(--color-border)'
        }}
      >
        <div
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '2rem',
            flexWrap: 'wrap'
          }}
        >
          {/* Brand */}
          <Link
            href="/"
            style={{
              textDecoration: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem'
            }}
          >
            <h1
              style={{
                fontSize: '1.75rem',
                fontWeight: 800,
                margin: 0,
                color: 'var(--color-text)',
                letterSpacing: '-0.02em',
                textTransform: 'uppercase'
              }}
            >
              SaveTogether
            </h1>
            <p
              style={{
                fontSize: '0.75rem',
                margin: 0,
                color: 'var(--gray-500)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontWeight: 700
              }}
            >
              DeFi Microfinance
            </p>
          </Link>

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Dark Mode Toggle */}
          <DarkModeToggle />

          {/* Wallet */}
          <WalletControls />

          {/* Mobile Menu Button */}
          <button
            className={`mobile-menu-button ${mobileMenuOpen ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav
          className="desktop-nav"
          style={{
            borderTop: '2px solid var(--color-border)',
            background: 'var(--black)',
            overflowX: 'auto'
          }}
        >
          <div
            style={{
              maxWidth: '1400px',
              margin: '0 auto',
              display: 'flex',
              padding: '0 1rem'
            }}
          >
            {NAV_ITEMS.map((item) => {
              const active = router.pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    padding: '1rem 1.5rem',
                    color: active ? 'black' : 'white',
                    background: active ? 'white' : 'transparent',
                    textDecoration: 'none',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    borderRight: '2px solid rgba(255,255,255,0.1)',
                    transition: 'all 200ms',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.background = '#1a1a1a'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.background = 'transparent'
                    }
                  }}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Mobile Navigation */}
        <nav className={`nav-items ${mobileMenuOpen ? 'active' : ''}`}>
          {NAV_ITEMS.map((item) => {
            const active = router.pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  color: active ? 'var(--color-success)' : 'white',
                  textDecoration: 'none',
                  fontWeight: 700,
                  fontSize: '1.5rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem',
                  transition: 'all 200ms'
                }}
              >
                <span style={{ fontSize: '2rem' }}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </header>

      {/* Main Content */}
      <main id="main-content" style={{ flex: 1, background: 'var(--color-bg)' }}>
        {children}
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: '2px solid var(--color-border)',
          background: 'var(--black)',
          color: 'var(--white)',
          padding: '2rem 1.5rem',
          textAlign: 'center'
        }}
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <p
            style={{
              fontSize: '0.875rem',
              margin: '0 0 0.5rem 0',
              color: '#a3a3a3',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          >
            DIDLab Trust Testnet • Chain ID: 252501
          </p>
          <div
            style={{
              display: 'flex',
              gap: '1.5rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginTop: '1rem'
            }}
          >
            <a
              href="https://explorer.didlab.org"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'white',
                textDecoration: 'underline',
                fontSize: '0.875rem',
                fontWeight: 600
              }}
            >
              Explorer
            </a>
            <a
              href="https://faucet.didlab.org"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'white',
                textDecoration: 'underline',
                fontSize: '0.875rem',
                fontWeight: 600
              }}
            >
              Faucet
            </a>
            <a
              href="https://github.com/IndrarajBiswas/DeFi-SaveTogether"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'white',
                textDecoration: 'underline',
                fontSize: '0.875rem',
                fontWeight: 600
              }}
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
