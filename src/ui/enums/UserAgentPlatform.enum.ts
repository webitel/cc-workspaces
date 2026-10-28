export const UserAgentPlatform = {
	Workspace: 'workspace',
	Pwa: 'pwa',
} as const;

export type UserAgentPlatform =
	(typeof UserAgentPlatform)[keyof typeof UserAgentPlatform];
