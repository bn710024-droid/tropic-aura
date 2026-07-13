#!/usr/bin/env node
/**
 * POC: Pre-render /produits/mangue only
 * Simple, direct script with no complexity
 */

import puppeteer from 'puppeteer'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.join(__dirname, '..')

async function main() {
  console.log('\n🚀 Starting Puppeteer prerender for /produits/mangue...\n')

  const url = 'http://localhost:5173/produits/mangue'
  const outDir = path.join(projectRoot, 'dist', 'produits', 'mangue')
  const outFile = path.join(outDir, 'index.html')

  try {
    // Launch browser
    console.log('1️⃣  Launching Puppeteer...')
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    console.log('   ✅ Browser launched\n')

    // Create page
    console.log('2️⃣  Creating page...')
    const page = await browser.newPage()
    console.log('   ✅ Page created\n')

    // Navigate
    console.log(`3️⃣  Navigating to ${url}...`)
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 })
    console.log('   ✅ Page loaded\n')

    // Wait for hydration
    console.log('4️⃣  Waiting for React hydration (2s)...')
    await new Promise(r => setTimeout(r, 2000))
    console.log('   ✅ Hydration complete\n')

    // Get HTML
    console.log('5️⃣  Capturing HTML content...')
    const html = await page.content()
    console.log(`   ✅ HTML captured (${html.length} bytes)\n`)

    // Create directory
    console.log(`6️⃣  Creating directory ${outDir}...`)
    fs.mkdirSync(outDir, { recursive: true })
    console.log('   ✅ Directory created\n')

    // Write file
    console.log(`7️⃣  Writing HTML to ${outFile}...`)
    fs.writeFileSync(outFile, html, 'utf-8')
    const fileSize = fs.statSync(outFile).size
    console.log(`   ✅ File written (${fileSize} bytes = ${(fileSize / 1024).toFixed(2)} KB)\n`)

    // Close browser
    await browser.close()
    console.log('8️⃣  Browser closed\n')

    // Success
    console.log('═══════════════════════════════════════════════════════════════')
    console.log('✅ POC SUCCESSFUL')
    console.log('═══════════════════════════════════════════════════════════════\n')

    console.log(`File location: ${outFile}`)
    console.log(`File size: ${(fileSize / 1024).toFixed(2)} KB\n`)

  } catch (err) {
    console.error('❌ ERROR:', err.message)
    console.error(err.stack)
    process.exit(1)
  }
}

main()
