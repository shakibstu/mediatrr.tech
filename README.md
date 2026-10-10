# mediatrr.tech

Source of the [MediatRR](https://github.com/shakibstu/MediatRR) documentation site, published at
[mediatrr.tech](https://mediatrr.tech). It is a React 19 single-page app built with Vite and hosted on
GitHub Pages.

## Working on the site

```bash
npm install
npm run dev      # local dev server with hot reload
npm run lint     # eslint
npm run build    # production build into dist/
npm run preview  # serve the production build locally
```

## Where things live

| Path | Purpose |
| --- | --- |
| `src/data/navigation.js` | Single source of truth for the docs pages: sidebar, routes, previous/next links, search, the generated static HTML and the sitemap all read from it. Each entry has a `slug`, `label`, `description` and the component `file`. |
| `src/data/site.js` | Site-wide constants: URLs, default descriptions, contact address. |
| `src/data/version.js` | The library version shown in the navbar and footer. Bump it when a new MediatRR version is published. |
| `src/data/searchIndex.js` | Hand-curated keywords per page for the search dialog. Keep it in sync with page content. |
| `src/pages/docs/*.jsx` | One component per docs page. Use `H2` from `components/DocHeading` for section headings (it adds anchors and feeds the table of contents) and `Callout` for notes, tips and warnings. |
| `src/pages/Home.jsx` | Landing page. |
| `src/index.css` | All styles. Colours are CSS custom properties defined on `:root` (dark) and `:root[data-theme="light"]`. |
| `brand/` | Original logo artwork and the source of the social preview card. |
| `public/` | Static files served as-is: favicons, the social image and `robots.txt`. |

## Routing on GitHub Pages

GitHub Pages only serves static files, so a plain single-page app returns 404 for every deep link.
The Vite plugin in `vite.config.js` fixes this at build time:

- every docs route is written to `dist/docs/<slug>.html` and `dist/docs/<slug>/index.html`, with the
  page's own `<title>`, description, canonical URL and Open Graph tags injected;
- `dist/404.html` is a copy of the app marked `noindex`, so unknown URLs still render the in-app
  404 page;
- `dist/sitemap.xml` lists the home page and every docs page.

At runtime `hooks/usePageMeta.js` keeps the title and meta tags in sync during client-side navigation,
and `components/ScrollManager.jsx` scrolls to the top (or to the URL hash) on every route change.

## Theme

The site is dark by default. The navbar toggle switches to a light theme and stores the choice in
`localStorage` under `mediatrr-theme`; the inline script in `index.html` applies the stored theme
before the first paint so there is no flash.

## Brand assets

`public/favicon-32.png`, `public/icon-192.png`, `public/apple-touch-icon.png` and
`public/og-image.png` were rendered from `brand/mediatrr-logo.svg` and `brand/og-card.svg` with the
macOS QuickLook renderer (`qlmanage -t`) and resized with `sips`. Regenerate them if the artwork changes.

## Deployment

Every push to `main` runs `.github/workflows/jekyll-gh-pages.yml`, which builds the site and deploys
`dist/` to GitHub Pages. Merging a pull request publishes immediately.

## Releasing docs for a new library version

1. Bump `src/data/version.js`.
2. Update the affected pages under `src/pages/docs/` and their keywords in `src/data/searchIndex.js`.
3. For a breaking release, add an upgrade guide page and register it in `src/data/navigation.js`
   and `src/pages/Docs.jsx`.
4. Run `npm run lint` and `npm run build`, then open a pull request.
