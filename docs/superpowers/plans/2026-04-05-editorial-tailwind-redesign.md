# Editorial Tailwind Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the Astro portfolio to Tailwind CSS and redesign the public pages around the approved "Editorial Field Notes" direction.

**Architecture:** Tailwind becomes the primary styling layer for the Astro app, while a small base stylesheet remains only for font-face registration and document-level theme behavior. Shared layout components are redesigned first, then the page templates, then the content detail pages and empty states, followed by cleanup of obsolete handcrafted CSS.

**Tech Stack:** Astro, Tailwind CSS, TypeScript, GitHub Pages static deployment

---

### Task 1: Install Tailwind and Wire the Astro Build

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `astro.config.mjs`
- Create: `tailwind.config.mjs` or `tailwind.config.ts`
- Create: `src/styles/tailwind.css`
- Modify: `src/layouts/BaseLayout.astro`
- Test: root build via `npm run build`

- [ ] **Step 1: Install Tailwind dependencies**

Run:

```bash
npm install -D tailwindcss @tailwindcss/vite
```

Expected: npm completes successfully and updates `package.json` and `package-lock.json`.

- [ ] **Step 2: Configure Astro to use Tailwind**

Update `astro.config.mjs` so Vite loads the Tailwind plugin:

```js
import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  output: 'static',
  site: 'https://ashwinchempolil.me',
  vite: {
    plugins: [tailwindcss()],
  },
})
```

- [ ] **Step 3: Create the Tailwind entry stylesheet**

Create `src/styles/tailwind.css` with:

```css
@import "tailwindcss";

@font-face {
  font-family: "Geist Mono";
  src: url("/fonts/GeistMonoVF.woff") format("woff");
  font-display: swap;
}

@custom-variant dark (&:where(.dark, .dark *));

@theme {
  --font-sans: "Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif;
  --font-mono: "Geist Mono", "Courier New", monospace;

  --color-paper: oklch(0.973 0.006 78);
  --color-paper-soft: oklch(0.952 0.008 78);
  --color-ink: oklch(0.205 0.015 40);
  --color-ink-muted: oklch(0.49 0.016 40);
  --color-ink-faint: oklch(0.67 0.012 42);
  --color-rule: oklch(0.9 0.008 70);
  --color-accent: oklch(0.49 0.06 28);

  --color-night: oklch(0.17 0.01 35);
  --color-night-soft: oklch(0.23 0.012 35);
  --color-night-ink: oklch(0.9 0.008 80);
  --color-night-muted: oklch(0.69 0.012 80);
  --color-night-rule: oklch(0.3 0.012 45);

  --tracking-kicker: 0.18em;
  --spacing-shell: clamp(1.25rem, 2vw, 2rem);
}

@layer base {
  html {
    scroll-behavior: smooth;
  }

  body {
    @apply bg-paper text-ink font-sans antialiased dark:bg-night dark:text-night-ink;
  }

  a {
    @apply transition-colors duration-200;
  }

  :focus-visible {
    @apply outline outline-1 outline-offset-4 outline-ink dark:outline-night-ink;
  }

  ::selection {
    @apply bg-ink text-paper dark:bg-night-ink dark:text-night;
  }
}
```

- [ ] **Step 4: Load the new stylesheet in the base layout**

In `src/layouts/BaseLayout.astro`, replace the old `global.css` import with:

```astro
---
import '../styles/tailwind.css'
---
```

- [ ] **Step 5: Run the build to verify Tailwind is wired correctly**

Run:

```bash
npm run build
```

Expected: Astro build passes and outputs static routes without CSS import errors.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json astro.config.mjs src/styles/tailwind.css src/layouts/BaseLayout.astro
git commit -m "build: add Tailwind to Astro site"
```

### Task 2: Rebuild the Global Shell and Theme Behavior

**Files:**
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/components/Nav.astro`
- Modify: `src/components/PageSection.astro`
- Test: root build via `npm run build`

- [ ] **Step 1: Write the failing verification goal**

Target behaviors:

```text
- header remains sticky and route-aware
- dark mode toggle still works
- no inline styles remain in Nav/PageSection
```

