export const ContactMode = {
	Add: 'add',
	Search: 'search',
	View: 'view',
} as const;

export type ContactModeType = (typeof ContactMode)[keyof typeof ContactMode];
