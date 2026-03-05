import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/CHUCKCHARGING/trip/',
  build: {
    outDir: '../trip',
    emptyOutDir: true,
  },
})
