// app/components/Footer.tsx  (server component — no 'use client')

import { PERSONAL_INFO } from '../../utils/constants'
import ObfuscatedEmail from './ObfuscatedEmail'

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

      {/* Email — obfuscated client component, never in server-rendered HTML */}
      <ObfuscatedEmail
        style={{
          display: 'block',
          fontFamily: 'var(--font-dm-sans)',
          fontSize: '1rem',
          color: 'var(--ink)',
          marginBottom: '0.75rem',
        }}
      />

      {/* Social links */}
      <p
        style={{
          fontFamily: 'var(--font-dm-sans)',
          fontSize: '0.75rem',
          color: 'var(--ink-mid)',
        }}
      >
        <a href={PERSONAL_INFO.github} target="_blank" rel="noopener noreferrer">GitHub</a>
        {' · '}
        <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
      </p>

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
