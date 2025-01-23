import { createApp } from 'vue';
import deepmerge from 'deepmerge';
import App from './app/the-app.vue';
import router from './app/router';
import store from './app/store';
import i18n from './app/locale/i18n';

import WebitelUi from './app/plugins/webitel-ui';
import BreakpointPlugin from './app/plugins/breakpoint.plugin';

import './app/assets/icons/sprite';
import './app/css/main.scss'

const setTokenFromUrl = () => {
  try {
    const queryMap = window.location.search.slice(1)
    .split('&')
    .reduce((obj, query) => {
      const [key, value] = query.split('=');
      obj[key] = value;
      return obj;
    }, {});

    if (queryMap.accessToken) {
      localStorage.setItem('access-token', queryMap.accessToken);
    }
  } catch (err) {
    console.error('Error restoring token from url', err);
  }
};

const fetchConfig = async () => {
  const electronConfig = window._config || {}; // Electron sets config to window
  const fileResponse = await fetch(`${import.meta.env.BASE_URL}/config.json`);
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
  .use(BreakpointPlugin);
  return app;
};

// init IIFE
(async () => {
  setTokenFromUrl();
  const config = await fetchConfig();
  await store.dispatch('SET_CONFIG', config);
  localStorage.setItem('CONFIG', JSON.stringify(config));
  const app = createVueInstance();
  app.provide('$config', config);
  app.mount('#app');
})();
