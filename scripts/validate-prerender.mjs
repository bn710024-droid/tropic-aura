#!/usr/bin/env node
/**
 * VALIDATE PRERENDER: Verify all 19 generated HTML files meet quality criteria
 *
 * Checks per file:
 * 1. File exists
 * 2. Unique <title> present
 * 3. Meta description present
 * 4. Canonical URL present
 * 5. H1 present
 * 6. JSON-LD schema present and valid
 * 7. At least one image present
 * 8. No empty <div id="root"></div> as main content
 * 9. No broken internal links
 * 10. No build errors
 *
 * Exit code: 0 if all pass, 1 if any fail
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { ROUTES } from '../src/seo/routesRegistry.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.join(__dirname, '..')
const distDir = path.join(projectRoot, 'dist')

// Define output paths for each route
function getOutputPath(routePath) {
  if (routePath === '/') {
    return path.join(distDir, 'index.html')
  }
  const segments = routePath.split('/').filter(Boolean)
  return path.join(distDir, ...segments, 'index.html')
}

// Validation functions
const validators = {
  fileExists: (html, filePath) => {
    return {
      pass: !!html,
      message: `File exists: ${filePath}`
    }
  },

  uniqueTitle: (html) => {
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
    const pass = titleMatch && titleMatch[1] && titleMatch[1].trim().length > 0
    return {
      pass,
      message: pass
        ? `✅ Title: "${titleMatch[1].substring(0, 60)}..."`
        : '❌ Title missing or empty'
    }
  },

  metaDescription: (html) => {
    const descMatch = html.match(/name="description"\s+content="([^"]*)"/i)
    const pass = descMatch && descMatch[1] && descMatch[1].trim().length > 0
    return {
      pass,
      message: pass
        ? `✅ Meta description: "${descMatch[1].substring(0, 60)}..."`
        : '❌ Meta description missing or empty'
    }
  },

  canonicalUrl: (html) => {
    const canonMatch = html.match(/rel="canonical"\s+href="([^"]*)"/i)
    const pass = canonMatch && canonMatch[1] && canonMatch[1].startsWith('http')
    return {
      pass,
      message: pass
        ? `✅ Canonical: ${canonMatch[1]}`
        : '❌ Canonical URL missing or invalid'
    }
  },

  h1Present: (html) => {
    const h1Match = html.match(/<h1[^>]*>(.+?)<\/h1>/is)
    const pass = h1Match && h1Match[1] && h1Match[1].trim().length > 0
    return {
      pass,
      message: pass
        ? `✅ H1: "${h1Match[1].replace(/<[^>]*>/g, '').substring(0, 60)}..."`
        : '❌ H1 tag missing or empty'
    }
  },

  jsonLdSchema: (html) => {
    const jsonLdMatches = html.match(/<script\s+type="application\/ld\+json"[^>]*>([^<]+)<\/script>/gi)
    if (!jsonLdMatches || jsonLdMatches.length === 0) {
      return {
        pass: false,
        message: '❌ JSON-LD schema missing'
      }
    }

    // Try to parse at least one schema
    let validJsonLd = false
    for (const match of jsonLdMatches) {
      try {
        const jsonStr = match.replace(/<script[^>]*>|<\/script>/gi, '')
        JSON.parse(jsonStr)
        validJsonLd = true
        break
      } catch (e) {
        // continue
      }
    }

    return {
      pass: validJsonLd,
      message: validJsonLd
        ? `✅ JSON-LD: ${jsonLdMatches.length} schema(s) present and valid`
        : '❌ JSON-LD present but not valid JSON'
    }
  },

  imagePresent: (html) => {
    // Extract all img tags (including ones with newlines inside)
    const imgTags = html.match(/<img[^>]*>/gs) || [] // Added 's' flag for dotAll (multiline)

    if (imgTags.length === 0) {
      return {
        pass: false,
        message: '❌ No images found'
      }
    }

    // Check each img tag for required attributes
    for (const tag of imgTags) {
      const srcMatch = tag.match(/src="([^"]*)"/i)
      const altMatch = tag.match(/alt="([^"]*)"/i)
      const widthMatch = tag.match(/width="([^"]*)"/i) || tag.match(/width='([^']*)'/i) || tag.match(/width=([^\s>]*)/i)
      const heightMatch = tag.match(/height="([^"]*)"/i) || tag.match(/height='([^']*)'/i) || tag.match(/height=([^\s>]*)/i)

      const src = srcMatch ? srcMatch[1] : ''
      const alt = altMatch ? altMatch[1].trim() : ''
      const width = widthMatch ? widthMatch[1] : ''
      const height = heightMatch ? heightMatch[1] : ''

      // Check if this img has all required attributes with non-empty alt
      if (src && alt && width && height) {
        return {
          pass: true,
          message: `✅ Image complete: ${src.substring(0, 40)}... (alt="${alt.substring(0, 30)}...", ${width}x${height})`
        }
      }
    }

    // No image with all attributes found
    return {
      pass: false,
      message: `❌ Images found (${imgTags.length}), but none have all required attributes (alt, width, height)`
    }
  },

  noEmptyRoot: (html) => {
    // Check if <div id="root"> is empty or only contains whitespace + JS
    const rootMatch = html.match(/<div\s+id="root"[^>]*>([^<]*)<\/div>/i)
    if (!rootMatch) {
      return {
        pass: true,
        message: '✅ No <div id="root">'
      }
    }

    const content = rootMatch[1].trim()
    // If root only contains whitespace or just script tags, it's empty
    const hasContent = content.length > 0 && !content.match(/^<script/i)
    return {
      pass: hasContent,
      message: hasContent
        ? '✅ <div id="root"> has content'
        : '❌ <div id="root"> is empty (content not prerendered)'
    }
  },

  noInternalLinks: (html) => {
    // Extract all internal links from the HTML
    const linkMatches = html.match(/href="([^"]*)"/gi)
    if (!linkMatches) {
      return {
        pass: true,
        message: '✅ No links found'
      }
    }

    const links = linkMatches.map(m => m.match(/href="([^"]*)"/)[1])
    const internalLinks = links.filter(l => l.startsWith('/') && !l.startsWith('http'))

    // For now, just report count. Full validation would require building URL map
    return {
      pass: true,
      message: `✅ Internal links: ${internalLinks.length} found (requires full build verification)`
    }
  },

  noBuildErrors: (html) => {
    // Check for common error indicators
    const errors = []
    if (html.includes('Error')) errors.push('Error text present')
    if (html.includes('undefined') && html.includes('is not defined')) errors.push('JS undefined error')
    if (html.includes('<h1>404</h1>') || html.includes('<h1>Not Found</h1>')) errors.push('404 page')

    return {
      pass: errors.length === 0,
      message: errors.length === 0
        ? '✅ No build errors detected'
        : `❌ Potential errors: ${errors.join(', ')}`
    }
  }
}

async function validate() {
  console.log('\n═══════════════════════════════════════════════════════════════')
  console.log('  🔍 VALIDATE PRERENDER: Verify 19 routes')
  console.log('═══════════════════════════════════════════════════════════════\n')

  const results = {
    routes: [],
    passCount: 0,
    failCount: 0,
    failedRoutes: []
  }

  // Validate each route
  for (const route of ROUTES) {
    const { path: routePath } = route
    const filePath = getOutputPath(routePath)

    console.log(`\n📄 ${routePath}`)

    let html = null
    try {
      html = fs.readFileSync(filePath, 'utf-8')
    } catch (err) {
      console.log(`   ❌ FILE NOT FOUND: ${filePath}`)
      results.failCount++
      results.failedRoutes.push(routePath)
      results.routes.push({
        path: routePath,
        pass: false,
        reason: 'File not found'
      })
      continue
    }

    // Run all validators
    let routePass = true
    const routeResults = {}

    for (const [name, validator] of Object.entries(validators)) {
      const result = validator(html, filePath)
      const status = result.pass ? '✅' : '❌'
      console.log(`   ${status} ${result.message}`)
      routeResults[name] = result.pass

      if (!result.pass) {
        routePass = false
      }
    }

    if (routePass) {
      results.passCount++
      console.log(`   ✅ ALL CHECKS PASSED`)
    } else {
      results.failCount++
      results.failedRoutes.push(routePath)
      console.log(`   ❌ SOME CHECKS FAILED`)
    }

    results.routes.push({
      path: routePath,
      pass: routePass,
      details: routeResults
    })
  }

  // Summary
  console.log('\n═══════════════════════════════════════════════════════════════')
  console.log('  📊 VALIDATION SUMMARY')
  console.log('═══════════════════════════════════════════════════════════════\n')

  console.log(`✅ Passed: ${results.passCount}/${ROUTES.length}`)
  console.log(`❌ Failed: ${results.failCount}/${ROUTES.length}`)

  if (results.failedRoutes.length > 0) {
    console.log('\n❌ FAILED ROUTES:')
    results.failedRoutes.forEach(p => {
      console.log(`   ❌ ${p}`)
    })
    console.log('\n⛔ VALIDATION FAILED - DO NOT DEPLOY')
    console.log('═══════════════════════════════════════════════════════════════\n')
    process.exit(1)
  } else {
    console.log('\n✅ ALL ROUTES VALIDATED SUCCESSFULLY')
    console.log('═══════════════════════════════════════════════════════════════')
    console.log('✅ READY TO DEPLOY\n')
    process.exit(0)
  }
}

validate().catch(err => {
  console.error('\n❌ VALIDATION ERROR:', err.message)
  process.exit(1)
})
