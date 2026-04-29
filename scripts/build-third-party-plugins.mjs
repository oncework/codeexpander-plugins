#!/usr/bin/env node
/**
 * Build third-party plugins for CodeExpander.
 *
 * Usage:
 *   node scripts/build-third-party-plugins.mjs
 *   node scripts/build-third-party-plugins.mjs --plugin=regex-vis
 *   node scripts/build-third-party-plugins.mjs --plugin=regex-vis,drawio,mermaid
 *   node scripts/build-third-party-plugins.mjs --list
 *   node scripts/build-third-party-plugins.mjs --force
 *   node scripts/build-third-party-plugins.mjs --parallel=4
 *   node scripts/build-third-party-plugins.mjs --verbose
 */

import { execSync } from "child_process";
import { existsSync, readFileSync, writeFileSync, readdirSync } from "fs";
import { join } from "path";
import readline from "readline";

const ROOT = join(import.meta.dirname, "..");
const PLUGINS_DIR = join(ROOT, "third-party");
const STATE_FILE = join(ROOT, ".build-state.json");

const args = {
  plugin: parseArg("plugin"),
  list: hasArg("list"),
  force: hasArg("force"),
  parallel: parseInt(parseArg("parallel") || "1", 10),
  verbose: hasArg("verbose"),
};

function parseArg(name) {
  const prefix = `--${name}=`;
  const found = process.argv.find((a) => a.startsWith(prefix));
  return found ? found.slice(prefix.length) : undefined;
}

function hasArg(name) {
  return process.argv.includes(`--${name}`);
}

function loadState() {
  if (existsSync(STATE_FILE)) {
    try {
      return JSON.parse(readFileSync(STATE_FILE, "utf-8"));
    } catch {
      return {};
    }
  }
  return {};
}

function saveState(state) {
  writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

function isThirdPartyPlugin(name) {
  const dir = join(PLUGINS_DIR, name);
  const entries = readdirSync(dir, { withFileTypes: true });
  return entries.some(
    (e) => e.isDirectory() && existsSync(join(dir, e.name, ".git")),
  );
}

function discoverPlugins() {
  return readdirSync(PLUGINS_DIR, { withFileTypes: true })
    .filter(
      (d) =>
        d.isDirectory() &&
        d.name.startsWith("plugin-") &&
        isThirdPartyPlugin(d.name),
    )
    .map((d) => d.name)
    .sort();
}

function resolvePluginNames(input, allPlugins) {
  const raw = input
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const resolved = [];
  for (const r of raw) {
    const name = r.startsWith("plugin-") ? r : `plugin-${r}`;
    if (allPlugins.includes(name)) {
      resolved.push(name);
    } else {
      console.error(`Unknown plugin: ${r}`);
      console.error(
        `Available: ${allPlugins.map((p) => p.replace("plugin-", "")).join(", ")}`,
      );
      process.exit(1);
    }
  }
  return resolved;
}

function buildPlugin(name) {
  const dir = join(PLUGINS_DIR, name);
  const shortName = name.replace("plugin-", "");

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`Building ${shortName} ...`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

  try {
    execSync("node ./build.mjs", {
      cwd: dir,
      stdio: args.verbose ? "inherit" : ["ignore", "inherit", "inherit"],
      timeout: 0,
    });
    console.log(`✅ ${shortName} built successfully`);
    return { success: true, time: Date.now() };
  } catch (err) {
    const msg =
      err.status !== null
        ? `exit code ${err.status}`
        : err.signal || "unknown error";
    console.error(`❌ ${shortName} failed (${msg})`);
    return { success: false, error: msg, time: Date.now() };
  }
}

async function runParallel(jobs, concurrency) {
  const results = [];
  const executing = [];

  for (const job of jobs) {
    const promise = job().then((r) => results.push(r));
    executing.push(promise);
    if (executing.length >= concurrency) {
      await Promise.race(executing);
      executing.splice(
        executing.findIndex((p) => p === promise),
        1,
      );
    }
  }
  await Promise.all(executing);
  return results;
}

async function interactiveSelect(allPlugins, state) {
  const choices = allPlugins.map((p, i) => {
    const short = p.replace("plugin-", "");
    const built = state[p]?.success;
    return `${i + 1}. ${built ? "✅" : "⬜"} ${short}`;
  });

  console.log('\nSelect plugins to build (comma-separated numbers, or "all"):');
  choices.forEach((c) => console.log(`  ${c}`));
  console.log("  0. all");

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const answer = await new Promise((resolve) => {
    rl.question("\n> ", (input) => {
      rl.close();
      resolve(input.trim());
    });
  });

  if (answer === "0" || answer.toLowerCase() === "all") {
    return allPlugins;
  }

  const indices = answer.split(",").map((s) => parseInt(s.trim(), 10) - 1);
  const selected = indices
    .filter((i) => i >= 0 && i < allPlugins.length)
    .map((i) => allPlugins[i]);

  return selected.length > 0 ? selected : allPlugins;
}

async function main() {
  const allPlugins = discoverPlugins();
  const state = loadState();

  if (allPlugins.length === 0) {
    console.log("No third-party plugins found.");
    return;
  }

  // --list mode
  if (args.list) {
    console.log("\nThird-party plugins:");
    for (const p of allPlugins) {
      const short = p.replace("plugin-", "");
      const built = state[p]?.success;
      const marker = built ? "✅" : "⬜";
      console.log(`  ${marker} ${short}`);
    }
    return;
  }

  // Determine plugins to build
  let plugins = [];

  if (args.plugin) {
    plugins = resolvePluginNames(args.plugin, allPlugins);
  } else if (process.stdin.isTTY) {
    plugins = await interactiveSelect(allPlugins, state);
  } else {
    plugins = allPlugins;
  }

  console.log(`\nSelected ${plugins.length} plugin(s):`);
  for (const p of plugins) {
    const short = p.replace("plugin-", "");
    const built = state[p]?.success;
    const marker = built && !args.force ? "✅" : "⬜";
    console.log(`  ${marker} ${short}`);
  }

  const toBuild = plugins.filter((p) => {
    if (args.force) return true;
    return !state[p]?.success;
  });

  if (toBuild.length === 0) {
    console.log(
      "\nAll selected plugins are already built. Use --force to rebuild.",
    );
    return;
  }

  console.log(
    `\nWill build ${toBuild.length} plugin(s) (parallel=${args.parallel}) ...`,
  );

  if (args.parallel > 1) {
    const jobs = toBuild.map((name) => () => {
      const result = buildPlugin(name);
      state[name] = result;
      saveState(state);
      return result;
    });
    await runParallel(jobs, args.parallel);
  } else {
    for (const name of toBuild) {
      const result = buildPlugin(name);
      state[name] = result;
      saveState(state);
    }
  }

  // Summary
  const success = toBuild.filter((p) => state[p]?.success);
  const failed = toBuild.filter((p) => !state[p]?.success);

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`Build Summary`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`Total:   ${toBuild.length}`);
  console.log(`Success: ${success.length}`);
  console.log(`Failed:  ${failed.length}`);

  if (failed.length > 0) {
    console.log(`\nFailed plugins:`);
    for (const p of failed) {
      console.log(
        `  ❌ ${p.replace("plugin-", "")} — ${state[p].error || "unknown"}`,
      );
    }
  }

  if (success.length > 0) {
    console.log(`\nSuccessful plugins:`);
    for (const p of success) {
      console.log(`  ✅ ${p.replace("plugin-", "")}`);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
