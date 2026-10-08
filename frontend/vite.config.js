import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
     tailwindcss(),
     
  ],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000", // غيّر البورت لبورت الـ backend عندك
        changeOrigin: true,
      },
    },
  },
})
