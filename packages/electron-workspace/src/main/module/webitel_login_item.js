const { app } = require('electron');
const { isLinux, isWindows } = require('../../shared/is');
const { config, updateConfig } = require('../../shared/config');

/** macOS + Windows only — Electron has no login-item API on Linux. */
const isSupported = () => !isLinux;

const getOpenAtLogin = () => Boolean(config().openAtLogin);

const applyLoginItemSettings = (openAtLogin) => {
	if (!isSupported()) return;

	const settings = {
		openAtLogin: Boolean(openAtLogin),
		// Always open on screen — never start hidden to tray.
		openAsHidden: false,
	};

	// path is Windows-only. NSIS/MSI: launch app exe (not Squirrel Update.exe).
	if (isWindows) {
		settings.path = process.execPath;
	}

	app.setLoginItemSettings(settings);
};

/** Persist to config.json and sync OS login item. */
const setOpenAtLogin = (openAtLogin) => {
	const enabled = Boolean(openAtLogin);
	updateConfig({
		openAtLogin: enabled,
	});
	applyLoginItemSettings(enabled);
};

/** Apply OS login item from config (source of truth). Default: false. */
const syncFromConfig = () => {
	const conf = config();
	if (conf.openAtLogin === undefined) {
		updateConfig({
			openAtLogin: false,
		});
	}
	applyLoginItemSettings(getOpenAtLogin());
};

module.exports = {
	isSupported,
	getOpenAtLogin,
	setOpenAtLogin,
	syncFromConfig,
};
