import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'hakai',
    isolate: false,
    exclude: ['tests/animez.test.ts'],
    environment: 'node',
    testTimeout: 5000,
  },
});
