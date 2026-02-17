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
	IS_VIDEO_CALL: (state, getters, rootState, rootGetters) => (call) => {
		const callOnWorkspace =
			call || rootGetters['workspace/CALL_ON_WORKSPACE'];

		if (!callOnWorkspace) return false;

		const video = callOnWorkspace?.remoteVideo;

		return [
			VideoMediaFlow.SendRecv,
		].includes(video);
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
