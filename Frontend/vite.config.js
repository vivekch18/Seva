import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': `${import.meta.env.VITE_SERVER_URL}`, // 👈 Replace 5000 with your actual backend port if different
    },
  },
});
