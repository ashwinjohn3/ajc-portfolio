// app/projects/page.tsx
import Nav from '../components/Nav'

const PROJECTS = [
  { title: 'CloudWatch Metrics Dashboard', sub: 'Amazon Web Services', year: '2024' },
  { title: 'Cost Anomaly Detection',       sub: 'Amazon Web Services', year: '2023' },
  { title: 'Data Pipeline Automation',     sub: 'Amazon Web Services', year: '2022' },
]

export const metadata = { title: 'Projects — Ashwin John Chempolil' }

export default function ProjectsPage() {
  return (
    <>
      <Nav />
      <main>
        <section className="wrap section">
          <p className="label">projects</p>
          <div>
            {PROJECTS.map((row) => (
              <div key={row.title} className="row">
                <div>
                  <div>{row.title}</div>
                  <div className="row-sub">{row.sub}</div>
                </div>
                <div className="row-year">{row.year}</div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  )
}
