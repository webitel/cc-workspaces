import Vue from 'vue';
import Vuex from 'vuex';
import webSocketClientController from '../api/agent-workspace/websocket/WebSocketClientController';
 import features from '../../features/store/features';
import workspace from '../../ui/store/agent-workspace';
import ui from '../../ui/store/ui';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    client: webSocketClientController,
  },
  modules: {
    features,
    ui,
    workspace,
  },
});

window.$store = store;

export default store;
