#!/usr/bin/env node
/**
 * Publish plugins one by one for CodeExpander.
 *
 * Usage:
 *   node scripts/publish-plugins.mjs
 *   node scripts/publish-plugins.mjs --plugin=blockbench
 *   node scripts/publish-plugins.mjs --plugin=blockbench,drawio
 *   node scripts/publish-plugins.mjs --scope=third-party
 *   node scripts/publish-plugins.mjs --scope=plugins
 *   node scripts/publish-plugins.mjs --list
 *   node scripts/publish-plugins.mjs --build
 *   node scripts/publish-plugins.mjs --dry-run
 *   node scripts/publish-plugins.mjs --yes
 */

import { execSync } from 'child_process'
import { existsSync, readFileSync, readdirSync } from 'fs'
import { join } from 'path'
import readline from 'readline'

const ROOT = join(import.meta.dirname, '..')
const SCOPES = {
  'third-party': join(ROOT, 'third-party'),
  plugins: join(ROOT, 'plugins'),
  examples: join(ROOT, 'examples'),
}

const args = {
  plugin: parseArg('plugin'),
  scope: parseArg('scope'),
  list: hasArg('list'),
  build: hasArg('build'),
  dryRun: hasArg('dry-run'),
  yes: hasArg('yes'),
  tag: parseArg('tag'),
  access: parseArg('access') || 'public',
}

function parseArg(name) {
  const prefix = `--${name}=`
  const found = process.argv.find((a) => a.startsWith(prefix))
  return found ? found.slice(prefix.length) : undefined
}

function hasArg(name) {
  return process.argv.includes(`--${name}`)
}

function discoverPlugins() {
  const scopes = args.scope
    ? [args.scope].filter((s) => SCOPES[s])
    : Object.keys(SCOPES)

  const plugins = []

  for (const scope of scopes) {
    const dir = SCOPES[scope]
    if (!existsSync(dir)) continue

    const entries = readdirSync(dir, { withFileTypes: true })
      .filter((d) => d.isDirectory() && d.name.startsWith('plugin-'))
      .map((d) => ({
        scope,
        name: d.name,
        dir: join(dir, d.name),
        pkg: readPkg(join(dir, d.name)),
      }))

    plugins.push(...entries)
  }

  // Filter out private packages
  return plugins
    .filter((p) => p.pkg && p.pkg.private !== true)
    .sort((a, b) => a.pkg.name.localeCompare(b.pkg.name))
}

function readPkg(dir) {
  const path = join(dir, 'package.json')
  if (!existsSync(path)) return null
  try {
    return JSON.parse(readFileSync(path, 'utf-8'))
  } catch {
    return null
  }
}

function resolvePluginNames(input, allPlugins) {
  const raw = input.split(',').map((s) => s.trim()).filter(Boolean)
  const resolved = []
  for (const r of raw) {
    const shortName = r.startsWith('plugin-') ? r : `plugin-${r}`
    const found = allPlugins.find((p) => p.name === shortName)
    if (found) {
      resolved.push(found)
    } else {
      console.error(`Unknown plugin: ${r}`)
      console.error(
        `Available: ${allPlugins.map((p) => p.name.replace('plugin-', '')).join(', ')}`
      )
      process.exit(1)
    }
  }
  return resolved
}

function buildPlugin(plugin) {
  const shortName = plugin.name.replace('plugin-', '')
  console.log(`\n  🔨 Building ${shortName} ...`)
  try {
    execSync('pnpm run build', {
      cwd: plugin.dir,
      stdio: 'inherit',
      timeout: 600_000,
    })
    console.log(`  ✅ ${shortName} built successfully`)
    return true
  } catch (err) {
    console.error(`  ❌ ${shortName} build failed`)
    return false
  }
}

function publishPlugin(plugin) {
  const shortName = plugin.name.replace('plugin-', '')
  const publishArgs = ['pnpm publish']

  if (args.dryRun) {
    publishArgs.push('--dry-run')
  }
  if (args.tag) {
    publishArgs.push(`--tag ${args.tag}`)
  }
  if (args.access) {
    publishArgs.push(`--access ${args.access}`)
  }
  publishArgs.push('--no-git-checks')

  const cmd = publishArgs.join(' ')
  console.log(`\n  📦 Publishing ${plugin.pkg.name}@${plugin.pkg.version} ...`)
  console.log(`     ${cmd}`)

  try {
    execSync(cmd, {
      cwd: plugin.dir,
      stdio: 'inherit',
    })
    console.log(`  ✅ ${shortName} published successfully`)
    return true
  } catch (err) {
    console.error(`  ❌ ${shortName} publish failed`)
    return false
  }
}

