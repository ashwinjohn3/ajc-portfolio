// app/page.tsx
import Nav from './components/Nav'
import Hero from './components/Hero'
import SectionTable from './components/SectionTable'
import Shelf from './components/Shelf'
import Footer from './components/Footer'
import { EXPERIENCE, EDUCATION, GAMES, MOVIES, TV_SHOWS } from '../utils/constants'

export default function Page() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        {/* SectionTable renders its own <section> — pass id directly to avoid nested <section><section> */}
        <SectionTable id="experience" heading="Experience" rows={EXPERIENCE} />
        <SectionTable id="education" heading="Education" rows={EDUCATION} />
        <Shelf games={GAMES} movies={MOVIES} tvShows={TV_SHOWS} />
      </main>
      <Footer />
    </>
  )
}
