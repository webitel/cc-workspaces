const { ipcRenderer } = require('electron');
const PjsipClient = require('./pjsip-client');

import type { Client as WebitelClient } from 'webitel-sdk';
import type { ClientDeviceConfig } from '../shared/types/ClientDeviceConfig.types';

let conf;
let chatPayload;
const SIP_BOOTSTRAP_MAX_ATTEMPTS = 40;
const SIP_BOOTSTRAP_INTERVAL_MS = 500;
type SipRegisterConfig = ClientDeviceConfig & {
	register_expires: number | string;
};

ipcRenderer.invoke('get-userData-path').then((result) => getConf(result));

function getConf(data) {
	conf = data;
}

window.addEventListener('DOMContentLoaded', async () => {
	if (window.$store) {
		subscribeMutation(window.$store);
		subscribeAction(window.$store);
		checkActiveTask();
	}
	window.ipcRenderer = ipcRenderer;
	localStorage.setItem('auto-refresh', 5000);
	ipcRenderer.send('hide-disconnect-popup');
	bootstrapSipSetup();
});

window.addEventListener(
	'keyup',
	(e) => {
		if (e.keyCode === 123) {
			ipcRenderer.send('open-close-DevTools');
		}
		if (e.keyCode === 116) {
			ipcRenderer.invoke('restart');
		}
	},
	true,
);

async function unrg(cli = {}, reload) {
	if (cli.phone) {
		await cli.phone.unregister();
		if (cli.phone.destroy) await cli.phone.destroy();
		cli.phone = null;
	}
	if (reload) ipcRenderer.send('reload-page');
}

async function resolveCliInstance(): Promise<WebitelClient | null> {
	if (window.cli) return window.cli;

	if (window.$store?.state?.client?.getCliInstance) {
		return window.$store.state.client.getCliInstance();
	}

	return null;
}

async function wireSipClient(cli: WebitelClient, sipInstance) {
	cli.phone = sipInstance;
	cli.phone.off = () => {};

	if (typeof cli.registerCallClient === 'function') {
		await cli.registerCallClient(sipInstance);
		return;
	}

	if (typeof cli.subscribePhone === 'function') {
		cli.subscribePhone(sipInstance);
		return;
	}

	cli.phone.on?.('newSession', cli.onNewCallSession?.bind(cli));
}

window.onbeforeunload = () => {
	destroyNotification();
};

ipcRenderer.on('from-main', (event, err = '') => {
	alert(err);
	console.error(err);
});

ipcRenderer.on('change-status', (event, status = '') => {
	switch (status) {
		case 'pause':
			$store.dispatch('features/status/SET_AGENT_PAUSE_STATUS');
			break;
		case 'online':
			$store.dispatch('features/status/SET_AGENT_WAITING_STATUS');
			break;
		case 'offline':
			$store.dispatch('features/status/AGENT_LOGOUT');
			break;
		default:
			console.error(status);
	}
});

const changeSIP = async (
	cli: WebitelClient,
	{ isSIP, timeoutSIP, codecs, debugMode },
) => {
	const sipChecked = await ipcRenderer.invoke('sip_checked');

	cli.emit('phone_registered', false);
	if (!(isSIP && sipChecked === true)) return;

	if (cli.phone) await unrg(cli);
	const sipInstance = new PjsipClient({
		debugMode,
		timeoutSIP,
		codecs,
	});
	const connDevice = (await cli.deviceConfig('sip')) as ClientDeviceConfig;
	sipInstance.on('registered', async () => {
		window.sip = sipInstance;
		await wireSipClient(cli, sipInstance);
		cli.emit('phone_registered', true);
	});
	const registerConfig: SipRegisterConfig = {
		...connDevice,
		register_expires: timeoutSIP,
	};
	await sipInstance.register(registerConfig);
};

