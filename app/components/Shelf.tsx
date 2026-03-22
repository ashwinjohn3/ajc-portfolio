// app/components/Shelf.tsx
'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { ShelfItem } from '../../utils/constants'

interface ShelfRowProps {
  heading: string
  items: ShelfItem[]
}

function ShelfRow({ heading, items }: ShelfRowProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <div style={{ marginBottom: '2rem' }}>
      {/* Row heading */}
      <h3
        style={{
          fontFamily: 'var(--font-dm-sans)',
          fontSize: '0.5rem',
          fontWeight: 500,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--ink-faint)',
          marginBottom: '0.75rem',
          paddingBottom: '0.375rem',
          borderBottom: '1px solid var(--rule)',
        }}
      >
        {heading}
      </h3>

      {/* Covers */}
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        {items.map((item) => (
          <div key={item.title} style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            <motion.div
              role="img"
              aria-label={item.title}
              whileHover={{ y: prefersReducedMotion ? 0 : -6 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              style={{
                width: '72px',
                height: '104px',
                borderRadius: '3px',
                overflow: 'hidden',
                // spineColor used as a tinted bottom shadow to distinguish each title's color
                boxShadow: `0 4px 14px rgba(0,0,0,0.13), 0 1px 3px rgba(0,0,0,0.08), 0 6px 12px ${item.spineColor}55`,
                position: 'relative',
                cursor: 'default',
              }}
            >
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                sizes="72px"
                style={{ objectFit: 'cover', objectPosition: 'center top' }}
              />
            </motion.div>
            {/* Title */}
            <span
              style={{
                fontFamily: 'var(--font-dm-sans)',
                fontSize: '0.5rem',
                color: 'var(--ink-faint)',
                textAlign: 'center',
                width: '72px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                display: 'block',
              }}
            >
              {item.title}
            </span>
          </div>
        ))}
      </div>

      {/* Shelf ledge */}
      <div
        style={{
          height: '3px',
          background: `linear-gradient(to right, var(--rule), var(--rule))`,
          borderRadius: '2px',
          boxShadow: '0 3px 8px rgba(0,0,0,0.08)',
          marginTop: '0.25rem',
        }}
      />
    </div>
  )
}

interface Props {
  games: ShelfItem[]
  movies: ShelfItem[]
  tvShows: ShelfItem[]
}

export default function Shelf({ games, movies, tvShows }: Props) {
  return (
    <section
      id="shelf"
      className="shelf-section"
      style={{
        maxWidth: '860px',
        margin: '0 auto',
        width: '100%',
        padding: '3rem 4rem',
        borderBottom: '1px solid var(--rule)',
      }}
    >
      <h2
        style={{
          fontFamily: 'var(--font-dm-sans)',
          fontSize: '0.5rem',
          fontWeight: 500,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--ink-faint)',
          marginBottom: '1.5rem',
        }}
      >
        Currently into
      </h2>

      <ShelfRow heading="Games"    items={games} />
      <ShelfRow heading="Movies"   items={movies} />
      <ShelfRow heading="TV Shows" items={tvShows} />
    </section>
  )
}
