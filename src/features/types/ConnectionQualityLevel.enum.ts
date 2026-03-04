export const ConnectionQualityLevels = {
	High: 'high',
	Medium: 'medium',
	Low: 'low',
} as const;

export type ConnectionQualityLevelsType =
	(typeof ConnectionQualityLevels)[keyof typeof ConnectionQualityLevels];