async function askYesNo(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  const answer = await new Promise((resolve) => {
    rl.question(`${question} (y/n) `, (input) => {
      rl.close()
      resolve(input.trim().toLowerCase())
    })
  })
  return answer === 'y' || answer === 'yes'
}

async function interactiveSelect(allPlugins) {
  console.log('\n📋 Select plugins to publish (comma-separated numbers, or "all"):')
  allPlugins.forEach((p, i) => {
    console.log(`  ${i + 1}. ${p.scope}/\x1b[36m${p.name}\x1b[0m \x1b[90m(v${p.pkg.version})\x1b[0m`)
  })
  console.log('  0. all')

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  const answer = await new Promise((resolve) => {
    rl.question('\n> ', (input) => {
      rl.close()
      resolve(input.trim())
    })
  })

  if (answer === '0' || answer.toLowerCase() === 'all') {
    return allPlugins
  }

  const indices = answer.split(',').map((s) => parseInt(s.trim(), 10) - 1)
  const selected = indices
    .filter((i) => i >= 0 && i < allPlugins.length)
    .map((i) => allPlugins[i])

  return selected.length > 0 ? selected : allPlugins
}

async function main() {
  const allPlugins = discoverPlugins()

  if (allPlugins.length === 0) {
    console.log('No publishable plugins found.')
    return
  }

  // --list mode
  if (args.list) {
    console.log('\n📋 Publishable plugins:')
    for (const p of allPlugins) {
      console.log(
        `  ${p.scope}/\x1b[36m${p.name}\x1b[0m \x1b[90m${p.pkg.name}@v${p.pkg.version}\x1b[0m`
      )
    }
    console.log(`\nTotal: ${allPlugins.length}`)
    return
  }

  // Determine plugins to publish
  let plugins = []

  if (args.plugin) {
    plugins = resolvePluginNames(args.plugin, allPlugins)
  } else if (process.stdin.isTTY) {
    plugins = await interactiveSelect(allPlugins)
  } else {
    plugins = allPlugins
  }

  console.log(`\n🎯 Selected ${plugins.length} plugin(s) to publish:`)
  for (const p of plugins) {
    console.log(`  • ${p.scope}/${p.name} ${p.pkg.name}@v${p.pkg.version}`)
  }

  if (args.dryRun) {
    console.log('\n🏷️  Dry-run mode enabled (no actual publish)')
  }

  const results = { success: [], failed: [], skipped: [] }

  for (const plugin of plugins) {
    const shortName = plugin.name.replace('plugin-', '')
    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
    console.log(`📦 ${shortName} (${plugin.pkg.name}@v${plugin.pkg.version})`)
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)

    if (!args.yes) {
      const shouldContinue = await askYesNo(`Publish ${shortName}?`)
      if (!shouldContinue) {
        console.log(`  ⏭️  Skipped`)
        results.skipped.push(plugin)
        continue
      }
    }

    // Build if requested
    if (args.build) {
      const built = buildPlugin(plugin)
      if (!built) {
        results.failed.push(plugin)
        if (!args.yes) {
          const continueAfterFail = await askYesNo('Continue with next plugin?')
          if (!continueAfterFail) break
        }
        continue
      }
    }

    // Publish
    const published = publishPlugin(plugin)
    if (published) {
      results.success.push(plugin)
    } else {
      results.failed.push(plugin)
      if (!args.yes) {
        const continueAfterFail = await askYesNo('Continue with next plugin?')
        if (!continueAfterFail) break
      }
    }
  }

  // Summary
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  console.log(`📊 Publish Summary`)
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  console.log(`Success:  ${results.success.length}`)
  console.log(`Failed:   ${results.failed.length}`)
  console.log(`Skipped:  ${results.skipped.length}`)

  if (results.success.length > 0) {
    console.log(`\n✅ Published:`)
    for (const p of results.success) {
      console.log(`  ${p.pkg.name}@v${p.pkg.version}`)
    }
  }
  if (results.failed.length > 0) {
    console.log(`\n❌ Failed:`)
    for (const p of results.failed) {
      console.log(`  ${p.pkg.name}@v${p.pkg.version}`)
    }
  }
  if (results.skipped.length > 0) {
    console.log(`\n⏭️  Skipped:`)
    for (const p of results.skipped) {
      console.log(`  ${p.pkg.name}@v${p.pkg.version}`)
    }
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
