#!/usr/bin/env node
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

const sourceDir = join(__dirname, 'motionity/src')
const distDir = join(__dirname, 'dist')

const resourcesToCopy = ['assets', 'favicon.ico', 'meta.png']
const cssFiles = [
  'magic-check.min.css',
  'nice-select.css',
  'pickr.css',
  'range-slider.min.css',
  'styles.css',
]

if (existsSync(distDir)) rmSync(distDir, { recursive: true, force: true })

if (!existsSync(sourceDir)) {
  console.error('Source not found')
  process.exit(1)
}

for (const resource of resourcesToCopy) {
  const sourcePath = join(sourceDir, resource)
  const destPath = join(distDir, resource)
  if (existsSync(sourcePath)) {
    cpSync(sourcePath, destPath, { recursive: true })
  }
}

for (const cssFile of cssFiles) {
  const sourcePath = join(sourceDir, cssFile)
  const destPath = join(distDir, cssFile)
  if (existsSync(sourcePath)) {
    cpSync(sourcePath, destPath)
  }
}

const indexPath = join(sourceDir, 'index.html')
if (existsSync(indexPath)) {
  cpSync(indexPath, join(distDir, 'index.html'))
}

const jsDir = join(sourceDir, 'js')
if (existsSync(jsDir)) {
  cpSync(jsDir, join(distDir, 'js'), { recursive: true })
}

removeMapFiles(distDir)

const pluginJson = JSON.parse(readFileSync(join(__dirname, 'plugin.json'), 'utf-8'))
pluginJson.main = 'index.html'
writeFileSync(join(distDir, 'plugin.json'), JSON.stringify(pluginJson, null, 2))
console.log('Build completed successfully!')
