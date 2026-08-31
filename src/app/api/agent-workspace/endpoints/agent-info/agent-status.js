import { AgentsAPI } from '@webitel/api-services/api';
import convertDuration from '@webitel/ui-sdk/src/scripts/convertDuration';

const getAgent = async ({ itemId, from, to }) => {
	const item = await AgentsAPI.getStatusStatisticsItem({
		agentId: itemId,
		from: from ?? new Date().setHours(0, 0, 0, 0),
		to: to ?? new Date().setHours(23, 59, 59, 999),
	});

	return {
		...item,
		statusDuration: convertDuration(item.statusDuration),
		online: convertDuration(item.online),
		offline: convertDuration(item.offline),
		pause: convertDuration(item.pause),
	};
};

export default {
	get: getAgent,
};
