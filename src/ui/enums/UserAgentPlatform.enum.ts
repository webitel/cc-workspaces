export const UserAgentPlatform = {
	Workspace: 'workspace',
	Pwa: 'pwa',
	Desktop: 'desktop',
} as const;

export type UserAgentPlatform =
	(typeof UserAgentPlatform)[keyof typeof UserAgentPlatform];
