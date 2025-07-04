import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import dotenv from 'dotenv';

dotenv.config(); // ✅ Load .env file

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': process.env.VITE_SERVER_URL || 'http://localhost:5000', // ✅ Fallback to localhost in dev
    },
  },
});
