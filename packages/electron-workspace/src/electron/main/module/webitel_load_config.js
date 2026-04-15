const { app, BrowserWindow } = require('electron');
const path = require('path'),
	url = require('url');

class LoadConfig {
	window = null;

	createWindow() {
		this.window = new BrowserWindow({
			width: 500,
			height: 256,
			autoHideMenuBar: true,
			title: 'Webitel',
			name: 'loadConfig',
			frame: false,
			icon: path.join(__dirname, '../../../../img/app-icon.png'),
			webPreferences: {
				contextIsolation: false,
				enableRemoteModule: true,
				nodeIntegration: true,
			},
		});

		//this.window.webContents.openDevTools()
		this.window.center();

		this.window.on('page-title-updated', (evt) => {
			evt.preventDefault();
		});

		this.window.loadURL(
			url.format({
				pathname: path.join(
					__dirname,
					'../../renderer/configuration/load_config.html',
				),
				protocol: 'file:',
			}),
		);

		this.window.on('close', (event) => {
			app.exit();
		});

		this.window.on('closed', () => {
			this.window = null;
		});
	}

	changeLang(lang) {
		this.window?.webContents?.reloadIgnoringCache();
	}

	hide() {
		if (this.window) this.window.hide();
	}

	collapsWindow() {
		this.window.minimize();
	}

	expandWindow() {
		if (this.window.isMaximized()) {
			this.window.unmaximize();
		} else {
			this.window.maximize();
		}
	}
}

module.exports = LoadConfig;
