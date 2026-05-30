import PageSection from '../components/PageSection'
import { WORK_EXPERIENCE, createPageMetadata } from '../../utils/site'

export const metadata = createPageMetadata('Work')

export default function WorkPage() {
  return (
    <PageSection label="work">
      <div>
        {WORK_EXPERIENCE.map((entry) => (
          <div key={`${entry.title}-${entry.company}`} className="exp-block">
            <div className="row">
              <div>
                <div>{entry.title}</div>
                <div className="row-sub">
                  {entry.company}
                  {entry.subtitle ? ` · ${entry.subtitle}` : null}
                </div>
              </div>
              <div className="row-year">{entry.period}</div>
            </div>
            {entry.bullets && entry.bullets.length > 0 ? (
              <ul className="exp-bullets">
                {entry.bullets.map((bullet) => (
                  <li key={bullet.text}>
                    {bullet.team ? (
                      bullet.href ? (
                        <a
                          className="bullet-team"
                          href={bullet.href}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {bullet.team}
                        </a>
                      ) : (
                        <span className="bullet-team">{bullet.team}</span>
                      )
                    ) : null}
                    {bullet.href && !bullet.team ? (
                      <a href={bullet.href} target="_blank" rel="noopener noreferrer">
                        {bullet.text}
                      </a>
                    ) : (
                      bullet.text
                    )}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ))}
      </div>
    </PageSection>
  )
}
