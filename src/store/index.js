import Vue from 'vue';
import Vuex from 'vuex';
import operator from './modules/operator-workspace/operator-workspace';

Vue.use(Vuex);

export default new Vuex.Store({
  // strict: true,
  modules: {
    operator,
  },
});
