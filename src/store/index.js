import Vue from 'vue';
import Vuex from 'vuex';
import userinfo from './modules/userinfo/userinfo';
import agent from './modules/agent-workspace/agent-workspace';
import now from './modules/reactive-now/reactive-now';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    userinfo,
    agent,
    now,
  },
});
