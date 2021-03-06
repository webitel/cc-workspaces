import Vue from 'vue';
import Vuelidate from 'vuelidate';
import App from './the-app.vue';
import router from './router';
import store from './store';
import i18n from './locale/i18n';
import Icon from './components/utils/icon-wrap.vue';

import './plugins/webitel-ui';

// import './css/fonts.scss';
import './css/main.scss';

Vue.config.productionTip = false;

Vue.component('icon', Icon);
Vue.use(Vuelidate);

const fetchConfig = async () => {
  const response = await fetch(`${process.env.BASE_URL}config.json`);
  return response.json();
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
  createVueInstance();
})();
