import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/socket.io': {
        target: 'https://admin-2-sooty.vercel.app/',
        ws: true,
        changeOrigin: true
      }
    }
  }
    
})
