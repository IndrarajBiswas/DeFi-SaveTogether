import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark') // Default to dark mode
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Check localStorage (default to dark if no preference saved)
    const savedTheme = localStorage.getItem('theme') as Theme | null

    if (savedTheme) {
      setTheme(savedTheme)
    } else {
      setTheme('dark') // Force dark mode by default
    }
  }, [])

  useEffect(() => {
    if (!mounted) return

    const root = document.documentElement
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark')
      root.classList.add('dark') // Add Tailwind dark class
    } else {
      root.removeAttribute('data-theme')
      root.classList.remove('dark') // Remove Tailwind dark class
    }
    localStorage.setItem('theme', theme)
  }, [theme, mounted])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

export default function DarkModeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      type="button"
    >
      <div className="theme-toggle-slider">
        {theme === 'light' ? '☀️' : '🌙'}
      </div>
    </button>
  )
}
