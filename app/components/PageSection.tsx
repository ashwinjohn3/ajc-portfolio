import type { ReactNode } from 'react'
import Nav from './Nav'

interface PageSectionProps {
  label: string
  children: ReactNode
}

export default function PageSection({ label, children }: PageSectionProps) {
  return (
    <>
      <Nav />
      <main>
        <section className="wrap section">
          <p className="label">{label}</p>
          {children}
        </section>
      </main>
    </>
  )
}
