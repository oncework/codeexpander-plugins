import * as esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["src/index.js"],
  bundle: true,
  platform: "node",
  target: "node18",
  outfile: "dist/index.cjs",
  format: "cjs",
  banner: { js: "#!/usr/bin/env node" },
});
