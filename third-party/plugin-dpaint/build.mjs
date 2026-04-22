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

const sourceDir = join(__dirname, 'DPaint-js')
const distDir = join(__dirname, 'dist')

const resourcesToCopy = [
  '_img',
  '_font',
  '_data',
  '_script',
  '_style',
  'manifest.json',
  'index.html',
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

removeMapFiles(distDir)

const pluginJson = JSON.parse(readFileSync(join(__dirname, 'plugin.json'), 'utf-8'))
pluginJson.main = 'index.html'
writeFileSync(join(distDir, 'plugin.json'), JSON.stringify(pluginJson, null, 2))
console.log('Build completed successfully!')
