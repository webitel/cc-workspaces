import { createApp } from 'vue';
import deepmerge from 'deepmerge';
import App from './app/the-app.vue';
import router from './app/router';
import store from './app/store';
import i18n from './app/locale/i18n';

import WebitelUi from './app/plugins/webitel-ui';
import WebitelCCUI from './app/plugins/webitel-cc-ui';
import BreakpointPlugin from './app/plugins/breakpoint.plugin';

import './app/assets/icons/sprite';

const fetchConfig = async () => {
  const electronConfig = window._config || {}; // Electron sets config to window
  const fileResponse = await fetch(`${process.env.BASE_URL}config.json`);
  const fileConfig = (await fileResponse.json()) || {};
  const apiResponse = async () => {
    try {
      const response = await fetch('/api/user/settings/phone',{
        headers: {
          'X-Webitel-Access': localStorage.getItem('access-token') || '',
        },
      });
      const body = await response.json();
      return {
        CLI: {
          registerWebDevice: body.webrtc,
          stun: body.stun,
        },
      };
    } catch (error) {
      return {};
    }
  };
  return deepmerge(fileConfig, await apiResponse(), electronConfig);
};

const createVueInstance = () => {
  const app = createApp(App)
  .use(i18n)
  .use(router)
  .use(store)
  .use(...WebitelUi)
  .use(WebitelCCUI)
  .use(BreakpointPlugin);
  return app;
};

// init IIFE
(async () => {
  const config = await fetchConfig();
  store.dispatch('SET_CONFIG', config);
  localStorage.setItem('CONFIG', JSON.stringify(config));
  const app = createVueInstance();
  app.provide('$config', config);
  app.mount('#app');
})();
