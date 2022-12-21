import Vue from 'vue';
import Vuelidate from 'vuelidate';
import deepmerge from 'deepmerge';
import App from './app/the-app.vue';
import router from './app/router';
import store from './app/store';
import i18n from './app/locale/i18n';

import './app/plugins';

import './app/assets/icons/sprite';

Vue.config.productionTip = false;

Vue.use(Vuelidate);

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
        CLI: body,
      };
    } catch (error) {
      return {};
    }
  };
  return deepmerge(fileConfig, await apiResponse(), electronConfig);
};

const createVueInstance = () => {
  new Vue({
    router,
    store,
    i18n,
    render: (h) => h(App),
  }).$mount('#app');
};

// init IIFE
(async () => {
  const config = await fetchConfig();
  store.dispatch('SET_CONFIG', config);
  Vue.prototype.$config = config;
  localStorage.setItem('CONFIG', JSON.stringify(config));
  createVueInstance();
})();
