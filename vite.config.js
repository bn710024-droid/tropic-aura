import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // autorise le host du tunnel cloudflared (quick tunnel) — test iPhone sans Vercel
    allowedHosts: ['.trycloudflare.com'],
  },
})
