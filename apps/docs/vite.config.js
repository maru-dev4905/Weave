import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages 프로젝트 사이트: https://<user>.github.io/<repo>/
const ghPagesBase =
  process.env.GITHUB_ACTIONS === 'true' && process.env.GITHUB_REPOSITORY
    ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}/`
    : '/'

// https://vite.dev/config/
export default defineConfig({
  base: ghPagesBase,
  plugins: [react()],
})
