// app/work/page.tsx
import Nav from '../components/Nav'

const EXPERIENCE = [
  { title: 'Software Dev Engineer II',  sub: 'Amazon Web Services',    year: '2024–' },
  { title: 'Software Dev Engineer',     sub: 'Amazon Web Services',    year: '2022'  },
  { title: 'Graduate Course Assistant', sub: 'Northeastern University', year: '2021' },
  { title: 'Data Scientist Intern',     sub: 'Active.ai',              year: '2021'  },
]

export const metadata = { title: 'Work — Ashwin John Chempolil' }

export default function WorkPage() {
  return (
    <>
      <Nav />
      <main>
        <section className="wrap section">
          <p className="label">work</p>
          <div>
            {EXPERIENCE.map((row) => (
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
