# Editorial Tailwind Redesign

## Summary

Redesign the Astro portfolio around an "Editorial Field Notes" direction and migrate styling fully to Tailwind CSS. The site should feel sharp, personal, minimal, and memorable, with enough personality to signal taste and curiosity without drifting into startup landing-page tropes or generic developer-portfolio patterns.

This redesign is for:

- recruiters evaluating fit and taste
- collaborators and other engineers deciding whether to reach out
- future co-founders looking for signal in how Ashwin thinks, makes decisions, and explores ideas

The site should prioritize two impressions:

1. Ashwin has a strong visual and editorial point of view.
2. Ashwin is intellectually curious across engineering, AI, tools, and photography.

The redesign should keep the current small-site simplicity while building a stronger system for future pages about process, tools, and how Ashwin works.

## Design Direction

### Chosen Direction

Use an "Editorial Field Notes" aesthetic:

- calm and minimal at first glance
- sharply art-directed on closer inspection
- personal rather than corporate
- founder-adjacent in confidence, but not SaaS-branded
- experimental in composition, not noisy in decoration

The site should feel like a well-edited notebook from someone who builds software, notices details, and documents what matters.

### Core Design Principles

- Typography should carry the identity. Large, confident type and carefully tuned small metadata should do more work than decorative UI.
- Layout should feel editorial rather than app-like. Use rhythm, offsets, and asymmetry instead of stacked cards.
- Navigation should stay simple and light, with enough polish to feel deliberate.
- Photography and projects should feel like part of the same personal system, not separate mini-sites.
- Dark mode should feel like an equally designed version, not an inverted afterthought.

### What Should Feel Memorable

The most memorable quality should be the tension between restraint and personality:

- quiet pages
- strong type
- precise spacing
- subtle but intentional color
- small moments of experimentation in layout and hover treatment

## Tailwind Migration Strategy

### Goal

Replace the handcrafted global CSS system with Tailwind CSS as the primary styling layer while preserving a small amount of global base styling only where necessary for:

- font-face registration
- theme variables
- base document behavior

Tailwind should become the main source of truth for layout, typography, spacing, borders, color application, states, and responsive behavior.

### Tailwind Role

Tailwind will be used for:

- layout composition
- spacing and rhythm
- typography scale and weight
- borders, dividers, and background surfaces
- dark mode variants
- responsive adjustments
- interaction states

Avoid rebuilding the old design one utility at a time. The migration should be used to create a more intentional visual system, not a 1:1 port.

### Configuration Principles

- Add Tailwind to the Astro app with a modern, minimal setup.
- Extend the Tailwind theme with project-specific colors, spacing choices, tracking, and font families.
- Keep design tokens centralized in Tailwind config instead of scattering one-off arbitrary values everywhere.
- Use arbitrary values sparingly for genuinely special cases such as fluid type clamps or unusual editorial spacing.
- Prefer semantic layout composition in Astro markup, but allow utility-heavy templates where it materially improves readability.

## Visual System

### Typography

Typography should lead the redesign.

- Keep a refined mono or technical accent only if it serves metadata and navigation, not the whole emotional identity.
- Introduce a more expressive display type for headings and page titles.
- Use a clear scale contrast between:
  - page title / hero copy
  - section labels
  - metadata
  - body copy

Target feeling:

- editorial headline energy
- technical precision in captions and metadata
- readable body text that still feels authored

### Color

Use a restrained light theme with tinted neutrals rather than flat grayscale.

Desired qualities:

- warm paper-like background
- deep, ink-like foreground
- softened mid-tones with subtle hue
- one controlled accent family for interaction and emphasis

Dark mode should feel like:

- smoked paper
- muted ink
- slightly warmer or moodier than a standard black UI

Avoid:

- blue-purple startup gradients
- neon accents
- glassmorphism
- loud shadows

### Space and Structure

Spacing should create rhythm rather than uniformity.

- Hero spacing should feel generous.
- Section pages should breathe.
- Labels and metadata should feel tightly grouped with the content they describe.
- Use thin rules and grid structures where they add editorial sharpness.
- Avoid repetitive boxed cards unless there is a strong content reason.

## Information Architecture

### Primary Pages

Keep the current route structure:

- `/`
- `/work`
- `/projects`
- `/photography`
- `/contact`

### Homepage

The homepage should feel like a front page or opening note, not a dashboard.

Primary jobs:

- establish taste quickly
- introduce Ashwin in a concise, confident way
- hint at interests beyond work
- make it easy to continue into projects, photography, or contact

Recommended structure:

1. compact sticky masthead
2. strong editorial intro block
3. short supporting note about engineering + curiosity
4. optional slim directional links into projects, photography, or future field-notes/tooling pages

### Work Page

This should remain simple and scannable, but more art-directed.

- experience entries should read like a clean ledger or annotated timeline
- hierarchy should come from typography and alignment, not box decoration

### Projects and Photography Index Pages

For now, both pages can still say "coming soon," but the page presentation should feel intentional rather than empty.

The empty state should:

- feel like a deliberate holding pattern
- suggest curation rather than absence
- make it clear richer content is planned

### Detail Pages

Project and photography detail templates should remain in place for later use.

When they surface publicly, they should support:

- generous titles
- metadata lines
- body copy that feels like reading, not app UI
- image treatment with careful proportion and spacing

## Navigation and Interaction

### Navigation

The header should remain light, sticky, and route-aware.

- home title active on `/`
- current tab active on subpages
- dark mode toggle integrated elegantly rather than feeling like an extra control

Stylistically:

- treat the masthead like a publication label
- reduce visual noise
- keep controls compact

### Interaction

Motion should be subtle and meaningful.

- small hover transitions
- restrained lift or opacity changes
- no large animated gimmicks

The site should feel fast, quiet, and expensive.

## Components to Redesign

### Base Layout

- establish Tailwind-driven page shell
- dark mode class strategy
- font loading integration
- cleaner page container logic

### Nav

- move inline styles fully into Tailwind classes
- tighten alignment and spacing
- refine active and hover treatments
- keep icon toggle minimal and polished

### PageSection

- convert section shell to Tailwind
- support consistent vertical rhythm
- make label treatment feel more editorial

### Work Rows

- redesign as sharper timeline/list rows
- reduce “generic app row” feel

### Empty States

- replace plain fallback text with a designed editorial placeholder treatment

## Technical Constraints

- Astro remains the framework
- Tailwind becomes the primary styling system
- current static site performance should remain strong
- dark mode toggle behavior must keep working
- basic content rendering must not require client-side JS
- route structure should not change

## Implementation Approach

### Phase 1

Install and configure Tailwind in Astro:

- Tailwind integration
- theme extension
- base layer for fonts and root theme hooks

### Phase 2

Migrate foundational components:

- `BaseLayout`
- `Nav`
- `PageSection`

### Phase 3

Redesign primary pages:

- homepage
- work
- projects
- photography
- contact

### Phase 4

Refine content templates:

- project detail
- photography detail

### Phase 5

Remove obsolete handcrafted global CSS once Tailwind parity is complete.

## Verification

- `npm run build` must pass after Tailwind integration
- dark and light modes must both remain usable
- navigation active state must still work
- site should remain static-output friendly for GitHub Pages
- no route should visually regress into generic Tailwind defaults

## Success Criteria

The redesign is successful if:

- the site feels unmistakably more intentional and memorable
- the visual identity supports Ashwin’s taste and curiosity
- the codebase is primarily Tailwind-driven rather than split between utilities and legacy CSS
- the resulting UI feels editorial and founder-sharp, not like a template or standard portfolio starter
