const { ipcRenderer } = require('electron');
const { SipPhone } = require('webitel-sdk');
let conf;
var sip = require('electron_baresip');
let chatPayload;

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
		console.error('unrg');
		await cli.phone.unregister();
		if (cli.phone.destroy) await cli.phone.destroy();
		cli.phone = null;
	}
	if (reload) {
		ipcRenderer.send('reload-page');
	}
	return;
}

window.onbeforeunload = () => {
	destroyNotification();
	// fixme
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

const changeSIP = async (cli, { isSIP, timeoutSIP, codecs, debugMode }) => {
	//console.error('>>>', isSIP, timeoutSIP, codecs)
	const sipChecked = await ipcRenderer.invoke('sip_checked');

	cli.emit('phone_registered', false);
	if (isSIP && sipChecked === true) {
		if (cli.phone) {
			await unrg(cli);
		}
		const sipInstance = new sip.SipClient({
			debug: debugMode,
		});
		let connDevice = await cli.deviceConfig('sip');

		// TODO deprecated
		cli.phone = sipInstance;
		if (typeof cli.subscribePhone !== 'function') {
			cli.subscribePhone(sipInstance);
		} else {
			cli.phone.on('newSession', cli.onNewCallSession.bind(cli));
		}

		cli.phone.off = () => {};

		sipInstance.on('registered', async () => {
			console.error('registered');
			window.sip = sipInstance;
			cli.emit('phone_registered', true);
		});

		await sipInstance.register({
			register_sec: timeoutSIP,
			codecs,
			...connDevice,
		});
	} else {
		if (!cli.phone || (cli.phone && cli.phone.type == 'sip')) {
			if (cli.phone) await unrg(cli);
			cli.phone = new SipPhone('electron', true);
			await cli.registerCallClient(cli.phone);
		}
	}
};

ipcRenderer.on(
	'change-SIP',
	async (event, { isSIP, timeoutSIP, codecs, debugMode }) => {
		//console.error("change-SIP", isSIP, timeoutSIP, codecs, debugMode)
		if (!window.cliController) {
			console.error('TODO');
			return;
		}
		const cli = await window.cliController.getCliInstance();
		//console.error(debugMode);
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
		console.log(action.type); //features/chat/ACCEPT
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
				window.cliController.getCliInstance().then(async function (cli) {
					//if (cli.phone) {
					//       await unrg(cli);
					// }
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
		console.log(mutation.type);
		switch (
			mutation.type //features/chat/ADD_CHAT
		) {
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

	let ob = createCallObject(call);
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
	let call = getActiveCall(callList);
	if (call) setActiveCall(call);
}

function setActiveCall(payload, isAnswerIvent) {
	let ob = createCallObject(payload);
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

// todo fixme
function getCallById(callId, state) {
	return state.features.call.callList.find((call) => call.id === callId);
}

// todo fixme
function getCallFromWorkspace(state) {
	return state.features.call.callOnWorkspace;
}

function removeCallInfo(payload, callList) {
	let data = {
		removeId: payload.id,
		reserveCall: null,
	};
	if (callList.length > 0) {
		let call = getActiveCall(callList);
		data.reserveCall = createCallObject(call);
	}
	ipcRenderer.send('remove-call-info', data);
}

function createCallObject(payload) {
	let obj = payload;
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
////////

//todo fixme
ipcRenderer.on('reset-timer', (event, arg) => {
	let tasks = $store.state.features.status?.agent?.task;
	if (tasks) {
		let task = tasks.get(arg);
		task.renew();
	}
});

////////////

ipcRenderer.on('set-processing-property', (event, arg = '') => {
	let call = fetCallById(arg.id);
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
	let call = fetCallById(arg);
	if (call && call.postProcessData) {
		call.reporting(call.postProcessData);
	}
});

ipcRenderer.on('make-call', async (event, destination) => {
	const cli = await window.cliController.getCliInstance();
	if (cli) {
		cli.call({
			destination: '',
		});
	}
});

ipcRenderer.on('chack-info', (event, arg) => {
	getActiveTask();
});

//setInterval(getActiveTask, 80)
function checkActiveTask() {
	setInterval(getActiveTask, 80);
}

function getActiveTask() {
	if (!$store) return;
	let list = $store.state.features.call.callList;
	if (list) {
		let call = list.find((call) => call.hangupAt !== 0 && call.allowReporting);
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
	let ob = {
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
