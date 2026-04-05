import ObfuscatedEmail from '../components/ObfuscatedEmail'
import PageSection from '../components/PageSection'
import { SOCIAL_LINKS, createPageMetadata } from '../../utils/site'
import { GithubIcon, LinkedinIcon } from '../components/SocialIcons'

const iconLinkStyle: React.CSSProperties = {
  color: 'var(--ink-mid)',
  display: 'flex',
  alignItems: 'center',
}

export const metadata = createPageMetadata('Contact')

export default function ContactPage() {
  return (
    <PageSection label="contact" activePath="/contact">
      <p style={{ color: 'var(--ink-mid)', marginBottom: '1.25rem' }}>
        Open to interesting conversations. Say hello.
      </p>
      <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
        <ObfuscatedEmail style={iconLinkStyle} />
        <a
          href={SOCIAL_LINKS.github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          style={iconLinkStyle}
        >
          <GithubIcon size={15} />
        </a>
        <a
          href={SOCIAL_LINKS.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          style={iconLinkStyle}
        >
          <LinkedinIcon size={15} />
        </a>
      </div>
    </PageSection>
  )
}
