// app/components/Footer.tsx  (server component — no 'use client')

import { PERSONAL_INFO } from '../../utils/constants'

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
      <style>{`
        @media (max-width: 640px)  { .footer-pad { padding: 2rem 1.5rem 3rem !important; } }
        @media (min-width: 641px) and (max-width: 1024px) { .footer-pad { padding: 2.5rem 2rem 3rem !important; } }
      `}</style>

      {/* Section heading */}
      <p
        style={{
          fontFamily: 'var(--font-dm-sans)',
          fontSize: '0.5rem',
          fontWeight: 500,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--ink-faint)',
          marginBottom: '1.25rem',
        }}
      >
        Say hi
      </p>

      {/* Email */}
      <a
        href={`mailto:${PERSONAL_INFO.email}`}
        style={{
          display: 'block',
          fontFamily: 'var(--font-dm-sans)',
          fontSize: '1rem',
          color: 'var(--ink)',
          marginBottom: '0.75rem',
        }}
      >
        {PERSONAL_INFO.email}
      </a>

      {/* Social links */}
      <p
        style={{
          fontFamily: 'var(--font-dm-sans)',
          fontSize: '0.75rem',
          color: 'var(--ink-mid)',
        }}
      >
        <a href={PERSONAL_INFO.github}>GitHub</a>
        {' · '}
        <a href={PERSONAL_INFO.linkedin}>LinkedIn</a>
      </p>

      {/* Copyright rule */}
      <div style={{ height: '1px', background: 'var(--rule)', margin: '2rem 0 1rem' }} />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontFamily: 'var(--font-dm-sans)',
          fontSize: '0.6rem',
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
