const LStorage = require('../shared/localStore');
const { app, BrowserWindow, dialog, shell } = require('electron'),
	//Positioner = require('electron-positioner'),
	Config = require('./module/webitel_config'),
	Workspace = require('./module/webitel_workspace'),
	conf = require('../shared/config').config(),
	LoadConfig = require('./module/webitel_load_config'),
	CallNotification = require('./module/webitel_call_notification'),
	DisconnectNotification = require('./module/webitel_disconnect_notification');

class WebitelWindows {
	lStorage = new LStorage();
	config = new Config();
	loadConfig = new LoadConfig();
	callNotification = new CallNotification();
	workspace = new Workspace();
	disconnectNotification = new DisconnectNotification();
	openUrlOnAnswer = conf.openUrlOnAnswer;

	start(URL = conf.URL, useSIP = conf.useSIP) {
		if (URL) {
			this.workspace.createWindow(URL, useSIP);
			this.callNotification.createWindow();
		} else {
			this.loadConfig.createWindow();
		}
		this.disconnectNotification.createWindow();
	}

	sleep() {
		if (this.workspace.window) {
			this.workspace.window.doDestroy = true;
			this.workspace.window.close();
		}
	}

	resume() {
		setTimeout(() => {
			this.workspace.createWindow(conf.URL, conf.useSIP);
		}, 5000);
	}

	onChangeLang(lang) {
		this.workspace.changeLang(lang);
		this.callNotification.changeLang(lang);
		this.loadConfig.changeLang(lang);
		this.disconnectNotification.changeLang(lang);
		setTimeout(() => {
			app.relaunch({
				args: process.argv.slice(1).concat([
					'--relaunch',
				]),
			});
			app.exit(0);
		}, 500);
	}

	onChangeSIP(value) {
		this.workspace.window.webContents.send('change-SIP', {
			isSIP: value,
			timeoutSIP: conf.timeoutSIP,
			codecs: conf.codecs,
			debugMode: conf.debugMode,
		});
	}

	callAction(action) {
		let call = this.callNotification.setCallAction(action);
		this.workspace.sandCallAction(call);
	}

	sendMessage(event, message) {
		if (this.loadConfig?.window)
			this.loadConfig?.window.webContents.send(event, message);

		if (this.workspace?.window)
			this.workspace.window.webContents.send(event, message);
	}

	openDevTools() {
		let w = BrowserWindow.getFocusedWindow();
		w.webContents.isDevToolsOpened()
			? w.webContents.closeDevTools()
			: w.webContents.openDevTools();
	}

	setActiveCall(arg) {
		this.callNotification.setActiveCall(arg);
		if (arg.isAnswerIvent === true) {
			this.opnLink(arg);
		}
	}

	setActiveChat(arg) {
		this.opnLinkChat(arg);
	}

	opnLinkChat(chat) {
		if (
			this.openUrlOnAnswer &&
			chat &&
			chat.variables &&
			chat.variables.hasOwnProperty(this.openUrlOnAnswer)
		) {
			var url = chat.variables[this.openUrlOnAnswer];
			const protocol = require('url').parse(url).protocol;
			if (protocol === 'http:' || protocol === 'https:') {
				shell.openExternal(url);
			}
		}
	}

	opnLink(call) {
		if (
			this.openUrlOnAnswer &&
			call &&
			call.variables &&
			call.variables.hasOwnProperty(this.openUrlOnAnswer)
		) {
			var url = call.variables[this.openUrlOnAnswer];
			const protocol = require('url').parse(url).protocol;
			if (protocol === 'http:' || protocol === 'https:') {
				shell.openExternal(url);
			}
		}
	}

	opendDialog() {
		dialog
			.showOpenDialog({
				properties: [
					'openFile',
				],
			})
			.then((fileObj) => {
				if (!fileObj.canceled) {
					const data = this.config.readConfig(fileObj.filePaths[0]);
					if (data.err) throw new Error(data.err);
					this.openUrlOnAnswer = data.ob.openUrlOnAnswer;
					return data.ob;
				} else {
					throw new Error();
				}
			})
			.then((ob) => {
				this.restartWorkspace(ob);
			})
			.catch((err) => {
				if (err.message) this.sendMessage('from-main', err);
			});
	}

	restartWorkspace(ob) {
		if (this.workspace.window) {
			this.workspace.window
				.loadURL(ob.URL)
				.then(() => {
					this.loadConfig.hide();
					this.config.writeConfig();
				})
				.then(() => {
					app.relaunch({
						args: process.argv.slice(1).concat([
							'--relaunch',
						]),
					});
					app.exit(0);
				})
				.catch((err) => this.workspace.window.send('from-main', err));
		} else {
			if (this._isValidHttpUrl(ob.URL)) {
				this.loadConfig.hide();
				this.config.writeConfig();
				this.start(ob.URL);
			} else {
				this.loadConfig.window.send('from-main', 'URL Is Not Valid');
			}
		}
	}

	_isValidHttpUrl(string) {
		let url;
		try {
			url = new URL(string);
		} catch (_) {
			return false;
		}

		return url.protocol === 'http:' || url.protocol === 'https:';
	}

	setWorkspaceVisible() {
		if (this.workspace.window)
			this.workspace.window.isVisible()
				? this.workspace.window.hide()
				: this.workspace.window.show();
	}

	changeUserStatus(status) {
		this.workspace.window.webContents.send('change-status', status);
	}

	removeCall(args) {
		this.callNotification.removeCall(args);
	}

	restoreWindow() {
		if (this.workspace.window) {
			if (this.workspace.window.isMinimized()) this.workspace.window.restore();
			this.workspace.window.isVisible() ? null : this.workspace.window.show();
			this.workspace.window.focus();
			this.workspace.window.center();
		}
	}

	updateProcessing(arg) {
		this.callNotification.updateProcessing(arg);
	}

	setProcessingProperty(arg) {
		arg.id = this.callNotification.getCallId();
		this.workspace.window.webContents.send('set-processing-property', arg);
	}

	sendReporting() {
		this.workspace.window.webContents.send(
			'send-reporting',
			this.callNotification.getCallId(),
		);
	}

	makeCall(destination = null) {
		if (!destination) return;
		this.workspace.window.webContents.send('make-call', destination);
	}

	clearProcessing() {
		this.callNotification.clearProcessing();
	}

	closeSuccessMessage() {
		this.callNotification.hide();
	}

	resetTime() {
		this.workspace.window.webContents.send(
			'reset-timer',
			this.callNotification.getTaskId(),
		);
	}

	collapsWindow() {
		this.loadConfig.collapsWindow();
	}

	expandWindow() {
		this.loadConfig.expandWindow();
	}

	closeWindow() {
		app.exit(0);
	}

	showDisconnectNotification() {
		this.disconnectNotification.setBounds();
		this.disconnectNotification.window.show();
	}

	hideDisconnectNotification() {
		this.disconnectNotification.window.hide();
	}
}

module.exports = WebitelWindows;
