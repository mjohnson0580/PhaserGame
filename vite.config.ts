import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  // Relative base so the built `dist/` works from any path,
  // including when served by the "Live Server" VS Code extension.
  base: './',

  server: {
    port: 8080,
    open: true
  },

  build: {
    outDir: 'dist',
    // Source maps make debugging the built bundle much easier.
    sourcemap: true,
    rollupOptions: {
      output: {
        // Split the (large) Phaser library into its own cacheable chunk.
        manualChunks: (id) => (id.includes('node_modules/phaser') ? 'phaser' : undefined)
      }
    }
  }
});
