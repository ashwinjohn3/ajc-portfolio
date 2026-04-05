import type { ReactNode } from 'react'
import Nav from './Nav'

interface PageSectionProps {
  label: string
  activePath: '/work' | '/projects' | '/photography' | '/contact'
  children: ReactNode
}

export default function PageSection({ label, activePath, children }: PageSectionProps) {
  return (
    <>
      <Nav activePath={activePath} />
      <main>
        <section className="wrap section">
          <p className="label">{label}</p>
          {children}
        </section>
      </main>
    </>
  )
}
