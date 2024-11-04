import path from 'path';
import { globbySync } from 'globby';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import createSvgSpritePlugin from 'vite-plugin-svg-sprite';
import vueDocgenPlugin from 'vite-plugin-vue-docgen';
import { defineConfig } from 'vitepress';
import { nav, sidebar } from './routes.js';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Webitel Workspace',
  description: 'webitel workspace docs',
  base: '/workspace/',
  head: [
    [
      'link',
      {
        rel: 'icon',
        href: 'data:image/svg+xml,<svg xmlns="%22http://www.w3.org/2000/svg%22" viewBox="%220" 0 100 100%22><text y="%22.9em%22" font-size="%2290%22">🚀</text></svg>',
      },
    ],
  ],
  lastUpdated: true,
  // // https://github.com/vuejs/vitepress/discussions/3590#discussioncomment-8541603
  // transformPageData: (pageData) => {
  //   console.log(pageData);
  //   return pageData;
  // },
  vite: {
    resolve: {
      alias: [
        { find: '__lib__', replacement: path.resolve(__dirname, '../../src') },

        // https://webitel.atlassian.net/browse/WTEL-5425?focusedCommentId=637600
        {
          find: '@webitel/ui-sdk/dist/ui-sdk.js',
          replacement: path.resolve(__dirname, '../../node_modules/@webitel/ui-sdk/src/install.js'),
        },
        {
          find: '@webitel/ui-sdk',
          replacement: path.resolve(__dirname, '../../node_modules/@webitel/ui-sdk'),
        },
      ],
    },
    ssr: {
      noExternal: ['@vuelidate/core', 'vue-multiselect', 'webitel-sdk'],
    },
    optimizeDeps: {
      include: [
        'clipboard-copy',
        'lodash/debounce.js',
        'lodash',
        'deep-copy',
      ],
    },
    plugins: [
      nodePolyfills({
        globals: {
          process: true,
        },
      }),

      // viteStaticCopy({
      //   targets: [
      //     {
      //       src: path.resolve(__dirname, '../../src/assets/icons/plyr.svg'),
      //       dest: 'img',
      //     },
      //   ],
      // }),
      createSvgSpritePlugin({
        include: '**/sprite/*.svg',
      }),
      (() => {
        const docgen = vueDocgenPlugin({
          include: globbySync(['src/**/*.vue']),
          injectAt: 'docs',
        });
        // dunno why, but default enforce value breaks build
        docgen.enforce = null;
        return docgen;
      })(),
    ],
  },

  // additionalData: `@import "../../src/css/main.scss";`,
  themeConfig: {
    search: { provider: 'local' },
    // https://vitepress.dev/reference/default-theme-config
    nav,
    sidebar,

    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/webitel/cc-workspaces',
      },
    ],
    // https://vitepress.dev/reference/default-theme-edit-link#site-level-config
    editLink: {
      // https://vitepress.dev/reference/runtime-api#usedata
      pattern: 'https://github.com/webitel/cc-workspaces/tree/master/docs/:path',
    },
  },
});
