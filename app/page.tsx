// app/page.tsx
import Nav from './components/Nav'
import ObfuscatedEmail from './components/ObfuscatedEmail'
import { Github, Linkedin } from 'lucide-react'

const EXPERIENCE = [
  { title: 'Software Dev Engineer II',  sub: 'Amazon Web Services',    year: '2024–'  },
  { title: 'Software Dev Engineer',     sub: 'Amazon Web Services',    year: '2022'   },
  { title: 'Graduate Course Assistant', sub: 'Northeastern University', year: '2021'  },
  { title: 'Data Scientist Intern',     sub: 'Active.ai',              year: '2021'   },
]

const PROJECTS = [
  { title: 'CloudWatch Metrics Dashboard', sub: 'Amazon Web Services', year: '2024' },
  { title: 'Cost Anomaly Detection',       sub: 'Amazon Web Services', year: '2023' },
  { title: 'Data Pipeline Automation',     sub: 'Amazon Web Services', year: '2022' },
]

// 9 photo stubs — swap src + alt when photos are ready
const PHOTOS = Array.from({ length: 9 }, (_, i) => ({ src: '', alt: `Photo ${i + 1}` }))

const GITHUB   = 'https://github.com/ashwinjohn3'
const LINKEDIN = 'https://linkedin.com/in/ashwinjohn3'

export default function Page() {
  return (
    <>
      <Nav />
      <main>

        {/* ── Hero ── */}
        <div className="wrap" style={{ paddingTop: '4rem', paddingBottom: '3rem' }}>
          <p style={{ color: 'var(--ink)', marginBottom: '1rem', fontSize: '0.9rem' }}>
            Hi, I&apos;m Ashwin.
          </p>
          <p style={{ color: 'var(--ink-mid)', maxWidth: '480px' }}>
            Software engineer at Amazon Web Services, where I build infrastructure
            tooling and data systems. Based in Washington DC, originally from Kerala.
            I care about clean systems, good food, and things that work quietly in
            the background.
          </p>
        </div>

        {/* ── Work ── */}
        <section id="work" className="wrap section">
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

        {/* ── Projects ── */}
        <section id="projects" className="wrap section">
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

        {/* ── Photography ── */}
        <section id="photography" className="wrap section">
          <p className="label">photography</p>
          <div className="photo-grid">
            {PHOTOS.map((photo, i) => (
              <div key={i} className="photo-tile">
                {photo.src && <img src={photo.src} alt={photo.alt} />}
              </div>
            ))}
          </div>
        </section>

        {/* ── Contact ── */}
        <section id="contact" className="wrap section">
          <p className="label">contact</p>
          <p style={{ color: 'var(--ink-mid)', marginBottom: '1.25rem' }}>
            Open to interesting conversations. Say hello.
          </p>
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
            <ObfuscatedEmail style={{ color: 'var(--ink-mid)', display: 'flex', alignItems: 'center' }} />
            <a href={GITHUB} target="_blank" rel="noopener noreferrer" aria-label="GitHub" style={{ color: 'var(--ink-mid)', display: 'flex', alignItems: 'center' }}>
              <Github size={15} />
            </a>
            <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" style={{ color: 'var(--ink-mid)', display: 'flex', alignItems: 'center' }}>
              <Linkedin size={15} />
            </a>
          </div>
        </section>

        {/* ── Footer ── */}
        <div className="wrap" style={{ paddingTop: '2rem', paddingBottom: '3rem', color: 'var(--ink-faint)', fontSize: '0.7rem', display: 'flex', justifyContent: 'space-between' }}>
          <span>ashwin john chempolil</span>
          <span>© {new Date().getFullYear()}</span>
        </div>

      </main>
    </>
  )
}
