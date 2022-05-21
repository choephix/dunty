import path from 'path'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

console.log(`right`)
console.log(path.resolve(__dirname, './src/'))

export default defineConfig({
  root: 'src/client',
  // plugins: [tsconfigPaths()],
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, './src/') },
    ],
  },
})
