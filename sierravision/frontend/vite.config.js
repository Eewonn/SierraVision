/**
 * Vite Configuration for SierraVision Frontend
 * ============================================
 * Development server configuration and build settings
 */

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  
  // Development server configuration
  server: {
    port: 5173,
    host: '0.0.0.0', // Allow external connections
    open: true, // Auto-open browser
    strictPort: true, // Fail if port is already in use
    
    // Proxy API requests to backend during development
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  
  // Build configuration
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'esbuild',
    
    // Rollup options for advanced build configuration
    rollupOptions: {
      output: {
        // Organize build output
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    }
  },
  
  // Preview server (for built app)
  preview: {
    port: 4173,
    host: true,
    strictPort: true
  },
  
  // Environment variables
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0')
  },
  
  // Resolve configuration
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname,
      '@components': new URL('./src/components', import.meta.url).pathname
    }
  }
})