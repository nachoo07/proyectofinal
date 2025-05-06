import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'

dotenv.config()

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': Object.fromEntries(
      // eslint-disable-next-line no-undef
      Object.entries(process.env).map(([key, val]) => [key, val])
    )
  },
})
