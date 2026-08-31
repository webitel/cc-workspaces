import { AgentsAPI } from '@webitel/api-services/api';

export const getAgentPauseCauses = (params) =>
	AgentsAPI.getPauseCausesForAgent(params);

export default {
	getList: getAgentPauseCauses,
};
