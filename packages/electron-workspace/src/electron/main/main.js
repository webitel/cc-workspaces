const {
	app,
	ipcMain,
	powerMonitor,
	Notification,
	dialog,
	BrowserWindow,
} = require('electron');
const { autoUpdater } = require('electron-updater');
const conf = require('../shared/config').config();
const WebitelWindows = require('./windows');
const WebitelTray = require('./module/webitel_tray');
const { createPjsipBridge } = require('./sip/pjsip-bridge');

const win = new WebitelWindows();
let tray = {};
const pjsipBridge = createPjsipBridge({
	sendToWindows: (channel, payload) => {
		for (const window of BrowserWindow.getAllWindows()) {
			window.webContents.send(channel, payload);
		}
	},
});

autoUpdater.autoDownload = false;

app.commandLine.appendSwitch('ignore-certificate-errors', 'true');
app.commandLine.appendSwitch('allow-insecure-localhost', 'true');

app.setAsDefaultProtocolClient('wtel');

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
	app.quit();
} else {
	app.on('second-instance', (event, argv) => {
		win.restoreWindow();
		//todo fixme make-call
		if (process.platform === 'win32' || process.platform === 'linux') {
			win.makeCall(argv.slice(1)[0]);
		}
	});
}

function sendStatusToWindow(text) {
	console.log(text);
	showNotification(text);
}

function isValidUrl(str) {
	const pattern = /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,})(:\d{2,5})?([/?].*)?$/i;
	return pattern.test(str);
}

function formatBytes(bytes, decimals = 2) {
	if (!+bytes) return '0 Bytes';

	const k = 1024;
	const dm = decimals < 0 ? 0 : decimals;
	const sizes = [
		'Bytes/s',
		'KB/s',
		'MB/s',
		'GB/s',
		'TB/s',
		'PB/s',
		'EB/s',
		'ZB/s',
		'YB/s',
	];

	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
}

function showNotification(body) {
	new Notification({
		title: 'Webitel Updater',
		body: body,
	}).show();
}

autoUpdater.on('checking-for-update', () => {
	sendStatusToWindow('Checking for update...');
});
autoUpdater.on('update-available', () => {
	dialog
		.showMessageBox({
			type: 'info',
			title: 'Found Updates',
			message: 'Found updates, do you want update now?',
			buttons: [
				'Yes',
				'No',
			],
		})
		.then((buttonIndex) => {
			if (buttonIndex === 0) {
				setImmediate(() => autoUpdater.downloadUpdate());
			}
		});
});
autoUpdater.on('update-not-available', (info) => {
	sendStatusToWindow('Update not available.');
});
autoUpdater.on('error', (err) => {
	sendStatusToWindow('Error in auto-updater. ' + err);
});
autoUpdater.on('download-progress', (progressObj) => {
	let log_message =
		'Download speed: ' + formatBytes(progressObj.bytesPerSecond);
	log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
	sendStatusToWindow(log_message);
});

autoUpdater.on('update-downloaded', () => {
	dialog
		.showMessageBox({
			title: 'Install Updates',
			message: 'Updates downloaded, application will be quit for update...',
		})
		.then(() => {
			setImmediate(() => autoUpdater.quitAndInstall());
		});
});

app.on('ready', () => {
	if (conf.updateEndpoint && isValidUrl(conf.updateEndpoint)) {
		autoUpdater.setFeedURL(conf.updateEndpoint);
		autoUpdater.checkForUpdatesAndNotify().then(() => {
			win.start();
			createAndSubscribeTray();
			subscribePowerMonitor();
		});
	} else {
		win.start();
		createAndSubscribeTray();
		subscribePowerMonitor();
	}
});

ipcMain.handle('get-userData-path', async (event) => {
	const result = await require('../shared/config').config();
	return result;
});

ipcMain.handle('get-localStore', async (event) => {
	const result = await require('../shared/config').storagePath();
	return result;
});

ipcMain.on('file-open', (event, args) => {
	win.opendDialog();
});

