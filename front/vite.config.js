import { defineConfig } from 'vite';
import legacy from '@vitejs/plugin-legacy';
import { config as dotenvConfig } from 'dotenv';

// Load environment variables from .env file
dotenvConfig();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    legacy({
      targets: ['defaults', 'not IE 11']
    })
  ],
// Vite automatically exposes variables prefixed with VITE_ to your frontend code via import.meta.env
  // Set base path if needed (e.g., for GitHub Pages deployment)
  base: './',
  build: {
    outDir: 'dist',
    // Generate source maps for better debugging
    sourcemap: true,
  },
  server: {
    // Open browser on server start
    open: true
  }
});

