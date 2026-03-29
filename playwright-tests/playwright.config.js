const { defineConfig } = require('@playwright/test')

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry'
  },
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1 --port 5173',
    cwd: '..',
    url: 'http://localhost:5173',
    reuseExistingServer: true
  }
})
