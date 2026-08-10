import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    proxy: {
      '/my-masjid-api': {
        target: 'https://time.my-masjid.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/my-masjid-api/, ''),
      },
    },
  },
});
