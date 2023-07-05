import { defineConfig } from 'vite'
import { crx } from '@crxjs/vite-plugin'
import manifest from './src/manifest'

export default defineConfig({
  root: 'src',
  build: { outDir: '../dist', emptyOutDir: true },
  plugins: [crx({ manifest })],
})
