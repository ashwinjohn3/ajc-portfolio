This repo is now an [Astro](https://astro.build) portfolio site built around static pages, Markdown-backed content, and a lightweight client footprint.

## Getting Started

Run the Astro dev server:

```bash
npm run dev
```

Build commands:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

This usually runs at `http://localhost:4321`.

## Architecture

The site is organized as a content-first static app:

- [`src/layouts/`](./src/layouts) contains shared page shells
- [`src/components/`](./src/components) contains reusable UI pieces
- [`src/content/`](./src/content) contains Markdown-backed collections
- [`src/styles/global.css`](./src/styles/global.css) contains the shared visual system
- [`src/data/site.ts`](./src/data/site.ts) contains shared site constants

Important Astro architecture decisions:

- pages are static by default
- Markdown is the default authoring format
- project and photography detail pages are content-driven
- remote photography images stay external in v1
- dark mode is handled with a lightweight header toggle and no heavy theming package
- WebGL is intentionally deferred, but the app is structured so it can be added later as an isolated client-only island

## Content Editing

If you want to add or edit content yourself, most future content work should happen in Markdown under `src/content/`.

### Project entries

Add a new Markdown file in:

- [`src/content/projects/`](./src/content/projects)

Example existing file:

- [`src/content/projects/portfolio-refresh.md`](./src/content/projects/portfolio-refresh.md)

Each project entry becomes:

- a card in `/projects`
- a generated detail page at `/projects/<slug>`

### Photography entries

Add a new Markdown file in:

- [`src/content/photography/`](./src/content/photography)

Example existing file:

- [`src/content/photography/dc-bloom-walk.md`](./src/content/photography/dc-bloom-walk.md)

Each photography entry becomes:

- a card in `/photography`
- a generated detail page at `/photography/<slug>`

Photography notes:

- use absolute remote image URLs
- provide `width` and `height` for gallery images
- keep `alt` text meaningful

### Writing scaffold

There is also an optional writing collection:

- [`src/content/writing/`](./src/content/writing)

It is scaffolded now, but not yet surfaced in site navigation.

### Frontmatter rules

Content schemas are defined in:

- [`src/content/config.ts`](./src/content/config.ts)

If you add new frontmatter fields, update the schema there too. If the schema and Markdown drift apart, Astro will fail the build.

## Build Output

The build outputs static files into:

- [`dist/`](./dist)

Current generated routes include:

- `/`
- `/work`
- `/projects`
- `/projects/portfolio-refresh`
- `/photography`
- `/photography/dc-bloom-walk`
- `/contact`

The built output is intentionally small because the site ships mostly static HTML with minimal client-side code.

## Learn More

To learn more about the frameworks in this repo:

- [Astro Documentation](https://docs.astro.build) - learn about Astro pages, content collections, and islands.

The saved Astro migration plan lives in [`docs/superpowers/plans/2026-04-05-astro-migration-plan.md`](./docs/superpowers/plans/2026-04-05-astro-migration-plan.md).

## Deployment Notes

The site now targets Astro static output. Keep the current route structure intact unless the user explicitly asks for URL changes.

GitHub Pages deployment is defined in:

- [`.github/workflows/astro-pages.yml`](./.github/workflows/astro-pages.yml)

Current deployment behavior on this branch:

- runs on pushes to `codex/astro-migration-plan`
- installs dependencies with `npm ci`
- builds the Astro site with `npm run build`
- uploads `dist/` to GitHub Pages

This branch-scoped trigger is intentional so Astro deployment changes can be validated before any mainline cutover.
