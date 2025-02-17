import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'hakai',
    isolate: false,
    environment: 'node',
    testTimeout: 5000,
  },
});
