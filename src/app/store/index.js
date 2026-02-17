import { createStore } from 'vuex';

import features from '../../features/store/features';
import workspace from '../../ui/store/agent-workspace';
import ui from '../../ui/store/ui';
import { useWebSocketClient } from '../api/agent-workspace/websocket/useWebSocketClient';
import instance from '../api/instance';
import OpenAPIConfig from '../api/openAPIConfig';

const wsClient = useWebSocketClient();

const store = createStore({
	state: {
		client: wsClient,
		config: {},
		api: {
			instance,
			OpenAPIConfig,
		},
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
