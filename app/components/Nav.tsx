// app/components/Nav.tsx
'use client'

import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import { useReducedMotion } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import { useEffect, useState } from 'react'

const NAV_LINKS = [
  { label: 'Work',   href: '#experience' },
  { label: 'Study',  href: '#education'  },
  { label: 'Say hi', href: '#contact'    },
]

export default function Nav() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => { setMounted(true) }, [])

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'var(--nav-bg)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.625rem 2.5rem',
        flexWrap: 'wrap',
        gap: '0.5rem',
      }}
    >
      {/* Site identity */}
      <span
        style={{
          fontFamily: 'var(--font-dm-sans)',
          fontSize: '0.6875rem',
          fontWeight: 500,
          color: 'var(--nav-ink)',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
        }}
      >
        ashwinjc
      </span>

      {/* Links + theme toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {NAV_LINKS.map(({ label, href }) => (
          <motion.a
            key={href}
            href={href}
            initial={{ opacity: 0.5 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.15 }}
            style={{
              fontFamily: 'var(--font-dm-sans)',
              fontSize: 'var(--nav-size)',
              color: 'var(--nav-ink)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              textDecoration: 'none',
            }}
          >
            {label}
          </motion.a>
        ))}

        {/* Theme toggle */}
        {mounted && (
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--nav-ink)',
              opacity: 0.6,
              display: 'flex',
              alignItems: 'center',
              padding: '2px',
            }}
          >
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        )}
      </div>

    </nav>
  )
}
