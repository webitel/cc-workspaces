import { AgentStatus } from 'webitel-sdk';

import APIRepository from '../../../app/api/APIRepository';
import clientHandlers from './client-handlers';
import UserStatus from './statusUtils/UserStatus';

const usersAPI = APIRepository.users;

const state = {
	agent: null,
	user: {
		status: {},
	},
};

const getters = {
	IS_AGENT: (state) => !!state.agent,
	IS_CCENTER_ON: (state, getters) =>
		getters.IS_AGENT && state.agent.status !== AgentStatus.Offline,
};

const actions = {
	...clientHandlers.actions,

	GET_AGENT_INSTANCE: async (context) => {
		const client = await context.rootState.client.getCliInstance();
		return client.agentSession();
	},

	SET_AGENT_WAITING_STATUS: async (context) => {
		try {
			const agent = await context.dispatch('GET_AGENT_INSTANCE');
			agent.online();
		} catch (err) {
			throw err;
		}
	},

	SET_AGENT_PAUSE_STATUS: async (context, note = '') => {
		try {
			const agent = await context.dispatch('GET_AGENT_INSTANCE');
			await agent.pause(note);
		} catch (err) {
			throw err;
		}
	},

	AGENT_LOGOUT: async (context) => {
		try {
			const agent = await context.dispatch('GET_AGENT_INSTANCE');
			agent.offline();
		} catch (err) {
			throw err;
		}
	},

	TOGGLE_USER_DND: async (context) => {
		const status = context.state.user.status?.[UserStatus.DND]
			? ''
			: UserStatus.DND;
		await usersAPI.setUserStatus(status);
	},

	TOGGLE_CONTACT_CENTER_MODE: async (context) => {
		try {
			if (context.getters.IS_CCENTER_ON) {
				await context.dispatch('AGENT_LOGOUT');
			} else {
				await context.dispatch('SET_AGENT_WAITING_STATUS');
			}
		} catch (err) {
			throw err;
		}
	},
};

const mutations = {
	SET_AGENT_INSTANCE: (state, agent) => {
		state.agent = agent;
	},

	SET_USER_INSTANCE: (state, user) => {
		state.user = user;
	},
};

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations,
};
