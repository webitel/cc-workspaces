import { VideoMediaFlow } from 'webitel-sdk';

import chat from './modules/chat/store/chat';

const actions = {
	//functions for on/off video in video call
	TOGGLE_VIDEO: ({ rootGetters }, { callId }) => {
		const call = callId
			? rootGetters['features/call/GET_CALL_BY_ID'](callId)
			: rootGetters['features/call/CALL_ON_WORKSPACE'];
		call.muteVideo(!call.mutedVideo);
	},
};

const getters = {
	IS_VIDEO_CALL_ON_WORKSPACE: (state, getters, rootState, rootGetters) => {
		return  getters['IS_VIDEO_CALL'](rootGetters['features/call/CALL_ON_WORKSPACE'])
	},
	IS_VIDEO_CALL: () => (call) => {
		return call?.remoteVideo === VideoMediaFlow.SendRecv;
	},
};

export default {
	namespaced: true,
	actions,
	getters,
	modules: {
		chat,
	},
};
