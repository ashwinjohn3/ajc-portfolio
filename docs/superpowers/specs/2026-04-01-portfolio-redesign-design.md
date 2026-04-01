# Portfolio Redesign — Design Spec

**Date:** 2026-04-01  
**Status:** Approved

---

## Overview

Extend the existing Next.js 14 portfolio (ashwin john chempolil) from a single-page scroll into a hybrid structure: a lean main page plus two dedicated sub-pages (`/work`, `/photography`). The design language stays the same — warm OKLCH tokens, Fraunces + DM Sans, minimal table-row aesthetic inspired by hrescak.com.

---

## Page Structure

### `/` — Main Page

Single scroll with four sections separated by `1px var(--rule)` borders, max-width 860px centered, consistent with the existing Hero layout.

1. **Hero** — unchanged. `Ashwin John` (bold) + `Chempolil.` (italic light). No new eyebrow or tagline.
2. **About** — new section. Short 2–3 sentence bio (plain prose, no bullet points). Eyebrow label `ABOUT` in the existing `--ink-faint` uppercase style.
3. **Experience** — existing `SectionTable` component, unchanged.
4. **Contact** — new section replacing the current Footer-only contact. Short one-liner ("Open to interesting conversations. Say hello.") + obfuscated email + GitHub + LinkedIn icon row (existing `ObfuscatedEmail` + lucide icons). Keep existing Footer below for copyright.

### `/work` — Work Projects

Dedicated page. Uses the same `SectionTable` component (or a near-identical variant) with `id="work"`. Rows: `index | title | subtitle (company) | year`. Populated from a new `WORK_PROJECTS` constant in `utils/constants.ts`. Same `Nav` component renders on all pages — no special back-link needed.

### `/photography` — Photography

Dedicated page. 3-column responsive grid of square image tiles. Stubbed with placeholder grey tiles for now — structured so real images (local or CDN) can be dropped in by swapping `src` values in a `PHOTOS` constant. No lightbox in v1 — clicking a tile does nothing (can be added later).

---

## Navigation

Update `Nav.tsx` NAV_LINKS:

```
Work      → /work
Photos    → /photography
Contact   → /#contact   (anchor on main page)
```

Remove `Study` link (Education section stays on main page but isn't nav-linked). Dark mode toggle stays.

---

## New Data in `utils/constants.ts`

```ts
// About bio (plain string, rendered as <p>) — user to provide final copy
export const ABOUT_BIO = `...`

// Work projects (reuses SectionRow interface)
export const WORK_PROJECTS: SectionRow[] = [
  { index: '01', title: '...', subtitle: 'Amazon Web Services', year: '2024' },
  // ...
]

// Photography stubs (array of { src, alt })
export const PHOTOS = [
  { src: '', alt: 'placeholder' },
  // ... 6–9 entries
]
```

---

## Components

| Component | Action |
|---|---|
| `Nav.tsx` | Update NAV_LINKS array |
| `Hero.tsx` | No change |
| `SectionTable.tsx` | Reuse as-is for Experience on `/`; reuse on `/work` |
| `About.tsx` | **New** — renders `ABOUT_BIO` with eyebrow label |
| `Contact.tsx` | **New** — replaces Footer contact block; section with bio line + icon row |
| `Footer.tsx` | Keep for copyright only |
| `app/work/page.tsx` | **New** — `/work` route, renders `SectionTable` with `WORK_PROJECTS` |
| `app/photography/page.tsx` | **New** — `/photography` route, renders photo grid |

---

## Styling

- All new sections follow the existing pattern: `<section id="...">` with `padding: '4rem 4rem'`, border-bottom rule, max-width 860px centered.
- Responsive overrides go in `globals.css` (not inline `<style>`).
- Photography grid: CSS grid, `grid-template-columns: repeat(3, 1fr)`, `gap: 0.5rem`, collapses to 2 columns on mobile.

---

## Out of Scope (v1)

- Lightbox / modal for photography
- Project detail pages
- Contact form (email link only)
- Animations on new sections beyond existing Framer Motion stagger pattern
- Real photography images (stubs only)
