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

# Implementation Notes — U6-FIX Hero badge text color (2026-06-12)

## Finding
Wave-2 code review (wave2-review.md) identified Hero.astro:184 using `var(--color-text-secondary)`
which no longer exists after the U3 rename (`--color-*` raw vars → `--brand-*`). The Tailwind theme
name emitted by `@theme inline` is `--color-secondary` (not `--color-text-secondary`), so the ref
resolved to nothing — badge text inherited primary color instead of muted secondary.

## Fix applied
Two-part change to Hero.astro:
1. Added `text-secondary` Tailwind utility to the badge span class list (line ~85). This is the
   preferred approach: single source of truth via the utility, same pattern as rest of component.
2. Removed the `color: var(--color-text-secondary)` declaration from `.hero-badge-text` scoped
   style rule. The `font-family` declaration was retained (no Tailwind utility covers that slot).

## Verification
- `cd astro-src && npm run build` → exit 0, 1 page built.
- dist CSS confirms: `.text-secondary{color:var(--brand-text-secondary)}` — live token.
- Dark mode confirmed: `.dark{--brand-text-secondary:oklch(65.5% .029 71)}` present in dist.
- `grep --color-text-secondary dist/` → no results — dead var fully gone.
- `git grep -n 'var(--color-' astro-src/src` sweep confirmed Hero was the only offender;
  the two remaining refs (`var(--color-accent)` and `var(--color-accent-hover)`) are correct —
  they are emitted by `@theme inline` on `:root` and resolve fine.

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

---

# Implementation Notes — U8 ExperienceTimeline

## Decisions made (not in spec)

### Card rendered as `<div>` — no card-level `href`

The spec says "link preserved: AWS RAM + Security Agent hrefs." The initial implementation passed
`href` to Card (making it an `<a>`) while also rendering bullet-level `<a>` tags in the default
slot. This creates nested `<a>` elements — invalid HTML per the interactive content model.

Fix: Card is always a `<div>` (no `href` prop). The company name is rendered as a standalone `<a>`
at the top of the default slot when a company URL exists. This keeps all links valid and keyboard-
navigable without nesting. The card's hover border feedback is lost (hover only activates on linked
cards), but the company name `<a>` provides a clear interactive affordance instead.

### Text abbreviation badge in logo slot (AWS, NEU, AI)

No local logo files exist in `astro-src/src/assets/`. A `<span slot="logo">` with the abbreviation
in `font-mono text-accent` styled as `bg-surface border-border rounded-lg w-10 h-10` occupies the
Card logo slot and inherits the `md:absolute md:-left-16` desktop offset treatment. Upgrading to
real logos: replace the `<span>` with an `<img>` in the slot — no Card/Section changes needed.

### `subheading` prop omitted from Card — company name in default slot

Since the company needs to be a link (not plain text), and Card's `subheading` prop renders as a
`<p>` (not a `<a>`), the company name is placed in the default slot instead. This avoids modifying
Card.astro, which is shared by UsesSection and any future consumers.

### `[bracket]` notation for team labels

`bullets[].team` rendered as `[AWS Resource Access Manager]` in `font-mono text-xs text-accent`
before the bullet text. Follows the nav bracket convention from U5.

## Build verification

```
$ cd astro-src && npm run build
14:20:25 [build] 1 page(s) built in 1.13s
14:20:25 [build] Complete!
# exit 0
```

Scratch page `src/pages/scratch-u8.astro` created, built, verified (3 entries + all links confirmed
in dist HTML), then removed before final clean build.

## File layout after U8

```
astro-src/
└── src/
    └── components/
        └── ExperienceTimeline.astro    ← NEW
```

---

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

---

# Implementation Notes — U10 Home Variant B + /work page

## Decisions made (not in spec)

### "see my work" link placement
- Spec says "perhaps with a one-line 'see my work →' terracotta link to /work."
- Rendered as a standalone `<div>` between the Hero section and UsesSection, constrained to
  the same `max-w-[60rem] mx-auto px-6 sm:px-10` grid as the Hero for alignment.
- Uses bracket notation `[see my work]` (Space Mono `font-mono`) to stay consistent with the
  nav link convention. Arrow SVG reuses the identical inline SVG from Hero.astro (stroke-width 2.5).
- `text-accent` / `hover:text-accent-hover` — terracotta; exactly one terracotta element on the page
  besides Hero's CTA, which is acceptable (both are CTA-class links).

