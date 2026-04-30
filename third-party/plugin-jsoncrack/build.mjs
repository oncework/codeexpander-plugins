#!/usr/bin/env zx

import { cd, $ } from "zx";
import { existsSync, rmSync, cpSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { glob } from "glob";

const __dirname = import.meta.dirname;

// Enter jsoncrack directory
cd(join(__dirname, "jsoncrack"));

// Install dependencies
console.log("Installing dependencies...");
await $`npm_config_engine_strict=false CI=true pnpm install --force`;

// Build project
console.log("Building project...");
await $`CI=true pnpm run build`;

// Copy out directory to dist
const outDir = join(__dirname, "jsoncrack", "out");
const distDir = join(__dirname, "dist");

if (existsSync(outDir)) {
  console.log("Copying out directory to dist...");

  // Remove dist directory if it exists
  if (existsSync(distDir)) {
    rmSync(distDir, { recursive: true, force: true });
  }

  cpSync(outDir, distDir, { recursive: true });

  // Remove all .map files from dist directory
  console.log("Removing sourcemap files...");
  const mapFiles = await glob("**/*.map", { cwd: distDir, absolute: true });
  mapFiles.forEach((mapFile) => {
    rmSync(mapFile, { force: true });
  });
  console.log(`Removed ${mapFiles.length} sourcemap file(s)`);

  const pluginJson = JSON.parse(
    readFileSync(join(__dirname, "plugin.json"), "utf-8"),
  );
  pluginJson.main = "index.html";
  writeFileSync(
    join(distDir, "plugin.json"),
    JSON.stringify(pluginJson, null, 2),
  );

  console.log("Build completed successfully!");
} else {
  console.error("Error: out directory not found!");
  process.exit(1);
}
