import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
<<<<<<< HEAD
  server: {
    port: 5173,
    hmr: {
      host: 'localhost',
      port: 5173,
=======
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
>>>>>>> cf7a9b2fe1ecdf81ccb484856c73e10b4736136a
    },
  },
})