async function bootstrapSipSetup() {
	for (
		let attempts = 1;
		attempts <= SIP_BOOTSTRAP_MAX_ATTEMPTS;
		attempts += 1
	) {
		const cli = await resolveCliInstance();
		if (cli) {
			await changeSIP(cli, {
				isSIP: conf?.useSIP ?? true,
				timeoutSIP: conf?.timeoutSIP || 90,
				codecs: conf?.codecs || [],
				debugMode: conf?.debugMode || true,
			});
			return;
		}
		await new Promise((resolve) =>
			setTimeout(resolve, SIP_BOOTSTRAP_INTERVAL_MS),
		);
	}
}

ipcRenderer.on(
	'change-SIP',
	async (event, { isSIP, timeoutSIP, codecs, debugMode }) => {
		const cli = await resolveCliInstance();
		if (!cli) return;
		await changeSIP(cli, {
			isSIP,
			timeoutSIP,
			codecs,
			debugMode,
		});
	},
);

ipcRenderer.on('call-action', (event, call) => {
	switch (call.action) {
		case 'answer':
			$store.dispatch('features/call/ANSWER', {
				callId: call.id,
			});
			break;
		case 'reject':
			$store.dispatch('features/call/HANGUP', {
				callId: call.id,
			});
			break;
		case 'hold':
			$store.dispatch('features/call/TOGGLE_HOLD', {
				callId: call.id,
			});
			break;
		case 'mute':
			$store.dispatch('features/call/TOGGLE_MUTE', {
				callId: call.id,
			});
			break;
		default:
			console.error(call);
	}
});

function subscribeAction(store) {
	store.subscribeAction((action, state) => {
		switch (action.type) {
			case 'features/call/HOLD_OTHER_CALLS':
				setActiveCall(
					action.payload,
					action.payload?._isOpenedLink ? false : true,
				);
				action.payload._isOpenedLink = true;
				break;

			case 'features/call/TOGGLE_MUTE':
			case 'features/call/TOGGLE_HOLD':
				updateCall(action.payload.callId, state, action.type);
				break;

			case 'features/chat/ACCEPT':
				setActiveChat(action.payload);
				break;

			case 'workspace/CLOSE_SESSION':
				destroyNotification();
				break;
			case 'globals/OPEN_DISCONNECT_POPUP':
				destroyNotification();
				openDisconnectPopup();
				break;

			case 'features/status/SUBSCRIBE_STATUS':
				resolveCliInstance().then(async (cli) => {
					if (!cli) return;
					await changeSIP(cli, {
						isSIP: conf.useSIP,
						timeoutSIP: conf.timeoutSIP,
						codecs: conf.codecs,
						debugMode: conf.debugMode,
					});
				});
				break;

			default:
		}
	});
}

function subscribeMutation(store) {
	store.subscribe((mutation, state) => {
		switch (mutation.type) {
			case 'features/status/SET_AGENT_INSTANCE':
				setUserStatus(mutation.payload.status);
				break;

			case 'features/call/SET_CALL_LIST':
				restoreNotification(mutation.payload);
				break;

			case 'features/call/ADD_CALL':
				setActiveCall(mutation.payload);
				break;

			case 'features/chat/ADD_CHAT':
				setActiveChatPayload(mutation.payload);
				break;

			case 'features/chat/REMOVE_CHAT':
				removeActiveChatPayload(mutation.payload);
				break;

			case 'features/call/REMOVE_CALL':
				if (mutation.payload.id) {
					removeCallInfo(mutation.payload, state.features.call.callList);
				}
				break;

			default:
		}
	});
}

function updateCall(callId, state, action) {
	let call;

	if (callId) call = getCallById(callId, state);
	else call = getCallFromWorkspace(state);

	const ob = createCallObject(call);
	ob.action = action;

	ipcRenderer.send('update-acive-call', ob);
}

function destroyNotification() {
	ipcRenderer.send('destroy-notification-window');
}

function openDisconnectPopup() {
	ipcRenderer.send('open-disconnect-popup');
}

function restoreNotification(callList) {
	const call = getActiveCall(callList);
	if (call) setActiveCall(call);
}

function setActiveCall(payload, isAnswerIvent) {
	const ob = createCallObject(payload);
	ob.isAnswerIvent = isAnswerIvent;
	ipcRenderer.send('set-acive-call', ob);
}

function setActiveChatPayload(payload) {
	chatPayload = createChatObject(payload);
}

