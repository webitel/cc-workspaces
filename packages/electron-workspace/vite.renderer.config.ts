import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
	root: resolve(__dirname, 'src/ui/call'),
	plugins: [
		vue(),
	],
	build: {
		outDir: resolve(__dirname, 'src/renderer/call-vue'),
		emptyOutDir: true,
	},
});
