import { defineConfig } from 'tsup';

export default defineConfig({
  format: ['esm'],
  entry: ['./src/index.ts'],
  dts: true,
  shims: true,
  clean: true,
  splitting: true,
  sourcemap: true,
});
