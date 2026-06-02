export const AgentTypes = {
	WEBITEL: 'webitel',
	USER: 'user',
	BOT: 'bot',
} as const;

export type AgentTypes = (typeof AgentTypes)[keyof typeof AgentTypes];