### /work page header
- Spec says "small page header (Space Mono label style)".
- Rendered as a `<p class="font-mono text-xs uppercase tracking-widest text-secondary">experience</p>`
  inside a constrained div — matches the Section label treatment exactly (same classes as
  Section.astro's 1/3 label column).
- Not rendered as a `<Section>` wrapper because ExperienceTimeline already renders its own
  `<Section id="experience">`. Adding another Section above would duplicate the border-top separator.
  The standalone label div has no border — it acts as a quiet page label, not a full section.

### No bottom padding div on /work
- Hero on home pages has `pt-20 pb-16 sm:pt-28 sm:pb-20` built in. The /work page header div
  uses `pt-20 pb-2 sm:pt-28` to match the same top padding without adding extra vertical space
  before the Section component's own `py-10` rhythm.

### variant-b.astro page title includes "Variant B" label
- Title: `createPageTitle('Home — Variant B')` → "Home — Variant B — Ashwin John Chempolil".
- This marks it clearly as a demo route. At U15 if B wins and becomes index.astro, the title
  is changed to `createPageTitle('Home')` at that point (single-word change).

### No ExperienceTimeline import in variant-b.astro
- Variant B is explicitly the home WITHOUT the timeline. The only work reference is the
  `[see my work]` text link to /work. No work collection data is queried on this page.

## Build verification

```
$ cd astro-src && npm run build
14:22:42 [build] 3 page(s) built in 937ms
14:22:42 [build] Complete!
# exit 0
```

## Content verification

- `/variant-b`: `grep -c "Amazon Web Services|Northeastern|Active.ai"` → 0 (confirmed absent)
- `/work`: all 3 entries present (Amazon Web Services, Northeastern University, Active.ai,
  Software Development Engineer II); all company + bullet hrefs confirmed in built HTML.

## File layout after U10

```
astro-src/
└── src/
    └── pages/
        ├── variant-b.astro    ← NEW: Hero + work-link + UsesSection + Contact
        └── work.astro         ← NEW: page header label + ExperienceTimeline
```


                                                                              
  --------                                                                    
                                                                              
  # Implementation Notes — U9 Home Variant A                                  
                                                                              
  ## Decisions made (not in spec)                                             
                                                                              
  ### Removed nested <main> from scaffold stub                                
                                                                              
  The scaffold stub had <main><h1>Scaffold</h1></main> inside <BaseLayout>.   
  BaseLayout                                                                  
  already wraps <slot /> in <main>, so the page must render bare sections, not
  a second                                                                    
  <main>. Replaced with a flat sequence of component calls.                   
                                                                              
  ### Contact section is a teaser, not a duplicate of /contact                
                                                                              
  The spec says id="contact" on the contact section. The nav [contact] link   
  points to                                                                   
  /contact (U11 full page). The in-page <Section id="contact"> serves as a    
  scroll anchor                                                               
  and end-of-scroll CTA. ObfuscatedEmail is used here too — the email is never
  plaintext                                                                   
  in server HTML (verified via grep on dist/index.html).                      
                                                                              
  ### ExperienceTimeline renders id="experience", not id="work"               
                                                                              
  The component from U8 uses id="experience" on its internal Section. The spec
  says id="work".                                                             
  This is an ExperienceTimeline internal decision made in U8 — not changed    
  here per constraint                                                         
  (do not touch components). If the nav [work] link needs to jump to this     
  anchor, it should                                                           
  use href="#experience" not href="#work". Flag for U10/final review.         
                                                                              
  ### createPageTitle('Home') for title prop                                  
                                                                              
  Uses the helper from src/data/site.ts to produce "Home — Ashwin John        
  Chempolil" consistently                                                     
  rather than hardcoding the full string.                                     


                                                                              
  --------                                                                    
                                                                              
  ## U11 — Subpages verification & flag-gating fix (3rd attempt)              
                                                                              
  ### CRITICAL DEFECT FIXED: static-mode flag gating                          
                                                                              
  The original projects.astro / photography.astro used                        
  return new Response(null, { status: 404 }) in page frontmatter (per plan-   
  rebuild                                                                     
  spec line 178). In output: 'static' (Astro 6.4.6) this DOES NOT prevent HTML
  emission — Astro renders the Response into a static 404-bodied HTML file, so
  /projects/index.html (4303 bytes) and /photography/index.html still shipped 
  to                                                                          
  dist/. Build reported 7 pages with flags OFF — violating success criterion  
  #4.                                                                         
                                                                              
  FIX: converted each flagged page to a dynamic rest route                    
  projects/[...path].astro and photography/[...path].astro whose              
  getStaticPaths() returns [] when the flag is off (Astro emits zero HTML) and
  [{ params: { path: undefined } }] when on (emits the page at the bare       
  /projects / /photography URL). This is the canonical static-mode pattern    
  (confirmed via Astro docs / context7). The flat *.astro files were removed  
  (moved to /tmp/*.bak — untracked, never committed).                         
                                                                              
  Verified bidirectionally:                                                   
                                                                              
  • Flags OFF (shipping): 5 pages, no projects/photography in dist.           
  • Flags ON: 7 pages, /projects/index.html + /photography/index.html emit at 
  correct bare URLs.                                                          
                                                                              
  NOTE FOR PLAN: spec line 178's Response(null,{status:404}) recipe is wrong  
  for                                                                         
  static output; the [...path] + empty getStaticPaths pattern is the correct  
  one.                                                                        
                                                                              
  ### resume.astro — astro check errors fixed                                 
                                                                              
  Original embedded fallback content INSIDE the <iframe> using JSX-style {' '}
  whitespace tokens and HTML comments — this broke the Astro/TS compiler (12  
  ts(1003)/ts(17002) errors). Rewrote: iframe is now self-closing; the        
  fallback                                                                    
  "can't see the PDF?" links render as a sibling <p> below the iframe; removed
  all                                                                         
  {' '} tokens (literal spaces work in Astro templates). resume.pdf embed +   
  open                                                                        
                                                                              
  • download links preserved.                                                 
                                                                              
  ### contact.astro — verified, no change needed                              
                                                                              
  Uses ObfuscatedEmail (char-code array, decoded client-side) + SOCIAL_LINKS  
  from                                                                        
  src/data/site.ts. grep -ri "@gmail" dist/ = 0. The 12 ashwinjohn3 hits in   
  dist                                                                        
  are the public GitHub/LinkedIn username in social URLs (intentional, not an 
  email).                                                                     
                                                                              
  ### Verification (shipping config, flags off)                               
                                                                              
  • npm run build → exit 0, 5 pages.                                          
  • dist HTML: contact, index, resume, variant-b, work.                       
  • grep -ri "@gmail" dist/ | wc -l → 0.                                      
  • npx astro check → 0 errors, 0 warnings, 0 hints.                          
  • No console.log/debugger/TODO in U11 files.                                


  ## USER-FIX-2 — Visual QA (Card + site-wide symmetry)                       
                                                                              
  Root causes (confirmed via Playwright screenshots, not assumption):         
                                                                              
  • No shared container: BaseLayout <main> had no max-width; only             
  Nav/Hero/Footer/page-headers self-centered, while Section.astro rendered    
  full viewport width → labels flush to x=0, cards bled to right viewport edge.
  Composition violently off-center per page.                                  
  • Card didn't read as a card: surface≈bg (~6% L diff) + faint border, AND   
  logo badge floated outside the card at md:-left-16 (orphaned in the gutter).
  • Duplicate "experience" label on /work (page header + Section label).      
                                                                              
  Fixes (token values untouched):                                             
                                                                              
  • BaseLayout <main> = mx-auto w-full max-w-[60rem] (single container; no    
  padding on main — padding lives one level down so page wrappers I don't own 
  don't double-pad).                                                          
  • Section: added px-6 sm:px-10. Hero: dropped redundant max-w/mx-auto, kept 
  padding.                                                                    
  • Card: border border-border ring-1 ring-border/60 always-on + hover-       
  brighten; logo moved inside header flex row (dropped negative offset).      
  • work.astro: removed duplicate label.                                      
                                                                              
  Deviation from reference DNA (justified): negative-offset logo dropped — it 
  broke card geometry and centering. Badge now inside card.                   
  Verified: build exit 0; astro check 0/0/0; screenshots at 375/768/1280 +    
  dark mode. Did NOT commit. Owned only                                       
  Card/Section/Hero/BaseLayout/work.astro + handoff; did not touch            
  index/variant-b/uses/site.ts (executor's).                                  


  ## FIX-STRUCTURE-VERIFY (2026-06-12) — restructure verification             
                                                                              
  Verified the prior worker's page restructure on branch redesign/personal-   
  brand.                                                                      
  **No source edits were needed — the restructure was already complete and    
  correct.**                                                                  
                                                                              
  • / = Hero + ExperienceTimeline only; /variant-b = Hero + [see my work] link
  only;                                                                       
  /uses = Space Mono header + UsesSection (mirrors work.astro); site.ts NAV   
  order                                                                       
  work→uses→resume→(flagged)→contact. All confirmed against built HTML.       
  • npm run build exit 0, exactly 6 pages. Grep of dist/: no uses/tools or    
  contact-section                                                             
  markup on / or /variant-b; /uses renders 3 tool categories; nav /uses on all
  6 pages;                                                                    
  zero email plaintext.                                                       
  • npm run check (astro check) → 0 errors/warnings/hints.                    
  • import.meta TS1343 in IDE diagnostics = stale tsserver noise.             
  astro/tsconfigs/base.json                                                   
  (via strict) sets module=ESNext, moduleResolution=Bundler — import.meta is  
  fully supported.                                                            
  astro check passes; no fix applied (would be a band-aid). Restart tsserver  
  to clear.                                                                   
  • Out-of-scope flag: /uses content is still TODO placeholders (collection   
  not yet populated).                                                         
  • Did NOT commit. Did NOT touch visual-fix files. Handoff: .omc/handoffs/fix-
  structure.md                                                                


  ## USER-FIX-4 — rename uses → tools (user-visible)                          
                                                                              
  • git mv src/pages/uses.astro src/pages/tools.astro; updated page title     
  (Tools) + file/inline comments. Page header <p>tools & setup</p> was already
  correct, left as-is.                                                        
  • src/data/site.ts NAV_LINKS: /uses/uses → /tools/tools.                    
  • Decisions: kept UsesSection component name + src/content/uses/ collection 
  (internal/invisible, designer-owned). Left description prose "...uses daily"
  (natural English verb).                                                     
  • FLAG (not my file): src/pages/variant-b.astro:7 comment still says "Tools 
  & Setup at /uses." — invisible code comment; owner should fix.              
  • Verified: build exit 0, dist/tools present + no dist/uses, no href="/uses"
  in dist, npm run check clean (0/0/0). Not committed.                        


  ## USER-FIX-3 retry — logos + tools layout verification (offline-first)     
                                                                              
  • Confirmed prior pass had already landed all logo wiring + tools grid; this
  retry                                                                       
  verified state with ZERO web fetches (earlier hang traced to the Active.ai  
  asset                                                                       
  fetch — not retried; honest typographic wordmark fallback kept).            
  • simple-icons NOT npm-installed; glyph path data already inlined in        
  BrandIcon.astro                                                             
  (github/linkedin/aws, CC0). Did not run npm install simple-icons — would    
  have been                                                                   
  a redundant network op for data already embedded.                           
  • Logos: GitHub/LinkedIn/AWS = inline currentColor glyphs (theme both modes);
  Northeastern = full-color SVG wordmark img in surface chip; Active.ai =     
  typographic                                                                 
  wordmark (asset unobtainable offline — OPEN, non-blocking).                 
  • Tools page: UsesSection 3 category cards, md:grid-cols-2 symmetric grid,  
  max-w-[60rem]                                                               
  container matching Nav/Hero/Footer, /work card chrome, mono-label lists. No 
  visible                                                                     
  "uses" heading leak (only id="uses" anchor + tools.astro meta desc; tools.  
  astro untouched).                                                           
  • Verify: build exit 0 (6 pages), check 0/0/0. Email-leak grep = only social
  profile                                                                     
  handles, no @gmail plaintext. Live 375/768/1280 screenshots skipped — no    
  headless                                                                    
  browser in env, install avoided to prevent the network hang this retry      
  guarded against.                                                            
  • Not committed.                                                            


                                                                              
  --------                                                                    
                                                                              
  ## USER-FIX-5 — Typography swap to Pairing 03 (2026-06-12)                  
                                                                              
  Replaced Space Grotesk/Space Mono with **Instrument Serif (display) +****   
  Instrument                                                                  
  ****Sans (body) + Fragment Mono (mono/labels)** at the ballot demo's        
  generous scale.                                                             
                                                                              
  Decisions:                                                                  
                                                                              
  • Added a third font CSS variable --font-body (Instrument Sans). Display is 
  now                                                                         
  a serif, so --font-family-sans and the body element repoint to the body sans,
  not display — otherwise all running text would render serif.                
  • Body scaled to 18px / line-height 1.6 (demo spec).                        
  • Hero "Ashwin" bold achieved honestly: Instrument Serif has no 700, so     
  "Ashwin"                                                                    
  uses Instrument Sans 700 and "John Chempolil" uses Instrument Serif italic  
  (the                                                                        
  pairing's signature). The larger serif italic last name is the visual anchor.
  • Nav brand hardcoded to "ajc"; dropped unused SITE_NAME import.            
  • Typography-only edits + the two micro-edits; colors and component         
  structure untouched.                                                        
                                                                              
  Verify: build exit 0 (6 pages, 6 font files), check 0 errors, dist has no   
  Space Grotesk/Space Mono, built CSS body font-size 18px. Not committed.     


  ## TINT ENGINE (designer) — replaced light/dark with 6 analog-display tints 
                                                                              
  **Files (owned):** src/styles/global.css, src/components/ThemeToggle.astro, 
  src/layouts/BaseLayout.astro. No sibling files touched. Not committed.      
                                                                              
  **Decisions not in spec:**                                                  
                                                                              
  • Mechanism: .dark class → [data-theme] attribute. Default DMG lives in     
  :root (no attribute) so absent/unknown stored tint = DMG with zero attr —   
  keeps no-flash trivial and avoids white flash on dark tints.                
  • Duotone math: surface = mix(bg→ink 6%), border = 18%, accent = ink, accent-
  hover = 82%. secondary tuned PER TINT (not a fixed %) to the smallest blend 
  that clears WCAG AA 4.5:1 on bg — several tints (dmg/pocket/paper) needed   
  darker secondary than a flat 62% blend would give. Documented hexes + ratios
  in .omc/handoffs/tint-engine.md.                                            
  • Retired --brand-avatar-ring / --brand-ping: kept the token NAMES (so      
  @theme inline + any consumer survives) but set them to the tint's ink       
  (monochrome), per ballot "ping survives as monochrome ink".                 
  • @custom-variant dark removed: grep confirmed ZERO dark: Tailwind utilities
  exist anywhere in src/.                                                     
                                                                              
  **Flagged to sibling (Hero.astro, not mine):** hardcodes literal #FFBE98    
  (avatar ring) + #4ade80 (ping) inside scoped  — the tint engine cannot reach
  literals. Sibling must swap to var(--brand-accent) or drop, per ballot.     
  Hero's                                                                      
  var(--color-accent)/var(--color-accent-hover) usages keep working via @theme
  inline                                                                      
  unchanged.                                                                  
                                                                              
  **Verified:** build exit 0, astro check 0 errors, all 6 tint blocks in      
  compiled CSS, utilities still live var(--brand-*), slop hexes               
  (terracotta/peach/green) = 0 in output, every tint AA-compliant.            


  ## Composition A "DMG" re-skin (designer)                                   
                                                                              
  Rebuilt visual composition to ballot direction A. Owned files only (Hero,   
  Nav, Footer,                                                                
  Card, ExperienceTimeline, pages, site.ts, one content emoji). Sibling owns  
  the tint                                                                    
  engine (global.css/ThemeToggle/BaseLayout) — confirmed live during          
  verification (DMG                                                           
  olive duotone rendering).                                                   
                                                                              
  Decisions / deviations:                                                     
                                                                              
  • Token mapping demo→live: --ink→text-primary, --ink-soft→text-secondary, --
  rule→border-border,                                                         
  --chip/--surface→bg-surface, --bg→bg-bg. In duotone, "accent" == ink step,  
  so I used                                                                   
  text-primary for ink beats (company names, team tags, CTA) rather than text-
  accent, keeping                                                             
  the screen strictly two-step.                                               
  • Kept text-accent in contact/resume/tools page chrome untouched: per brief,
  text-accent                                                                 
  remains a VALID utility (= ink step in duotone), and "tools page chrome     
  stays". Not stripped.                                                       
  • Hero greeting prop kept in interface for call-site compatibility          
  (index/variant-b still pass                                                 
  it) but unused in the title-card composition; the mono kicker carries       
  role/location instead.                                                      
  • NEU brand-red logo: forced to duotone via scoped CSS filter (grayscale+   
  contrast+multiply in                                                        
  light; invert+screen in dark) rather than swapping the asset — keeps the    
  asset intact and                                                            
  monochrome-safe at render. AWS/github/linkedin are currentColor SVGs,       
  already mono-safe; AWS                                                      
  sized up to 32px in a 54px chip (φ-step from old 40px/20px).                
  • φ scale applied verbatim from ballot: Ashwin clamp(3.6rem,11vw,5.29rem)=76.
  2px dominant,                                                               
  surname clamp(2.4rem,7vw,3.27rem)=47.1px subordinate, tagline 18px Fragment 
  Mono.                                                                       
  • Removed gratuitous rounding: Card rounded-2xl→rounded-[3px], chip rounded-
  lg→rounded-[4px].                                                           
  • Anti-slop: dropped 🌸 (site.ts tagline) and 🐏 (AWS RAM bullet content).  


                                                                              
  --------                                                                    
                                                                              
  ## WAVE6-FIX (reviewer findings)                                            
                                                                              
  • **[****HIGH] NEU dark-tint filter was dead code.** :global(.dark) .neu-   
  duotone could never match — TINT-ENGINE retired the .dark class for [data-  
  theme]. Retargeted to the three DARK tints: :global([data-theme="amber"]) . 
  neu-duotone, :global([data-theme="p1"]) .neu-duotone, :global([data-        
  theme="vfd"]) .neu-duotone. Same invert+screen filter. Verified the rule    
  appears (and the old .dark rule is gone) in dist/index.html +               
  dist/work/index.html.                                                       
  • **[****LOW] Orphan tokens removed.** Deleted --brand-avatar-ring / --brand-
  ping from all 6 tint blocks AND their --color-* mappings in @theme inline   
  (grep confirmed zero consumers — removing the mapping too avoids emitting   
  equally-orphan utilities). 0 occurrences left in dist.                      
  • **[****LOW] Static aria-label.** Added aria-label="Display tint" to the   
  #tint-toggle button markup so it is labeled pre-JS; the inline script still 
  refines it to the full "Display tint: X. Click for Y." at runtime.          
  • **Debris:** mv public/logos/00Tree.html /tmp/00Tree.html (not rm) — kept  
  it out of dist.                                                             
  • **Verify:** npm run build exit 0 (6 pages); npm run check 0/0/0 (26 files).


  ## Layout-fixes pass (redesign/personal-brand)                              
                                                                              
  Four interlocking layout fixes, one atomic commit.                          
                                                                              
  1. **Emoji tint cycler** (ThemeToggle.astro). User-requested override of the
  anti-emoji rule, THIS toggle only. One emoji per tint evoking the hardware: 
  dmg 🎮 · pocket 🕹️ · amber 🟠 · p1 🟢 · paper 📄 · vfd 🔵. Emoji is         
  aria-hidden (decorative); readable tint name + next-tint hint stay in the   
  button aria-label. Added a var EMOJI map to the inline script.              
      • Decision: kept the cyclic JS architecture (BaseLayout owns pre-paint; 
      toggle only flips attr+storage+label) untouched — only the label glyph  
      source changed (name → emoji map). No double-apply risk introduced.     
  2. **Footer pin + tint bg** (BaseLayout.astro + Footer.astro). Root cause of
  both reported symptoms ("shifting" + "not changing color on some pages"):   
  footer relied on inherited body bg and mt-20, so on short pages the body    
  bg showed beneath and the margin pushed it inconsistently.                  
      • Fix: body → flex min-h-dvh flex-col, main → flex-1, footer →          
      shrink-0 bg-bg (dropped mt-20). Footer now pins to the bottom on        
      every page and explicitly paints the tint bg (changes with every tint). 
      • Tradeoff: removing mt-20 removes the old large gap above the footer on
      tall pages; the footer's own top border + py-8 carry the separation.    
      This is intentional — uniform footer height/position was the goal.      
  3. **Lean home** (index.astro rewritten; variant-b.astro git rm'd). Home is 
  now Hero + "[see my work]" link, no ExperienceTimeline. The timeline stays  
  at /work. Build dropped from 6 → 5 pages. The stale "Variant B" comment in
  work.astro was reworded. No variant-b references remain in src/ or dist/.      
      • Decision: absorbed variant-b's composition into index rather than     
      renaming the file, to keep the canonical / route and git history of     
      index.astro intact.                                                     
  4. **Full-bleed hero** (Hero.astro fill prop + BaseLayout fillViewport      
  prop). On home, main becomes a flex column and the hero <section> gets      
  flex-1 flex flex-col justify-center, stretching its grain bg + full-height  
  center hairline to fill all space between nav and footer with content       
  vertically centered (Kubrick axis preserved). Opt-in via props so other     
  pages keep normal flow.                                                     
      • Decision: made fill opt-in (props) rather than always-on, because Hero
      is                                                                      
      only used on home but the prop keeps the component reusable without     
      forcing full-height everywhere.                                         
                                                                              
                                                                              
  Verify: npm run build exit 0 (5 pages); npx astro check 0/0/0; footer block 
  byte-identical across all 5 pages; home dist has 0 timeline markers + the   
  see-work link + 🎮 label + flex-1 hero. No browser driver in env →          
  structural                                                                  
  (DOM-order + flex-chain) verification, which is deterministic for pin/fill. 


                                                                              
  --------                                                                    
                                                                              
  # SOLID-FIXES — oracle audit top-5 (2026-06-12)                             
                                                                              
  Behavior-preserving refactor on redesign/personal-brand. Built site renders 
  identically (5 pages, all 6 tints). Verified: npm run build exit 0 / 5      
  pages, npm run check 0/0/0, all 6 --brand-bg + 5 [data-theme] blocks present,
  all 6 toggle emoji + cycle order intact, 3 work cards render with           
  logos+links, no-flash script still pre-paint in <head>, zero hero-ping, zero
  orphan svg refs.                                                            
                                                                              
  1. **Centralized tint registry** → new src/lib/tints.ts is the single source
  of truth: ordered TINTS array of {id, emoji, label, bg, scheme} + derived   
  TINT_IDS / TINT_BG / TINT_DARK / TINT_EMOJI. BaseLayout's no-flash is:inline
  script and ThemeToggle's cycler now receive their literals via define:vars  
  injection at BUILD time (no runtime import — script stays literal-fast and  
  pre-paint). Killed the 3-way palette duplication (BaseLayout + ThemeToggle +
  CSS) and the desync hazard.                                                 
      • **Decision:** <Font> (astro:assets) has no define:vars, so the        
      registry feeds the inline scripts via define:vars (which Astro prepends 
      as const decls to is:inline). Confirmed in dist: const TINTS = ["dmg",...
      ], const EMOJI = {...}, const BG = {...} all serialized correctly.      
      • **Decision:** DARK changed from an object map {amber:1,...} to an     
      array (TINT_DARK) with indexOf membership — cleaner derivation from     
      scheme: 'dark'.                                                         
      • **Build-time sync guard:** assertTintsSyncedWithCss(css) parses --    
      brand-bg out of :root + each [data-theme] block and throws on any drift 
      vs the registry. Called from BaseLayout frontmatter via global.css?raw  
      (Vite raw import) so it runs at build and FAILS the build on mismatch.  
      Guard logic unit-validated (passes synced, throws on drift). global.css 
      carries a loud ⚠️ REGISTRY SYNC comment cross-referencing tints.ts.     
      • **Note:** baseline dist had 🎮 x7; post-refactor x2 — purely a        
      serialization difference (old hand-written repeated literal vs compact  
      define:vars JSON). All 6 glyphs + order preserved; behavior identical.  
  2. **Dead code** — git rm orphan public/logos/{aws,github,linkedin}.svg     
  (BrandIcon inlines the path data; zero refs confirmed). northeastern.svg    
  STAYS (referenced by NEU frontmatter). Deleted dead @keyframes hero-ping    
  (global.css tail; hero-blip is the live one). Reworded the two stale        
  "terracotta" selection/focus comments to "duotone ink" and removed the "ping
  badge" animations block comment. (The two remaining "no terracotta" mentions
  in Hero/Timeline are intentional design-intent docs, not stale refs.)       
  3. **Dead props (ISP)** — removed Card.subheading (only Card referenced it; 
  both call sites omit it), Hero.greeting + its plumbing (BIO.greeting in site.
  ts, the greeting={...} prop in index.astro), and Section.class (zero callers;
  the class:list collapsed to a plain static class). All confirmed zero-caller
  before removal.                                                             
  4. **Timeline O/C** — moved company link + logo identity OUT of the two in- 
  component maps (COMPANY_HREFS, COMPANY_LOGOS) INTO the work collection      
  frontmatter. content.config.ts gained companyHref?: z.url() + a logo?       
  discriminated union (brand{icon} | img{src} | word{primary,accent}). The 3  
  work .md files carry their own companyHref + logo. ExperienceTimeline.astro 
  now reads entry.data.companyHref / entry.data.logo and derives the logo     
  label/alt from entry.data.company. A new employer now needs ZERO component  
  edits — drop a .md with its logo descriptor.                                
      • **Decision:** dropped the old label field from each descriptor since  
      the component already has the company name from entry.data.company — DRY.
      Guarded the logo chip with {logo && (...)} since logo is now optional.  
  5. **Docs** — fixed stale CLAUDE.md: fonts (Space Grotesk/Mono → Instrument 
  Serif/Instrument Sans/Fragment Mono via Fonts API), theme/tint note (6      
  analog duotones via data-theme + registry, no .dark), CSS section (no       
  @custom-variant dark, strict-duotone + registry-sync note), and added a     
  Layout/footer pattern section (min-h-dvh flex chain, footer pin,            
  fillViewport/fill).                                                         
      • **Note:** CLAUDE.md is .gitignore'd (.gitignore:35), so the docs fix  
      is applied to the working file (correct + current) but is NOT committed 
      — respecting the repo's existing convention rather than force-tracking  
      it.                                                                     
                                                                              
                                                                              
  **Commits:** 2 atomic (refactor: registry + ISP + O/C ; chore: dead-code    
  removal). Not pushed.

---

## HERO-FUSE — power-on hero (ballot T1 + T3 fused)

**File:** `src/components/Hero.astro` fully replaced (the only owned file; no
global.css change — all keyframes are scoped inside the component, and the tint
tokens are already global).

**Fusion (one motion timeline, not two halves glued together):** a power-on /
boot sequence —
1. a spotlit Aceternity hairline grid + radial-fade spotlight frames the shot and
   drifts toward the name;
2. the terminal boot log types in (his real lines, Fragment Mono:
   `> whoami` / `Hi, I'm Ashwin.` / `> cat ./role & ./status`);
3. the oversized name powers on like a CRT (scaleY switch-on snap + phosphor
   bloom, "Ashwin" φ4 bleeding off the left frame edge) in sync with ONE
   scanline sweep that fires once at 2.8s;
4. surname (Instrument Serif italic, subordinate φ3) + strap ("Making cloud
   shareable — SDE II, AWS", his verbatim AWS RAM bullet) + [github]/[linkedin]
   coordinates resolve last. Kubrick corner ticks frame the whole.

**Decisions made (not in spec):**
- Demo→live token map: `--bg`→`--color-bg`, `--surface`→`--color-surface`,
  `--border`→`--color-border`, `--ink`→`--color-primary`,
  `--ink2`→`--color-secondary`, `--accent`→`--color-accent` (Tailwind
  `@theme inline` maps the `--brand-*` source tokens).
- Scanline sweep made **one-shot** (`1.1s ... 1 forwards`, delay 2.8s) instead of
  the demo T3's infinite loop, because the brief said "one scanline sweep on
  power-on" — it reads as the CRT switching on, then settles (no perpetual flicker).
- Kept `tagline`/`ctaHref`/`ctaLabel`/`badgeText` props for **API parity** so
  `index.astro` compiles unchanged (yields 4 non-blocking ts(6133) hints; the
  real copy is sourced inline + from `SOCIAL_LINKS`). Trade-off: 4 hints vs.
  editing the caller — chose not to touch index.astro beyond the read-only
  fill-prop confirmation the brief scoped.
- Name aligns to the `px-6`/`sm:px-10` content edge; `<main>` is already
  `max-w-[60rem]`, so the section is grid-constrained and `overflow:hidden` clips
  the bleed — no extra container needed.
- `min-height` reserved on the boot block so the name doesn't jump while lines type in.

**Verified:** `npm run check` 0 err / `npm run build` 5 pages exit 0; headless
render in DMG + amber + paper (Ashwin 109.66px > surname 67.78px = φ 1.618);
reduced-motion resolved end-state (no blank hero); full-bleed `fill` chain intact;
no peach / green / emoji / availability-badge in dist.

**Handoff:** `.omc/handoffs/hero-fuse.md`. One atomic commit, not pushed.                                                       


                                                                              
  --------                                                                    
                                                                              
  ## HERO-GEOMETRY-FIX (2026-06-13)                                           
                                                                              
  ### Defect 1 — hero rendered as a centered square (FIXED)                   
                                                                              
  • Root cause: <section id="hero"> is a direct child of <main class="mx-auto 
  w-full max-w-[60rem]"> (BaseLayout). The whole treatment was clamped to     
  960px.                                                                      
  • Fix: full-bleed break-out via negative inline margins calc(50% - 50vw) on 
  .hero-power (deliberately NOT width:100vw, which counts the scrollbar gutter
  and forces a horizontal-scroll sliver). Inner .hero-col (max-w-[60rem] mx-  
  auto)                                                                       
  restores the reading column for text. Did NOT touch BaseLayout's shared max-
  w                                                                           
  contract — broke out from inside the hero.                                  
  • Decision: added body { overflow-x: clip } to global.css to absorb the     
  scrollbar-gutter sub-pixel. Chose clip over hidden (no new scroll container,
  doesn't break sticky/anchored elements). Scoped to body, not html, to avoid 
  any                                                                         
  interaction with html { scroll-behavior: smooth } anchor offsets.           
                                                                              
  ### Defect 2 — terminal chrome duplicated at different sizes (FIXED)        
                                                                              
  • The branch's Hero had NO window chrome at all; the user was reading the   
  loose                                                                       
  boot-log strip + meta strip as two mismatched "bars". Per brief, introduced 
  ONE                                                                         
  reusable TerminalChrome.astro used as the top title bar AND bottom status   
  bar.                                                                        
  • DRY guarantee: all sizing (--term-h, --term-pad-x, --term-dot, --term-fs) 
  is defined ONCE on .term-bar. The variant prop only switches the border side
  and the caret — it cannot change sizing. Verified in compiled CSS: a single 
  --term-h/--term-pad-x declaration → the two bars are provably identical.    
                                                                              
  ### Tradeoffs / things to know                                              
                                                                              
  • The status-bar copy ("status: online — Washington, DC · open to           
  opportunities")                                                             
  is new authored furniture. Avoided a literal ● glyph (emoji/colored-dot     
  risk) —                                                                     
  the live-status cue is the duotone ink caret (.term-caret), matching the    
  strap sq.                                                                   
  • Headless-Chrome caveat for future QA: --window-size=375 renders a ~500px  
  CSS                                                                         
  viewport, so 375px screenshots LOOK clipped but aren't. Verify real overflow
  with                                                                        
  CDP document.documentElement.scrollWidth - clientWidth (was 0 on /work; the 
  index's residual ~8px is the clipped scrollbar gutter, no visible scrollbar).
  • Motion pass handoff: entrance timeline untouched; hero-chrome-top /       
  hero-chrome-bottom class hooks exposed on the two TerminalChrome instances  
  for                                                                         
  the follow-on animation work. The .hero-window is a clean single wrap to    
  animate.                                                                    

