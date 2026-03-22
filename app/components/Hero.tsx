// app/components/Hero.tsx
'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { PERSONAL_INFO } from '../../utils/constants'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const itemVariants = (dur: number) => ({
  hidden:  { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: dur, ease: [0.16, 1, 0.3, 1] } },
})

export default function Hero() {
  const prefersReducedMotion = useReducedMotion()
  const dur = prefersReducedMotion ? 0 : 0.55
  const item = itemVariants(dur)

  return (
    // className on <section> so responsive <style> overrides land on the padded element
    <section
      className="hero-section"
      style={{
        padding: '6rem 4rem',
        borderBottom: '1px solid var(--rule)',
        maxWidth: '860px',
        margin: '0 auto',
        width: '100%',
      }}
    >
      {/* Responsive padding via style tag — targets .hero-section on the outer <section> */}
      <style>{`
        @media (max-width: 640px) {
          .hero-section { padding: 2.5rem 1.5rem !important; }
          .hero-name { font-size: clamp(2.5rem, 12vw, 4rem) !important; }
          .hero-role-line { flex-direction: column !important; gap: 0.25rem !important; }
        }
        @media (min-width: 641px) and (max-width: 1024px) {
          .hero-section { padding: 3rem 2rem !important; }
          .hero-name { font-size: clamp(3rem, 7vw, 5.5rem) !important; }
        }
      `}</style>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Eyebrow */}
        <motion.p
          variants={item}
          style={{
            fontFamily: 'var(--font-dm-sans)',
            fontSize: 'var(--eyebrow-size)',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'var(--ink-faint)',
            marginBottom: '0.75rem',
          }}
        >
          {PERSONAL_INFO.tagline}
        </motion.p>

        {/* Name */}
        <div style={{ lineHeight: 0.92 }}>
          <motion.span
            className="hero-name"
            variants={item}
            style={{
              display: 'block',
              fontFamily: 'var(--font-fraunces)',
              fontSize: 'var(--name-size)',
              fontWeight: 700,
              color: 'var(--ink)',
              letterSpacing: '-0.04em',
            }}
          >
            {PERSONAL_INFO.firstName}
          </motion.span>
          <motion.span
            className="hero-name"
            variants={item}
            style={{
              display: 'block',
              fontFamily: 'var(--font-fraunces)',
              fontSize: 'var(--name-size)',
              fontWeight: 300,
              fontStyle: 'italic',
              color: 'var(--ink-mid)',
              letterSpacing: '-0.04em',
            }}
          >
            {PERSONAL_INFO.lastName}.
          </motion.span>
        </div>

        {/* Rule + role line */}
        <motion.div variants={item}>
          <div style={{ height: '1px', background: 'var(--rule)', margin: '1.25rem 0 0.875rem' }} />
          <div
            className="hero-role-line"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              fontFamily: 'var(--font-dm-sans)',
              fontSize: '0.6875rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--ink-faint)',
            }}
          >
            <span>{PERSONAL_INFO.role} · {PERSONAL_INFO.company}</span>
            <span>{PERSONAL_INFO.location}</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
