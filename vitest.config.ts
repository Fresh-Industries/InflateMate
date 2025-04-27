import { defineConfig } from 'vitest/config';
import { loadEnv } from 'vite';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  return {
    test: {
      environment: 'node',
      globals: true,
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, '.'),
      },
    },
  };
});