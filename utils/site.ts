import type { Metadata } from 'next'

export const SITE_NAME = 'Ashwin John Chempolil'

// Feature flags — gate a page (and its nav link) on/off without code changes.
// Off by default; set the matching env var to "true" (e.g. in .env.local) to re-enable.
export const FEATURE_FLAGS = {
  projects: process.env.NEXT_PUBLIC_SHOW_PROJECTS === 'true',
  photography: process.env.NEXT_PUBLIC_SHOW_PHOTOGRAPHY === 'true',
} as const

export type FeatureFlag = keyof typeof FEATURE_FLAGS

export type NavLink = { label: string; href: string; flag?: FeatureFlag }

export const NAV_LINKS: NavLink[] = [
  { label: 'work', href: '/work' },
  { label: 'resume', href: '/resume' },
  { label: 'projects', href: '/projects', flag: 'projects' },
  { label: 'photography', href: '/photography', flag: 'photography' },
  { label: 'contact', href: '/contact' },
]

// Nav links with their feature flag enabled (or no flag at all).
export function visibleNavLinks(): NavLink[] {
  return NAV_LINKS.filter((link) => !link.flag || FEATURE_FLAGS[link.flag])
}

export type WorkBullet = { text: string; href?: string; team?: string }

export type WorkExperience = {
  title: string
  company: string
  period: string
  subtitle?: string
  bullets?: WorkBullet[]
}

export const WORK_EXPERIENCE: WorkExperience[] = [
  {
    title: 'Software Development Engineer II',
    company: 'Amazon Web Services',
    period: '2022–2026',
    bullets: [
      {
        team: 'AWS Resource Access Manager',
        text: 'Making cloud shareable 🐏',
        href: 'https://aws.amazon.com/ram/',
      },
      {
        team: 'AWS Security Agent',
        text: 'Helped build and ship it.',
        href: 'https://aws.amazon.com/security-agent/',
      },
    ],
  },
  {
    title: 'Graduate Course Assistant',
    company: 'Northeastern University',
    subtitle: 'Engineering Probability and Statistics',
    period: '2021',
    bullets: [
      {
        text: 'Helped a class of grad students get through a hard course.',
      },
    ],
  },
  {
    title: 'Data Scientist Intern',
    company: 'Active.ai',
    period: '2021',
    bullets: [
      {
        text: 'Trained models to pull answers out of financial questions.',
      },
    ],
  },
]

export const SOCIAL_LINKS = {
  github: 'https://github.com/ashwinjohn3',
  linkedin: 'https://linkedin.com/in/ashwinjohn3',
} as const

export function createPageMetadata(title: string): Metadata {
  return { title: `${title} — ${SITE_NAME}` }
}
