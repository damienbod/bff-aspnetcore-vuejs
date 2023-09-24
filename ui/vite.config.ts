import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    https: {
		key: fs.readFileSync('./certs/dev_localhost.key'),
		cert: fs.readFileSync('./certs/dev_localhost.pem'),
	},
    port: 4202,
    strictPort: true, // exit if port is in use
    hmr: {
      clientPort: 4202, // point vite websocket connection to vite directly, circumventing .net proxy
    },
  },
  optimizeDeps: {
    force: true,
  },
  build: {
    outDir: "../server/wwwroot",
    emptyOutDir: true
  },
})
