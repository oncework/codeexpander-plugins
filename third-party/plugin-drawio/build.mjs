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

const sourceDir = join(__dirname, 'drawio/src/main/webapp')
const distDir = join(__dirname, 'dist')

const resourcesToCopy = [
  'images',
  'img',
  'plugins',
  'resources',
  'templates',
  'mxgraph',
  'math4',
  'META-INF',
  'WEB-INF',
  'connect',
  'favicon.ico',
  'export-fonts.css',
  'shortcuts.svg',
  'monday-app-association.json',
  'service-worker.js',
  'service-worker.js.map',
  'workbox-05b6c01b.js',
  'workbox-05b6c01b.js.map',
  'workbox-acfd85e3.js',
  'workbox-acfd85e3.js.map',
]

const htmlFiles = [
  'index.html',
  'clear.html',
  'dropbox.html',
  'export3.html',
  'github.html',
  'gitlab.html',
  'onedrive3.html',
  'open.html',
  'teams.html',
  'vsdxImporter.html',
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

for (const htmlFile of htmlFiles) {
  const sourcePath = join(sourceDir, htmlFile)
  const destPath = join(distDir, htmlFile)
  if (existsSync(sourcePath)) {
    cpSync(sourcePath, destPath)
  }
}

// Copy styles and js directories
const stylesDir = join(sourceDir, 'styles')
const jsDir = join(sourceDir, 'js')
if (existsSync(stylesDir)) cpSync(stylesDir, join(distDir, 'styles'), { recursive: true })
if (existsSync(jsDir)) cpSync(jsDir, join(distDir, 'js'), { recursive: true })

removeMapFiles(distDir)

const pluginJson = JSON.parse(readFileSync(join(__dirname, 'plugin.json'), 'utf-8'))
pluginJson.main = 'index.html'
writeFileSync(join(distDir, 'plugin.json'), JSON.stringify(pluginJson, null, 2))
console.log('Build completed successfully!')
