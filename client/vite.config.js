import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/My-PMO/',
  plugins: [
    tailwindcss(),
    react()
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/My-PMO/api': {
        target: 'http://127.0.0.1',
        changeOrigin: true
      },
      '/My-PMO/uploads': {
        target: 'http://127.0.0.1',
        changeOrigin: true
      }
    }
  }
})
