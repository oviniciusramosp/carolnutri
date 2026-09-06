// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://nutricarolagostini.com',
  base: '/',
  output: 'static',
  trailingSlash: 'always',
  redirects: {
    '/midia-kit/joy/': '/media-kit/joy/',
    '/midia-kit/joy-og/': '/media-kit/joy-og/',
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/media-kit/') && !page.includes('/dashboard'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
