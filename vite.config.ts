import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: process.env.GITHUB_PAGES ? '/clock-app/' : '/',
  plugins: [react()],
  server: {
    host: true,
  },
})
