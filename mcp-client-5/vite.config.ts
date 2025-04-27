import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  if (mode === 'client-prod') {
    return {
      plugins: [react()], 
      define: {
        "process.env.NODE_ENV": '"production"',
      },
      build: {
        lib: {
          entry: [
            './src/entry-client.jsx',
          ],
          formats: ['es'],
          fileName: '[name]',
        },
        rollupOptions: {
          output: {
            dir: './public/static'
          }
        },
        emptyOutDir: false,
        copyPublicDir: false
      }
    }
  } else {
    return {
      plugins: [react()],
    }
  }
})
