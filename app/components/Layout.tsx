import Link from 'next/link'
import { useRouter } from 'next/router'
import { ReactNode, useState } from 'react'
import dynamic from 'next/dynamic'
import {
  LayoutDashboard,
  Wallet,
  Users,
  Landmark,
  Award,
  Search,
  Vote,
  Settings,
  Menu,
  X
} from 'lucide-react'

const WalletControls = dynamic(() => import('./WalletControls'), { ssr: false })
const DarkModeToggle = dynamic(() => import('./DarkModeToggle'), { ssr: false })

const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/savings', label: 'Savings', icon: Wallet },
  { href: '/groups', label: 'Groups', icon: Users },
  { href: '/loans', label: 'Loans', icon: Landmark },
  { href: '/badges', label: 'Badges', icon: Award },
  { href: '/badge-explorer', label: 'Explorer', icon: Search },
  { href: '/governance', label: 'Governance', icon: Vote },
  { href: '/admin', label: 'Admin', icon: Settings }
]

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-page-bg">
      {/* Skip to main content link for accessibility */}
      <a href="#main-content" className="skip-to-main">
        Skip to main content
      </a>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-card-bg border-b-2 border-border-default shadow-lg backdrop-blur-sm bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Brand */}
            <Link href="/" className="flex flex-col group transition-transform hover:scale-105">
              <h1 className="text-2xl md:text-3xl font-extrabold text-text-primary tracking-tight">
                SaveTogether
              </h1>
              <p className="text-[10px] md:text-xs text-text-muted uppercase tracking-widest font-semibold">
                DeFi Microfinance
              </p>
            </Link>

            {/* Desktop Navigation Actions */}
            <div className="hidden md:flex items-center gap-4">
              <DarkModeToggle />
              <WalletControls />
            </div>

            {/* Mobile Menu Button */}
            <button
              className="mobile-menu-button md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-text-primary" />
              ) : (
                <Menu className="w-6 h-6 text-text-primary" />
              )}
            </button>
          </div>

          {/* Desktop Navigation Bar */}
          <nav className="hidden md:flex border-t border-border-subtle -mx-4 sm:-mx-6 lg:-mx-8">
            <div className="flex w-full">
              {NAV_ITEMS.map((item) => {
                const active = router.pathname === item.href
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      flex items-center gap-2 px-6 py-4
                      font-semibold text-sm uppercase tracking-wide
                      transition-all duration-200
                      border-b-2
                      ${active
                        ? 'text-accent border-accent bg-accent/5'
                        : 'text-text-secondary border-transparent hover:text-text-primary hover:bg-card-hover'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </nav>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t border-border-subtle bg-card-bg">
            <div className="px-4 py-4 space-y-2">
              {NAV_ITEMS.map((item) => {
                const active = router.pathname === item.href
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg
                      font-semibold text-base transition-all
                      ${active
                        ? 'text-accent bg-accent/10 border border-accent/30'
                        : 'text-text-secondary hover:text-text-primary hover:bg-card-hover'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
              <div className="pt-4 border-t border-border-subtle flex items-center justify-between">
                <DarkModeToggle />
                <WalletControls />
              </div>
            </div>
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main id="main-content" className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-border-default bg-zinc-950 text-text-secondary py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <p className="text-sm font-semibold uppercase tracking-wider">
              DIDLab Trust Testnet • Chain ID: 252501
            </p>
            <div className="flex items-center justify-center gap-6 flex-wrap">
              <a
                href="https://explorer.didlab.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-accent-hover font-medium text-sm transition-colors underline"
              >
                Block Explorer
              </a>
              <a
                href="https://faucet.didlab.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-accent-hover font-medium text-sm transition-colors underline"
              >
                Faucet
              </a>
              <a
                href="https://github.com/IndrarajBiswas/DeFi-SaveTogether"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-accent-hover font-medium text-sm transition-colors underline"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
