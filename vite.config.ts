import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/clock-app/',
  plugins: [react()],
  server: {
    host: true,
  },
})
