#!/usr/bin/env node

import { execSync } from 'child_process'
import { existsSync, rmSync, cpSync, readFileSync, writeFileSync, readdirSync, statSync, unlinkSync } from 'fs'
import { join } from 'path'

const __dirname = import.meta.dirname

function removeMapFiles(dir) {
  const entries = readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = join(dir, entry.name)
    if (entry.isDirectory()) {
      removeMapFiles(fullPath)
    } else if (entry.name.endsWith('.map')) {
      unlinkSync(fullPath)
    }
  }
}

const submoduleDir = join(__dirname, 'mermaid-live-editor')

// Install dependencies
console.log('Installing dependencies...')
execSync('CI=true pnpm install --ignore-workspace', { cwd: submoduleDir, stdio: 'inherit' })

// Build project
console.log('Building mermaid-live-editor...')
execSync('CI=true pnpm run build', { cwd: submoduleDir, stdio: 'inherit' })

// Define source and destination paths
// mermaid-live-editor uses adapter-static with pages: 'docs'
const sourceDir = join(__dirname, 'mermaid-live-editor', 'docs')
const distDir = join(__dirname, 'dist')

// Clean and create dist directory
console.log('Copying build artifacts to dist...')

if (existsSync(distDir)) {
  rmSync(distDir, { recursive: true, force: true })
}

if (existsSync(sourceDir)) {
  cpSync(sourceDir, distDir, { recursive: true })

  // Remove all .map files from dist directory
  console.log('Removing sourcemap files...')
  removeMapFiles(distDir)
  console.log('Sourcemap files removed')

  // Copy plugin.json into dist and update main field
  console.log('Copying plugin.json to dist...')
  const pluginJson = JSON.parse(readFileSync(join(__dirname, 'plugin.json'), 'utf-8'))
  pluginJson.main = 'index.html'
  writeFileSync(
    join(distDir, 'plugin.json'),
    JSON.stringify(pluginJson, null, 2)
  )

  console.log('Build completed successfully!')
} else {
  console.error('Error: Build output directory not found!')
  console.error(`Expected: ${sourceDir}`)
  process.exit(1)
}
