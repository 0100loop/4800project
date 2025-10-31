import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss({
      base: './src/index.css',
    })
  ],
  server: {
    port: 5173,
    // If you prefer proxy instead of hardcoding the URL in HomePage:
    // proxy: { '/api': { target: 'http://127.0.0.1:5000', changeOrigin: true } }
  }
})
