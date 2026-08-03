import { resolve } from 'node:path';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';

export default defineConfig({
	main: {
		plugins: [
			externalizeDepsPlugin(),
		],
		build: {
			rollupOptions: {
				input: resolve(__dirname, 'src/main/index.ts'),
			},
		},
	},
});
