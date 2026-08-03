import path from 'node:path';
import { app, Menu, shell, Tray } from 'electron';
import { configPath, logsPath } from './config';
import { type SoftphoneStateSnapshot, STATES } from './softphone';

const icon = (name: string): string => path.join(app.getAppPath(), 'img', name);

const STATUS_LABELS: Record<string, string> = {
	[STATES.IDLE]: 'Waiting for workspace…',
	[STATES.CONNECTING]: 'Connecting…',
	[STATES.REGISTERING]: 'Registering SIP…',
	[STATES.REGISTERED]: 'Registered',
	[STATES.ERROR]: 'Error',
};

/** everything the tray renders; server-error handlers pass a partial */
export type TrayState = Partial<SoftphoneStateSnapshot> &
	Pick<SoftphoneStateSnapshot, 'state'>;

// Composition, NOT `extends Tray`: Electron's Tray constructor returns a
// native wrapper object that discards the subclass prototype, so methods
// defined on a subclass simply don't exist on the instance at runtime.
class SoftphoneTray {
	// resolved lazily: app.getAppPath() needs the ready app
	#icons = {
		waiting: icon('app-offline-icon.png'),
		registered: icon('app-online-icon.png'),
		inCall: icon('app-active-call-icon.png'),
		error: icon('app-busy-icon.png'),
	};
	#tray: Tray;
	#clients = 0;
	#lastState: TrayState = {
		state: STATES.IDLE,
	};
	#inCall = false;

	constructor() {
		this.#tray = new Tray(this.#icons.waiting);
		if (process.platform === 'darwin' && app.dock) app.dock.hide();
		this.#render();
	}

	updateState(state: TrayState): void {
		this.#lastState = state;
		this.#render();
	}

	updateClients(count: number): void {
		this.#clients = count;
		this.#render();
	}

	updateInCall(inCall: boolean): void {
		this.#inCall = inCall;
		this.#render();
	}

	#image(): string {
		if (this.#lastState.state === STATES.ERROR) return this.#icons.error;
		if (this.#lastState.state !== STATES.REGISTERED) return this.#icons.waiting;
		return this.#inCall ? this.#icons.inCall : this.#icons.registered;
	}

	#statusLine(): string {
		const { state, extension, lastError } = this.#lastState;
		if (state === STATES.REGISTERED && extension) {
			return `${STATUS_LABELS[state]} @${extension}`;
		}
		if (state === STATES.ERROR && lastError) {
			return `${STATUS_LABELS[state]}: ${lastError}`;
		}
		return STATUS_LABELS[state] || state;
	}

	#render(): void {
		this.#tray.setImage(this.#image());
		this.#tray.setToolTip(
			`Webitel Softphone Companion — ${this.#statusLine()}`,
		);
		this.#tray.setContextMenu(
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
					// app.quit() (not app.exit) so before-quit runs the graceful
					// SIP unregister in index.ts
					click: () => app.quit(),
				},
			]),
		);
	}
}

export default SoftphoneTray;
