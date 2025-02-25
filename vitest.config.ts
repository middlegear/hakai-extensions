import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'hakai-extensions',
    isolate: true,
    environment: 'node',
    testTimeout: 20000,
  },
});
