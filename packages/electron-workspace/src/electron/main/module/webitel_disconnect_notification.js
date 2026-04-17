const { BrowserWindow, app, screen } = require('electron');
const path = require('path'),
	url = require('url');

class DisconnectNotification {
	window = null;
	widtNotification = 281;
	heightNotification = 240;
	x = 0;
	y = 0;

	createWindow() {
		const displayBounds = screen.getPrimaryDisplay();
		const { width, height } = displayBounds.workAreaSize;
		this.x = width - (this.widtNotification + 20);
		this.y = height - (this.heightNotification + 30);

		this.window = new BrowserWindow({
			width: this.widtNotification,
			height: this.heightNotification,
			x: this.x,
			y: this.y,
			show: false,
			autoHideMenuBar: true,
			title: 'Webitel',
			name: 'disconnectNotification',
			frame: false,
			icon: path.join(__dirname, '../../../../img/app-icon.png'),
			webPreferences: {
				contextIsolation: false,
				enableRemoteModule: true,
				nodeIntegration: true,
			},
		});

		this.window.setAlwaysOnTop(true, 'screen');

		//this.window.webContents.openDevTools()

		this.window.on('page-title-updated', (evt) => {
			evt.preventDefault();
		});

		this.window.loadURL(
			url.format({
				pathname: path.join(
					__dirname,
					'../../renderer/error/disconnect_notification.html',
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

	setBounds() {
		this.window.setBounds({
			width: this.widtNotification,
			height: this.heightNotification,
			x: this.x,
			y: this.y,
		});
	}
}

module.exports = DisconnectNotification;
