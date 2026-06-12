// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://ashwinchempolil.me',
  output: 'static',

  // Fonts API — top-level in Astro 6 (not under experimental)
  // Pairing 03: Instrument Serif (display) + Instrument Sans (body) + Fragment Mono (labels)
  fonts: [
    {
      // Display — Instrument Serif ships ONLY 400, normal + italic.
      // Italic is the signature (hero last name). Display sizing is built
      // around the single 400 weight (sized up large; see global.css/Hero).
      provider: fontProviders.google(),
      name: 'Instrument Serif',
      cssVariable: '--font-display',
      weights: [400],
      styles: ['normal', 'italic'],
    },
    {
      // Body — Instrument Sans, variable weights. Default running text +
      // honest "Ashwin" bold (700) against the serif italic last name.
      provider: fontProviders.google(),
      name: 'Instrument Sans',
      cssVariable: '--font-body',
      weights: [400, 500, 600, 700],
    },
    {
      // Labels / nav / meta — Fragment Mono, single 400 weight.
      provider: fontProviders.google(),
      name: 'Fragment Mono',
      cssVariable: '--font-mono',
      weights: [400],
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
