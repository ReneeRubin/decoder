import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// WICHTIG: base bleibt "/" (Wurzelverzeichnis), damit das Cloudflare-Pages-
// Standard-Preview (*.pages.dev) und die empfohlene Subdomain-Lösung
// (decoder.rueckenbewusst-sein.de) sofort ohne 404-Fehler bei den Assets
// funktionieren. Bei der Pfad-Variante (rueckenbewusst-sein.de/decoder,
// Option B in docs/alfahosting-domain-setup.md) muss dieser Wert wieder auf
// "/decoder/" gesetzt werden – siehe dortige Erklärung.
export default defineConfig({
  base: "/",
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
