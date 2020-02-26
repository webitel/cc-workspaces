import Vue from 'vue';
import Vuex from 'vuex';
import userinfo from './modules/userinfo/userinfo';
import operator from './modules/operator-workspace/operator-workspace';

Vue.use(Vuex);

export default new Vuex.Store({
  // strict: true,
  modules: {
    userinfo,
    operator,
  },
});
