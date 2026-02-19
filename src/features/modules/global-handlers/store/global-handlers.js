import { watch } from 'vue';

const state = {
	isDisconnectPopup: false,
	isPhoneReg: false,
};

const getters = {};

const actions = {
	INIT_GLOBAL_HANDLERS: (context) => {
		context.dispatch('SUBSCRIBE_TO_CONNECTION_STATE');
		context.dispatch('SUBSCRIBE_TO_PHONE_REGISTRATION');
	},
	RESET_GLOBAL_HANDLERS: (context) => {
		context.dispatch('CLOSE_DISCONNECT_POPUP');
	},
	SUBSCRIBE_TO_CONNECTION_STATE: (context) => {
		let stop = null;

		stop = watch(
			() => context.rootState.client.state,
			(value) => {
				console.log(value, ' value');
				if (value === 'RECONNECTING' || value === 'DISCONNECTED') {
					context.dispatch('OPEN_DISCONNECT_POPUP');
				}

				if (value === 'CONNECTED') {
					context.dispatch('CLOSE_DISCONNECT_POPUP');
				}
			},
			{
				immediate: true,
			},
		);

		return stop;
	},
	SUBSCRIBE_TO_CLIENT_DISCONNECT: async (context) => {
		const client = await context.rootState.client.getCliInstance();
		client.on('disconnected', () => {
			context.dispatch('CLEAR_ALL_TASKS_ON_DISCONNECT');
			context.dispatch('OPEN_DISCONNECT_POPUP');
		});
	},
	SUBSCRIBE_TO_PHONE_REGISTRATION: async (context) => {
		const client = await context.rootState.client.getCliInstance();
		client.on('phone_registered', (isPhoneReg) =>
			context.commit('SET_PHONE_REG', isPhoneReg),
		);
		if (client.phoneIsRegister()) {
			context.commit('SET_PHONE_REG', true);
		}
	},
	OPEN_DISCONNECT_POPUP: (context) =>
		context.commit('SET_DISCONNECT_POPUP', true),
	CLOSE_DISCONNECT_POPUP: (context) =>
		context.commit('SET_DISCONNECT_POPUP', false),
	/**
	 * @author o.chorpita
	 * clears all active tasks (calls, chats, jobs) from store when connection is lost.
	 * https://webitel.atlassian.net/browse/WTEL-8920
	 */
	CLEAR_ALL_TASKS_ON_DISCONNECT: (context) => {
		// This prevents getters like CALL_ON_WORKSPACE from returning stale tasks
		context.commit('workspace/SET_STATE_HISTORY', [], {
			root: true,
		});

		context.dispatch('features/call/SET_CALL_LIST', [], {
			root: true,
		});
		context.commit('features/call/CLEAR_CALL_INFO', null, {
			root: true,
		});
		context.dispatch('features/chat/SET_CHAT_LIST', [], {
			root: true,
		});
		context.commit('features/job/SET_JOB_LIST', [], {
			root: true,
		});
	},
};

const mutations = {
	SET_DISCONNECT_POPUP: (state, value) => {
		state.isDisconnectPopup = value;
	},
	SET_PHONE_REG: (state, isPhoneReg) => {
		state.isPhoneReg = isPhoneReg;
	},
};

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations,
};
