import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/socket.io': {
        target: 'http://localhost:2500',
        ws: true,
        changeOrigin: true
      }
    }
  }
    
})
