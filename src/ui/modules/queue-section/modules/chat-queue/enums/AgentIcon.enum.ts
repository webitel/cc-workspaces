export const AgentIcon = {
	Bot: 'bot',
	Contact: 'contacts',
	Agent: 'agent',
} as const;

export type AgentIcon = (typeof AgentIcon)[keyof typeof AgentIcon];
