# Portfolio — Agent Context

## Stack

- Astro static site
- TypeScript
- Markdown-first content collections in `src/content/`
- Custom CSS in `src/styles/global.css`
- Local font asset served from `public/fonts/`

## Architecture

- Shared layouts live in `src/layouts/`
- Shared UI components live in `src/components/`
- Site constants live in `src/data/site.ts`
- Content schemas live in `src/content/config.ts`
- Page routes live in `src/pages/`

This repo has been cut over from the earlier Next.js implementation on this branch. Do not reintroduce Next.js-specific files unless the user explicitly asks for it.

## Content authoring

Markdown-backed content currently lives in:

- `src/content/projects/*.md`
- `src/content/photography/*.md`
- `src/content/writing/*.md`

Important:

- Project and photography detail pages are generated from Markdown content entries
- Frontmatter must stay in sync with `src/content/config.ts`
- Remote photography images should remain absolute URLs in frontmatter
- Gallery entries should include accurate `width`, `height`, and `alt`

## Styling

- Global styles live in `src/styles/global.css`
- Keep the visual language minimal and consistent with the current editorial monospace direction
- Prefer shared class-based styling over scattering many one-off inline styles
- The theme toggle exists in the header and should remain lightweight, no heavy theming framework

## Routes

Preserve these routes unless the user asks for URL changes:

- `/`
- `/work`
- `/projects`
- `/projects/[slug]`
- `/photography`
- `/photography/[slug]`
- `/contact`

## Media and photography

- Photography images are remote-hosted in v1
- Do not mirror remote images locally unless the user asks for a local asset pipeline
- Keep layouts resilient to missing or slow remote images

## Interactivity

- Pages should remain static by default
- Client-side behavior should be tiny and intentional
- WebGL is still out of scope for the current baseline, but future work may add an isolated client-only island

## Dev commands

- `npm run dev` — start Astro dev server
- `npm run build` — build Astro site
- `npm run preview` — preview Astro production build

## Deployment notes

- Build output goes to `dist/`
- `public/CNAME` and root `CNAME` represent the current custom domain setup
