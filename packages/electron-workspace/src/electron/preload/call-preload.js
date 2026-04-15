const { ipcRenderer } = require('electron');
const MarkdownIt = require('markdown-it');
const ProcessingTimer = require('../../renderer/call/progress_timer');
const Timer = require('../../renderer/call/timer');
const i18n = new (require('../shared/i18n/i18n'))();

let processingTimer,
	timerId,
	timer,
	memberId,
	hidden = true;

const md = new MarkdownIt();

function answer() {
	ipcRenderer.send('call-action', 'answer');
}

function reject() {
	ipcRenderer.send('call-action', 'reject');
}

function hold() {
	ipcRenderer.send('call-action', 'hold');
}

function collaps() {
	ipcRenderer.send('collaps-window');
}

function mute() {
	ipcRenderer.send('call-action', 'mute');
}

function arrow() {
	hidden = !hidden;
	showHideClientInfo();
}

function success() {
	ipcRenderer.send('send-reporting');
}

function fail() {
	setProcessingProperty({
		prop: 'success',
		value: false,
	});
	if (!memberId) {
		save();
	}
}

function choiceNo() {
	setProcessingProperty({
		prop: 'isScheduleCall',
		value: false,
	});
}

function choiceYes() {
	setProcessingProperty({
		prop: 'isScheduleCall',
		value: true,
	});
}

function save() {
	ipcRenderer.send('send-reporting');
}

function closeWindow() {
	clearMessageTimeaut();
	ipcRenderer.send('close-success-message');
}

window.addEventListener('DOMContentLoaded', () => {
	processingTimer = new ProcessingTimer();
	timer = new Timer('idSec', 'idMin');
	translation();
});

ipcRenderer.on('show-call', (event, arg) => {
	var x = document.getElementById('mainCall');
	if (window.getComputedStyle(x).display === 'none') {
		x.style.display = 'block';
	}

	document.getElementById('mainProcessing').style.display = 'none';
	document.getElementById('successMessage').style.display = 'none';
	clearMessageTimeaut();
	setCallInfo(arg);
	if (arg.action !== 'features/call/TOGGLE_MUTE') {
		console.log(arg.action);
		setClientInfo(arg.variables);
		setTime(arg);
	}
});

ipcRenderer.on('destroy-notification', () => {
	window._clearCalendar();
	clearMessageTimeaut();
	setCleanWindow();
	timer.reset();
});

ipcRenderer.on('show-success-message', () => {
	document.getElementById('mainCall').style.display = 'none';
	document.getElementById('mainProcessing').style.display = 'none';
	document.getElementById('successMessage').style.display = 'block';
	sendSize([
		259,
		184,
	]);
	window._clearCalendar();
	timerId = setTimeout(() => {
		closeWindow();
		clearMessageTimeaut();
	}, 2000);
});

ipcRenderer.on('set-processing-info', (event, arg) => {
	document.getElementById('mainCall').style.display = 'none';
	document.getElementById('successMessage').style.display = 'none';
	document.getElementById('mainProcessing').style.display = 'block';
	setProcessingInfo(arg);
});

function setTime(call) {
	if (call && call.answered) {
		timer.startWithDate(call.answeredAt);
	} else if (call && !call.answered) {
		timer.startWithDuration(call.duration);
	}
}

function setCleanWindow() {
	document.getElementById('callName').textContent = '';
	document.getElementById('callNumber').textContent = '';
}

function setCallInfo(call) {
	if (call?.displayName)
		document.getElementById('callName').textContent = call.displayName;
	if (call?.displayNumber && call.showNumber)
		document.getElementById('callNumber').textContent = call.displayNumber;
	if (call?.queueName) {
		document.getElementById('queueName').textContent = call.queueName;
		document.getElementById('queue').style.display = 'block';
	} else {
		document.getElementById('queue').style.display = 'none';
	}

	setButtons(call);
	showHideClientInfo(call);
}

function setButtons(call) {
	if (call.answered) {
		document.getElementById('infoClose').style.margin = '16.5px 0px 16.5px 0px';
		document.getElementById('declineBtn').style.display = 'block';
		document.getElementById('rejectBtn').style.display = 'none';
		document.getElementById('answerBtn').style.display = 'none';
		document.getElementById('holdBtn').style.display = call.isHold
			? 'none'
			: 'block';
		document.getElementById('muteBtn').style.display = call.muted
			? 'none'
			: 'block';
		document.getElementById('mutePressedBtn').style.display = call.muted
			? 'block'
			: 'none';
		document.getElementById('holdPressedBtn').style.display = call.isHold
			? 'block'
			: 'none';
		document.getElementById('imgActiveHold').style.backgroundImage = call.isHold
			? 'url("../../../img/hold-call.svg")'
			: 'url("../../../img/active-call.svg")';
	} else {
		document.getElementById('infoClose').style.margin = '10px 0px 10px 0px';
		if (call.allowAnswer) {
			document.getElementById('answerBtn').style.display = 'block';
			document.getElementById('rejectBtn').style.marginLeft = '0';
		} else {
			document.getElementById('answerBtn').style.display = 'none';
			document.getElementById('rejectBtn').style.marginLeft = '98px';
		}
		//document.getElementById("answerBtn").style.display = "block"
		document.getElementById('rejectBtn').style.display = 'block';
		document.getElementById('holdBtn').style.display = 'none';
		document.getElementById('declineBtn').style.display = 'none';
		document.getElementById('muteBtn').style.display = 'none';
		document.getElementById('holdPressedBtn').style.display = 'none';
		document.getElementById('mutePressedBtn').style.display = 'none';
		document.getElementById('imgActiveHold').style.backgroundImage =
			'url("../../../img/ringing-call.svg")';
	}
	resizeByElement('mainCall');
}