function removeActiveChatPayload(payload) {
	chatPayload = null;
}

function setActiveChat(payload) {
	if (chatPayload) {
		ipcRenderer.send('set-acive-chat', chatPayload);
	}
}

function getActiveCall(callList) {
	let activeCall = callList.find((call) => call.isHold === false);
	if (!activeCall) activeCall = getFirstCall(callList);
	return activeCall;
}

function getFirstCall(callList) {
	if (callList[0].id) return callList[0];
	return null;
}

function getCallById(callId, state) {
	return state.features.call.callList.find((call) => call.id === callId);
}

function getCallFromWorkspace(state) {
	return state.features.call.callOnWorkspace;
}

function removeCallInfo(payload, callList) {
	const data = {
		removeId: payload.id,
		reserveCall: null,
	};
	if (callList.length > 0) {
		const call = getActiveCall(callList);
		data.reserveCall = createCallObject(call);
	}
	ipcRenderer.send('remove-call-info', data);
}

function createCallObject(payload) {
	const obj = payload;
	return {
		allowAnswer: payload.allowAnswer,
		id: payload.id,
		displayName: payload.displayName,
		displayNumber: payload.displayNumber,
		state: payload.state,
		duration: payload.duration,
		direction: payload.direction,
		variables: Object.assign({}, payload.variables),
		muted: payload.muted,
		isHold: payload.isHold,
		answeredAt: payload.answeredAt,
		queueName: payload.queue?.queue_name,
		answered: payload.answeredAt > 0,
	};
}

function createChatObject(payload) {
	return {
		id: payload.id,
		variables: payload.variables,
	};
}

function setUserStatus(status) {
	ipcRenderer.send('update-tray', status);
}
ipcRenderer.on('reset-timer', (event, arg) => {
	const tasks = $store.state.features.status?.agent?.task;
	if (tasks) {
		const task = tasks.get(arg);
		task.renew();
	}
});

ipcRenderer.on('set-processing-property', (event, arg = '') => {
	const call = fetCallById(arg.id);
	if (call) {
		switch (arg.prop) {
			case 'isScheduleCall':
				call.postProcessData.isScheduleCall = arg.value;
				break;

			case 'nextDistributeAt':
				call.postProcessData.nextDistributeAt = arg.value;
				break;

			case 'success':
				call.postProcessData.success = arg.value;
				break;

			default:
		}
		$store.dispatch('reporting/SET_PROPERTY', arg);
	}
});

ipcRenderer.on('send-reporting', (event, arg) => {
	const call = fetCallById(arg);
	if (call && call.postProcessData) {
		call.reporting(call.postProcessData);
	}
});

ipcRenderer.on('make-call', async (event, destination) => {
	const cli = await resolveCliInstance();
	if (cli) {
		cli.call({
			destination,
		});
	}
});

ipcRenderer.on('chack-info', (event, arg) => {
	getActiveTask();
});

function checkActiveTask() {
	setInterval(getActiveTask, 80);
}

function getActiveTask() {
	if (!$store) return;
	const list = $store.state.features.call.callList;
	if (list) {
		const call = list.find(
			(call) => call.hangupAt !== 0 && call.allowReporting,
		);
		if (call) {
			setProcessing(call);
		} else {
			ipcRenderer.send('clear-processing');
		}
	}
}

function fetCallById(callId) {
	return $store.state?.features?.call?.callList?.find(
		(call) => call.id === callId,
	);
}

function setProcessing(call) {
	const ob = {
		id: call.id,
		taskId: call.task.id,
		state: call.task.state,
		startProcessingAt: call.task.startProcessingAt,
		renewalSec: call.task.renewalSec,
		processingTimeoutAt: call.task.processingTimeoutAt,
		processingSec: call.task.processingSec,
		memberId: call.task.distribute.member_id,
		now: $store.state?.ui?.now.now,
		reporting: {
			isSuccess: call.postProcessData?.success,
			nextDistributeAt: call.postProcessData?.nextDistributeAt,
			isScheduleCall: call.postProcessData?.isScheduleCall,
		},
	};

	ipcRenderer.send('update-procesing', ob);
}
