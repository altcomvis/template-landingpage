import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  base:
    mode === 'production'
      ? 'https://s3.glbimg.com/v1/AUTH_87d42e7b2a034c7ba871ec4d2695d73d/oglobo-globo-com/projetos/NOMEPROJETO/'
      : '/',
  build: {
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name][extname]',
      },
    },
  },
}))
