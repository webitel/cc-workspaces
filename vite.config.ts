import basicSsl from '@vitejs/plugin-basic-ssl';
import vue from '@vitejs/plugin-vue';
import { defineConfig, loadEnv } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { VitePWA } from 'vite-plugin-pwa';
import vueDevtools from 'vite-plugin-vue-devtools';
import { resolve } from 'path';

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return defineConfig({
    base: '/workspace',
    define: {
      'process.env': JSON.parse(
        JSON.stringify(env).replaceAll('VITE_', 'VUE_APP_'),
      ),
    },
    server: {
      port: 8080,
      host: true,
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern',
        },
      },
    },
    resolve: {
      alias: {
        vue: '@vue/compat',
        'lodash/fp': 'lodash-es',
        lodash: 'lodash-es',
        '@': resolve(__dirname, 'src'),
        '@aliasedDeps/api-services/axios': resolve(__dirname, 'src/app/api/instance'),
      },
    },
    optimizeDeps: {
      include: ['clipboard-copy', 'deep-equal', 'deepmerge'],
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
      vueDevtools({
        launchEditor: 'webstorm',
      }),
      // https://www.npmjs.com/package/vite-plugin-node-polyfills
      nodePolyfills({
        // are needed for csv-parse
        include: ['buffer', 'stream'],
        globals: {
          Buffer: true, // can also be 'build', 'dev', or false
        },
      }),
      // https://webitel.atlassian.net/browse/WTEL-4240
      VitePWA({
        registerType: 'autoUpdate',
        strategies: 'injectManifest',
        base: mode === 'development' ? 'workspace' : undefined,
        srcDir: 'src/app/serviceworker',
        filename: 'sw.js',
        injectRegister: 'inline',
        injectManifest: {
          enableWorkboxModulesLogs: false,
          maximumFileSizeToCacheInBytes: 100 * 1024 * 1024, // 100mb instead of 2mb
          // injectionPoint: undefined, // https://webitel.atlassian.net/browse/WTEL-5434
        },
        // workbox: {
        //   disableDevLogs: true,
        //   maximumFileSizeToCacheInBytes: 100 * 1024 * 1024, // 100mb instead of 2mb
        //   // maximumFileSizeToCacheInBytes: 13, // 100mb instead of 2mb
        // },
        devOptions: {
          enabled: true,
          type: 'module',
        },
        manifest: {
          icons: [
            {
              src: '/workspace/pwa-192x192.png',
              sizes: '144x144',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/workspace/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/workspace/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/workspace/pwa-maskable-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'maskable',
            },
            {
              src: '/workspace/pwa-maskable-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
      }),
    ],
    test: {
      globals: true,
      // coverage: {
      //   enabled: false,
      //   reporter: 'json',
      // },
      alias: {
        /**
         * override the default alias vue -> vue/compat for dev and prod,
         * which is creating 2 vue instances while running tests :(
         */
        vue: 'vue',
        lodash: 'lodash-es',
      },
      server: {
        deps: {
          inline: [/@webitel\/.*/],
        },
      },
      environment: 'happy-dom',
      setupFiles: ['./tests/config/config.js'],
    },
  });
};
