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

---

# Implementation Notes — U2 Core config + BaseLayout

## Decisions made (not in spec)

### Fonts API: top-level `fonts` key in Astro 6, NOT `experimental.fonts`
- The plan and `astro-migration-facts.md` both document `experimental: { fonts: [...] }` based on the
  Astro 5.x docs. In Astro 6.4.6 the fonts API has been **promoted out of experimental** — it is now a
  top-level `fonts:` key in `defineConfig()`. Using `experimental.fonts` causes a hard config error:
  "Invalid or outdated experimental feature."
- Decision: use `fonts: [...]` at the top level. Verified against
  `node_modules/astro/dist/core/config/schemas/base.js` which shows
  `fonts: z.array(FontFamilySchema).optional()` at root level, not inside `experimental`.
- The `<Font cssVariable="..." />` import from `astro:assets` and `fontProviders.google()` import from
  `astro/config` remain unchanged — only the config nesting changed.
- Build confirmed: "Copying fonts (5 files)..." appears in build output, fonts self-hosted in `dist/_astro/`.

### FontFamilySchema field names confirmed: `weights` and `styles` (not `weight`/`style`)
- Schema uses `z.tuple([WeightSchema], WeightSchema)` — weights must be a non-empty array.
- Valid fields: `name`, `cssVariable`, `provider`, `weights`, `styles`, `subsets`, `formats`,
  `fallbacks`, `optimizedFallbacks`, `display`, `stretch`, `featureSettings`, `variationSettings`,
  `unicodeRange`, `options`.

### No-flash theme script: IIFE pattern chosen
- Wrapped the applyTheme logic in an IIFE so `applyTheme` is not leaked to global scope. The
  `astro:after-swap` listener is added inside the IIFE via `document.addEventListener`.
- The script reads `localStorage.getItem('theme')` and falls back to `prefers-color-scheme`, then
  sets/removes the `.dark` class on `<html>`. Identical pattern to `astro-migration-facts.md §4/§6`.

### `<Font>` placement: before SEO tags, after theme script
- Theme script must be the absolute first thing in `<head>` (before any stylesheets) to prevent FOUC.
- `<Font>` tags placed after the theme script but before the title/meta block — this matches the
  Astro docs recommendation (Font outputs `<link rel="preload">` + `<style>`, both non-blocking).

### global.css import moved from index.astro to BaseLayout.astro
- U1 added `import '../styles/global.css'` in `index.astro` frontmatter. Now that BaseLayout exists,
  the import lives in the layout and was removed from `index.astro` to avoid duplicate injection.

### index.astro updated to use BaseLayout
- Replaced the inline `<html>/<head>/<body>` boilerplate in `index.astro` with `<BaseLayout>` wrapper.
  The scaffold `<h1>Scaffold</h1>` placeholder is preserved inside `<main>` for U3+ to replace.

## Build output (verified)
```
13:55:33 [assets] Copying fonts (5 files)...
13:55:33 [build] 1 page(s) built in 1.12s
# exit 0 — dist/ produced with CNAME, resume.pdf, _astro/ (fonts), index.html
```

## File layout after U2
```
astro-src/
├── astro.config.mjs          ← site, output:static, fonts[], image.remotePatterns, vite
├── src/
│   ├── layouts/
│   │   └── BaseLayout.astro  ← NEW: ClientRouter, Font tags, no-flash script, slot
│   ├── pages/
│   │   └── index.astro       ← updated: wraps BaseLayout
│   └── styles/
│       └── global.css        ← @import "tailwindcss" (unchanged; tokens land in U3)
└── public/
    ├── CNAME                 ← COPIED from ../public/CNAME
    ├── resume.pdf            ← COPIED from ../public/resume.pdf
    ├── favicon.ico
    └── favicon.svg
```
