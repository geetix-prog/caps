import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  server: {
    watch: {
      ignored: [
        '**/pb/pb_data/**',
        '**/*.db',
        '**/*.db-shm',
        '**/*.db-wal',
      ],
    },
  },
})