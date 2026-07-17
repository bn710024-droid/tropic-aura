#!/usr/bin/env node
/**
 * PRERENDER FOR BUILD: Generate static HTML for all 19 routes
 *
 * This script is called by build-and-prerender.mjs
 * It connects to the vite preview server (default: http://localhost:4173)
 * Or uses the PRERENDER_URL environment variable if provided
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { ROUTES } from '../src/seo/routesRegistry.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.join(__dirname, '..')
const distDir = path.join(projectRoot, 'dist')

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
    for (const route of ROUTES) {
      const { path: routePath } = route
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
    console.log(`✅ Rendered: ${results.success.length}/${ROUTES.length} routes`)

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
