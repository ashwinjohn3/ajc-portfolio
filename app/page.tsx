// app/page.tsx
import Nav from './components/Nav'

export default function Page() {
  return (
    <>
      <Nav />
      <main>
        <div className="wrap" style={{ paddingTop: '4rem', paddingBottom: '3rem' }}>
          <p style={{ color: 'var(--ink)', marginBottom: '1rem', fontSize: '1.5rem', fontWeight: 600 }}>
            Hi, I&apos;m Ashwin.
          </p>
          <p style={{ color: 'var(--ink-mid)', maxWidth: '520px' }}>
            I&apos;m a software engineer based in Washington, DC 🌸.
          </p>
        </div>
      </main>
    </>
  )
}
