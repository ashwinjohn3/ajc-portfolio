// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://ashwinchempolil.me',
  output: 'static',

  // Fonts API — top-level in Astro 6 (not under experimental)
  // Pairing 05: Syne (display) + Onest (body) + Spline Sans Mono (labels)
  fonts: [
    {
      // Display — Syne, geometric art-school sans. Carries the hero name and
      // headings. The name uses a strong weight (700/800); 600 for mid headings.
      provider: fontProviders.google(),
      name: 'Syne',
      cssVariable: '--font-display',
      weights: [400, 500, 600, 700, 800],
    },
    {
      // Body — Onest, quiet even body sans (variable). Default running text +
      // bold (700) for emphasis like the "Ashwin" name lead.
      provider: fontProviders.google(),
      name: 'Onest',
      cssVariable: '--font-body',
      weights: [400, 500, 600, 700],
    },
    {
      // Labels / nav / meta — Spline Sans Mono, soft friendly terminal face.
      provider: fontProviders.google(),
      name: 'Spline Sans Mono',
      cssVariable: '--font-mono',
      weights: [400, 500, 600, 700],
      styles: ['normal', 'italic'],
    },
  ],

  image: {
    remotePatterns: [
      { protocol: 'https', hostname: 'image.tmdb.org' },
      { protocol: 'https', hostname: 'cdn.cloudflare.steamstatic.com' },
    ],
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
