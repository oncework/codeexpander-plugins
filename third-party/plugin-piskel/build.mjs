#!/usr/bin/env zx

import { $, cd } from "zx";
import { existsSync, rmSync, cpSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import chalk from "chalk";

const __dirname = import.meta.dirname;

// Enter piskel directory
cd(join(__dirname, "piskel"));

// Install dependencies
console.log("Installing dependencies...");
await $`CI=true npm install`;

// Build project
console.log("Building piskel...");
await $`CI=true npm run build`;

// Return to parent directory
cd(__dirname);

// Clean and create dist directory
const sourceDir = join(__dirname, "piskel/dest/prod");
const distDir = join(__dirname, "dist");

console.log("Copying build artifacts to dist...");
if (existsSync(distDir)) {
  rmSync(distDir, { recursive: true, force: true });
}

// Copy build artifacts to dist directory
if (existsSync(sourceDir)) {
  cpSync(sourceDir, distDir, { recursive: true });

  const pluginJson = JSON.parse(
    readFileSync(join(__dirname, "plugin.json"), "utf-8"),
  );
  pluginJson.main = "index.html";
  writeFileSync(
    join(distDir, "plugin.json"),
    JSON.stringify(pluginJson, null, 2),
  );

  console.log(chalk.green("✓ Build completed successfully!"));
} else {
  console.error("Error: Build output directory not found!");
  console.error("Expected: " + sourceDir);
  process.exit(1);
}
