// utils/constants.ts

export const PERSONAL_INFO = {
  name: 'Ashwin John Chempolil',
  firstName: 'Ashwin John',
  lastName: 'Chempolil',
  role: 'Software Dev Engineer II',
  company: 'Amazon Web Services, Inc.',
  tagline: 'Software Engineer · Builder · Thinker',
  location: 'Kerala → Boston → Washington DC',
  email: 'ashwinchempolil@gmail.com',
  github: 'https://github.com/ashwinjohn3',
  linkedin: 'https://linkedin.com/in/ashwinjohn3',
}

export interface SectionRow {
  index: string
  title: string
  subtitle: string
  year: string
}

export const EXPERIENCE: SectionRow[] = [
  { index: '01', title: 'Software Dev Engineer II',   subtitle: 'Amazon Web Services',    year: '2024–' },
  { index: '02', title: 'Software Dev Engineer',      subtitle: 'Amazon Web Services',    year: '2022'  },
  { index: '03', title: 'Graduate Course Assistant',  subtitle: 'Northeastern University', year: '2021' },
  { index: '04', title: 'Data Scientist Intern',      subtitle: 'Active.ai',              year: '2021'  },
]

export const EDUCATION: SectionRow[] = [
  { index: '01', title: 'MS, Data Analytics Engineering', subtitle: 'Northeastern University', year: '2021' },
  { index: '02', title: 'BTech, Production Engineering',  subtitle: 'University of Kerala',    year: '2018' },
]

export interface ShelfItem {
  title: string
  year?: string
  imageUrl: string
  spineColor: string
}

export const GAMES: ShelfItem[] = [
  // Steam CDN: https://cdn.cloudflare.steamstatic.com/steam/apps/{appId}/library_600x900.jpg
  { title: 'Elden Ring',    year: '2022', imageUrl: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/library_600x900.jpg',  spineColor: '#3a1a08' },
  { title: 'Balatro',       year: '2024', imageUrl: 'https://cdn.cloudflare.steamstatic.com/steam/apps/2379780/library_600x900.jpg',  spineColor: '#7a1010' },
  { title: 'Hollow Knight', year: '2017', imageUrl: 'https://cdn.cloudflare.steamstatic.com/steam/apps/367520/library_600x900.jpg',   spineColor: '#1a1a3a' },
]

export const MOVIES: ShelfItem[] = [
  // TMDB CDN: https://image.tmdb.org/t/p/w300/{poster_path}
  { title: 'Dune: Part Two', year: '2024', imageUrl: 'https://image.tmdb.org/t/p/w300/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg', spineColor: '#7a4800' },
  { title: 'Oppenheimer',    year: '2023', imageUrl: 'https://image.tmdb.org/t/p/w300/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg', spineColor: '#3a3000' },
  { title: 'Past Lives',     year: '2023', imageUrl: 'https://image.tmdb.org/t/p/w300/k3waqVXSnYNGCrFQlC7HGFaBFiV.jpg', spineColor: '#2a3a4a' },
]

export const TV_SHOWS: ShelfItem[] = [
  { title: 'Severance',   year: 'S2', imageUrl: 'https://image.tmdb.org/t/p/w300/lgpBhDWLMYWU7RfAVwGkEA09wFI.jpg', spineColor: '#0d2a2a' },
  { title: 'The Bear',    year: 'S3', imageUrl: 'https://image.tmdb.org/t/p/w300/sHFlbKS3WLqMnp9t2ghADIJFnuQ.jpg', spineColor: '#3a2800' },
  { title: 'Slow Horses', year: 'S4', imageUrl: 'https://image.tmdb.org/t/p/w300/zXGQHLFSFoFqFPABbRc2cSxMFjv.jpg', spineColor: '#1a2c3a' },
]
