// app/page.tsx
import Nav from './components/Nav'

export default function Page() {
  return (
    <>
      <Nav />
      <main>
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
      </main>
    </>
  )
}
