import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss()],
  server: {
    port: process.env.PORT || 5173,  // Match frontend port for consistency
    host: "0.0.0.0",
    strictPort: true,
    allowedHosts: ["e-com-1-glqf.onrender.com"], // Match frontend allowedHosts
    proxy: {
      '/socket.io': {
        target: 'http://localhost:2400',
        ws: true,
        changeOrigin: true
      }
    }
  }
})
