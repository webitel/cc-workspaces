import Vue from 'vue';
import Vuelidate from 'vuelidate';
import App from './the-app.vue';
import router from './router';
import store from './store';
import i18n from './locale/i18n';
import Icon from './components/utils/icon-wrap.vue';

import './css/fonts.scss';
import './css/main.scss';

Vue.config.productionTip = false;

Vue.component('icon', Icon);
Vue.use(Vuelidate);
new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount('#app');
