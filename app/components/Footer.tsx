// app/components/Footer.tsx  (server component — no 'use client')

import { Github, Linkedin } from 'lucide-react'
import { PERSONAL_INFO } from '../../utils/constants'
import ObfuscatedEmail from './ObfuscatedEmail'

const iconStyle: React.CSSProperties = {
  color: 'var(--ink-mid)',
  display: 'flex',
  alignItems: 'center',
  transition: 'color 0.15s',
}

export default function Footer() {
  return (
    <footer
      id="contact"
      className="footer-pad"
      style={{
        maxWidth: '860px',
        margin: '0 auto',
        width: '100%',
        padding: '3rem 4rem 4rem',
      }}
    >
      {/* Section heading */}
      <h2
        style={{
          fontFamily: 'var(--font-dm-sans)',
          fontSize: 'var(--label-size)',
          fontWeight: 500,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'var(--ink-faint)',
          marginBottom: '1.25rem',
        }}
      >
        Say hi
      </h2>

      {/* Icon row — email obfuscated, never in server HTML */}
      <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
        <ObfuscatedEmail style={iconStyle} />
        <a href={PERSONAL_INFO.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" style={iconStyle}>
          <Github size={18} />
        </a>
        <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" style={iconStyle}>
          <Linkedin size={18} />
        </a>
      </div>

      {/* Copyright rule */}
      <div style={{ height: '1px', background: 'var(--rule)', margin: '2rem 0 1rem' }} />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontFamily: 'var(--font-dm-sans)',
          fontSize: '0.6875rem',
          letterSpacing: '0.06em',
          color: 'var(--ink-faint)',
        }}
      >
        <span>{PERSONAL_INFO.name}</span>
        <span>© 2026</span>
      </div>
    </footer>
  )
}
