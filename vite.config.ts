import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      // Disabled this to allow for URL parameters
      strict: false,
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Group markdown-related dependencies into a separate chunk
          'markdown-editor': [
            'react-markdown',
            'remark-gfm',
            'rehype-sanitize',
            'rehype-slug',
          ],
        }
      }
    }
  }
})
