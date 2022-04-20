import Vue from 'vue';
import Vuelidate from 'vuelidate';
import deepmerge from 'deepmerge';
import App from './app/the-app.vue';
import router from './app/router';
import store from './app/store';
import i18n from './app/locale/i18n';

import './app/plugins';

// import './css/fonts.scss';
import './app/css/main.scss';

import './app/assets/icons/sprite';

Vue.config.productionTip = false;

Vue.use(Vuelidate);

const fetchConfig = async () => {
  const windowConfig = window._config || {}; // Electron sets config to window
  const response = await fetch(`${process.env.BASE_URL}config.json`);
  const fileConfig = (await response.json()) || {};
  return deepmerge(fileConfig, windowConfig);
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
  Vue.prototype.$config = config;
  localStorage.setItem('CONFIG', JSON.stringify(config));
  createVueInstance();
})();
