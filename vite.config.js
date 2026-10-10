import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { DOCS_FLAT } from './src/data/navigation.js'
import { DOCS_INDEX_DESCRIPTION, SITE_NAME, SITE_URL } from './src/data/site.js'

const escapeHtml = (value) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const replaceAttribute = (html, pattern, value) => html.replace(pattern, `$1${escapeHtml(value)}$2`)

const docPages = () => [
  { path: '/docs', title: `Documentation · ${SITE_NAME}`, description: DOCS_INDEX_DESCRIPTION },
  ...DOCS_FLAT.map((doc) => ({
    path: `/docs/${doc.slug}`,
    title: `${doc.label} · ${SITE_NAME}`,
    description: doc.description,
  })),
]

const renderPage = (template, page) => {
  const url = `${SITE_URL}${page.path}`
  let html = template.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(page.title)}</title>`)
  html = replaceAttribute(html, /(<meta name="description" content=")[^"]*(")/, page.description)
  html = replaceAttribute(html, /(<link rel="canonical" href=")[^"]*(")/, url)
  html = replaceAttribute(html, /(<meta property="og:url" content=")[^"]*(")/, url)
  html = replaceAttribute(html, /(<meta property="og:title" content=")[^"]*(")/, page.title)
  html = replaceAttribute(html, /(<meta property="og:description" content=")[^"]*(")/, page.description)
  html = replaceAttribute(html, /(<meta name="twitter:title" content=")[^"]*(")/, page.title)
  html = replaceAttribute(html, /(<meta name="twitter:description" content=")[^"]*(")/, page.description)
  return html
}

const sitemap = (paths) => {
  const lastmod = new Date().toISOString().slice(0, 10)
  const entries = paths.map(
    (path) => `  <url>\n    <loc>${SITE_URL}${path}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`,
  )
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>\n`
}

function staticRoutes() {
  let outDir = resolve('dist')
  return {
    name: 'mediatrr-static-routes',
    apply: 'build',
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir)
    },
    closeBundle() {
      const template = readFileSync(resolve(outDir, 'index.html'), 'utf8')
      const write = (relativePath, content) => {
        const file = resolve(outDir, relativePath)
        mkdirSync(dirname(file), { recursive: true })
        writeFileSync(file, content)
      }

      const pages = docPages()
      for (const page of pages) {
        const html = renderPage(template, page)
        const base = page.path.slice(1)
        write(`${base}.html`, html)
        write(`${base}/index.html`, html)
      }

      write(
        '404.html',
        template.replace('<meta name="viewport"', '<meta name="robots" content="noindex" />\n    <meta name="viewport"'),
      )
      write('sitemap.xml', sitemap(['/', ...pages.map((page) => page.path)]))
    },
  }
}

export default defineConfig({
  plugins: [react(), staticRoutes()],
})
