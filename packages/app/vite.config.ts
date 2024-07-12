import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteTsconfigPaths from 'vite-tsconfig-paths'
import svgr from '@svgr/rollup'
import topLevelAwait from 'vite-plugin-top-level-await'
import path from 'path'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  base: '/',
  define: {
    // here is the main update
    global: 'globalThis',
  },
  optimizeDeps: {
    exclude: ['@rollup/browser'],
    include: ['react', 'react-dom'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'node:child_process': 'node-stdlib-browser/mock/empty.js',
      'node:fs': 'node-stdlib-browser/mock/empty.js',
      'node:path': 'node-stdlib-browser/mock/empty.js',
      'node:os': 'node-stdlib-browser/mock/empty.js',
    },
  },
  plugins: [
    topLevelAwait(),
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin'],
      },
    }),
    viteTsconfigPaths(),
    svgr(),
    nodePolyfills(),
  ],
  server: {
    open: true,
    // this sets a default port to 3000
    port: 3000,
  },
})
