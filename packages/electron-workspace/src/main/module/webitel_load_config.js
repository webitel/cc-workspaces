const { app, BrowserWindow } = require('electron');
const path = require('path');

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
			icon: path.join(app.getAppPath(), 'img/app-icon.png'),
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

		const devUrl = process.env.ELECTRON_RENDERER_URL;
		if (devUrl) {
			this.window.loadURL(`${devUrl}/windows/load-config/index.html`);
		} else {
			this.window.loadFile(
				path.join(__dirname, '../renderer/windows/load-config/index.html'),
			);
		}

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
