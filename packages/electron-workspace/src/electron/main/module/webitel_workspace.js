const { app, BrowserWindow, shell } = require('electron');
const path = require('path'),
	url = require('url');

class Workspace {
	window = null;

	createWindow(URL) {
		if (this.window) return;
		this.window = new BrowserWindow({
			minWidth: 900,
			minHeight: 600,
			autoHideMenuBar: true,
			title: 'Webitel',
			name: 'workspace',
			icon: path.join(__dirname, '../../../img/app-icon.png'),
			webPreferences: {
				webSecurity: false,
				contextIsolation: false, // protect against prototype pollution
				enableRemoteModule: true,
				nodeIntegration: true,
				preload: path.join(__dirname, '../../preload/workspace-preload.js'),
			},
		});

		this.window.maximize();
		//this.window.webContents.openDevTools()

		this.window.on('page-title-updated', (evt) => {
			evt.preventDefault();
		});

		this.window.webContents.setWindowOpenHandler((url) => {
			console.log(url);
			shell.openExternal(url.url);
			return {
				action: 'deny',
			};
		});

		this.window.loadURL(URL).catch((err) => {
			this.window.loadURL(
				url.format({
					pathname: path.join(
						__dirname,
						'../../renderer/error/err_message.html',
					),
					protocol: 'file:',
				}),
			);
		});

		this.window.on('close', (event) => {
			// close if windows sleep
			if (!this.window.doDestroy) {
				this.window.hide();
				event.preventDefault();
			}
		});

		this.window.on('closed', () => {
			this.window = null;
		});
	}

	changeSIP(value) {
		if (this.window) {
			let str = `{'ON_SITE':true,'CLI':{'debug':false,'registerWebDevice':${value}}}`;
			this.window.webContents.executeJavaScript(
				`localStorage.setItem("CONFIG", "${str}");`,
				true,
			);
		}
	}

	changeLang(lang) {
		if (this.window) {
			this.window.webContents.executeJavaScript(
				`localStorage.setItem("lang", "${lang}");`,
				true,
			);
			// this.reload()
		}
	}

	updateWindow(ob) {
		this.window
			.loadURL(ob.URL)
			.then(() => {
				app.relaunch({
					args: process.argv.slice(1).concat([
						'--relaunch',
					]),
				});
				app.exit(0);
			})
			.catch((err) => this.window.send('from-main', err));
	}

	sandCallAction(call) {
		this.window.webContents.send('call-action', call);
	}

	reload() {
		this.window.webContents.reloadIgnoringCache();
	}
}

module.exports = Workspace;
