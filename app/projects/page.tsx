import PageSection from '../components/PageSection'
import { FEATURE_FLAGS, createPageMetadata } from '../../utils/site'
import { notFound } from 'next/navigation'

export const metadata = createPageMetadata('Projects')

export default function ProjectsPage() {
  if (!FEATURE_FLAGS.projects) notFound()

  return (
    <PageSection label="projects">
      <p style={{ color: 'var(--ink-faint)' }}>coming soon.</p>
    </PageSection>
  )
}
