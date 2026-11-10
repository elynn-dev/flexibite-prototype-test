import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  // GitHub Pages serves the site from /flexibite-prototype-test/, so built files must be linked from there.
  // `npm run dev` keeps using the root.
  base: command === 'build' ? '/flexibite-prototype-test/' : '/',
}))
