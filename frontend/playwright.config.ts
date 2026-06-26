import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,   // tests comparten DynamoDB local, mejor en serie
  retries: 0,
  workers: 1,
  reporter: 'html',

  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },

  // Solo Chromium para dev — rápido y suficiente
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Asume que Vite y el backend ya están corriendo
  // NO arranca servidores automáticamente
});
