import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('react') || id.includes('scheduler')) return 'react-vendor'
          if (id.includes('recharts')) return 'charts'
          if (id.includes('framer-motion') || id.includes('/motion/')) return 'motion'
          if (id.includes('lucide-react')) return 'icons'
          if (id.includes('axios')) return 'network'
        },
      },
    },
  },
})
