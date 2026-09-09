import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// Der Decoder wird unter /decoder ausgeliefert (siehe docs/alfahosting-domain-setup.md).
export default defineConfig({
  base: "/decoder/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
  },
});
