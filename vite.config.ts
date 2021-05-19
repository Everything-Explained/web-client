import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve as pathResolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': pathResolve(__dirname, 'src')
    },
  },
  build: {
    cleanCssOptions: {
      level: 0,
    },
    terserOptions: {
      toplevel: true,
      ecma: 2018,
      format: {
        ecma: 2018,
        indent_level: 2,
      },
      compress: {
        drop_console: true,
        ecma: 2018,
      }
    }
  }
});
