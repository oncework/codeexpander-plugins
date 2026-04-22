#!/usr/bin/env node
import { execSync } from 'child_process'
import { existsSync, rmSync, cpSync, readFileSync, writeFileSync, readdirSync, statSync, unlinkSync } from 'fs'
import { join } from 'path'

const __dirname = import.meta.dirname

function removeMapFiles(dir) {
  const entries = readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = join(dir, entry.name)
    if (entry.isDirectory()) removeMapFiles(fullPath)
    else if (entry.name.endsWith('.map')) unlinkSync(fullPath)
  }
}

const submoduleDir = join(__dirname, 'svgedit')

console.log('Installing dependencies...')
execSync('CI=true pnpm install --ignore-workspace', { cwd: submoduleDir, stdio: 'inherit' })

console.log('Building svgedit...')
execSync('CI=true pnpm run build', { cwd: submoduleDir, stdio: 'inherit' })

const sourceDir = join(__dirname, 'svgedit/dist/editor')
const distDir = join(__dirname, 'dist')

console.log('Copying build artifacts to dist...')
if (existsSync(distDir)) rmSync(distDir, { recursive: true, force: true })

if (existsSync(sourceDir)) {
  cpSync(sourceDir, distDir, { recursive: true })
  removeMapFiles(distDir)
  console.log('Sourcemap files removed')

  const pluginJson = JSON.parse(readFileSync(join(__dirname, 'plugin.json'), 'utf-8'))
  pluginJson.main = 'index.html'
  writeFileSync(join(distDir, 'plugin.json'), JSON.stringify(pluginJson, null, 2))

  console.log('Build completed successfully!')
} else {
  console.error('Error: Build output directory not found!')
  console.error('Expected: ' + sourceDir)
  process.exit(1)
}

