export const SITE_NAME = 'Ashwin John Chempolil'

export const SITE_DESCRIPTION = 'Software engineer based in Washington DC.'

export const NAV_LINKS = [
  { label: 'work', href: '/work' },
  { label: 'projects', href: '/projects' },
  { label: 'photography', href: '/photography' },
  { label: 'contact', href: '/contact' },
] as const

export const EXPERIENCE = [
  { title: 'Software Dev Engineer II', sub: 'Amazon Web Services', year: '2024–' },
  { title: 'Software Dev Engineer', sub: 'Amazon Web Services', year: '2022' },
  { title: 'Graduate Course Assistant', sub: 'Northeastern University', year: '2021' },
  { title: 'Data Scientist Intern', sub: 'Active.ai', year: '2021' },
] as const

export const SOCIAL_LINKS = {
  github: 'https://github.com/ashwinjohn3',
  linkedin: 'https://linkedin.com/in/ashwinjohn3',
} as const

const EMAIL_CODES = [97, 115, 104, 119, 105, 110, 99, 104, 101, 109, 112, 111, 108, 105, 108, 64, 103, 109, 97, 105, 108, 46, 99, 111, 109]

export const EMAIL = EMAIL_CODES.map((code) => String.fromCharCode(code)).join('')
