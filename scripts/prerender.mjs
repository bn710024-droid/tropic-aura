#!/usr/bin/env node
/**
 * PRERENDER: Generate static HTML for all 19 routes
 *
 * This script:
 * 1. Imports all routes from src/seo/routesRegistry.js
 * 2. Launches Puppeteer once
 * 3. Navigates to each route via http://localhost:5173{path}
 * 4. Waits for React hydration + Helmet metadata injection
 * 5. Captures rendered HTML
 * 6. Saves to dist/{path}/index.html
 * 7. Logs summary
 *
 * Hook: npm run build → vite build → npm run postbuild → node scripts/prerender.mjs
 */

import puppeteer from 'puppeteer'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { ROUTES } from '../src/seo/routesRegistry.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.join(__dirname, '..')
const distDir = path.join(projectRoot, 'dist')

// Configuration
const DEV_SERVER_URL = 'http://localhost:5173'
const HYDRATION_WAIT = 2000 // ms: wait for React hydration + Helmet
const NAVIGATION_TIMEOUT = 30000 // ms

async function prerender() {
  console.log('\n═══════════════════════════════════════════════════════════════')
  console.log('  🚀 PRERENDER: Generate static HTML for all 19 routes')
  console.log('═══════════════════════════════════════════════════════════════\n')

  // Validate dev server is running
  console.log(`📍 Dev server: ${DEV_SERVER_URL}`)
  console.log(`📁 Output dir: ${distDir}\n`)

  let browser
  const results = {
    success: [],
    failed: [],
    skipped: []
  }

  try {
    // Launch browser ONCE for all routes
    console.log('🚀 Launching Puppeteer browser...')
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      timeout: NAVIGATION_TIMEOUT
    })
    console.log('✅ Browser launched\n')

    // Process each route
    for (const route of ROUTES) {
      const { path: routePath } = route
      const url = `${DEV_SERVER_URL}${routePath}`

      try {
        console.log(`📄 Processing: ${routePath}`)

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
          console.log(`   ⚠️  Navigation timeout (may be OK): ${navErr.message}`)
        }

        // Wait for React hydration + Helmet
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
    console.log('═══════════════════════════════════════════════════════════════')
    console.log('  📊 PRERENDER SUMMARY')
    console.log('═══════════════════════════════════════════════════════════════\n')

    console.log(`✅ Success: ${results.success.length}/${ROUTES.length}`)
    results.success.forEach(p => console.log(`   ✅ ${p}`))

    if (results.failed.length > 0) {
      console.log(`\n❌ Failed: ${results.failed.length}`)
      results.failed.forEach(({ path: p, error }) => {
        console.log(`   ❌ ${p}: ${error}`)
      })
      console.log('')
      process.exit(1)
    }

    console.log('\n═══════════════════════════════════════════════════════════════')
    console.log('✅ ALL ROUTES PRERENDERED SUCCESSFULLY')
    console.log('═══════════════════════════════════════════════════════════════\n')

  } catch (err) {
    console.error('\n❌ FATAL ERROR:', err.message)
    if (browser) await browser.close()
    process.exit(1)
  }
}

prerender()
