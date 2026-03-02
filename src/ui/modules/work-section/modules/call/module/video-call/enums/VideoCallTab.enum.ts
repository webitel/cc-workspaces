export const VideoCallTab = {
	State: 'state',
	Contacts: 'contacts',
	History: 'history',
	Transfer: 'transfer',
	Chat: 'chat',
} as const;

export type VideoCallTabType = (typeof VideoCallTab)[keyof typeof VideoCallTab];