function setClientInfo(clientInfo) {
	let html = '';
	if (clientInfo instanceof Object) {
		for (let [key, value] of Object.entries(clientInfo)) {
			if (isValidHttpUrl(value)) {
				value = '<' + value + '>';
				html +=
					'<p>' +
					'<span style="font-weight:600">' +
					md.renderInline(key) +
					'</span>' +
					md.renderInline(`: ${value}`) +
					'</p>';
			} else {
				html +=
					'<p>' +
					'<span style="font-weight:600">' +
					md.renderInline(key) +
					'</span>' +
					md.renderInline(`: ${value}`) +
					'</p>';
			}
		}
	}
	document.getElementById('textInfo').innerHTML = html;
	resizeByElement('mainCall');
}

function isValidHttpUrl(string) {
	let url;
	try {
		url = new URL(string);
	} catch (_) {
		return false;
	}
	return url.protocol === 'http:' || url.protocol === 'https:';
}

function resizeByElement(name) {
	let element = document.getElementById(name);
	let h = Math.max(
		element.clientHeight,
		element.scrollHeight,
		element.offsetHeight,
	);
	sendSize([
		279,
		h,
	]);
}

function sendSize(arg) {
	ipcRenderer.send('resize-popap-win', arg);
}

function showHideClientInfo() {
	if (hidden === true) {
		let x = document.getElementById('infoClose');
		if (window.getComputedStyle(x).display === 'none') {
			x.style.display = 'flex';
		}
		let y = document.getElementById('infoOpen');
		if (window.getComputedStyle(y).display !== 'none') {
			y.style.display = 'none';
		}
	} else if (hidden === false) {
		let x = document.getElementById('infoClose');
		if (window.getComputedStyle(x).display !== 'none') {
			x.style.display = 'none';
		}
		let y = document.getElementById('infoOpen');
		if (window.getComputedStyle(y).display === 'none') {
			y.style.display = 'block';
		}
	}
	resizeByElement('mainCall');
}

function clearMessageTimeaut() {
	if (timerId) {
		clearTimeout(timerId);
		timerId = null;
	}
	processingTimer.clearTimeaut();
}

function setProcessingProperty(payload) {
	ipcRenderer.send('set-processing-property', payload);
}

function setProcessingInfo(arg) {
	memberId = arg.memberId;
	processingTimer.updateProgress(arg);
	setControls(arg);
}

function translation() {
	document.getElementById('successBtn').textContent = i18n.__(
		'notificationCall',
		'Yes',
	);
	document.getElementById('failBtn').textContent = i18n.__(
		'notificationCall',
		'No',
	);
	document.getElementById('closeBtn').textContent = i18n.__(
		'notificationCall',
		'Close',
	);
	document.getElementById('titleSaved').textContent = i18n.__(
		'notificationCall',
		'Saved',
	);
	document.getElementById('saveBtn').textContent = i18n.__(
		'notificationCall',
		'Save',
	);
	document.getElementById('answerBtn').textContent = i18n.__(
		'notificationCall',
		'Answer',
	);
	document.getElementById('rejectBtn').textContent = i18n.__(
		'notificationCall',
		'Reject',
	);
	document.getElementById('choiceYesLabel').textContent = i18n.__(
		'notificationCall',
		'Yes',
	);
	document.getElementById('choiceNoLabel').textContent = i18n.__(
		'notificationCall',
		'No',
	);
}

function setControls(arg) {
	if (arg.reporting.isSuccess) {
		document.getElementById('titleInfo').textContent = i18n.__(
			'notificationCall',
			'callSuccessfulText',
		);
		document.getElementById('titleInfo').style.marginTop = '30px';
		document.getElementById('controls').style.display = 'block';
		document.getElementById('failControls').style.display = 'none';
		sendSize([
			260,
			300,
		]);
	} else if (arg.memberId) {
		document.getElementById('titleInfo').textContent = i18n.__(
			'notificationCall',
			'scheduleCallText',
		);
		document.getElementById('titleInfo').style.marginTop = '10px';
		document.getElementById('controls').style.display = 'none';
		document.getElementById('failControls').style.display = 'block';
		setVisibleCalendar(arg);
	}
}

function setVisibleCalendar(arg) {
	document.getElementById('choiceYes').checked = arg.reporting.isScheduleCall
		? true
		: false;
	document.getElementById('choiceNo').checked = arg.reporting.isScheduleCall
		? false
		: true;
	if (arg.reporting.isScheduleCall) {
		window._makeCalender('set', arg.reporting.nextDistributeAt);
		document.getElementById('date-pick-container').style.display = 'block';
		sendSize([
			348,
			677,
		]);
	} else {
		document.getElementById('date-pick-container').style.display = 'none';
		sendSize([
			260,
			300,
		]);
	}
}

window.addEventListener(
	'keyup',
	(e) => {
		if (e.keyCode === 123) {
			ipcRenderer.send('open-close-DevTools');
		}
	},
	true,
);
