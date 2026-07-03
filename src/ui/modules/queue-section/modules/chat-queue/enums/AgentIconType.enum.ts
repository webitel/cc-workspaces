export const AgentIconType = {
	Bot: 'bot',
	Contact: 'contacts',
	Agent: 'agent',
} as const;

export type AgentIconType = (typeof AgentIconType)[keyof typeof AgentIconType];
