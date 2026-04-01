// app/contact/page.tsx
import Nav from '../components/Nav'
import ObfuscatedEmail from '../components/ObfuscatedEmail'
import { Github, Linkedin } from 'lucide-react'

const GITHUB   = 'https://github.com/ashwinjohn3'
const LINKEDIN = 'https://linkedin.com/in/ashwinjohn3'

export const metadata = { title: 'Contact — Ashwin John Chempolil' }

export default function ContactPage() {
  return (
    <>
      <Nav />
      <main>
        <section className="wrap section">
          <p className="label">contact</p>
          <p style={{ color: 'var(--ink-mid)', marginBottom: '1.25rem' }}>
            Open to interesting conversations. Say hello.
          </p>
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
            <ObfuscatedEmail style={{ color: 'var(--ink-mid)', display: 'flex', alignItems: 'center' }} />
            <a href={GITHUB} target="_blank" rel="noopener noreferrer" aria-label="GitHub"
              style={{ color: 'var(--ink-mid)', display: 'flex', alignItems: 'center' }}>
              <Github size={15} />
            </a>
            <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
              style={{ color: 'var(--ink-mid)', display: 'flex', alignItems: 'center' }}>
              <Linkedin size={15} />
            </a>
          </div>
        </section>
      </main>
    </>
  )
}
