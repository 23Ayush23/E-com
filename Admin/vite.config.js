import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/socket.io': {
        target: 'https://e-com-psm5.onrender.com',
        ws: true,
        changeOrigin: true
      }
    }
  }
    
})
