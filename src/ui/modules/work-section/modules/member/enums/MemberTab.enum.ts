export const MemberTab = {
	Communications: 'communications',
	History: 'history',
	Contacts: 'contacts',
} as const;

export type MemberTab = (typeof MemberTab)[keyof typeof MemberTab];
