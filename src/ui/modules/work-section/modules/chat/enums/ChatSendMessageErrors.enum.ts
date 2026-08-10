export const ChatSendMessageErrors = {
	WebhookSiteClosedButMsgSent: 'custom.bot.send_notify.do_request.rejected',
	PortalNoDeviceConnection: 'portal: no device connection',
} as const;

export type ChatSendMessageErrors =
	(typeof ChatSendMessageErrors)[keyof typeof ChatSendMessageErrors];
