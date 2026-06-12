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

# Implementation Notes — U4 Content Collections + Migration

## Decisions made (not in spec)

### `z` imported from `astro/zod` (not `zod` directly)
- Official Astro docs recommend `import { z } from 'astro/zod'` in `content.config.ts`.
- Both work at runtime; `astro/zod` avoids any version-mismatch risk if Astro ships its own Zod.

### `order` field added to both collections (not in spec)
- The spec did not specify a sort key for work entries or uses categories. Without a stable sort,
  `getCollection()` returns entries in filesystem order (non-deterministic across platforms).
- Added `order: z.number().int().nonnegative()` to both `work` and `uses` schemas.
- Work entries: 0 = AWS (most recent), 1 = Northeastern, 2 = Active.ai.
- Uses categories: 0 = Editor & Terminal, 1 = Hardware, 2 = Software & Services.
- Page builders should sort with `.sort((a, b) => a.data.order - b.data.order)`.

### `src/data/site.ts` as a plain TS module (not a collection)
- The plan mentions both "file() loader JSON" and "a site.ts config module" as options.
- Decision: plain TypeScript module. Nav links, social links, and bio are code-controlled config,
  not markdown content. A plain module is simpler and avoids a JSON-to-TS impedance mismatch.
- `FEATURE_FLAGS` lives here because it reads `import.meta.env` at the module level — this would
  not be possible inside a collection schema (schemas run at type-generation time).

### `BIO` object added (not in original site.ts)
- The Next.js home page bio is hardcoded inline in `app/page.tsx`, not in `utils/site.ts`.
- Decision: migrate it into `src/data/site.ts` as a `BIO` constant so it is centralized.
- Values are verbatim: `"Hi, I'm Ashwin."` and `"I'm a software engineer based in Washington, DC 🌸."`.

### `createPageTitle()` replaces `createPageMetadata()`
- Original Next.js helper returns `Metadata` (Next.js type). Astro does not have a `Metadata` type.
- Replaced with `createPageTitle(pageTitle: string): string` — returns the formatted title string.
- Callers pass it to `BaseLayout`'s `title` prop.

### `.env.example` placed in `astro-src/` root (not repo root)
- The Astro project root is `astro-src/`. Astro reads `.env` from the project root, not the monorepo
  root. `.env.example` is placed alongside `astro.config.mjs` for discoverability.

### Uses collection: 3 placeholder files, all items marked TODO
- Three categories: "Editor & Terminal" (order 0), "Hardware" (order 1), "Software & Services" (order 2).
- All item names and descriptions prefixed with "TODO:" so Ashwin can grep for `TODO:` to find them.
- Each file has a one-sentence markdown body for context (optional; page builders can ignore it).

## Build verification
```
$ cd astro-src && npm run build
14:00:11 [content] Syncing content
14:00:11 [content] Synced content
14:00:11 [types] Generated 294ms
14:00:11 [build] 1 page(s) built in 780ms
14:00:11 [build] Complete!
# exit 0 — both collections loaded, Zod schemas validated, no TS errors
```

## File layout after U4
```
astro-src/
├── .env.example                        ← NEW: PUBLIC_SHOW_PROJECTS / PHOTOGRAPHY = false
├── src/
│   ├── content.config.ts               ← NEW: work + uses collections with zod schemas
│   ├── content/
│   │   ├── work/
│   │   │   ├── amazon-web-services.md  ← NEW
│   │   │   ├── northeastern-university.md  ← NEW
│   │   │   └── active-ai.md            ← NEW
│   │   └── uses/
│   │       ├── editor-terminal.md      ← NEW (placeholder)
│   │       ├── hardware.md             ← NEW (placeholder)
│   │       └── software.md             ← NEW (placeholder)
│   ├── data/
│   │   └── site.ts                     ← NEW: SITE_NAME, NAV_LINKS, SOCIAL_LINKS,
│   │                                          FEATURE_FLAGS, BIO, createPageTitle()
│   └── lib/
│       └── flags.ts                    ← NEW: isEnabled(), isDisabled()
```

