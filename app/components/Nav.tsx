// app/components/Nav.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'
import { NAV_LINKS, SITE_NAME } from '../../utils/site'

const activeLinkStyle: React.CSSProperties = {
  color: 'var(--ink)',
  opacity: 1,
}

const inactiveNameStyle: React.CSSProperties = {
  color: 'var(--ink-mid)',
}

const inactiveNavItemStyle: React.CSSProperties = {
  color: 'var(--ink-faint)',
  padding: '0 0.35rem',
}

const iconButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: 'var(--ink-faint)',
  display: 'flex',
  alignItems: 'center',
  padding: '0 0.35rem',
  marginLeft: '0.25rem',
}

export default function Nav() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'var(--bg)',
      borderBottom: '1px solid var(--rule)',
    }}>
      <div className="wrap" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', paddingBottom: '0.75rem' }}>
        <Link
          href="/"
          style={pathname === '/' ? activeLinkStyle : inactiveNameStyle}
        >
          {SITE_NAME.toLowerCase()}
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.1rem' }}>
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              style={pathname === href ? { ...activeLinkStyle, padding: '0 0.35rem' } : inactiveNavItemStyle}
            >
              [{label}]
            </Link>
          ))}
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle theme"
              style={iconButtonStyle}
            >
              {theme === 'dark' ? <Sun size={11} /> : <Moon size={11} />}
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}
