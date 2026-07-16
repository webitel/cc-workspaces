export const ChatSendMessageErrors = {
	PortalNoDeviceConnection: 'portal: no device connection',
} as const;

export type ChatSendMessageErrors =
	(typeof ChatSendMessageErrors)[keyof typeof ChatSendMessageErrors];
