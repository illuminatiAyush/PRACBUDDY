import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import localFilesPlugin from './vite-plugin-local-files.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    localFilesPlugin('./MPMC codea'),
  ],
})
