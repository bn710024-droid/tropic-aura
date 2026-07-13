#!/usr/bin/env node
import puppeteer from 'puppeteer'
import fs from 'fs'
import path from 'path'

const route = '/produits/mangue'
const url = `http://localhost:5173${route}`
const outDir = 'dist/produits/mangue'

console.log(`\n🚀 Pre-rendering: ${route}`)
console.log(`📍 URL: ${url}\n`)

try {
  const browser = await puppeteer.launch({ headless: 'new' })
  const page = await browser.newPage()

  console.log('📄 Navigating...')
  await page.goto(url, { waitUntil: 'networkidle2' })

  await page.waitForTimeout(1500)

  console.log('📸 Capturing HTML...')
  const html = await page.content()

  fs.mkdirSync(outDir, { recursive: true })
  fs.writeFileSync(`${outDir}/index.html`, html)

  const size = (fs.statSync(`${outDir}/index.html`).size / 1024).toFixed(2)
  console.log(`✅ Saved: ${outDir}/index.html (${size} KB)\n`)

  // Analyze
  console.log('═══════════════════════════════════════════════════════════════')
  console.log('  CONTENT VERIFICATION')
  console.log('═══════════════════════════════════════════════════════════════\n')

  const checks = [
    ['<h1', 'H1 tag'],
    ['name="description"', 'Meta description'],
    ['rel="canonical"', 'Canonical URL'],
    ['property="og:title"', 'OG Title'],
    ['property="og:image"', 'OG Image'],
    ['"@type":"Product"', 'JSON-LD Product'],
    ['prod-mangue', 'Product image'],
    ['<dl', 'Specifications (dl)'],
    ['<details', 'FAQ (details)'],
    ['Spécifications export', 'Specs heading text'],
    ['Questions fréquentes', 'FAQ heading text']
  ]

  for (const [search, label] of checks) {
    const found = html.includes(search)
    console.log(`  ${found ? '✅' : '❌'} ${label}`)
  }

  console.log('')

  await browser.close()

} catch (err) {
  console.error('❌ Error:', err.message)
  process.exit(1)
}
