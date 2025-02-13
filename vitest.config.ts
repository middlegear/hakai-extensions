import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'webscrapper',
    isolate: false,
    environment: 'node',
    testTimeout: 5000,
  },
});
