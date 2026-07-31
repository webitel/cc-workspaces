import type { IpcRenderer } from 'electron';

/**
 * Electron ipcRenderer via runtime Node require (nodeIntegration: true).
 * Bare `require('electron')` is resolved by Vite to the npm `electron`
 * package, which gets stubbed `path`/`fs` and breaks at runtime.
 */
export function getIpcRenderer(): IpcRenderer | null {
	try {
		const nodeRequire = window.require;
		if (typeof nodeRequire !== 'function') return null;
		return nodeRequire('electron').ipcRenderer as IpcRenderer;
	} catch {
		return null;
	}
}
