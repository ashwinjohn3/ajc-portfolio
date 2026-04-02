// app/projects/page.tsx
import Nav from '../components/Nav'

export const metadata = { title: 'Projects — Ashwin John Chempolil' }

export default function ProjectsPage() {
  return (
    <>
      <Nav />
      <main>
        <section className="wrap section">
          <p className="label">projects</p>
          <p style={{ color: 'var(--ink-faint)' }}>coming soon.</p>
        </section>
      </main>
    </>
  )
}
