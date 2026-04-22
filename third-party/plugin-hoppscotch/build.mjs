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

const submoduleDir = join(__dirname, 'hoppscotch')
const selfhostWebDir = join(submoduleDir, 'packages', 'hoppscotch-selfhost-web')

// Copy .env.example to .env if .env doesn't exist
const envPath = join(submoduleDir, '.env')
const envExamplePath = join(submoduleDir, '.env.example')
if (!existsSync(envPath) && existsSync(envExamplePath)) {
  console.log('Creating .env from .env.example...')
  cpSync(envExamplePath, envPath)
}

// Modify main.ts to set extension as default interceptor for web
const mainTsPath = join(selfhostWebDir, 'src', 'main.ts')
if (existsSync(mainTsPath)) {
  console.log('Configuring web interceptor to use extension...')
  let mainTsContent = readFileSync(mainTsPath, 'utf-8')
  mainTsContent = mainTsContent.replace(
    /web:\s*{[\s\S]*?defaultInterceptor:\s*["']browser["']/,
    (match) => match.replace(/defaultInterceptor:\s*["']browser["']/, 'defaultInterceptor: "extension"')
  )
  writeFileSync(mainTsPath, mainTsContent, 'utf-8')
}

console.log('Installing dependencies...')
execSync('CI=true pnpm install --ignore-workspace', { cwd: submoduleDir, stdio: 'inherit' })

console.log('Building hoppscotch...')
execSync('CI=true pnpm run generate', { cwd: submoduleDir, stdio: 'inherit' })

const sourceDir = join(selfhostWebDir, 'dist')
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
