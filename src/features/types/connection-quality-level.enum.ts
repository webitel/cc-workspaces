export const CONNECTION_QUALITY_LEVELS = {
	High: 'high',
	Medium: 'medium',
	Low: 'low',
} as const;

export type CONNECTION_QUALITY_LEVELS_TYPE =
	(typeof CONNECTION_QUALITY_LEVELS)[keyof typeof CONNECTION_QUALITY_LEVELS];
