import { eventBus } from '@webitel/ui-sdk/scripts';
import i18n from '../../../locale/i18n';

interface WebSocketError {
	id?: string;
	[key: string]: unknown;
}

interface NotificationMessage {
	type: 'error';
	text: string | WebSocketError;
}

const websocketErrorEventHandler = (error: WebSocketError): WebSocketError => {
	const errorKey = error.id?.replaceAll('.', '_');
	const localeKey = errorKey ? `error.websocket.${errorKey}` : null;

	const message: NotificationMessage = {
		type: 'error',
		text:
			localeKey && i18n.global.te(localeKey) ? i18n.global.t(localeKey) : error,
	};

	eventBus.$emit('notification', message);
	return error;
};

export default websocketErrorEventHandler;
