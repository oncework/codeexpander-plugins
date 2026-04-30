#!/usr/bin/env zx

import { $, cd } from "zx";
import { existsSync, rmSync, cpSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { glob } from "glob";

const __dirname = import.meta.dirname;

// Build svgedit and copy output to dist directory
cd(join(__dirname, "svgedit"));

// Install dependencies
console.log("Installing dependencies...");
await $`CI=true pnpm install --ignore-workspace`;

// Build the project
console.log("Building svgedit...");
await $`CI=true pnpm run build`;

// Go back to parent directory
cd(__dirname);

// Define source and destination paths
const sourceDir = join(__dirname, "svgedit", "dist", "editor");
const distDir = join(__dirname, "dist");

// Remove existing dist directory if it exists
console.log("Copying build artifacts to dist...");

if (existsSync(distDir)) {
  rmSync(distDir, { recursive: true, force: true });
}

// Copy dist/editor to dist
if (existsSync(sourceDir)) {
  cpSync(sourceDir, distDir, { recursive: true });

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
  console.error("Error: Build output directory not found!");
  process.exit(1);
}
