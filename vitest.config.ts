import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'webscrapper',
    environment: 'node',
    testTimeout: 20000,
  },
});
