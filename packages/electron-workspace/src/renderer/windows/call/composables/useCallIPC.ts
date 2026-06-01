import type { IpcRenderer } from 'electron';

const ipcRenderer: IpcRenderer | null =
	typeof require === 'function' ? require('electron').ipcRenderer : null;

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
	action?: string;
	variables?: Record<string, string>;
};

export type ProcessingPayload = {
	memberId?: string | number;
	startProcessingAt: number;
	processingTimeoutAt: number;
	now: number;
	renewalSec: number;
	reporting: {
		isSuccess?: boolean;
		isScheduleCall?: boolean;
		nextDistributeAt?: number;
	};
};

export type CallAction = 'answer' | 'reject' | 'hold' | 'mute';

export function sendCallAction(action: CallAction) {
	ipcRenderer?.send('call-action', action);
}

export function collapseWindow() {
	ipcRenderer?.send('collaps-window');
}

export function sendReporting() {
	ipcRenderer?.send('send-reporting');
}

export function closeSuccessMessage() {
	ipcRenderer?.send('close-success-message');
}

export function setProcessingProperty(payload: {
	prop: 'success' | 'isScheduleCall';
	value: boolean;
}) {
	ipcRenderer?.send('set-processing-property', payload);
}

export function resizeWindow(
	size: [
		number,
		number,
	],
) {
	ipcRenderer?.send('resize-popap-win', size);
}

export function resetTimer() {
	ipcRenderer?.send('reset-timer');
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

export function onShowSuccessMessage(handler: () => void) {
	const wrap = () => handler();
	ipcRenderer?.on('show-success-message', wrap);
	return () => ipcRenderer?.removeListener('show-success-message', wrap);
}

export function onSetProcessingInfo(handler: Handler<ProcessingPayload>) {
	ipcRenderer?.on('set-processing-info', handler);
	return () => ipcRenderer?.removeListener('set-processing-info', handler);
}
