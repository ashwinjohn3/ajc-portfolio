import { notFound } from 'next/navigation'
import PageSection from '../components/PageSection'
import { FEATURE_FLAGS, createPageMetadata } from '../../utils/site'

const PHOTO_PLACEHOLDER_COUNT = 9

export const metadata = createPageMetadata('Photography')

export default function PhotographyPage() {
  if (!FEATURE_FLAGS.photography) notFound()

  return (
    <PageSection label="photography">
      <div className="photo-grid">
        {Array.from({ length: PHOTO_PLACEHOLDER_COUNT }, (_, index) => (
          <div key={index} className="photo-tile" />
        ))}
      </div>
    </PageSection>
  )
}
