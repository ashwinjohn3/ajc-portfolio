// ---------------------------------------------------------------------------
// Site-level data — nav links, social links, bio, and feature flags.
// Migrated verbatim from utils/site.ts in the Next.js app.
// Feature flags read via import.meta.env.PUBLIC_* (Astro equivalent of
// NEXT_PUBLIC_* in Next.js; see astro-migration-facts.md §8.4).
// ---------------------------------------------------------------------------

export const SITE_NAME = 'Ashwin John Chempolil';

// ---------------------------------------------------------------------------
// Feature flags — gate a page (and its nav link) on/off without code changes.
// Off by default; set the matching env var to "true" (e.g. in .env) to enable.
// Use the typed helpers in src/lib/flags.ts for type-safe access.
// ---------------------------------------------------------------------------
export const FEATURE_FLAGS = {
  projects: import.meta.env.PUBLIC_SHOW_PROJECTS === 'true',
  photography: import.meta.env.PUBLIC_SHOW_PHOTOGRAPHY === 'true',
} as const;

export type FeatureFlag = keyof typeof FEATURE_FLAGS;

// ---------------------------------------------------------------------------
// Navigation links
// ---------------------------------------------------------------------------
export type NavLink = { label: string; href: string; flag?: FeatureFlag };

export const NAV_LINKS: NavLink[] = [
  { label: 'work', href: '/work' },
  { label: 'tools', href: '/tools' },
  { label: 'resume', href: '/resume' },
  { label: 'projects', href: '/projects', flag: 'projects' },
  { label: 'photography', href: '/photography', flag: 'photography' },
  { label: 'contact', href: '/contact' },
];

/** Returns only nav links whose feature flag (if any) is enabled. */
export function visibleNavLinks(): NavLink[] {
  return NAV_LINKS.filter((link) => !link.flag || FEATURE_FLAGS[link.flag]);
}

// ---------------------------------------------------------------------------
// Social links
// ---------------------------------------------------------------------------
export const SOCIAL_LINKS = {
  github: 'https://github.com/ashwinjohn3',
  linkedin: 'https://linkedin.com/in/ashwinjohn3',
} as const;

// ---------------------------------------------------------------------------
// Home page bio — verbatim from app/page.tsx
// ---------------------------------------------------------------------------
export const BIO = {
  tagline: "I'm a software engineer based in Washington, DC.",
} as const;

// ---------------------------------------------------------------------------
// Page metadata helper
// ---------------------------------------------------------------------------
export function createPageTitle(pageTitle: string): string {
  return `${pageTitle} — ${SITE_NAME}`;
}
