import { defineConfig } from 'vite'

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    rollupOptions: {
      input: 'public/index.html'
    }
  },
  server: {
    port: 5173,
    open: true
  }
})
