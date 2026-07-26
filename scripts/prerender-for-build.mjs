#!/usr/bin/env node
/**
 * PRERENDER FOR BUILD: Generate static HTML for every route, in BOTH languages.
 *
 * This script is called by build-and-prerender.mjs
 * It connects to the vite preview server (default: http://localhost:4173)
 * Or uses the PRERENDER_URL environment variable if provided
 *
 * BILINGUE : les routes anglaises (/en/...) DOIVENT être pré-rendues elles
 * aussi. Sans cela, le serveur renvoie pour /en/products le index.html
 * pré-rendu de l'accueil français — Googlebot lit alors un <title> et une
 * meta description françaises sur une page annoncée comme anglaise, ce qui
 * ruine le référencement de toute la version EN (constaté en production).
 * La correspondance FR→EN vient de src/i18n/routing.js, même source que le
 * sitemap et le sélecteur de langue.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { ROUTES } from '../src/seo/routesRegistry.js'
import { ROUTES as I18N_ROUTES, TRANSLATED_PAGES, SUPPORTED_LANGS, DEFAULT_LANG } from '../src/i18n/routing.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.join(__dirname, '..')
const distDir = path.join(projectRoot, 'dist')

const OTHER_LANGS = SUPPORTED_LANGS.filter((l) => l !== DEFAULT_LANG)

// ── Liste finale des chemins à pré-rendre : toutes les routes françaises,
// plus leur équivalent dans chaque autre langue quand la page est
// réellement traduite (voir TRANSLATED_PAGES).
const frToOthers = new Map()
for (const key of TRANSLATED_PAGES) {
  const pair = I18N_ROUTES[key]
  if (pair?.[DEFAULT_LANG]) frToOthers.set(pair[DEFAULT_LANG], pair)
}
const productsPair = I18N_ROUTES.products

/** Équivalents (par langue) d'un chemin français, ou {} si non traduit. */
function altPathsFor(frPath) {
  const direct = frToOthers.get(frPath)
  if (direct) return direct
  // Fiches produit : /produits/<slug> → /en/products/<slug>, /nl/producten/<slug>...
  if (frPath.startsWith(`${productsPair[DEFAULT_LANG]}/`)) {
    const slug = frPath.slice(productsPair[DEFAULT_LANG].length + 1)
    const out = {}
    for (const lang of OTHER_LANGS) out[lang] = `${productsPair[lang]}/${slug}`
    return out
  }
  return {}
}

const PRERENDER_PATHS = []
for (const r of ROUTES) {
  PRERENDER_PATHS.push(r.path)
  const alt = altPathsFor(r.path)
  for (const lang of OTHER_LANGS) {
    if (alt[lang]) PRERENDER_PATHS.push(alt[lang])
  }
}

// Use environment variable or default
const BASE_URL = process.env.PRERENDER_URL || 'http://localhost:4173'
const HYDRATION_WAIT = 4000 // ms - Increased to allow React full hydration + animation setup
const NAVIGATION_TIMEOUT = 30000 // ms

// Le Chromium embarqué de `puppeteer` échoue au lancement dans le sandbox
// de build Vercel (libnspr4.so manquant — cf. incident du 2026-07-17).
// Sur Vercel (process.env.VERCEL défini automatiquement), on bascule vers
// @sparticuz/chromium + puppeteer-core, un binaire compilé pour tourner
// dans ces environnements contraints. En local, `puppeteer` classique
// reste utilisé (déjà validé, aucun changement de comportement).
async function launchBrowser() {
  if (process.env.VERCEL) {
    const [{ default: chromium }, { default: puppeteerCore }] = await Promise.all([
      import('@sparticuz/chromium'),
      import('puppeteer-core'),
    ])
    return puppeteerCore.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      timeout: NAVIGATION_TIMEOUT,
    })
  }
  const { default: puppeteer } = await import('puppeteer')
  return puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    timeout: NAVIGATION_TIMEOUT,
  })
}

async function prerender() {
  console.log('\n🚀 PRERENDER FOR BUILD: Generate static HTML')
  console.log(`📍 Base URL: ${BASE_URL}`)
  console.log(`📁 Output dir: ${distDir}\n`)

  let browser
  const results = {
    success: [],
    failed: [],
  }

  try {
    // Launch browser
    console.log('🚀 Launching Puppeteer browser...')
    browser = await launchBrowser()
    console.log('✅ Browser launched\n')

    // Process each route
    for (const routePath of PRERENDER_PATHS) {
      const url = `${BASE_URL}${routePath}`

      try {
        console.log(`📄 Rendering: ${routePath}`)

        // Create new page
        const page = await browser.newPage()
        await page.setViewport({ width: 1280, height: 800 })

        // Navigate
        try {
          await page.goto(url, {
            waitUntil: 'networkidle2',
            timeout: NAVIGATION_TIMEOUT
          })
        } catch (navErr) {
          console.log(`   ⚠️  Navigation timeout: ${navErr.message}`)
        }

        // Wait for React hydration
        await new Promise(r => setTimeout(r, HYDRATION_WAIT))

        // Capture HTML
        const html = await page.content()

        // Determine output path
        let outPath
        if (routePath === '/') {
          outPath = path.join(distDir, 'index.html')
        } else {
          const segments = routePath.split('/').filter(Boolean)
          outPath = path.join(distDir, ...segments, 'index.html')
        }

        // Create directory
        fs.mkdirSync(path.dirname(outPath), { recursive: true })

        // Write file
        fs.writeFileSync(outPath, html, 'utf-8')
        const sizeKB = (fs.statSync(outPath).size / 1024).toFixed(2)

        console.log(`   ✅ Generated (${sizeKB} KB)`)
        results.success.push(routePath)

        // Close page
        await page.close()

      } catch (err) {
        console.log(`   ❌ ERROR: ${err.message}`)
        results.failed.push({ path: routePath, error: err.message })
      }
    }

    // Close browser
    await browser.close()
    console.log('\n✅ Browser closed\n')

    // Summary
    console.log(`✅ Rendered: ${results.success.length}/${PRERENDER_PATHS.length} routes`)

    if (results.failed.length > 0) {
      console.log(`❌ Failed: ${results.failed.length}`)
      results.failed.forEach(({ path: p, error }) => {
        console.log(`   ❌ ${p}: ${error}`)
      })
      process.exit(1)
    }

  } catch (err) {
    console.error('❌ FATAL ERROR:', err.message)
    if (browser) await browser.close()
    process.exit(1)
  }
}

prerender()
