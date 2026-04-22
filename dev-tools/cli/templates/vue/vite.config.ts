import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  base: "./",
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: { input: path.resolve(__dirname, "index.html") },
  },
  plugins: [vue()],
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
});
