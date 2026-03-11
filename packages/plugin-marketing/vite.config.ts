import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
export default defineConfig({
  base: "./",
  build: { outDir: "dist", emptyOutDir: true, rollupOptions: { input: path.resolve(__dirname, "index.html") } },
  plugins: [react()],
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
});
