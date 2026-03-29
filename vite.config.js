import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/testSetup.js',
    include: ['src/**/*.test.{js,jsx,ts,tsx}'],
    exclude: ['playwright-tests/**']
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3003',
        changeOrigin: true
      }
    }
  }
})
