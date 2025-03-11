import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: process.env.PORT || 5174,
    host: "0.0.0.0",
    strictPort: true,
    allowedHosts: ["e-com-1-glqf.onrender.com"], // Allow your deployed Render domain
  }
})
