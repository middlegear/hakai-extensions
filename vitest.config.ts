import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'hakai',
    environment: 'node',
    testTimeout: 5000,
  },
});
