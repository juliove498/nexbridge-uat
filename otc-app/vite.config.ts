import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import wasm from 'vite-plugin-wasm';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    wasm(),
    {
      name: 'copy-index-to-404',
      writeBundle() {
        const outDir = path.resolve(__dirname, '../otc-uat');
        const src = path.join(outDir, 'index.html');
        if (fs.existsSync(src)) {
          fs.copyFileSync(src, path.join(outDir, '404.html'));
          console.log('✓ Copied index.html → 404.html for SPA fallback');
        }
      },
    },
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  base: '/otc-uat/',
  build: {
    outDir: '../otc-uat',
    emptyOutDir: true,
    target: 'esnext',
  },
  optimizeDeps: {
    exclude: ['lwk_wasm'],
  },
  server: {
    port: 5173,
  },
});