- [ ] **Step 2: Redesign `BaseLayout.astro` around Tailwind shell classes**

Refactor the layout so the document body establishes the editorial page frame:

```astro
<body class="min-h-screen bg-paper text-ink transition-colors duration-300 dark:bg-night dark:text-night-ink">
  <slot />
</body>
```

Keep the existing theme bootstrap script, but update it so it toggles `document.documentElement.classList` with `dark` instead of depending on old CSS selectors.

- [ ] **Step 3: Rewrite `Nav.astro` using Tailwind utilities**

Use a compact masthead with a serif site title, small mono nav labels, and icon toggle:

```astro
<nav class="sticky top-0 z-50 border-b border-rule/80 bg-paper/90 backdrop-blur-sm dark:border-night-rule dark:bg-night/85">
  <div class="mx-auto flex w-full max-w-6xl items-center justify-between px-shell py-4">
    ...
  </div>
</nav>
```

Active links should use darker foreground and subtle underline/border treatment rather than bracket-style highlighting.

- [ ] **Step 4: Rewrite `PageSection.astro` using Tailwind**

Use a shell with generous vertical rhythm:

```astro
<section class="mx-auto w-full max-w-6xl border-t border-rule px-shell py-14 dark:border-night-rule md:py-20">
  <p class="mb-6 font-mono text-[0.66rem] uppercase tracking-kicker text-ink-faint dark:text-night-muted">{label}</p>
  <div class="max-w-4xl">
    <slot />
  </div>
</section>
```

- [ ] **Step 5: Run the build to verify the shell still compiles**

Run:

```bash
npm run build
```

Expected: build passes and all routes still generate.

- [ ] **Step 6: Commit**

```bash
git add src/layouts/BaseLayout.astro src/components/Nav.astro src/components/PageSection.astro
git commit -m "feat: redesign global shell with Tailwind"
```

### Task 3: Redesign the Homepage and Contact Page

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/pages/contact.astro`
- Modify: `src/components/SocialIcons.astro` if icon sizing/styling needs cleanup
- Test: root build via `npm run build`

- [ ] **Step 1: Write the failing content/layout expectation**

Target homepage behaviors:

```text
- intro reads like an editorial opening note
- typography leads the page
- contact links feel intentional, not icon-row boilerplate
```

- [ ] **Step 2: Rewrite `src/pages/index.astro`**

Use an asymmetric editorial intro with:

```astro
<main class="mx-auto flex w-full max-w-6xl flex-col gap-20 px-shell pb-20 pt-16 md:pt-24">
  <section class="grid gap-10 md:grid-cols-[minmax(0,3fr)_minmax(220px,1fr)] md:gap-16">
    ...
  </section>
</main>
```

The main intro should use large serif text, brief supporting copy, and a slim side column with directional notes such as current interests and future field-notes language.

- [ ] **Step 3: Rewrite `src/pages/contact.astro`**

Replace inline styles with a designed contact section:

```astro
<div class="flex flex-wrap items-center gap-5 text-ink-muted dark:text-night-muted">
  ...
</div>
```

Keep links simple and editorial, not button-like.

- [ ] **Step 4: Run the build**

Run:

```bash
npm run build
```

Expected: build passes and homepage/contact pages compile with Tailwind classes.

- [ ] **Step 5: Commit**

```bash
git add src/pages/index.astro src/pages/contact.astro src/components/SocialIcons.astro
git commit -m "feat: redesign homepage and contact page"
```

### Task 4: Redesign Work, Projects, and Photography Index Pages

**Files:**
- Modify: `src/pages/work.astro`
- Modify: `src/pages/projects/index.astro`
- Modify: `src/pages/photography/index.astro`
- Modify: `src/components/ProjectCard.astro` only if retained for future use
- Test: root build via `npm run build`

- [ ] **Step 1: Write the failing content/layout expectation**

Target behaviors:

```text
- work reads like a clean annotated ledger
- projects/photography "coming soon" states feel deliberate and curated
- index pages keep the editorial system consistent
```

- [ ] **Step 2: Rewrite `src/pages/work.astro`**

Use rows with stronger hierarchy and spacing:

```astro
<div class="grid gap-0 border-y border-rule dark:border-night-rule">
  ...
