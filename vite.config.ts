import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  // Relative base so the built `dist/` works from any path,
  // including when served by the "Live Server" VS Code extension.
  base: './',

  server: {
    port: 8080,
    open: true,
    // Also listen on the LAN address so you can open the dev server on a
    // phone/tablet on the same network — the only realistic way to test
    // touch input and real mobile performance.
    host: true
  },

  build: {
    outDir: 'dist',
    // No source maps in production: they'd publish your full original source
    // alongside the game and add ~11 MB to every deploy. `npm run dev` always
    // has working source maps, so day-to-day debugging is unaffected.
    // Set to 'hidden' if you need maps for an error reporter (emitted, but not
    // referenced by the bundle), or true to debug the production build itself.
    sourcemap: false,
    rollupOptions: {
      output: {
        // Split the (large) Phaser library into its own cacheable chunk.
        manualChunks: (id) => (id.includes('node_modules/phaser') ? 'phaser' : undefined)
      }
    }
  }
});
