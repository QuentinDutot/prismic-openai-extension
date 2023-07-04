import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        background: 'src/scripts/background.ts',
        content: 'src/scripts/content.ts',
        popup: 'src/scripts/popup.ts',
      },
      output: {
        entryFileNames: (chunk) => `scripts/${chunk.name}.js`,
      },
    },
  },
})
