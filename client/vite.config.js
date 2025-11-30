import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Proxy `/api` requests to the backend server (default port 5000).
    // This ensures fetch('/api/...') from the client is forwarded to the API
    // rather than being served by the Vite dev server.
    proxy: {
      '/api': {
        //target: 'http://127.0.0.1:5000',
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
        // keep the path as-is, so /api/spots -> http://127.0.0.1:5000/api/spots
      },
    },
  }
})
