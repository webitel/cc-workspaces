import { AgentsAPI } from '@webitel/api-services/api';

const getList = async (params) => {
	const defaultObject = {
		countMembers: 0,
		waitingMembers: 0,
		maxMemberLimit: 0,
		agents: {},
	};

	const { items, next } = await AgentsAPI.getAgentQueues(params);

	return {
		items: items.map((item) => {
			const merged = {
				...defaultObject,
				...item,
			};
			return {
				...merged,
				agents: {
					busy: merged.agents.busy || 0,
					pause: merged.agents.pause || 0,
					online: merged.agents.online || 0,
					allowPause: merged.agents.allowPause,
				},
			};
		}),
		next,
	};
};

export default {
	getList,
};