## U5 starting point
- Import `visibleNavLinks()` from `../data/site` for the Nav component.
- Import `SOCIAL_LINKS` from `../data/site` for the Footer.
- Import `isDisabled()` from `../lib/flags` for flagged page 404 guards.
- Work collection: `getCollection('work')` + `.sort((a,b) => a.data.order - b.data.order)`.
- Uses collection: `getCollection('uses')` + `.sort((a,b) => a.data.order - b.data.order)`.

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

                                                                              
  --------                                                                    
                                                                              
---

# Implementation Notes — U6 Hero Component

## Decisions made (not in spec)

### Dual-weight name treatment (not specified in U6 spec)
- Spec says "play with weight/size — minimal but with one playful touch."
- Decision: split the name across two lines. "Ashwin" at font-normal (400) and a smaller clamp size;
  "John Chempolil" at font-bold (700) and a larger clamp size. Same family (Space Grotesk) throughout —
  no weight switching mid-word, just a line break that lets the weight contrast land cleanly.
- `clamp(2.5rem, 6vw, 3.75rem)` / `clamp(2.75rem, 7vw, 4.5rem)` for fluid sizing without breakpoints.
- Letter-spacing: -0.02em / -0.03em — tight tracking at display sizes, matches Space Grotesk character.

### Fixed brand colors hardcoded in `<style>`, not via CSS variables
- `#FFBE98` (avatar ring) and `#4ade80` (ping) declared as `background-color: #FFBE98` directly.
- Rationale: fixed elements that must never adapt to theme. Hardcoding makes that contract visible to
  any future editor without requiring them to trace CSS variable chains.
- Global CSS variables still exist as documentation; component does not consume them.

### Two-layer ping pattern
- Outer `.ping-ring` div: animates scale 1→2 and fades. Inner `.ping-dot` div: solid, never animates.
- Single-element ping goes fully transparent at scale(2) — the indicator disappears briefly (bad UX).
- Two-layer keeps the dot always visible; only the pulse ring animates.

### `@keyframes hero-ping` added to global.css (append-only)
- Added at end of global.css under a clearly labelled comment block.
- No existing token rules touched — pure append per U6 constraint.
- Same keyframes also declared inside Hero.astro scoped `<style>` as self-contained fallback.

### CTA arrow: inline SVG, not lucide-react
- lucide-react is installed in the Next.js app but not in astro-src.
- Inline SVG arrow (24×24 viewBox, stroke-width 2.5). Zero dependency.

### Bug fixed: apostrophe in single-quoted string default
- `avatarAlt = 'Ashwin's labrador'` caused esbuild parse error ("Expected } but found s").
- Fix: use double quotes for strings containing apostrophes.

## Build verification

```
$ cd astro-src && npm run build
14:06:33 [build] 1 page(s) built in 758ms
14:06:33 [build] Complete!
exit 0
```

## File layout after U6

```
astro-src/
└── src/
    ├── components/
    │   └── Hero.astro          ← NEW: avatar ring, ping badge, name, bio, CTA
    └── styles/
        └── global.css          ← APPENDED: @keyframes hero-ping block
```

