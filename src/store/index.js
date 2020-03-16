import Vue from 'vue';
import Vuex from 'vuex';
import userinfo from './modules/userinfo/userinfo';
import operator from './modules/operator-workspace/operator-workspace';
import now from './modules/reactive-now/reactive-now';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    userinfo,
    operator,
    now,
  },
});
