import { getIpcRenderer } from '../../../shared/ipc';

const ipcRenderer = getIpcRenderer();

export type CallPayload = {
	id?: string | number;
	displayName?: string;
	displayNumber?: string;
	queueName?: string;
	showNumber?: boolean;
	answered?: boolean;
	answeredAt?: number;
	duration?: number;
	allowAnswer?: boolean;
	isHold?: boolean;
	muted?: boolean;
	state?: string;
	action?: string;
	variables?: Record<string, string>;
};

export type CallAction = 'answer' | 'reject' | 'hold' | 'mute';

export function sendCallAction(action: CallAction) {
	ipcRenderer?.send('call-action', action);
}

export function collapseWindow() {
	ipcRenderer?.send('collaps-window');
}

export function toggleDevTools() {
	ipcRenderer?.send('open-close-DevTools');
}

type Handler<T = unknown> = (event: unknown, arg: T) => void;

export function onShowCall(handler: Handler<CallPayload>) {
	ipcRenderer?.on('show-call', handler);
	return () => ipcRenderer?.removeListener('show-call', handler);
}

export function onDestroyNotification(handler: () => void) {
	const wrap = () => handler();
	ipcRenderer?.on('destroy-notification', wrap);
	return () => ipcRenderer?.removeListener('destroy-notification', wrap);
}
