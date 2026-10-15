export const AgentIcon = {
	Bot: 'bot',
	Contact: 'user',
	Agent: 'agent',
} as const;

export type AgentIcon = (typeof AgentIcon)[keyof typeof AgentIcon];
