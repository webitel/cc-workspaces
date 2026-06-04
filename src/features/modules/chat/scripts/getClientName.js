import { AgentTypes } from '../enums/AgentTypes.enum';

export const getClientName = (members) => {
	if (!members?.length) return '';

	const agentTypes = Object.values(AgentTypes);
	const client = members.find((member) => !agentTypes.includes(member?.type));

	return client?.name;
};
