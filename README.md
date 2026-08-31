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

## GitHub Pages + domínio

Produção: https://nutricarolagostini.com

O workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) publica
em todo push em `main`. `site` e `base` em `astro.config.mjs` apontam para o
domínio próprio (`/` no apex). O preview antigo
`https://oviniciusramosp.github.io/carolnutri/` redireciona para o domínio
depois que o custom domain está nas settings do Pages.

### DNS (Namecheap)

Nameservers: Namecheap BasicDNS. Canonical: apex. `www` redireciona via GitHub.

**Apagar:** `A` de `@` para o parking (`162.255.119.121`), `CNAME` de `www` para
`parkingpage.namecheap.com`, e qualquer **URL Redirect** de `@` ou `www`.

**Manter:** MX `eforward*.registrar-servers.com` e o TXT de SPF.

**Criar:**

| Type | Host | Value | TTL |
| --- | --- | --- | --- |
| A | `@` | `185.199.108.153` | Automatic |
| A | `@` | `185.199.109.153` | Automatic |
| A | `@` | `185.199.110.153` | Automatic |
| A | `@` | `185.199.111.153` | Automatic |
| AAAA | `@` | `2606:50c0:8000::153` | Automatic |
| AAAA | `@` | `2606:50c0:8001::153` | Automatic |
| AAAA | `@` | `2606:50c0:8002::153` | Automatic |
| AAAA | `@` | `2606:50c0:8003::153` | Automatic |
| CNAME | `www` | `oviniciusramosp.github.io.` | Automatic |

GitHub: **Settings → Pages → Custom domain** = `nutricarolagostini.com`.
**Enforce HTTPS** quando o certificado aparecer.

## Tokens

As cores em `src/styles/global.css` espelham `src/app/globals.css` do dashboard.
Não inventar hex no componente — token primeiro, depois a classe Tailwind
(`bg-almond`, `text-coffee`, `border-taupe`).
