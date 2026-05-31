import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Ensures relative assets path for GitHub Pages
  build: {
    outDir: 'docs', // Builds to docs/ folder so GitHub Pages can host it directly
  }
})