ipcMain.on('update-tray', (event, args) => {
	tray.updateTray(args);
});

ipcMain.on('reload-page', async (event, args) => {
	win.workspace.reload();
});

ipcMain.on('remove-call-info', (event, args) => {
	win.removeCall(args);
});

ipcMain.on('call-action', (event, args) => {
	win.callAction(args);
});

ipcMain.on('set-acive-call', (event, args) => {
	win.setActiveCall(args);
});

ipcMain.on('set-acive-chat', (event, args) => {
	win.setActiveChat(args);
});

ipcMain.on('update-acive-call', (event, args) => {
	win.callNotification.updateActiveCall(args);
});

ipcMain.on('destroy-notification-window', (event, args) => {
	win.callNotification.destroyNotification();
	tray.setDefaultTray();
});

ipcMain.on('open-disconnect-popup', (event, args) => {
	win.showDisconnectNotification();
});

ipcMain.on('hide-disconnect-popup', (event, args) => {
	win.hideDisconnectNotification();
});

ipcMain.on('collaps-window', (event, args) => {
	win.callNotification.collapsWindow();
});

ipcMain.on('open-close-DevTools', (event, args) => {
	win.openDevTools();
});

ipcMain.on('resize-popap-win', (event, args) => {
	win.callNotification.resize(args);
});

ipcMain.on('update-procesing', (event, args) => {
	win.updateProcessing(args);
});

ipcMain.on('set-processing-property', (event, args) => {
	win.setProcessingProperty(args);
});

ipcMain.on('send-reporting', (event, args) => {
	win.sendReporting();
});

ipcMain.on('clear-processing', (event, args) => {
	win.clearProcessing();
});

ipcMain.on('close-success-message', (event, args) => {
	win.closeSuccessMessage();
});

ipcMain.on('reset-timer', (event, args) => {
	win.resetTime();
});

ipcMain.on('collaps-load-window', (event, args) => {
	win.collapsWindow();
});

ipcMain.on('expand-load-window', (event, args) => {
	win.expandWindow();
});

ipcMain.on('close-load-window', (event, args) => {
	win.closeWindow();
});

ipcMain.handle('sip_checked', (event, args) => {
	return tray.lStorage.getSIP();
});
ipcMain.handle('sip-worker:request', async (event, payload = {}) => {
	try {
		return await pjsipBridge.request(payload.method, payload.args || []);
	} catch (err) {
		console.error('[sip] request failed', payload.method, err);
		throw err;
	}
});
ipcMain.handle('restart', (event, args) => {
	console.error('restart');
	app.relaunch({
		args: process.argv.slice(1).concat([
			'--relaunch',
		]),
	});
	app.exit(0);
});

app.on('before-quit', () => {
	pjsipBridge.stop();
});

function createAndSubscribeTray() {
	tray = new WebitelTray();
	tray.on('file-open', () => {
		win.opendDialog();
	});
	tray.on('change-status', (status) => {
		win.changeUserStatus(status);
	});
	tray.on('on-change-lang', (id) => {
		win.onChangeLang(id);
	});
	tray.on('show-hide-window', () => {
		win.setWorkspaceVisible();
	});
	tray.on('on-change-SIP', (value) => {
		win.onChangeSIP(value);
	});
}

function subscribePowerMonitor() {
	console.log('subscribePowerMonitor');
	powerMonitor.on('unlock-screen', () => {
		console.log('The system is going to ready', new Date());
		if (win) {
			win.resume();
		}
	});

	powerMonitor.on('lock-screen', () => {
		console.log('The system is going to lock-screen', new Date());
		if (win) {
			win.sleep();
		}
	});

	powerMonitor.on('resume', () => {
		console.log('The system is going to ready', new Date());
		if (win) {
			win.resume();
		}
	});

	powerMonitor.on('suspend', () => {
		console.log('The system is going to sleep', new Date());
		if (win) {
			win.sleep();
		}
	});
}
