import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages serves the site from /todo-notebook/ (build + preview), local dev from /
export default defineConfig(({ command, isPreview }) => ({
  base: command === 'build' || isPreview ? '/todo-notebook/' : '/',
  plugins: [react()],
}))
