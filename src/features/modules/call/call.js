import { QueueTypeName } from '@webitel/ui-sdk/enums';
import eventBus from '@webitel/ui-sdk/src/scripts/eventBus.js';

import i18n from '../../../app/locale/i18n';
import WorkspaceStates from '../../../ui/enums/WorkspaceState.enum';
import clientHandlers from './client-handlers';
import manual from './modules/manual/store/manual';
import missed from './modules/missed-calls/store/missed-calls';
import isIncomingRinging from './scripts/isIncomingRinging';
import videoCall from './video-call/video-call';

const state = {
	callList: [],
	isVideo: false,
	callInfo: new Map(),
};

const getters = {
	CALL_ON_WORKSPACE: (s, g, rS, rootGetters) =>
		rootGetters['workspace/IS_CALL_WORKSPACE'] &&
		rootGetters['workspace/TASK_ON_WORKSPACE'],

	GET_CALL_BY_ID: (state) => (callId) =>
		state.callList.find((call) => call.id === callId),

	IS_NEW_CALL: (state, getters) =>
		getters.CALL_ON_WORKSPACE && getters.CALL_ON_WORKSPACE._isNew,

	GET_CURRENT_CALL_DIGITS: (state, getters) => {
		if (
			getters.CALL_ON_WORKSPACE.digits &&
			getters.CALL_ON_WORKSPACE.digits.length
		) {
			return getters.CALL_ON_WORKSPACE.digits;
		}
		return '';
	},

	// every returns true on empty array, so we have to check for array length
	IS_ANY_RINGING: (state) =>
		state.callList.length &&
		state.callList.every((call) => isIncomingRinging(call)),

	IS_OFFLINE_CALL: (state, getters) =>
		getters.CALL_ON_WORKSPACE.queue?.queue_type === QueueTypeName.OFFLINE_QUEUE,

	NORMALIZE_PHONE_NUMBER: () => (phone) => {
		if (!phone) return '';
		return phone.replace(/[()\-\s]/g, '');
	},
};

