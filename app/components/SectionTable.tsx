// app/components/SectionTable.tsx
'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { SectionRow } from '../../utils/constants'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
}

const rowVariants = (dur: number) => ({
  hidden:  { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: dur, ease: [0.16, 1, 0.3, 1] } },
})

interface Props {
  heading: string
  rows: SectionRow[]
  id?: string
}

export default function SectionTable({ heading, rows, id }: Props) {
  const prefersReducedMotion = useReducedMotion()
  const dur = prefersReducedMotion ? 0 : 0.45
  const rowItem = rowVariants(dur)

  return (
    // className on <section> so responsive <style> overrides land on the padded element
    <section
      id={id}
      className="section-pad"
      style={{
        maxWidth: '860px',
        margin: '0 auto',
        width: '100%',
        padding: '3rem 4rem',
        borderBottom: '1px solid var(--rule)',
      }}
    >
      <style>{`
        @media (max-width: 640px)  { .section-pad { padding: 2rem 1.5rem !important; } }
        @media (min-width: 641px) and (max-width: 1024px) { .section-pad { padding: 2.5rem 2rem !important; } }
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
          marginBottom: '1rem',
        }}
      >
        {heading}
      </p>

      {/* Rows */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        {rows.map((row) => (
          <motion.div
            key={row.index}
            variants={rowItem}
            style={{
              display: 'grid',
              gridTemplateColumns: '2.5rem 1fr 4rem',
              gap: '0.375rem',
              padding: '0.75rem 0',
              borderBottom: '1px solid var(--rule)',
              alignItems: 'baseline',
            }}
          >
            {/* Index */}
            <span
              style={{
                fontFamily: 'var(--font-dm-sans)',
                fontSize: 'var(--label-size)',
                color: 'var(--ink-faint)',
              }}
            >
              {row.index}
            </span>

            {/* Title + subtitle */}
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-dm-sans)',
                  fontSize: 'var(--role-size)',
                  color: 'var(--ink)',
                  fontWeight: 400,
                }}
              >
                {row.title}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-dm-sans)',
                  fontSize: '0.6875rem',
                  color: 'var(--ink-mid)',
                  marginTop: '0.125rem',
                }}
              >
                {row.subtitle}
              </div>
            </div>

            {/* Year */}
            <span
              style={{
                fontFamily: 'var(--font-dm-sans)',
                fontSize: 'var(--label-size)',
                color: 'var(--ink-faint)',
                textAlign: 'right',
              }}
            >
              {row.year}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
