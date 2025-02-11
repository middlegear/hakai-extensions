import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'webscrapper',
    environment: 'node',
    testTimeout: 120000,
  },
});
