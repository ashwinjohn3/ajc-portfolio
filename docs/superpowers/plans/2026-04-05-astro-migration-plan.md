# Astro Migration Plan

## Goal

Migrate the portfolio from Next.js to Astro to reduce framework overhead, make the site more content-first, and support markdown-driven pages with TypeScript, remote-hosted photography, and selective interactive islands for WebGL.

## Why Astro

- Better fit for a mostly static portfolio and writing site
- Markdown and MDX are first-class
- TypeScript works naturally in components, content schemas, and utilities
- JavaScript ships only where interactivity is explicitly needed
- WebGL can be isolated to client-only islands instead of hydrating the whole page

## Desired End State

- Astro-based static site
- Markdown or MDX-driven project, writing, and photography pages
- Shared typed layouts and components
- Remote photography images loaded from external hosts/CDNs
- Optional client-only WebGL section for homepage or project pages
- Minimal client JavaScript outside explicit interactive islands

## Content Model

### Pages

- Home
- Work
- Projects index
- Photography index
- Contact

### Content Collections

- `src/content/projects/*.md` or `*.mdx`
- `src/content/photography/*.md` or `*.mdx`
- optional `src/content/writing/*.md`

### Typed Frontmatter

Projects:

- `title`
- `slug`
- `year`
- `summary`
- `tags`
- `externalUrl`
- `repoUrl`
- `featured`

Photography:

- `title`
- `slug`
- `location`
- `date`
- `coverImage`
- `gallery`
- `camera`
- `filmOrLens`
- `featured`

Remote image fields should be stored as full URLs so the site can render externally hosted photography without copying the assets into the repo.

## Target Architecture

### Core folders

```text
src/
  components/
    Nav.astro
    PageSection.astro
    SocialIcons.astro
    PhotoGrid.astro
    ProjectCard.astro
    WebGLHero.tsx
  content/
    config.ts
    projects/
    photography/
    writing/
  layouts/
    BaseLayout.astro
    ContentLayout.astro
  pages/
    index.astro
    work.astro
    projects/
      index.astro
      [slug].astro
    photography/
      index.astro
      [slug].astro
    contact.astro
  styles/
    global.css
```

### Rendering strategy

- Static `.astro` pages for all content pages
- Markdown/MDX rendered through content collections
- WebGL embedded only where needed with `client:load` or `client:visible`
- No framework runtime on plain text/image pages

## Migration Phases

### Phase 1: Foundation

- Initialize Astro in a new migration branch or directory
- Port global CSS and visual tokens
- Recreate the current route structure as Astro pages
- Rebuild header and simple layout components in `.astro`
- Preserve current typography and minimal visual style

### Phase 2: Content system

- Define Astro content collections with Zod schemas
- Move structured portfolio content into markdown frontmatter
- Convert current work, projects, and photography placeholders into content-backed pages
- Add typed helpers for sorting featured items and building navigation

### Phase 3: Photography support

- Model photography entries with remote image URLs
- Build gallery/grid components that render remote-hosted images
- Decide whether each page should use:
  - plain `<img>` for absolute simplicity
  - Astro image tooling only for locally hosted assets
- Add captions, metadata, and optional grouped galleries

### Phase 4: WebGL support

- Choose rendering stack:
  - plain canvas + TypeScript if lightweight and custom
  - Three.js if scene complexity grows
  - React Three Fiber only if React-specific scene ergonomics are truly needed
- Keep the WebGL component isolated as an island
- Lazy-load it only on pages that need it
- Provide static fallback content for reduced-motion or low-power devices

### Phase 5: Cleanup and deployment

- Remove Next.js app/router files once parity is reached
- Remove unused React/Next-only dependencies if Astro components cover all needs
- Update deployment config for Astro static output
- Add redirects or preserve routes if URLs change
- Verify performance and final page output

## Performance Principles

- Default to static HTML
- Hydrate nothing unless it adds real value
- Keep remote images off the critical path where possible
- Use responsive image sizing in galleries
- Avoid full-page React hydration
- Treat WebGL as an opt-in enhancement, not a site baseline

## Markdown vs MDX

Use markdown by default for simple content pages.

Use MDX only when a page needs embedded components such as:

- featured project callouts
- inline photography grids
- WebGL embeds
- custom notes or timeline blocks

This keeps authoring simple while still allowing richer pages where needed.

## Risks

### Content migration drift

If content lives partly in code and partly in markdown during transition, pages can become inconsistent.

Mitigation:

- move one content area at a time
- centralize schemas early
- keep canonical content source clear

### Overusing interactive islands

If too many pages embed client-side widgets, Astro’s performance advantage gets diluted.

Mitigation:

- keep interactivity isolated
- prefer static markup first
- require explicit justification for hydrated components

### Remote image reliability

Externally hosted photography may be slower or less stable than local assets.

Mitigation:

- use trusted image hosts/CDNs
- keep alt text and dimensions explicit
- optionally cache or mirror critical hero images later

## Implementation Order

1. Create Astro scaffold and base layout
2. Port global styling and navigation
3. Recreate current static routes
4. Introduce content collections
5. Migrate projects and photography to markdown
6. Add remote gallery support
7. Add optional WebGL island
8. Remove Next.js-specific code and dependencies
9. Validate routes, performance, and deployment

## Success Criteria

- All current routes render correctly in Astro
- Site content can be authored via markdown/MDX
- Photography pages support remote-hosted images cleanly
- A WebGL section can be embedded without hydrating the whole site
- Client JavaScript is materially lower than the current Next.js build
- Deployment remains simple and reliable

## Recommendation

Proceed with Astro as the primary migration target.

Use:

- `.astro` for layout and page shells
- markdown for most content
- MDX only where embedded components are needed
- TypeScript content schemas for structure and safety
- client-only islands for WebGL or any future interactive experiments
