// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://nutricarolagostini.com',
  base: '/',
  output: 'static',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/midia-kit/'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
