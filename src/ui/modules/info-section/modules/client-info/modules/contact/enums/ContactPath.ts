export const ContactPath = {
	ReadOnlyContact: 'view/contact_view',
	FullContact: 'contacts',
} as const;

/**
 * Type representing the values of ContactPath
 */
export type ContactPathType = (typeof ContactPath)[keyof typeof ContactPath];
