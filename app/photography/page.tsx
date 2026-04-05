import PageSection from '../components/PageSection'
import { createPageMetadata } from '../../utils/site'

const PHOTO_PLACEHOLDER_COUNT = 9

export const metadata = createPageMetadata('Photography')

export default function PhotographyPage() {
  return (
    <PageSection label="photography" activePath="/photography">
      <div className="photo-grid">
        {Array.from({ length: PHOTO_PLACEHOLDER_COUNT }, (_, index) => (
          <div key={index} className="photo-tile" />
        ))}
      </div>
    </PageSection>
  )
}
