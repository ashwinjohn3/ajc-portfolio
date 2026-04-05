# Portfolio — Agent Context

## Stack
- Next.js 14 App Router, Tailwind CSS, Framer Motion v11, next-themes, lucide-react (all installed)
- Fonts: Fraunces (display) + DM Sans (body) via `next/font/google`
- Theme: `<ThemeProvider attribute="class" defaultTheme="light">` — dark mode via `.dark` class

## Image CDNs (configured in next.config.mjs remotePatterns)
- Games: `cdn.cloudflare.steamstatic.com/steam/apps/{appId}/library_600x900.jpg`
- Movies/TV: `image.tmdb.org/t/p/w300/{poster_path}`

## CSS / Styling
- Design tokens live in `app/globals.css` as OKLCH CSS custom properties (light + dark in `.dark`)
- Responsive overrides go in `globals.css` — do NOT use inline `<style>` tags in components (causes duplicate injection when a component renders multiple times)
- Scroll anchor offset rule uses `[id]` selector (not `section[id]`) to cover `<footer id="...">` too
- When adding responsive className overrides, put `className` on the element that holds the padding (outer `<section>`), not on an inner `motion.div`

## Component patterns
- `SectionTable` renders its own `<section id={id}>` — pass `id` as a prop, never wrap it in another `<section>` in page.tsx
- `Hero`, `SectionTable`, `Shelf`, `Footer` all use `className` on outer element for responsive overrides
- `next-themes`: always guard theme toggle with `mounted` state to avoid hydration mismatch
- Email is obfuscated via `ObfuscatedEmail` client component (char code array, never in server HTML)

## Fraunces font
- Must include `style: ['normal', 'italic']` in config — italic is used for the last-name display

## Dev commands
- `npm run dev` — start dev server (port 3000, falls back to 3001 if occupied)
- `npm run build` — production build, confirms no type errors
- `npx tsc --noEmit` — type check only
