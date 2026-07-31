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
				// @webitel/ui-sdk components are authored for Vue 2 compat mode
				vue: '@vue/compat',
				// ui-sdk dist expects the consumer to provide the axios instance
				'@aliasedDeps/api-services/axios': resolve(
					__dirname,
					'src/renderer/shared/api/instance',
				),
			},
			dedupe: [
				'@vue/compat',
			],
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
					compilerOptions: {
						compatConfig: {
							MODE: 2,
							// avoid Vue2 compat v-model warnings
							COMPONENT_V_MODEL: false,
							// avoid warnings when using boolean attributes
							ATTR_FALSE_VALUE: false,
						},
						isCustomElement: (tag) => tag.startsWith('media-'),
					},
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