## U9/U10 starting point
- `import Hero from '../components/Hero.astro'`
- `import { BIO } from '../data/site'`
- Pass `greeting`, `tagline`, `ctaHref`, `ctaLabel` as props; all have sensible defaults.
- `avatarSrc` default is `https://placedog.net/400/400` — swap for real photo URL when available.
- `badgeText` default is `'Open to opportunities'` — update via prop if status changes.

  ## U7 — Section, Card, ObfuscatedEmail, UsesSection + content.config.ts     
  cleanup (2026-06-12)                                                        
                                                                              
  ### content.config.ts: z.string().url() → z.url()                           
                                                                              
  • Two occurrences: bullets[].href in work schema and items[].url in uses    
  schema.                                                                     
  • z.url() is the non-deprecated Zod 4 form; z.string().url() produces TS    
  deprecation 6385.                                                           
  • astro check confirms 0 warnings after this change.                        
                                                                              
  ### Section.astro design decisions                                          
                                                                              
  • Renders its own <section id={...}> — never wrap in another <section> from 
  page.tsx.                                                                   
  • 1/3 label / 2/3 content via flex flex-col gap-6 md:flex-row md:gap-10 —   
  collapses on mobile.                                                        
  • Label: font-mono text-xs uppercase tracking-widest text-secondary — Space 
  Mono technical axis.                                                        
  • Border-top border-t border-border separates sections visually; py-10      
  vertical rhythm.                                                            
  • class prop forwarded to outer <section> for responsive overrides from page
  level.                                                                      
                                                                              
  ### Card.astro design decisions                                             
                                                                              
  • Polymorphic: renders <a> when href is set, <div> otherwise — avoids nested
  interactive elements.                                                       
  • External links get target="_blank" rel="noopener noreferrer" automatically.
  • Logo slot: mb-3 md:mb-0 md:absolute md:-left-16 md:top-3 — negative offset
  treatment on desktop,                                                       
  stacked on mobile. Only rendered when Astro.slots.has('logo') is true.      
  • Hover: transition-all duration-200 + hover:border-primary/25 hover:shadow-
  sm only when href                                                           
  present (non-linked cards don't fake interactivity). Matches design DNA     
  (border-only feedback, no lift).                                            
  • bg-surface applied so cards distinguish from page bg-bg background.       
  • subheading rendered in text-accent font-mono — terracotta for company/role
  labels per usage rules.                                                     
  • meta (date range) rendered above heading in font-mono text-xs text-       
  secondary.                                                                  
                                                                              
  ### ObfuscatedEmail.astro design decisions                                  
                                                                              
  • Zero framework JS: no React, no Svelte — pure is:inline script.           
  • Char-code array CODES passed via define:vars so it is inlined without     
  exposing the address as a                                                   
  string literal. The define:vars value appears as [97,115,...] in emitted    
  HTML — never @gmail.                                                        
  • id="obfuscated-email" used for querySelector; page may only have one      
  instance at a time (contact page                                            
  use-case). If multiple instances are needed in future, refactor to use a    
  data attribute + NodeList.                                                  
  • Fallback label [email] shown before JS runs (e.g. no-JS environments or   
  slow connections). Considered                                               
  "click to reveal" pattern but decided against: showing the address          
  immediately on load is friendlier.                                          
  • astro:after-swap listener re-decodes after ClientRouter navigations (SPA- 
  style nav swaps the DOM).                                                   
  • Verified: grep -r "ashwinjohn3" dist/ → no results. grep -r "@gmail" dist/
  → no results.                                                               
                                                                              
  ### UsesSection.astro design decisions                                      
                                                                              
  • Composes Section + Card directly — no new abstractions introduced.        
  • TODO items detected by description?.startsWith('TODO') — rendered with    
  text-secondary/50 italic                                                    
  so the section looks complete while content is pending.                     
  • Item names rendered as font-mono text-xs to maintain the technical/mono   
  axis for tool labels.                                                       
  • Item URLs open in a new tab with rel="noopener noreferrer".               
                                                                              
  ### Hero.astro smartquote fix (incidental)                                  
                                                                              
  • Build failed with "Expected } but found s" at Hero.astro:32 — a right     
  single quotation mark (')                                                   
  inside a single-quoted JS string broke the esbuild parser.                  
  • This was a concurrent U6 agent's file. The agent self-corrected before my 
  edit could apply.                                                           
  Recorded here for the audit trail.                                          


                                                                              
  --------                                                                    
                                                                              
  # Implementation Notes — U5 Nav + Footer + ThemeToggle                      
                                                                              
  ## Decisions made (not in spec)                                             
                                                                              
  ### ThemeToggle: is:inline script with removeEventListener before re-bind   
                                                                              
  • ClientRouter replaces the DOM on navigation, creating a new #theme-toggle 
  button element each time.                                                   
  • astro:after-swap fires after the new DOM is in place. Re-binding requires 
  removing the old listener                                                   
  first (on the new element there is no old listener, but the pattern is safe 
  regardless).                                                                
  • The toggle does NOT call BaseLayout's applyTheme() — it only flips .dark  
  and updates localStorage.                                                   
  This avoids double-applying on load and keeps the two scripts decoupled.    
                                                                              
  ### ThemeToggle: CSS :global(.dark) for icon visibility                     
                                                                              
  • Astro scopes <style> blocks. To target <html class="dark"> (a parent      
  element) from inside a                                                      
  component's scoped style, use :global(.dark) .selector.                     
  • Moon icon visible by default (light mode); sun icon hidden. When .dark is 
  on <html>, rules swap.                                                      
  • No JS class toggling on the button itself — pure CSS driven by the <html> 
  class.                                                                      
                                                                              
  ### Nav: transition:name="site-name" on first name only                     
                                                                              
  • Renders only the first token of SITE_NAME ("Ashwin") in the nav to keep it
  compact.                                                                    
  • Full name is in the Hero; abbreviated name in nav is the convention.      
                                                                              
  ### Nav: active link detection via Astro.url.pathname                       
                                                                              
  • Active state: solid border-primary + text-primary. Inactive: border-      
  transparent with hover.                                                     
  • The / home link is NOT in NAV_LINKS so no risk of it always matching via  
  startsWith.                                                                 
                                                                              
  ### Nav: bg-bg/95 with backdrop-blur-sm                                     
                                                                              
  • Tailwind 4 opacity modifier /95 works on custom tokens declared in @theme.
  • Slight transparency + blur gives the sticky nav depth without a harsh     
  solid color.                                                                
                                                                              
  ### Footer: copyright year computed server-side                             
                                                                              
  • new Date().getFullYear() runs in Astro frontmatter (server-side at static 
  build time).                                                                
  • Result is a static number in the built HTML — no client JS needed.        
                                                                              
  ### BaseLayout: <main> wrapper around slot                                  
                                                                              
  • Added <main> landmark between Nav and Footer wrapping <slot />.           
  • Provides correct landmark semantics for screen readers.                   
  • Current pages render <section> elements (not <main>), so no nested        
  landmark conflict.                                                          
                                                                              
  ### scroll-margin-top: 4rem matches nav height                              
                                                                              
  • Nav height is h-14 = 3.5rem. The 4rem placeholder from U3 provides        
  comfortable buffer.                                                         
  • No change to global.css needed.                                           
                                                                              
  ## Build verification                                                       
                                                                              
    $ cd astro-src && npm run build                                           
    14:11:02 [build] 1 page(s) built in 737ms                                 
    14:11:02 [build] Complete!                                                
    exit 0                                                                    
                                                                              
    $ npx astro check                                                         
    Result (15 files):                                                        
    - 0 errors                                                                
    - 0 warnings                                                              
    - 0 hints                                                                 
                                                                              
  ## File layout after U5                                                     
                                                                              
    astro-src/                                                                
    └── src/                                                                  
        ├── components/                                                       
        │   ├── Nav.astro            <- NEW: sticky top nav, feature-flagged  
  links, ThemeToggle                                                          
        │   ├── ThemeToggle.astro    <- NEW: zero-framework dark/light toggle,
  ClientRouter-safe                                                           
        │   └── Footer.astro         <- NEW: social links + copyright metadata
        └── layouts/                                                          
            └── BaseLayout.astro     <- MODIFIED: imports + renders Nav, main,
  Footer                                                                      
                                                                              
  ## U9/U10 starting point                                                    
                                                                              
  • <BaseLayout> now renders Nav + Footer automatically — pages just need the 
  wrapper.                                                                    
  • Nav reads visibleNavLinks() directly; no page needs to pass nav links.    
  • Footer reads SOCIAL_LINKS directly; no page needs to pass social links.   
  • ThemeToggle is embedded in Nav — no separate import needed from pages.    

