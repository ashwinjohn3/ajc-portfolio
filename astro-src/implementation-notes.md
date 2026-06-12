# Implementation Notes — U1 Scaffold

## Decisions made (not in spec)

### Astro version: 6.4.6 installed, not 5.x
- The plan specified "Astro 5" but `npm create astro@latest` resolves to the current release.
- At execution time (2026-06-12) `create-astro@5.0.6` installs **astro 6.4.6**.
- All migration facts in `.omc/handoffs/astro-migration-facts.md` remain valid for 6.x:
  - `@tailwindcss/vite` integration path is identical
  - `ClientRouter` from `astro:transitions` is the correct import (ViewTransitions was removed in v6)
  - strict tsconfig, content collections, PUBLIC_ env vars — all unchanged
- Decision: proceed with 6.4.6 rather than pin to 5.x; 6.x is the stable current release.
- Recorded in `.omc/handoffs/learnings.md` and `u1-scaffold.md`.

### Scaffold location: `astro-src/` subdirectory (not repo root)
- `npm create astro@latest .` refused to scaffold into a non-empty directory (produces a default-named
  subdirectory instead). The repo root is non-empty (Next.js app present).
- Decision: scaffold into `astro-src/` — a clean, clearly named subdirectory that coexists with the
  Next app. All Astro work lives under `astro-src/`; U2+ components/pages/layouts go inside it.
- The root `package.json` is the Next.js one and remains untouched.

### global.css import added to index.astro
- The `astro add tailwind` command scaffolds `src/styles/global.css` with `@import "tailwindcss"` but
  does NOT inject the import into any page. Added the import to `src/pages/index.astro` frontmatter
  so Tailwind is active at build time and the scaffold build passes cleanly.

## Build commands (for learnings.md)

```
cd astro-src
npm install          # install deps
npm run dev          # dev server (astro dev, port 4321 default)
npm run build        # astro build → dist/
npm run preview      # astro preview
```

## File layout after U1

```
ajc-portfolio/
├── app/                    ← Next.js app (untouched)
├── astro-src/              ← NEW: Astro 6 scaffold
│   ├── astro.config.mjs    ← @tailwindcss/vite wired
│   ├── tsconfig.json       ← extends astro/tsconfigs/strict
│   ├── package.json        ← astro 6.4.6 + @tailwindcss/vite 4.3.x
│   ├── src/
│   │   ├── pages/index.astro
│   │   └── styles/global.css   ← @import "tailwindcss"
│   ├── public/
│   └── dist/               ← build output (gitignored)
├── public/                 ← Next.js public (CNAME, resume.pdf — untouched)
└── ...                     ← all Next.js config files untouched
```

## U2 starting point
- `astro.config.mjs` needs: `site`, `output: 'static'`, `image.remotePatterns`, experimental fonts config.
- `src/layouts/BaseLayout.astro` to be created with ClientRouter, no-flash theme script, font tags.
- `public/CNAME` and `public/resume.pdf` should be copied into `astro-src/public/`.
