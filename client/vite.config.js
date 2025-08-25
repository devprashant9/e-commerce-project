import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, 
    port: 5173
  },
  define: {
    'import.meta.env.VITE_PAYPAL_CLIENT_ID': `"${process.env.VITE_PAYPAL_CLIENT_ID}"`,
    'import.meta.env.VITE_API_URL': `"${process.env.VITE_API_URL || 'http://localhost:5000'}"`,
  }
})
