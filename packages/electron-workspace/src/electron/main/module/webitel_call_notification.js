const { BrowserWindow, shell, screen } = require('electron');
const { isDev, isOSX, isWindows, isLinux } = require('../../shared/is');
const path = require('path'),
	url = require('url');
const fs = require('fs');
const conf = require('../../shared/config').config();

class CallNotification {
	window = {};
	call = null;
	//isNawProcesing = false
	widtNotification = 281;
	heightNotification = 186;
	x = 0;
	y = 0;

	createWindow() {
		const displayBounds = screen.getPrimaryDisplay();
		let { width, height } = displayBounds.workAreaSize;
		this.x = width - (this.widtNotification + 20);
		this.y = height - (this.heightNotification + 30);

		this.window = new BrowserWindow({
			autoHideMenuBar: true,
			focus: true,
			frame: false,
			hasShadow: true,
			alwaysOnTop: true,
			show: false,
			width: this.widtNotification,
			height: this.heightNotification,
			x: this.x,
			y: this.y,
			title: 'Webitel',
			useContentSize: true,
			name: 'callNotification',
			titleBarStyle: 'hidden',
			icon: path.join(__dirname, '../../../img/app-active-call-icon.png'),
			webPreferences: {
				contextIsolation: false,
				enableRemoteModule: true,
				nodeIntegration: true,
				// preload: path.join(__dirname, '../../preload/call-preload.js')
			},
		});
		this.window.flashFrame(false);
		const vueCallPath = path.join(
			__dirname,
			'../../../renderer/call-vue/index.html',
		);
		const legacyCallPath = path.join(
			__dirname,
			'../../../renderer/call/notification_call.html',
		);
		const useVueCallUi = process.env.ELECTRON_USE_VUE_CALL_UI === '1';
		const callWindowPath =
			useVueCallUi && fs.existsSync(vueCallPath) ? vueCallPath : legacyCallPath;

		this.window.loadURL(
			url.format({
				pathname: callWindowPath,
				protocol: 'file:',
				slashes: true,
			}),
		);
		//this.window.webContents.openDevTools()

		this.window.setAlwaysOnTop(true, 'screen');

		//this.window.setAutoResize(false)

		this.window.webContents.on('new-window', function (event, url) {
			console.log(url);
			event.preventDefault();
			shell.openExternal(url);
		});
		this.window.webContents.on('will-navigate', function (event, url) {
			console.log(url);
			event.preventDefault();
			shell.openExternal(url);
		});

		//this.window.webContents.openDevTools()

		if (isWindows) {
			this.window.setAppDetails({
				appId: 'callNotification',
			});
		}

		this.window.on('close', (event) => {
			this.window.minimize();
			event.preventDefault();
		});

		this.window.on('will-resize', (e) => {
			//prevent resizing even if resizable property is true.
			e.preventDefault();
		});
	}

	removeCall(arg) {
		if (this.call && this.call.id === arg.removeId) {
			if (arg.reserveCall) this.setActiveCall(arg.reserveCall);
			else if (!this.isNawProcesing) this.destroyNotification();
		}
	}

	setCallAction(action) {
		this.call.action = action;
		return this.call;
	}

	destroyNotification() {
		this.call = null;
		this.isNawProcesing = false;
		this.window.hide();
		if (this.window && this.window.webContents) {
			this.window.webContents.send('destroy-notification');
		}
	}

	collapsWindow() {
		this.window.minimize();
	}

	updateActiveCall(callOb) {
		if (this.call && this.call.id === callOb.id) {
			this.call = callOb;

			if (callOb.action === 'features/call/TOGGLE_MUTE')
				callOb.muted = !callOb.muted;
			if (callOb.action === 'features/call/TOGGLE_HOLD')
				callOb.isHold = !callOb.isHold;

			this._showCall(callOb);
		}
	}

	resize(arg) {
		if (
			arg[0] !== this.widtNotification ||
			arg[1] !== this.heightNotification
		) {
			this.widtNotification = arg[0];
			this.heightNotification = arg[1];
			this.window.setResizable(true);
			this.window.setSize(arg[0], arg[1], false);
			this.window.setResizable(false);
		}
	}

	setActiveCall(arg) {
		if (!this.isNawProcesing) {
			this.call = arg;
			this.window.show();
			this._showCall(arg);
		}
	}

	_showCall(ob) {
		if (conf.showNumber) {
			ob.showNumber = conf.showNumber;
		}
		this.window.webContents.send('show-call', ob);
		this._setIcon(ob.isHold);
		/* let positioner = new Positioner(this.callNotification)
        positioner.move('bottomRight') */
	}

	/* setPosition() {
        const windowBounds = this.window.getBounds()
        const displayBounds = screen.getPrimaryDisplay()
        let v = this.window.getContentSize()
        //this.window.setContentSize(300,300)
        v = this.window.getContentSize()
        if(displayBounds){
            if((windowBounds.x < (-this.widtNotification / 2) || windowBounds.y < (-this.heightNotification / 2)) 
                || displayBounds.bounds.width < (windowBounds.x + (this.widtNotification / 2))
                || displayBounds.bounds.height < (windowBounds.y + (this.heightNotification / 2))) {
                 this.window.setBounds({
                    width: this.widtNotification,
                    height: this.heightNotification,
                    x: this.x,
                    y: this.y
                }) 
                //this.window.setSize(this.widtNotification, this.heightNotification)
                //this.window.setPosition(this.x, this.y)
                //let positioner = new Positioner(this.window)
                //positioner.move('bottomRight') 
            }
        }
    } */

	_setIcon(isHold) {
		if (isHold)
			this.window.setOverlayIcon(
				path.join(__dirname, '../../../img/icon-pause.png'),
				'pause',
			);
		else this.window.setOverlayIcon(null, 'active');
	}

	show() {
		this.window.show();
	}

	hide() {
		this.window.hide();
	}

	updateProcessing(arg) {
		let needShow = !this.isNawProcesing;
		this.call = arg;
		this.isNawProcesing = true;
		// todo
		if (!(this.call && this.call.task && this.call.task.hasForm)) {
			this.window.webContents.send('set-processing-info', arg);
		}
		if (needShow && !conf.hidePostProcessing) {
			this.show();
		} else if (conf.hidePostProcessing) {
			this.destroyNotification();
		}
	}

	clearProcessing() {
		if (this.isNawProcesing) {
			this.isNawProcesing = false;
			let left = Math.round(
				(this.call.processingTimeoutAt - this.call.now) / 1000,
			); // to do ...
			if (left > 0 && !conf.hidePostProcessing) {
				this.window.webContents.send('show-success-message');
			} else {
				this.destroyNotification();
			}
		}
	}

	changeLang(lang) {
		this.window?.webContents?.reloadIgnoringCache();
	}

	getCallId() {
		return this.call.id;
	}

	getTaskId() {
		return this.call.taskId;
	}
}

module.exports = CallNotification;
