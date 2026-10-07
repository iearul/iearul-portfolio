import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    // three.js lives in the lazily loaded game chunk; it is big by nature.
    chunkSizeWarningLimit: 1500,
  },
})
