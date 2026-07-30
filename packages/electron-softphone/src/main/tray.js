const path = require('node:path');
const { Tray, Menu, app, shell } = require('electron');
const { STATES } = require('./softphone');
const { logsPath, configPath } = require('./config');

const icon = (name) => path.join(app.getAppPath(), 'img', name);

const ICONS = {
	waiting: icon('app-offline-icon.png'),
	registered: icon('app-online-icon.png'),
	inCall: icon('app-active-call-icon.png'),
	error: icon('app-busy-icon.png'),
};

const STATUS_LABELS = {
	[STATES.IDLE]: 'Waiting for workspace…',
	[STATES.CONNECTING]: 'Connecting…',
	[STATES.REGISTERING]: 'Registering SIP…',
	[STATES.REGISTERED]: 'Registered',
	[STATES.ERROR]: 'Error',
};

class SoftphoneTray extends Tray {
	#clients = 0;
	#lastState = {
		state: STATES.IDLE,
	};
	#inCall = false;

	constructor() {
		super(ICONS.waiting);
		if (process.platform === 'darwin' && app.dock) app.dock.hide();
		this.setToolTip('Webitel Softphone');
		this.#render();
	}

	updateState(state) {
		this.#lastState = state;
		this.#render();
	}

	updateClients(count) {
		this.#clients = count;
		this.#render();
	}

	updateInCall(inCall) {
		this.#inCall = inCall;
		this.#render();
	}

	#image() {
		if (this.#lastState.state === STATES.ERROR) return ICONS.error;
		if (this.#lastState.state !== STATES.REGISTERED) return ICONS.waiting;
		return this.#inCall ? ICONS.inCall : ICONS.registered;
	}

	#statusLine() {
		const { state, extension, lastError } = this.#lastState;
		if (state === STATES.REGISTERED && extension) {
			return `${STATUS_LABELS[state]} @${extension}`;
		}
		if (state === STATES.ERROR && lastError) {
			return `${STATUS_LABELS[state]}: ${lastError}`;
		}
		return STATUS_LABELS[state] || state;
	}

	#render() {
		this.setImage(this.#image());
		this.setToolTip(`Webitel Softphone — ${this.#statusLine()}`);
		this.setContextMenu(
			Menu.buildFromTemplate([
				{
					label: this.#statusLine(),
					enabled: false,
				},
				{
					label: `Workspace connections: ${this.#clients}`,
					enabled: false,
				},
				{
					type: 'separator',
				},
				{
					label: 'Open logs',
					click: () => shell.openPath(logsPath()),
				},
				{
					label: 'Open config',
					click: () => shell.showItemInFolder(configPath()),
				},
				{
					type: 'separator',
				},
				{
					label: 'Quit',
					click: () => app.exit(0),
				},
			]),
		);
	}
}

module.exports = SoftphoneTray;
