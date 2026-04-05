# Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend the portfolio from a single scroll into a hybrid structure: lean main page (Hero → About → Experience → Contact) plus dedicated `/work` and `/photography` sub-pages.

**Architecture:** Add two new section components (`About`, `Contact`), two new route pages (`/work`, `/photography`), update nav links, strip `Footer` to copyright-only, and add data constants for bio/projects/photos. All new components follow the existing inline-style + Framer Motion pattern.

**Tech Stack:** Next.js 14 App Router, TypeScript, Framer Motion v11, lucide-react, Tailwind (globals.css for responsive overrides only)

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `utils/constants.ts` | Modify | Add `ABOUT_BIO`, `WORK_PROJECTS`, `PHOTOS` |
| `app/components/About.tsx` | Create | Renders bio with eyebrow label, Framer Motion stagger |
| `app/components/Contact.tsx` | Create | Contact section: one-liner + ObfuscatedEmail + GitHub + LinkedIn icons |
| `app/components/Footer.tsx` | Modify | Strip to copyright rule + name/year only |
| `app/components/Nav.tsx` | Modify | Update NAV_LINKS to Work/Photos/Contact |
| `app/page.tsx` | Modify | Add About + Contact, remove Shelf |
| `app/work/page.tsx` | Create | `/work` route — renders Nav + SectionTable(WORK_PROJECTS) + Footer |
| `app/photography/page.tsx` | Create | `/photography` route — renders Nav + 3-col photo grid + Footer |
| `app/globals.css` | Modify | Add responsive overrides for `.about-section`, `.contact-section`, `.photo-grid-section` |

---

## Task 1: Add data constants

**Files:**
- Modify: `utils/constants.ts`

- [ ] **Step 1: Add ABOUT_BIO, WORK_PROJECTS, PHOTOS to constants**

Open `utils/constants.ts` and append after the existing exports:

```ts
export const ABOUT_BIO =
  `I'm a software engineer at Amazon Web Services, where I build infrastructure tooling and data systems. ` +
  `Previously studied Data Analytics Engineering at Northeastern. ` +
  `I care about clean systems, good food, and things that work quietly in the background.`

export interface PhotoItem {
  src: string
  alt: string
}

export const PHOTOS: PhotoItem[] = [
  { src: '', alt: 'Photo 1' },
  { src: '', alt: 'Photo 2' },
  { src: '', alt: 'Photo 3' },
  { src: '', alt: 'Photo 4' },
  { src: '', alt: 'Photo 5' },
  { src: '', alt: 'Photo 6' },
  { src: '', alt: 'Photo 7' },
  { src: '', alt: 'Photo 8' },
  { src: '', alt: 'Photo 9' },
]

export const WORK_PROJECTS: SectionRow[] = [
  { index: '01', title: 'CloudWatch Metrics Dashboard',  subtitle: 'Amazon Web Services', year: '2024' },
  { index: '02', title: 'Cost Anomaly Detection',        subtitle: 'Amazon Web Services', year: '2023' },
  { index: '03', title: 'Data Pipeline Automation',      subtitle: 'Amazon Web Services', year: '2022' },
]
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add utils/constants.ts
git commit -m "feat: add ABOUT_BIO, WORK_PROJECTS, PHOTOS constants"
```

---

## Task 2: Create About component

**Files:**
- Create: `app/components/About.tsx`

- [ ] **Step 1: Create the file**

```tsx
// app/components/About.tsx
'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { ABOUT_BIO } from '../../utils/constants'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const itemVariants = (dur: number) => ({
  hidden:  { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: dur, ease: [0.16, 1, 0.3, 1] } },
})

