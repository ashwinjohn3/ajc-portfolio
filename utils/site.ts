import type { Metadata } from 'next'

export const SITE_NAME = 'Ashwin John Chempolil'

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

export function createPageMetadata(title: string): Metadata {
  return { title: `${title} — ${SITE_NAME}` }
}
