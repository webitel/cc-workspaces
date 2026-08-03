const LStorage = require('../shared/localStore');
const { app, BrowserWindow, dialog, shell } = require('electron'),
	//Positioner = require('electron-positioner'),
	Config = require('./module/webitel_config'),
	Workspace = require('./module/webitel_workspace'),
	conf = require('../shared/config').config(),
	LoadConfig = require('./module/webitel_load_config'),
	CallNotification = require('./module/webitel_call_notification'),
	DisconnectNotification = require('./module/webitel_disconnect_notification'),
	{ isAlive } = require('./module/window_utils');

class WebitelWindows {
	lStorage = new LStorage();
	config = new Config();
	loadConfig = new LoadConfig();
	callNotification = new CallNotification();
	workspace = new Workspace();
	disconnectNotification = new DisconnectNotification();
	openUrlOnAnswer = conf.openUrlOnAnswer;
	_resumeTimer = null;

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
		// already gone == already asleep
		if (!isAlive(this.workspace.window)) return;
		this.workspace.window.doDestroy = true;
		this.workspace.window.close();
	}

	resume() {
		// macOS fires both 'resume' and 'unlock-screen' on wake — keep one timer
		clearTimeout(this._resumeTimer);
		this._resumeTimer = setTimeout(() => {
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
		if (!isAlive(this.workspace.window)) return;
		this.workspace.window.webContents.send('change-SIP', {
			isSIP: value,
			timeoutSIP: conf.timeoutSIP,
			codecs: conf.codecs,
			debugMode: conf.debugMode,
		});
	}

	callAction(action) {
		const call = this.callNotification.setCallAction(action);
		this.workspace.sandCallAction(call);
	}

	sendMessage(event, message) {
		if (isAlive(this.loadConfig?.window))
			this.loadConfig.window.webContents.send(event, message);

		if (isAlive(this.workspace?.window))
			this.workspace.window.webContents.send(event, message);
	}

	openDevTools() {
		const w = BrowserWindow.getFocusedWindow();
		if (!w) return;
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
			Object.hasOwn(chat.variables, this.openUrlOnAnswer)
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
			Object.hasOwn(call.variables, this.openUrlOnAnswer)
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
		if (isAlive(this.workspace.window)) {
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
				.catch((err) => {
					if (!isAlive(this.workspace.window)) return;
					this.workspace.window.webContents.send('from-main', err);
				});
		} else {
			if (this._isValidHttpUrl(ob.URL)) {
				this.loadConfig.hide();
				this.config.writeConfig();
				this.start(ob.URL);
			} else if (isAlive(this.loadConfig.window)) {
				this.loadConfig.window.webContents.send(
					'from-main',
					'URL Is Not Valid',
				);
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
		if (isAlive(this.workspace.window))
			this.workspace.window.isVisible()
				? this.workspace.window.hide()
				: this.workspace.window.show();
	}

	changeUserStatus(status) {
		if (!isAlive(this.workspace.window)) return;
		this.workspace.window.webContents.send('change-status', status);
	}

	removeCall(args) {
		this.callNotification.removeCall(args);
	}

	restoreWindow() {
		const workspaceWin = isAlive(this.workspace.window)
			? this.workspace.window
			: null;
		const target =
			workspaceWin ||
			(isAlive(this.loadConfig?.window) ? this.loadConfig.window : null);
		if (!target) return;

		if (target.isMinimized()) target.restore();
		if (!target.isVisible()) target.show();
		target.focus();
		if (workspaceWin) {
			workspaceWin.center();
		}
	}

	makeCall(destination = null) {
		if (!destination) return;
		if (!isAlive(this.workspace.window)) return;
		this.workspace.window.webContents.send('make-call', destination);
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
		if (!isAlive(this.disconnectNotification.window)) return;
		this.disconnectNotification.setBounds();
		this.disconnectNotification.window.show(); // https://webitel.atlassian.net/browse/WTEL-9965
	}

	hideDisconnectNotification() {
		if (!isAlive(this.disconnectNotification.window)) return;
		this.disconnectNotification.window.hide();
	}
}

module.exports = WebitelWindows;
