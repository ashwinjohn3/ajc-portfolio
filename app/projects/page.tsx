import PageSection from '../components/PageSection'
import { createPageMetadata } from '../../utils/site'

export const metadata = createPageMetadata('Projects')

export default function ProjectsPage() {
  return (
    <PageSection label="projects" activePath="/projects">
      <p style={{ color: 'var(--ink-faint)' }}>coming soon.</p>
    </PageSection>
  )
}
