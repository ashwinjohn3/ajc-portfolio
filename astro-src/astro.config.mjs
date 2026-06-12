// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://ashwinchempolil.me',
  output: 'static',

  // Fonts API — top-level in Astro 6 (not under experimental)
  // Space Grotesk: display/body; Space Mono: labels/nav/meta
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Space Grotesk',
      cssVariable: '--font-display',
      weights: [300, 400, 500, 600, 700],
    },
    {
      provider: fontProviders.google(),
      name: 'Space Mono',
      cssVariable: '--font-mono',
      weights: [400, 700],
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
