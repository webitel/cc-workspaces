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

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    status,
    workspace,
    call,
    chat,
    member,
    reporting,
    userinfo,
    now,
  },
});