const actions = {
	...clientHandlers.actions,

	SET_CALL_LIST: (context, callList) => {
		context.commit('SET_CALL_LIST', callList);
	},

	ADD_CALL: (context, call) => {
		context.commit('ADD_CALL', call);
	},

	// destructuring arg in order to skip mouse events
	CALL: async (context, { user, number, contactId } = {}) => {
		// deprecated from 20.02.2024. remove me in 6 months
		if (user) throw new Error('{ user } param for CALL is deprecated');

		const CALL_PARAMS = {
			disableStun: !context.rootState.config.CLI.stun,
			contactId,
		};
		let destination;

		const isActiveCall = context.state.callList.find((call) => call.active);
		//@author Oles Chorpita
		//If there's an active call, or call was active but cleared from TASK_ON_WORKSPACE,
		if (isActiveCall) {
			context.dispatch('SET_HOLD', isActiveCall);
		}

		if (number) {
			destination = number;
		} else {
			destination =
				context.rootGetters['workspace/TASK_ON_WORKSPACE'].newNumber;
		}

		// eslint-disable-next-line no-useless-escape
		destination = destination.replace(/[^0-9a-zA-z+*#]/g, '');
		const client = await context.rootState.client.getCliInstance();
		const params = {
			...CALL_PARAMS,
			video: context.state.isVideo,
		};
		try {
			await client.call({
				destination,
				params,
			});
		} catch (err) {
			throw err;
		}
	},

	ANSWER: async (context, { callId } = {}) => {
		const ANSWER_PARAMS = {
			useAudio: true,
			disableStun: !context.rootState.config.CLI.stun,
		};
		const call = callId
			? context.getters.GET_CALL_BY_ID(callId)
			: context.getters.CALL_ON_WORKSPACE;
		if (call.allowAnswer) {
			const params = {
				...ANSWER_PARAMS,
				video: context.rootGetters['features/call/videoCall/IS_VIDEO_CALL'](call),
			};
			await call.answer(params);
			await context.dispatch('SET_WORKSPACE', call);
		}
	},

	BLIND_TRANSFER: async (context, number) => {
		const call = context.getters.CALL_ON_WORKSPACE;
		try {
			await call.blindTransfer(number);
			// context.commit('REMOVE_CALL', call);
			// context.dispatch('RESET_WORKSPACE');
		} catch {}
	},

	BRIDGE: async (context, callToBridge) => {
		const call = context.getters.CALL_ON_WORKSPACE;
		try {
			await call.bridgeTo(callToBridge);
			// context.commit('REMOVE_CALL', call);
			// context.dispatch('RESET_WORKSPACE');
		} catch {}
	},

	TOGGLE_MUTE: async (context, { callId } = {}) => {
		const call = callId
			? context.getters.GET_CALL_BY_ID(callId)
			: context.getters.CALL_ON_WORKSPACE;
		const isMuted = call.muted;
		await call.mute(!isMuted);
	},

	TOGGLE_HOLD: async (context, { callId } = {}) => {
		const call = callId
			? context.getters.GET_CALL_BY_ID(callId)
			: context.getters.CALL_ON_WORKSPACE;
		if ((!call.isHold && call.allowHold) || (call.isHold && call.allowUnHold)) {
			try {
				await call.toggleHold();
			} catch {}
		}
	},

	SET_HOLD: async (context, call) => {
		if (!call.isHold && call.allowHold) {
			call.hold();
		}
	},

	SEND_DTMF: async (context, value) => {
		const call = context.getters.CALL_ON_WORKSPACE;
		if (call.allowDtmf) {
			try {
				await call.sendDTMF(value);
			} catch {}
		}
	},

	HANGUP: async (context, { callId } = {}) => {
		const call = callId
			? context.getters.GET_CALL_BY_ID(callId)
			: context.getters.CALL_ON_WORKSPACE;
		if (call.allowHangup) {
			try {
				await call.hangup();
			} catch {}
		}
	},

	OPEN_ACTIVE_CALL: (context, call) => {
		context.dispatch('SET_WORKSPACE', call);
	},

	// new number destructuring to prevent mouse event
	OPEN_NEW_CALL: (context, { newNumber } = {}) =>
		context.dispatch('SET_WORKSPACE', {
			_isNew: true,
			newNumber: newNumber || '',
		}),

	CLOSE_NEW_CALL: (context) => context.dispatch('RESET_WORKSPACE'),

	ADD_DIGIT: async (context, value) => {
		const call = context.getters.CALL_ON_WORKSPACE;
		if (call.allowDtmf) {
			// if there's a call, send dtmf
			context.dispatch('SEND_DTMF', value);
		} else {
			// else user types a number
			const newNumber = call.newNumber + value;

			// cannot mutate newCall because its instance only on 'workspace' state

			context.getters.CALL_ON_WORKSPACE.newNumber = newNumber;
		}
	},

	SET_NEW_NUMBER: (
		context,
		{ call = context.getters.CALL_ON_WORKSPACE, value },
	) => {
		// cannot mutate newCall because its instance only on 'workspace' state

		call.newNumber = value;
	},

	HOLD_OTHER_CALLS: (context, activeCall) => {
		if (context.state.callList.length > 1) {
			context.state.callList.forEach((call) => {
				if (call !== activeCall) context.dispatch('SET_HOLD', call);
			});
		}
	},

	TOGGLE_VIDEO: (context) => {
		const value = !context.state.isVideo;
		localStorage.setItem('isVideo', JSON.stringify(value));
		context.commit('SET_VIDEO', value);
	},

	RESTORE_VIDEO_PARAM: (context) => {
		const value = localStorage.getItem('isVideo');
		if (value) context.commit('SET_VIDEO', JSON.parse(value));
	},

	SET_WORKSPACE: (context, call) =>
		context.dispatch(
			'workspace/SET_WORKSPACE_STATE',
			{
				type: WorkspaceStates.CALL,
				task: call,
			},
			{
				root: true,
			},
		),

	RESET_WORKSPACE: (context) =>
		context.dispatch('workspace/RESET_WORKSPACE_STATE', null, {
			root: true,
		}),
};

const mutations = {
	...clientHandlers.mutations,

	SET_VIDEO: (state, value) => {
		state.isVideo = value;
	},

	SET_CALL_LIST: (state, callList) => {
		state.callList = callList;
	},

	ADD_CALL: (state, call) => {
		state.callList.push(call);
	},

	REMOVE_CALL: (state, removedCall) => {
		state.callList = state.callList.filter((call) => call !== removedCall);
		if (removedCall?.id) {
			state.callInfo.delete(removedCall.id);
		}
	},
	UPDATE_CALL_INFO: (state, { callId, info }) => {
		if (!callId) return;
		const existing = state.callInfo.get(callId) || {};
		state.callInfo.set(callId, {
			...existing,
			...info,
		});
	},
	CLEAR_CALL_INFO: (state) => {
		state.callInfo = new Map();
	},
};

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations,
	modules: {
		missed,
		manual,
		videoCall,
	},
};
