// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const SITE = 'https://onnoy.vercel.app';

// Pages that must never appear in the public sitemap.
const PRIVATE_ROUTES = ['/admin', '/profile', '/login', '/register', '/fix-db'];

export default defineConfig({
  site: SITE,
  output: 'static',
  trailingSlash: 'never',
  compressHTML: true,
  build: {
    format: 'file',
    inlineStylesheets: 'auto',
  },
  integrations: [
    sitemap({
      filter: (page) => !PRIVATE_ROUTES.some((p) => new URL(page).pathname.startsWith(p)),
      changefreq: 'weekly',
      priority: 0.7,
    }),
  ],
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Plus Jakarta Sans',
      cssVariable: '--font-display',
      weights: [600, 700, 800],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['sans-serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Inter',
      cssVariable: '--font-body',
      weights: [400, 500, 600, 700],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['sans-serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Noto Sans Bengali',
      cssVariable: '--font-bengali',
      weights: [400, 500, 600, 700],
      styles: ['normal'],
      subsets: ['bengali'],
      fallbacks: ['sans-serif'],
    },
  ],
  image: {
    responsiveStyles: true,
  },
  vite: {
    build: {
      cssCodeSplit: true,
    },
  },
});
