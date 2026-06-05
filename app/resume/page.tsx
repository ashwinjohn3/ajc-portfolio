import Nav from '../components/Nav'
import { createPageMetadata } from '../../utils/site'

export const metadata = createPageMetadata('Resume')

const RESUME_PATH = '/resume.pdf'

const linkStyle: React.CSSProperties = {
  color: 'var(--ink)',
  textDecoration: 'underline',
  textUnderlineOffset: '3px',
}

export default function ResumePage() {
  return (
    <>
      <Nav />
      <main>
        <section className="wrap section">
          <p className="label">resume</p>
          <p style={{ color: 'var(--ink-mid)', marginBottom: '1.25rem' }}>
            The one-page version.{' '}
            <a href={RESUME_PATH} target="_blank" rel="noopener noreferrer" style={linkStyle}>
              Open ↗
            </a>{' '}
            ·{' '}
            <a href={RESUME_PATH} download="ChempolilAshwinJohn2026.pdf" style={linkStyle}>
              Download ↓
            </a>
          </p>
        </section>
        <div
          style={{
            maxWidth: '900px',
            margin: '0 auto',
            padding: '0 var(--pad-x) 3rem',
            width: '100%',
          }}
        >
          <iframe
            src={RESUME_PATH}
            title="Ashwin John Chempolil — Résumé"
            style={{
              width: '100%',
              height: '85vh',
              border: '1px solid var(--rule)',
              borderRadius: '2px',
              background: 'var(--bg)',
            }}
          />
        </div>
      </main>
    </>
  )
}
