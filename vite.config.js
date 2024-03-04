import vue from '@vitejs/plugin-vue';
import { defineConfig, loadEnv } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { VitePWA } from 'vite-plugin-pwa';
import createSvgSpritePlugin from 'vite-plugin-svg-sprite';
import basicSsl from '@vitejs/plugin-basic-ssl';

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return defineConfig({
    base: 'workspace',
    define: {
      'process.env': JSON.parse(JSON.stringify(env)
      .replaceAll('VITE_', 'VUE_APP_')),
    },
    server: {
      port: 8080,
      // https: true,
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "./src/app/css/main.scss";`,
        },
      },
    },
    resolve: {
      alias: {
        vue: '@vue/compat',
      },
    },
    plugins: [
      // basicSsl(),
      vue({
        template: {
          compilerOptions: {
            compatConfig: {
              MODE: 2,
            },
          },
        },
      }),
      // https://www.npmjs.com/package/vite-plugin-node-polyfills
      nodePolyfills({
        // are needed for csv-parse
        include: ['buffer', 'stream'],
        globals: {
          Buffer: true, // can also be 'build', 'dev', or false
        },
      }),
      createSvgSpritePlugin({
        include: '**/sprite/*.svg',
      }),
      // https://webitel.atlassian.net/browse/WTEL-4240
      VitePWA({
        registerType: 'autoUpdate',
        strategies: 'injectManifest',
        // base: 'workspace',
        base: '',
        srcDir: 'src/app/serviceworker',
        filename: 'sw.js',
        injectRegister: 'inline',
        devOptions: {
          enabled: true,
          type: 'module',
        },
        manifest: {
          icons: [
            {
              'src': '/workspace/pwa-192x192.png',
              'sizes': '144x144',
              'type': 'image/png',
              'purpose': 'any',
            },
            {
              'src': '/workspace/pwa-192x192.png',
              'sizes': '192x192',
              'type': 'image/png',
              'purpose': 'any',
            },
            {
              'src': '/workspace/pwa-512x512.png',
              'sizes': '512x512',
              'type': 'image/png',
              'purpose': 'any',
            },
            {
              'src': '/workspace/pwa-maskable-192x192.png',
              'sizes': '192x192',
              'type': 'image/png',
              'purpose': 'maskable',
            },
            {
              'src': '/workspace/pwa-maskable-512x512.png',
              'sizes': '512x512',
              'type': 'image/png',
              'purpose': 'maskable',
            },
          ],
        },
      }),
    ],
    test: {
      globals: true,
      coverage: {
        enabled: false,
        reporter: 'json',
      },
      alias: {
        /**
         * override the default alias vue -> vue/compat for dev and prod,
         * which is creating 2 vue instances while running tests :(
         */
        'vue': 'vue',
      },
      environment: 'happy-dom',
      setupFiles: ['./tests/config/config.js'],
    },
  });
}
