import { resolve } from 'node:path';
import vue from '@vitejs/plugin-vue';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';

export default defineConfig({
	main: {
		plugins: [
			externalizeDepsPlugin(),
		],
		build: {
			rollupOptions: {
				input: resolve(__dirname, 'src/main/index.js'),
			},
		},
	},
	preload: {
		plugins: [
			externalizeDepsPlugin(),
		],
		build: {
			rollupOptions: {
				input: {
					workspace: resolve(__dirname, 'src/preload/workspace.js'),
					call: resolve(__dirname, 'src/preload/call.js'),
				},
			},
		},
	},
	renderer: {
		root: resolve(__dirname, 'src/renderer'),
		plugins: [
			vue(),
		],
		build: {
			rollupOptions: {
				input: {
					'call-vue': resolve(__dirname, 'src/renderer/call-vue/index.html'),
				},
			},
		},
	},
});
