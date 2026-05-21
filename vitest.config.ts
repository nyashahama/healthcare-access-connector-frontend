import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'
import viteReact from '@vitejs/plugin-react'

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      components: resolve(__dirname, 'src/components'),
      layouts: resolve(__dirname, 'src/layouts'),
      views: resolve(__dirname, 'src/views'),
      hooks: resolve(__dirname, 'src/hooks'),
      platform: resolve(__dirname, 'src/platform'),
      api: resolve(__dirname, 'src/api'),
      context: resolve(__dirname, 'src/context'),
      utils: resolve(__dirname, 'src/utils'),
      assets: resolve(__dirname, 'src/assets'),
      test: resolve(__dirname, 'src/test'),
    },
  },
  plugins: [viteReact()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
  },
})
