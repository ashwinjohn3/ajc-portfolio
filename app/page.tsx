// app/page.tsx
import Nav from './components/Nav'

export default function Page() {
  return (
    <>
      <Nav activePath="/" />
      <main>
        <div className="wrap" style={{ paddingTop: '4rem', paddingBottom: '3rem' }}>
          <p style={{ color: 'var(--ink)', marginBottom: '1rem', fontSize: '0.9rem' }}>
            Hi, I&apos;m Ashwin.
          </p>
          <p style={{ color: 'var(--ink-mid)', maxWidth: '480px' }}>
            I&apos;m a software engineer based in Washington DC 🌸. I love exploring and tinkering with AI 🤖.
          </p>
          <p style={{ color: 'var(--ink-mid)', maxWidth: '480px', marginTop: '0.9rem' }}>
            Currently working at AWS ☁️.
          </p>
        </div>
      </main>
    </>
  )
}
