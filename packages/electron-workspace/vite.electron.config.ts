import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		lib: {
			entry: resolve(__dirname, 'src/electron/preload/workspace-preload.ts'),
			formats: [
				'cjs',
			],
			fileName: () => 'workspace-preload.js',
		},
		outDir: resolve(__dirname, 'src/electron/preload'),
		emptyOutDir: false,
		rollupOptions: {
			external: [
				'electron',
				'webitel-sdk',
				'baresip-node',
			],
		},
	},
});
