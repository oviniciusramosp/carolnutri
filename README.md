# Site — Carol Nutri

Site público da nutricionista. App **Astro** estático, hospedado no **GitHub Pages**.
Independente do dashboard (Next.js na raiz) e do app do paciente (`apps/mobile`).

## Por que `apps/www`

Convenção de monorepo: `www` = site público de marketing; `web` seria o app logado
(aqui o dashboard, que continua na raiz). Não usamos npm workspaces de propósito:
o `npm ci` da VPS do dashboard não pode instalar Astro nem Expo.

## Estrutura

```text
apps/www/
├── public/                 # arquivos servidos como estão
│   ├── images/             # logo, fotos, og-image
│   ├── favicon.png
│   ├── apple-touch-icon.png
│   └── .nojekyll           # GitHub Pages não deve passar o build pelo Jekyll
├── src/
│   ├── components/         # Header, Footer, blocos reutilizáveis
│   ├── layouts/            # BaseLayout.astro — html/head/body de todas as páginas
│   ├── lib/                # site.ts — nome, descrição (não é um utils.ts)
│   ├── pages/              # rotas: index.astro → /, 404.astro → 404.html
│   └── styles/             # global.css — tokens da marca + Tailwind v4
├── astro.config.mjs
└── package.json            # @carol/www
```

Regras iguais ao resto do repo: identificadores em inglês, copy da UI em português.
Rotas futuras de SEO em PT (`/sobre`, `/servicos`, `/contato`) — criar o arquivo
em `src/pages/sobre.astro`, etc. Componente usado por uma página fica ao lado;
na segunda chamada, sobe para `src/components/`.

## Desenvolvimento

```bash
nvm use
cd apps/www
npm install
npm run dev          # http://localhost:4321
npm run build        # saída em dist/
npm run preview      # serve o dist localmente
```

Pela raiz do repo: `npm run www:dev` / `www:build` / `www:preview`.

## GitHub Pages

O workflow [`.github/workflows/deploy-www.yml`](../../.github/workflows/deploy-www.yml)
builda **só** `apps/www` quando há push em `main` nesse caminho.

O site público vive num repo separado, `oviniciusramosp/carolnutri`, para o
dashboard (dados de saúde) não ir para um repositório público. Preview:
https://oviniciusramosp.github.io/carolnutri/

`GITHUB_PAGES=true` no Action troca `base` para `/carolnutri/`. Localmente
continua `/`. Domínio próprio depois: DNS + `public/CNAME`, e voltar `base` para `/`.

## Tokens

As cores em `src/styles/global.css` espelham `src/app/globals.css` do dashboard.
Não inventar hex no componente — token primeiro, depois a classe Tailwind
(`bg-almond`, `text-coffee`, `border-taupe`).
