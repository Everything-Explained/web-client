import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
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
