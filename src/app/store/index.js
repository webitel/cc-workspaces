import Vue from 'vue';
import Vuex from 'vuex';
import webSocketClientController from '../api/agent-workspace/websocket/WebSocketClientController';
 import features from '../../features/store/features';
import agentInfo from '../../ui/modules/info-section/modules/general-info/store/agent-info';
import status from '../../features/modules/agent-status/agent-status';
import workspace from '../../ui/store/agent-workspace';
import call from '../../features/modules/call/call';
import chat from '../../features/modules/chat/store/chat';
import globals from '../../features/modules/global-handlers/store/global-handlers';
import member from '../../features/modules/member/member';
import notifications from '../../features/modules/notifications/store/notifications';
import reporting from '../../features/modules/reporting/store/post-processing';
import now from '../../ui/modules/reactive-now/reactive-now';
import userinfo from '../../ui/modules/userinfo/userinfo';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    client: webSocketClientController,
  },
  modules: {
    features,
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
