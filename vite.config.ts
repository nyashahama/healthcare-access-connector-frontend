import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'

export default defineConfig({
  server: {
    port: 3000,
  },
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
    },
  },
  plugins: [
    tanstackStart({
      tsr: {
        appDirectory: 'src',
      },
    }),
    viteReact(),
  ],
})
