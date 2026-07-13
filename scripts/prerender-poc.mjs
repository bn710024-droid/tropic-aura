#!/usr/bin/env node
/**
 * POC: Pre-render single route (/produits/mangue) using Puppeteer
 *
 * This script:
 * 1. Launches a Puppeteer browser
 * 2. Navigates to http://localhost:5173/produits/mangue
 * 3. Waits for React to hydrate and Helmet to inject metadata
 * 4. Captures the complete rendered HTML
 * 5. Saves it to dist/produits/mangue/index.html
 * 6. Logs before/after comparison
 */

import puppeteer from 'puppeteer'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.join(__dirname, '..')
const distDir = path.join(projectRoot, 'dist')

async function prerender() {
  console.log('\n═══════════════════════════════════════════════════════════════')
  console.log('  POC: Pre-render /produits/mangue with Puppeteer')
  console.log('═══════════════════════════════════════════════════════════════\n')

  const route = '/produits/mangue'
  const url = `http://localhost:5173${route}`

  try {
    // 1. Launch browser
    console.log('🚀 Launching Puppeteer browser...')
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })

    // 2. Open page
    console.log(`📄 Opening URL: ${url}`)
    const page = await browser.newPage()

    // Set viewport to desktop size
    await page.setViewport({ width: 1280, height: 800 })

    // 3. Navigate and wait for hydration
    console.log('⏳ Navigating and waiting for React hydration...')
    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 })
    } catch (err) {
      console.log('⚠️  Timeout warning (may be OK if SPA is still interactive):', err.message)
    }

    // Wait a bit more for React and Helmet to fully settle
    console.log('⏳ Waiting for Helmet metadata injection...')
    await page.waitForTimeout(2000)

    // 4. Get HTML content
    console.log('📸 Capturing rendered HTML...')
    const html = await page.content()

    // 5. Save to dist
    const dirPath = path.join(distDir, 'produits', 'mangue')
    fs.mkdirSync(dirPath, { recursive: true })
    const filePath = path.join(dirPath, 'index.html')
    fs.writeFileSync(filePath, html, 'utf-8')
    console.log(`✅ Saved to: ${filePath}`)

    // 6. Analyze content
    console.log('\n═══════════════════════════════════════════════════════════════')
    console.log('  📊 CONTENT ANALYSIS')
    console.log('═══════════════════════════════════════════════════════════════\n')

    const checks = {
      'H1 tag': /<h1[^>]*>([^<]+)<\/h1>/,
      'Description meta': /name="description" content="([^"]*)"/,
      'Canonical URL': /rel="canonical" href="([^"]*)"/,
      'OG:Title': /property="og:title" content="([^"]*)"/,
      'OG:Image': /property="og:image" content="([^"]*)"/,
      'Twitter Card': /name="twitter:card" content="([^"]*)"/,
      'JSON-LD Product': /"@type":"Product"/,
      'Product name in JSON-LD': /"name":"([^"]*)".*"@type":"Product"/,
      'Specs (dl tag)': /<dl[^>]*>/,
      'Product image (img tag)': /<img[^>]*src="[^"]*prod-mangue[^"]*"/,
      'FAQ (details tag)': /<details/,
      'Main content (main tag)': /<main/,
      'Article tag': /<article/,
      'H2 tags': /<h2[^>]*>/g
    }

    console.log('✅ Checking for expected content:\n')

    for (const [check, regex] of Object.entries(checks)) {
      const match = html.match(regex)
      const isArray = regex.flags.includes('g')

      if (check.includes('tags')) {
        const count = (html.match(regex) || []).length
        console.log(`  ${match ? '✅' : '❌'} ${check}: ${count} found`)
      } else if (match) {
        const content = match[1] ? match[1].substring(0, 60) : match[0].substring(0, 60)
        console.log(`  ✅ ${check}: "${content}..."`)
      } else {
        console.log(`  ❌ ${check}: NOT FOUND`)
      }
    }

    // 7. Size comparison
    const fileSizeKB = (fs.statSync(filePath).size / 1024).toFixed(2)
    console.log(`\n📊 File size: ${fileSizeKB} KB`)

    // 8. Extract and show key content
    console.log('\n═══════════════════════════════════════════════════════════════')
    console.log('  📝 EXTRACTED CONTENT SAMPLES')
    console.log('═══════════════════════════════════════════════════════════════\n')

    const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/)
    if (h1Match) {
      console.log(`H1: "${h1Match[1]}"`)
    }

    const descMatch = html.match(/name="description" content="([^"]*)/)
    if (descMatch) {
      console.log(`\nDescription: "${descMatch[1].substring(0, 120)}..."`)
    }

    const productNameMatch = html.match(/"name":"([^"]*)"[^}]*"@type":"Product"/)
    if (productNameMatch) {
      console.log(`\nProduct name (JSON-LD): "${productNameMatch[1]}"`)
    }

    // 9. Show HTML structure snippet
    console.log('\n═══════════════════════════════════════════════════════════════')
    console.log('  🔍 HTML HEAD SNIPPET')
    console.log('═══════════════════════════════════════════════════════════════\n')

    const headMatch = html.match(/<head[^>]*>[\s\S]*?<\/head>/)
    if (headMatch) {
      const headContent = headMatch[0]
      // Show first 500 chars of head
      console.log(headContent.substring(0, 800) + '...\n')
    }

    // 10. Close browser
    await browser.close()
    console.log('✅ Browser closed\n')

    console.log('═══════════════════════════════════════════════════════════════')
    console.log('  ✅ POC SUCCESSFUL')
    console.log('═══════════════════════════════════════════════════════════════\n')

    return true
  } catch (error) {
    console.error('❌ POC FAILED:', error.message)
    process.exit(1)
  }
}

// Run only if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  prerender()
}
