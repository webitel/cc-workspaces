const { app, Tray, Menu, MenuItem } = require('electron');
const { isLinux, isOSX } = require('../../shared/is');
const LStorage = require('../../shared/localStore');

const path = require('path');
const { AgentPauseCauseServiceApiAxiosParamCreator } = require('webitel-sdk');
const greenIcon = path.join(__dirname, '../../../../img/app-online-icon.png'),
	yelloIcon = path.join(__dirname, '../../../../img/app-pause-icon.png'),
	greyIcon = path.join(__dirname, '../../../../img/app-offline-icon.png'),
	redIcon = path.join(__dirname, '../../../../img/app-busy-icon.png');

class WebitelTray extends Tray {
	isStatus = false;
	menuConfig = null;
	lStorage = new LStorage();

	constructor() {
		super(greyIcon);
		if (isOSX) {
			app.dock.setIcon(greenIcon);
		}

		this.setDefaultTray();

		this.on('click', () => this.emit('show-hide-window'));
	}

	setDefaultTray = () => {
		var i18n = new (require('../../shared/i18n/i18n'))();
		this.menuConfig = Menu.buildFromTemplate([
			{
				label: i18n.__('tray', 'Settings'),
				submenu: [
					{
						label: i18n.__('tray', 'UploadConfig'),
						click: () => this.emit('file-open'),
					},
					{
						label: i18n.__('tray', 'Language'),
						submenu: [
							{
								id: 'en',
								label: 'English',
								click: this._handleLangClick,
								type: 'radio',
								checked: 'en' === this.lStorage.getLang(),
							},
							{
								id: 'ua',
								label: 'Українська',
								click: this._handleLangClick,
								type: 'radio',
								checked: 'ua' === this.lStorage.getLang(),
							},
							{
								id: 'ru',
								label: 'Русский',
								click: this._handleLangClick,
								type: 'radio',
								checked: 'ru' === this.lStorage.getLang(),
							},
						],
					},
					{
						id: 'SIP',
						label: i18n.__('tray', 'SIP'),
						click: this._handleSIPClick,
						type: 'checkbox',
						checked: true === this.lStorage.getSIP(),
					},
				],
			},
			{
				type: 'separator',
			},
			{
				label: i18n.__('tray', 'Exit'),
				click: () => app.exit(0),
			},
		]);

		if (isLinux) this._configTrayFoLinux();

		this.isStatus = false;

		this.setImage(greyIcon);
		this.setToolTip('Webitel');
		this.setContextMenu(this.menuConfig);
	};

	updateTray = (status) => {
		if (!this.isStatus) this._setStatus();
		this._updateImage(status);
		this._setChecked(status);
		this._setSipChecked('SIP', this.lStorage.getSIP());
	};

	_configTrayFoLinux = () => {
		this.menuConfig.insert(
			0,
			new MenuItem({
				type: 'separator',
			}),
		);
		this.menuConfig.insert(
			0,
			new MenuItem({
				label: 'Workspace',
				click: () => this.emit('show-hide-window'),
			}),
		);
	};

	_setStatus = () => {
		var i18n = new (require('../../shared/i18n/i18n'))();
		this.menuConfig.insert(
			0,
			new MenuItem({
				type: 'separator',
			}),
		);
		this.menuConfig.insert(
			0,
			new MenuItem({
				id: 'pause',
				label: i18n.__('tray', 'Pause'),
				click: this._handleClick,
				type: 'radio',
			}),
		);
		this.menuConfig.insert(
			0,
			new MenuItem({
				id: 'offline',
				label: i18n.__('tray', 'Offline'),
				click: this._handleClick,
				type: 'radio',
			}),
		);
		this.menuConfig.insert(
			0,
			new MenuItem({
				id: 'online',
				label: i18n.__('tray', 'Online'),
				click: this._handleClick,
				type: 'radio',
			}),
		);
		this.menuConfig.insert(
			0,
			new MenuItem({
				id: 'busy',
				visible: false,
				type: 'radio',
			}),
		);
		this.isStatus = true;
	};

	_updateImage = (status) => {
		switch (status) {
			case 'online':
				this.setImage(greenIcon);
				break;
			case 'pause':
				this.setImage(yelloIcon);
				break;
			case 'offline':
				this.setImage(greyIcon);
				break;
			default:
				this.setImage(redIcon);
		}
		this.setToolTip(status);
	};

	_sendEvent = (status) => {
		this.emit('change-status', status);
	};

	_handleClick = (menuItem) => {
		this._sendEvent(menuItem.id);
	};

	_handleLangClick = (menuItem) => {
		this.lStorage.setLang(menuItem.id);
		this.emit('on-change-lang', menuItem.id);
	};

	_handleSIPClick = (isSip) => {
		this.lStorage.setSIP(isSip.checked);
		this.emit('on-change-SIP', isSip.checked);
	};

	_setChecked = (status) => {
		let menuItem = this.menuConfig.getMenuItemById(status);
		if (menuItem) menuItem.checked = true;
		else {
			menuItem = this.menuConfig.getMenuItemById('busy');
			menuItem.checked = true;
		}
		if (isLinux) this.setContextMenu(this.menuConfig);
	};

	_setSipChecked = (id, state) => {
		const menuItem = this.menuConfig.getMenuItemById(id);
		if (menuItem && !menuItem.checked) menuItem.checked = state;
	};
}

module.exports = WebitelTray;
