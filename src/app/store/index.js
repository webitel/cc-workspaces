import Vue from 'vue';
import Vuex from 'vuex';
import webSocketClientController from '../api/agent-workspace/websocket/WebSocketClientController';
import agentInfo from '../../ui/modules/info-section/modules/general-info/store/agent-info';
import status from '../../features/agent-status/agent-status';
import workspace from '../../ui/store/agent-workspace';
import call from '../../features/call/call';
import chat from '../../features/chat/chat';
import globals from '../../features/global-handlers/store/global-handlers';
import member from '../../features/member/member';
import notifications from '../../features/notifications/store/notifications';
import reporting from '../../features/post-processing/store/post-processing';
import now from '../../ui/modules/reactive-now/reactive-now';
import userinfo from '../../ui/modules/userinfo/userinfo';

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
