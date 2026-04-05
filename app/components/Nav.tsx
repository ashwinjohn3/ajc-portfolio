import Link from 'next/link'
import { NAV_LINKS, SITE_NAME } from '../../utils/site'

const activeLinkStyle: React.CSSProperties = {
  color: 'var(--ink)',
}

const inactiveNameStyle: React.CSSProperties = {
  color: 'var(--ink-mid)',
}

const inactiveNavItemStyle: React.CSSProperties = {
  color: 'var(--ink-faint)',
  padding: '0 0.35rem',
}

interface NavProps {
  activePath: '/' | '/work' | '/projects' | '/photography' | '/contact'
}

export default function Nav({ activePath }: NavProps) {
  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'var(--bg)',
      borderBottom: '1px solid var(--rule)',
    }}>
      <div className="wrap" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', paddingBottom: '0.75rem' }}>
        <Link
          href="/"
          prefetch={false}
          style={activePath === '/' ? activeLinkStyle : inactiveNameStyle}
        >
          {SITE_NAME.toLowerCase()}
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.1rem' }}>
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              prefetch={false}
              style={activePath === href ? { ...activeLinkStyle, padding: '0 0.35rem' } : inactiveNavItemStyle}
            >
              [{label}]
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
