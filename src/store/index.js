import Vue from 'vue';
import Vuex from 'vuex';
import webSocketClientController from '../api/agent-workspace/websocket/WebSocketClientController';
import agentInfo from './modules/agent-info/agent-info';
import status from './modules/agent-status/agent-status';
import workspace from './modules/agent-workspace/agent-workspace';
import call from './modules/call/call';
import chat from './modules/chat/chat';
import globals from './modules/global-handlers/global-handlers';
import member from './modules/member/member';
import notifications from './modules/notifications/notifications';
import reporting from './modules/post-processing/post-processing';
import now from './modules/reactive-now/reactive-now';
import userinfo from './modules/userinfo/userinfo';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    client: webSocketClientController,
  },
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
    notifications,
  },
});

window.$store = store;

export default store;
