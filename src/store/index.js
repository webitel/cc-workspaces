import Vue from 'vue';
import Vuex from 'vuex';
import userinfo from './modules/userinfo/userinfo';
import status from './modules/agent-status/agent-status';
import workspace from './modules/agent-workspace/agent-workspace';
import now from './modules/reactive-now/reactive-now';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    userinfo,
    status,
    workspace,
    now,
  },
});
