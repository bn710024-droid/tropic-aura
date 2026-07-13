#!/usr/bin/env node
/**
 * BUILD AND PRERENDER: Complete pipeline for production build
 *
 * This script orchestrates:
 * 1. npm run prebuild (sitemap, favicons)
 * 2. vite build (React SPA)
 * 3. Start vite preview in background
 * 4. Wait for preview to be ready
 * 5. Execute prerender.mjs against preview server
 * 6. Stop preview server
 * 7. Execute validate-prerender.mjs
 *
 * This runs as: npm run build (in package.json)
 */

import { execSync, spawn } from 'child_process'
import http from 'http'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.join(__dirname, '..')

const PREVIEW_URL = 'http://localhost:4173'
const PREVIEW_TIMEOUT = 30000 // ms

// Utility: wait for server to be ready
async function waitForServer(url, timeout = PREVIEW_TIMEOUT) {
  const startTime = Date.now()
  while (Date.now() - startTime < timeout) {
    try {
      await new Promise((resolve, reject) => {
        http.get(url, (res) => {
          if (res.statusCode === 200 || res.statusCode === 301) {
            resolve()
          } else {
            reject(new Error(`Status ${res.statusCode}`))
          }
        }).on('error', reject)
      })
      return true
    } catch (err) {
      // retry
      await new Promise(r => setTimeout(r, 500))
    }
  }
  throw new Error(`Preview server did not respond within ${timeout}ms`)
}

async function buildAndPrerender() {
  console.log('\n═══════════════════════════════════════════════════════════════')
  console.log('  🏗️  BUILD AND PRERENDER: Complete production pipeline')
  console.log('═══════════════════════════════════════════════════════════════\n')

  let previewProcess = null

  try {
    // Step 1: Prebuild (sitemap, favicons)
    console.log('1️⃣  Running prebuild...')
    execSync('npm run prebuild', { cwd: projectRoot, stdio: 'inherit' })
    console.log('✅ Prebuild complete\n')

    // Step 2: Vite build
    console.log('2️⃣  Running Vite build...')
    execSync('npm run build:vite', { cwd: projectRoot, stdio: 'inherit' })
    console.log('✅ Vite build complete\n')

    // Step 3: Start preview server in background
    console.log(`3️⃣  Starting preview server on ${PREVIEW_URL}...`)
    // Use shell command for cross-platform compatibility (works on Windows/Mac/Linux)
    const cmd = process.platform === 'win32'
      ? 'npm exec -- vite preview --port 4173'
      : 'npm exec -- vite preview --port 4173'

    previewProcess = spawn(cmd, {
      cwd: projectRoot,
      stdio: 'pipe',
      shell: true
    })

    // Wait for preview to be ready
    console.log('⏳ Waiting for preview server to be ready...')
    try {
      await waitForServer(PREVIEW_URL)
      console.log('✅ Preview server ready\n')
    } catch (err) {
      throw new Error(`Failed to start preview server: ${err.message}`)
    }

    // Step 4: Run prerender
    console.log('4️⃣  Rendering static HTML for all 19 routes...')
    // Run prerender with PRERENDER_URL environment variable
    execSync('node scripts/prerender-for-build.mjs', {
      cwd: projectRoot,
      stdio: 'inherit',
      env: { ...process.env, PRERENDER_URL: PREVIEW_URL }
    })
    console.log('✅ Prerender complete\n')

    // Step 5: Stop preview server
    console.log('5️⃣  Stopping preview server...')
    if (previewProcess) {
      previewProcess.kill()
      await new Promise(r => setTimeout(r, 1000))
    }
    console.log('✅ Preview server stopped\n')

    // Step 6: Validate
    console.log('6️⃣  Validating prerendered files...')
    execSync('node scripts/validate-prerender.mjs', {
      cwd: projectRoot,
      stdio: 'inherit'
    })
    console.log('✅ Validation complete\n')

    console.log('═══════════════════════════════════════════════════════════════')
    console.log('✅ BUILD AND PRERENDER PIPELINE COMPLETE')
    console.log('═══════════════════════════════════════════════════════════════\n')

  } catch (err) {
    console.error('\n❌ PIPELINE FAILED:', err.message)
    if (previewProcess) {
      previewProcess.kill()
    }
    process.exit(1)
  }
}

buildAndPrerender()
