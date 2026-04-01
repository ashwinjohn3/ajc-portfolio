// app/photography/page.tsx
import Nav from '../components/Nav'

const PHOTOS = Array.from({ length: 9 }, (_, i) => ({ src: '', alt: `Photo ${i + 1}` }))

export const metadata = { title: 'Photography — Ashwin John Chempolil' }

export default function PhotographyPage() {
  return (
    <>
      <Nav />
      <main>
        <section className="wrap section">
          <p className="label">photography</p>
          <div className="photo-grid">
            {PHOTOS.map((photo, i) => (
              <div key={i} className="photo-tile">
                {photo.src && <img src={photo.src} alt={photo.alt} />}
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  )
}