</div>
```

Each row should place role/company on the left and year on the right with better serif/mono contrast.

- [ ] **Step 3: Redesign the projects and photography empty states**

Replace plain one-line fallback text with a deliberate editorial holding pattern, for example:

```astro
<div class="max-w-2xl border-t border-rule pt-8 dark:border-night-rule">
  <p class="font-mono text-[0.66rem] uppercase tracking-kicker text-ink-faint dark:text-night-muted">Curating</p>
  <p class="mt-4 max-w-xl text-xl leading-relaxed text-ink dark:text-night-ink">A more considered selection is on the way.</p>
</div>
```

- [ ] **Step 4: Run the build**

Run:

```bash
npm run build
```

Expected: build passes and index pages remain static.

- [ ] **Step 5: Commit**

```bash
git add src/pages/work.astro src/pages/projects/index.astro src/pages/photography/index.astro src/components/ProjectCard.astro
git commit -m "feat: redesign work and index pages"
```

### Task 5: Redesign Project and Photography Detail Templates

**Files:**
- Modify: `src/layouts/ContentLayout.astro`
- Modify: `src/pages/projects/[slug].astro`
- Modify: `src/pages/photography/[slug].astro`
- Modify: `src/components/PhotoGrid.astro`
- Test: root build via `npm run build`

- [ ] **Step 1: Write the failing content/template expectation**

Target behaviors:

```text
- detail pages feel like reading, not app UI
- metadata uses a serif/mono editorial hierarchy
- photography imagery gets better framing and spacing
```

- [ ] **Step 2: Rewrite `ContentLayout.astro`**

Use a narrower reading measure with stronger title spacing:

```astro
<article class="max-w-3xl">
  <header class="border-b border-rule pb-8 dark:border-night-rule">
    ...
  </header>
  <div class="prose prose-neutral mt-8 max-w-none dark:prose-invert">
    <slot />
  </div>
</article>
```

Do not depend on Tailwind Typography unless already installed; if needed, create equivalent utility composition manually.

- [ ] **Step 3: Rewrite project and photography detail markup**

Adjust title, metadata, link groups, hero image, and gallery wrappers to match the editorial system. If `PhotoGrid.astro` remains, style it with Tailwind grid utilities and preserve image aspect ratios.

- [ ] **Step 4: Run the build**

Run:

```bash
npm run build
```

Expected: detail page routes still generate for both collections.

- [ ] **Step 5: Commit**

```bash
git add src/layouts/ContentLayout.astro src/pages/projects/[slug].astro src/pages/photography/[slug].astro src/components/PhotoGrid.astro
git commit -m "feat: redesign content detail templates"
```

### Task 6: Remove Obsolete CSS and Final Cleanup

**Files:**
- Modify: `src/styles/global.css` or remove it entirely
- Modify: any remaining Astro files with inline `style=""`
- Test: root build via `npm run build`

- [ ] **Step 1: Search for leftover legacy styling**

Run:

```bash
rg -n 'style=|var\\(--|class="[^"]*wrap|class="[^"]*section-copy|class="[^"]*row|class="[^"]*lede' src -S
```

Expected: only intentional, minimal leftovers remain.

- [ ] **Step 2: Remove or drastically shrink the old stylesheet**

Keep only truly global concerns. If `src/styles/global.css` becomes unnecessary, delete it and ensure nothing imports it.

- [ ] **Step 3: Run final build verification**

Run:

```bash
npm run build
```

Expected: Astro build passes cleanly.

- [ ] **Step 4: Commit**

```bash
git add src/styles src
git commit -m "refactor: complete Tailwind styling migration"
```

## Self-Review

- Spec coverage: all sections from the redesign spec are covered by Tailwind setup, shell redesign, page redesign, detail template redesign, and cleanup tasks.
- Placeholder scan: no unresolved TODO/TBD markers are present in this plan.
- Type consistency: the plan consistently references the existing Astro files and keeps route structure unchanged.
