import { reactive } from 'vue';

import APIRepository from '../../../app/api/APIRepository';
import parseUserStatus from './statusUtils/parseUserStatus';

const usersAPI = APIRepository.users;

const userStatusHandler = (user) => ({
	status: parseUserStatus(user),
});

const actions = {
	// main action to start initialization
	SUBSCRIBE_STATUS: async (context) =>
		Promise.allSettled([
			context.dispatch('SUBSCRIBE_AGENT_STATUS'),
			context.dispatch('SUBSCRIBE_USER_STATUS'),
		]),

	// main agent subscribe action
	SUBSCRIBE_AGENT_STATUS: async (context) => {
		const client = await context.rootState.client.getCliInstance();

		let agent;
		try {
			agent = await client.agentSession();
			client.agent = reactive(client.agent);
		} catch (err) {
			return; // abort action, if no agent
		}
		await client.subscribeAgentsStatus(
			async (state, agent) => {
				context.commit('SET_AGENT_INSTANCE', agent);
			},
			{
				agent_id: agent.agentId,
			},
		);

		context.commit('SET_AGENT_INSTANCE', agent);

		window.agent = agent;
	},

	// main user subscribe action
	SUBSCRIBE_USER_STATUS: async (context) => {
		const client = await context.rootState.client.getCliInstance();
		await client.subscribeUsersStatus((presence) => {
			const user = userStatusHandler(presence);
			context.commit('SET_USER_INSTANCE', user);
		});

		await context.dispatch('GET_CURRENT_USER_STATUS');
	},

	// helper action to get initial user status from HTTP request
	GET_CURRENT_USER_STATUS: async (context) => {
		const presence = await usersAPI.getUserStatus();
		const user = userStatusHandler(presence);
		context.commit('SET_USER_INSTANCE', user);
	},
};

export default {
	actions,
};
