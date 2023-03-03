import { createStore } from 'vuex';
import webSocketClientController from '../api/agent-workspace/websocket/WebSocketClientController';
 import features from '../../features/store/features';
import workspace from '../../ui/store/agent-workspace';
import ui from '../../ui/store/ui';

const store = createStore({
  state: {
    client: webSocketClientController,
    config: {},
  },
  actions: {
    SET_CONFIG: (context, callList) => {
      context.commit('SET_CONFIG', callList);
    },
  },
  mutations: {
    SET_CONFIG: (state, config) => {
      state.config = config;
    },
  },
  modules: {
    features,
    ui,
    workspace,
  },
});

window.$store = store;

export default store;
