import PageSection from '../components/PageSection'
import { EXPERIENCE, createPageMetadata } from '../../utils/site'

export const metadata = createPageMetadata('Work')

export default function WorkPage() {
  return (
    <PageSection label="work">
      <div>
        {EXPERIENCE.map((row) => (
          <div key={row.title} className="row">
            <div>
              <div>{row.title}</div>
              <div className="row-sub">{row.sub}</div>
            </div>
            <div className="row-year">{row.year}</div>
          </div>
        ))}
      </div>
    </PageSection>
  )
}
