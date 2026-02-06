import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      include: ['src/**.{js,ts}']
    },
    dir: 'src/tests',
    maxWorkers: 1
  }
});