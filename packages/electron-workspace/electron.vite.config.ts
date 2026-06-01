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
				},
			},
		},
	},
	renderer: {
		root: resolve(__dirname, 'src/renderer'),
		base: './',
		resolve: {
			alias: {
				'@img': resolve(__dirname, 'img'),
			},
		},
		server: {
			fs: {
				allow: [
					resolve(__dirname),
				],
			},
		},
		plugins: [
			vue({
				template: {
					transformAssetUrls: {
						includeAbsolute: false,
						tags: {
							input: [
								'src',
							],
						},
					},
				},
			}),
		],
		build: {
			rollupOptions: {
				input: {
					call: resolve(__dirname, 'src/renderer/windows/call/index.html'),
					'load-config': resolve(
						__dirname,
						'src/renderer/windows/load-config/index.html',
					),
					disconnect: resolve(
						__dirname,
						'src/renderer/windows/disconnect/index.html',
					),
					'err-message': resolve(
						__dirname,
						'src/renderer/windows/err-message/index.html',
					),
				},
			},
		},
	},
});
