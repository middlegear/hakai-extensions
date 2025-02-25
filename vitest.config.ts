import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'hakai-extensions',
    environment: 'node',
    testTimeout: 20000, // slow 3g connection lol
  },
});
