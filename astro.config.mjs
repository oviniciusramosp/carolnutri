// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// Local + custom domain use `/`. GitHub Pages project URL needs the repo prefix.
const githubPages = process.env.GITHUB_PAGES === 'true';

export default defineConfig({
  site: githubPages ? 'https://oviniciusramosp.github.io' : 'https://carolnutri.com.br',
  base: githubPages ? '/carolnutri/' : '/',
  output: 'static',
  trailingSlash: 'always',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
