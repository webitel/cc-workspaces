import Vue from 'vue';
import Vuex from 'vuex';
import userinfo from './modules/userinfo/userinfo';
import status from './modules/agent-status/agent-status';
import workspace from './modules/agent-workspace/agent-workspace';
import now from './modules/reactive-now/reactive-now';
import call from './modules/call/call';
import chat from './modules/chat/chat';
import member from './modules/member/member';
import reporting from './modules/post-processing/post-processing';
import globals from './modules/global-handlers/global-handlers';
import agentInfo from './modules/agent-info/agent-info';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    status,
    workspace,
    call,
    chat,
    member,
    reporting,
    userinfo,
    now,
    globals,
    agentInfo,
  },
});

window.$store = store;

export default store;
