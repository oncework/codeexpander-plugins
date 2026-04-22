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

const submoduleDir = join(__dirname, 'blockbench')

console.log('Installing dependencies...')
execSync('npm install', { cwd: submoduleDir, stdio: 'inherit' })

console.log('Building blockbench...')
execSync('npm run build-web', { cwd: submoduleDir, stdio: 'inherit' })

const distDir = join(__dirname, 'dist')

console.log('Copying build artifacts to dist...')
if (existsSync(distDir)) rmSync(distDir, { recursive: true, force: true })

// Blockbench web build outputs to the root directory
cpSync(join(submoduleDir, 'index.html'), join(distDir, 'index.html'))
cpSync(join(submoduleDir, 'css'), join(distDir, 'css'), { recursive: true })
cpSync(join(submoduleDir, 'font'), join(distDir, 'font'), { recursive: true })
cpSync(join(submoduleDir, 'assets'), join(distDir, 'assets'), { recursive: true })
cpSync(join(submoduleDir, 'dist'), join(distDir, 'dist'), { recursive: true })
cpSync(join(submoduleDir, 'favicon.png'), join(distDir, 'favicon.png'))

removeMapFiles(distDir)
console.log('Sourcemap files removed')

const pluginJson = JSON.parse(readFileSync(join(__dirname, 'plugin.json'), 'utf-8'))
pluginJson.main = 'index.html'
writeFileSync(join(distDir, 'plugin.json'), JSON.stringify(pluginJson, null, 2))

console.log('Build completed successfully!')