export default function About() {
  const prefersReducedMotion = useReducedMotion()
  const dur = prefersReducedMotion ? 0 : 0.55
  const item = itemVariants(dur)

  return (
    <section
      id="about"
      className="about-section"
      style={{
        padding: '3rem 4rem',
        borderBottom: '1px solid var(--rule)',
        maxWidth: '860px',
        margin: '0 auto',
        width: '100%',
      }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        <motion.h2
          variants={item}
          style={{
            fontFamily: 'var(--font-dm-sans)',
            fontSize: 'var(--label-size)',
            fontWeight: 500,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--ink-faint)',
            marginBottom: '1rem',
          }}
        >
          About
        </motion.h2>
        <motion.p
          variants={item}
          style={{
            fontFamily: 'var(--font-dm-sans)',
            fontSize: 'var(--role-size)',
            color: 'var(--ink-mid)',
            lineHeight: 1.7,
            maxWidth: '560px',
          }}
        >
          {ABOUT_BIO}
        </motion.p>
      </motion.div>
    </section>
  )
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/components/About.tsx
git commit -m "feat: add About section component"
```

---

## Task 3: Create Contact component and strip Footer

**Files:**
- Create: `app/components/Contact.tsx`
- Modify: `app/components/Footer.tsx`

- [ ] **Step 1: Create Contact.tsx**

The Contact section takes over the contact content that currently lives in `Footer.tsx` (icon row), adds a one-liner, and owns the `id="contact"` anchor.

```tsx
// app/components/Contact.tsx
import { Github, Linkedin } from 'lucide-react'
import { PERSONAL_INFO } from '../../utils/constants'
import ObfuscatedEmail from './ObfuscatedEmail'

const iconStyle: React.CSSProperties = {
  color: 'var(--ink-mid)',
  display: 'flex',
  alignItems: 'center',
  transition: 'color 0.15s',
}

export default function Contact() {
  return (
    <section
      id="contact"
      className="contact-section"
      style={{
        padding: '3rem 4rem',
        borderBottom: '1px solid var(--rule)',
        maxWidth: '860px',
        margin: '0 auto',
        width: '100%',
      }}
    >
      <h2
        style={{
          fontFamily: 'var(--font-dm-sans)',
          fontSize: 'var(--label-size)',
          fontWeight: 500,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'var(--ink-faint)',
          marginBottom: '1rem',
        }}
      >
        Contact
      </h2>
      <p
        style={{
          fontFamily: 'var(--font-dm-sans)',
          fontSize: 'var(--role-size)',
          color: 'var(--ink-mid)',
          marginBottom: '1.25rem',
        }}
      >
        Open to interesting conversations. Say hello.
      </p>
      <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
        <ObfuscatedEmail style={iconStyle} />
        <a href={PERSONAL_INFO.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" style={iconStyle}>
          <Github size={18} />
        </a>
        <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" style={iconStyle}>
          <Linkedin size={18} />
        </a>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Strip Footer.tsx to copyright only**

Replace the entire contents of `app/components/Footer.tsx` with:

```tsx
// app/components/Footer.tsx  (server component — no 'use client')
import { PERSONAL_INFO } from '../../utils/constants'

export default function Footer() {
  return (
    <footer
      className="footer-pad"
      style={{
        maxWidth: '860px',
        margin: '0 auto',
        width: '100%',
        padding: '2rem 4rem 3rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontFamily: 'var(--font-dm-sans)',
          fontSize: '0.6875rem',
          letterSpacing: '0.06em',
          color: 'var(--ink-faint)',
        }}
      >
        <span>{PERSONAL_INFO.name}</span>
        <span>© 2026</span>
      </div>
    </footer>
  )
}
```

- [ ] **Step 3: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add app/components/Contact.tsx app/components/Footer.tsx
git commit -m "feat: add Contact section, strip Footer to copyright only"
```

---

## Task 4: Update Nav links

**Files:**
- Modify: `app/components/Nav.tsx`

- [ ] **Step 1: Replace NAV_LINKS array**

In `app/components/Nav.tsx`, find the `NAV_LINKS` constant (lines 10–14) and replace it:

```ts
const NAV_LINKS = [
  { label: 'Work',    href: '/work'        },
  { label: 'Photos',  href: '/photography' },
  { label: 'Contact', href: '/#contact'    },
]
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/components/Nav.tsx
git commit -m "feat: update nav links to Work, Photos, Contact"
```

---

## Task 5: Update main page

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Replace page.tsx**

Replace the entire contents of `app/page.tsx`:

```tsx
// app/page.tsx
import Nav from './components/Nav'
import Hero from './components/Hero'
import About from './components/About'
import SectionTable from './components/SectionTable'
import Contact from './components/Contact'
import Footer from './components/Footer'
import { EXPERIENCE, EDUCATION } from '../utils/constants'

export default function Page() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <SectionTable id="experience" heading="Experience" rows={EXPERIENCE} />
        <SectionTable id="education" heading="Education" rows={EDUCATION} />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Start dev server and visually verify main page**

```bash
npm run dev
```

Open http://localhost:3000. Verify:
- Hero renders unchanged (Ashwin John bold, Chempolil. italic)
- About section appears below Hero with bio text
- Experience + Education table rows render
- Contact section shows "Open to interesting conversations. Say hello." + icon row
- Footer shows name + © 2026 (no duplicate contact icons)
- Nav links: Work → /work, Photos → /photography, Contact → /#contact

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "feat: update main page — About + Contact sections, remove Shelf"
```

---

## Task 6: Create /work page

**Files:**
- Create: `app/work/page.tsx`

- [ ] **Step 1: Create the file**

```tsx
// app/work/page.tsx
import Nav from '../components/Nav'
import SectionTable from '../components/SectionTable'
import Footer from '../components/Footer'
import { WORK_PROJECTS } from '../../utils/constants'

export const metadata = { title: 'Work — Ashwin John Chempolil' }

export default function WorkPage() {
  return (
    <>
      <Nav />
      <main>
        <SectionTable id="work" heading="Work" rows={WORK_PROJECTS} />
      </main>
      <Footer />
    </>
  )
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Visually verify /work**

With dev server running, navigate to http://localhost:3000/work.  
Verify: Nav renders, Work table shows 3 placeholder AWS projects, Footer shows copyright.

- [ ] **Step 4: Commit**

```bash
git add app/work/page.tsx
git commit -m "feat: add /work page with project table"
```

---

## Task 7: Create /photography page

**Files:**
- Create: `app/photography/page.tsx`

- [ ] **Step 1: Create the file**

```tsx
// app/photography/page.tsx
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { PHOTOS } from '../../utils/constants'

export const metadata = { title: 'Photography — Ashwin John Chempolil' }

export default function PhotographyPage() {
  return (
    <>
      <Nav />
      <main>
        <section
          className="photo-grid-section"
          style={{
            maxWidth: '860px',
            margin: '0 auto',
            width: '100%',
            padding: '3rem 4rem',
            borderBottom: '1px solid var(--rule)',
          }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-dm-sans)',
              fontSize: 'var(--label-size)',
              fontWeight: 500,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--ink-faint)',
              marginBottom: '1.5rem',
            }}
          >
            Photography
          </h2>
          <div
            className="photo-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.5rem',
            }}
          >
            {PHOTOS.map((photo, i) => (
              <div
                key={i}
                aria-label={photo.alt}
                style={{
                  aspectRatio: '1',
                  background: 'var(--rule)',
                  borderRadius: '2px',
                  overflow: 'hidden',
                }}
              >
                {photo.src && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Visually verify /photography**

Navigate to http://localhost:3000/photography.  
Verify: Nav renders, 3×3 grid of grey placeholder tiles, Footer shows copyright.

- [ ] **Step 4: Commit**

```bash
git add app/photography/page.tsx
git commit -m "feat: add /photography page with placeholder grid"
```

---

## Task 8: Add responsive CSS overrides

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Append responsive overrides to globals.css**

At the end of `app/globals.css`, append:

```css
/* ── New sections ── */
@media (max-width: 640px) {
  .about-section   { padding: 2rem 1.5rem !important; }
  .contact-section { padding: 2rem 1.5rem !important; }
  .photo-grid-section { padding: 2rem 1.5rem !important; }
  .photo-grid { grid-template-columns: repeat(2, 1fr) !important; }
}
@media (min-width: 641px) and (max-width: 1024px) {
  .about-section   { padding: 2.5rem 2rem !important; }
  .contact-section { padding: 2.5rem 2rem !important; }
  .photo-grid-section { padding: 2.5rem 2rem !important; }
}
```

- [ ] **Step 2: Visually verify responsive layout**

In browser DevTools, switch to mobile viewport (375px wide).  
Verify:
- About and Contact sections have reduced padding
- Photography grid collapses to 2 columns on mobile

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat: add responsive CSS for About, Contact, Photography sections"
```

---

## Task 9: Production build verification

- [ ] **Step 1: Run full build**

```bash
npm run build
```

Expected: exits 0 with no type errors, no missing module errors. You should see routes for `/`, `/work`, `/photography` listed in the build output.

- [ ] **Step 2: Commit if any build-only fixes needed, otherwise done**

If build passes cleanly, no commit needed. If any import or type error surfaces, fix it and commit:

```bash
git add <changed files>
git commit -m "fix: resolve build errors"
```
