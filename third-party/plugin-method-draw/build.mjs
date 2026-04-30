#!/usr/bin/env zx

import { cd, $ } from "zx";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const __dirname = import.meta.dirname;

// Build Method-Draw and copy output to dist directory
cd(join(__dirname, "Method-Draw"));

// Install dependencies
await $`npm i`;

// Build the project using gulp
await $`npx gulp build`;

// Go back to parent directory
cd(__dirname);

// Remove existing dist directory if it exists
await $`rm -rf dist`;

// Copy dist directory
await $`cp -r Method-Draw/dist dist`;

// Write plugin.json
const distDir = join(__dirname, "dist");
const pluginJson = JSON.parse(
  readFileSync(join(__dirname, "plugin.json"), "utf-8"),
);
pluginJson.main = "index.html";
writeFileSync(
  join(distDir, "plugin.json"),
  JSON.stringify(pluginJson, null, 2),
);

console.log("Build completed successfully!");
