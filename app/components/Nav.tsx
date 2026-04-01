// app/components/Nav.tsx
'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

const LINKS = [
  { label: 'work',        href: '#work'        },
  { label: 'projects',    href: '#projects'    },
  { label: 'photography', href: '#photography' },
  { label: 'contact',     href: '#contact'     },
]

export default function Nav() {
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
        <a href="/" style={{ color: 'var(--ink-mid)' }}>
          ashwin john chempolil
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.1rem' }}>
          {LINKS.map(({ label, href }) => (
            <a key={href} href={href} style={{ color: 'var(--ink-faint)', padding: '0 0.35rem' }}>
              [{label}]
            </a>
          ))}
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle theme"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-faint)', display: 'flex', alignItems: 'center', padding: '0 0.35rem', marginLeft: '0.25rem' }}
            >
              {theme === 'dark' ? <Sun size={11} /> : <Moon size={11} />}
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}
