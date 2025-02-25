import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'hakai-extensions',
    environment: 'node',
    testTimeout: 10000,
  },
});
