// @author r.zaritskyi
// Sender role -> ui-sdk icon name. Use these keys, not icon-name literals, so a ui-sdk icon rename stays a one-line change here.
export const AgentIcon = {
	Bot: 'bot',
	Contact: 'user',
	Agent: 'agent',
} as const;

export type AgentIcon = (typeof AgentIcon)[keyof typeof AgentIcon];
