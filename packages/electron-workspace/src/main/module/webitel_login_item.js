const { app, dialog, shell } = require('electron');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { isLinux, isWindows, isOSX } = require('../../shared/is');
const { config, updateConfig } = require('../../shared/config');

const LAUNCH_AGENT_LABEL = 'org.webitel.openAtLogin';

/** macOS + Windows only — Electron has no login-item API on Linux. */
const isSupported = () => !isLinux;

const getOpenAtLogin = () => Boolean(config().openAtLogin);

const getAppBundlePath = () => {
	// /Applications/Webitel.app/Contents/MacOS/Webitel → /Applications/Webitel.app
	if (process.execPath.includes('.app/Contents/MacOS/')) {
		return process.execPath.replace(/\/Contents\/MacOS\/[^/]+$/, '');
	}
	return process.execPath;
};

const getLaunchAgentPath = () =>
	path.join(
		app.getPath('home'),
		'Library/LaunchAgents',
		`${LAUNCH_AGENT_LABEL}.plist`,
	);

/**
 * LaunchAgent fallback for macOS. SMAppService (setLoginItemSettings) can report
 * Enabled but still not launch on some macOS versions; RunAtLoad agent is reliable.
 */
const setMacLaunchAgent = (enabled) => {
	const plistPath = getLaunchAgentPath();
	const agentsDir = path.dirname(plistPath);
	const uid = typeof process.getuid === 'function' ? process.getuid() : 501;
	const domain = `gui/${uid}`;

	if (enabled) {
		if (!fs.existsSync(agentsDir)) {
			fs.mkdirSync(agentsDir, {
				recursive: true,
			});
		}

		const appBundle = getAppBundlePath();
		const plist = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>Label</key>
	<string>${LAUNCH_AGENT_LABEL}</string>
	<key>ProgramArguments</key>
	<array>
		<string>/usr/bin/open</string>
		<string>-a</string>
		<string>${appBundle}</string>
	</array>
	<key>RunAtLoad</key>
	<true/>
	<key>LimitLoadToSessionType</key>
	<string>Aqua</string>
</dict>
</plist>
`;
		fs.writeFileSync(plistPath, plist);

		try {
			execFileSync(
				'launchctl',
				[
					'bootout',
					`${domain}/${LAUNCH_AGENT_LABEL}`,
				],
				{
					stdio: 'ignore',
				},
			);
		} catch {
			/* not loaded yet */
		}

		try {
			execFileSync(
				'launchctl',
				[
					'bootstrap',
					domain,
					plistPath,
				],
				{
					stdio: 'ignore',
				},
			);
		} catch (err) {
			console.error('launchctl bootstrap failed', err);
			try {
				execFileSync(
					'launchctl',
					[
						'load',
						'-w',
						plistPath,
					],
					{
						stdio: 'ignore',
					},
				);
			} catch (loadErr) {
				console.error('launchctl load failed', loadErr);
			}
		}
		return;
	}

	try {
		execFileSync(
			'launchctl',
			[
				'bootout',
				`${domain}/${LAUNCH_AGENT_LABEL}`,
			],
			{
				stdio: 'ignore',
			},
		);
	} catch {
		try {
			execFileSync(
				'launchctl',
				[
					'unload',
					'-w',
					plistPath,
				],
				{
					stdio: 'ignore',
				},
			);
		} catch {
			/* already unloaded */
		}
	}

	if (fs.existsSync(plistPath)) {
		fs.unlinkSync(plistPath);
	}
};

const openLoginItemsSettings = () => {
	// System Settings → General → Login Items (macOS 13+)
	shell.openExternal(
		'x-apple.systempreferences:com.apple.LoginItems-Settings.extension',
	);
};

const getOsLoginItemStatus = () => {
	if (!isSupported()) {
		return {
			openAtLogin: false,
			status: 'not-registered',
		};
	}
	return app.getLoginItemSettings();
};

const applyLoginItemSettings = (openAtLogin) => {
	if (!isSupported()) return getOsLoginItemStatus();

	const enabled = Boolean(openAtLogin);

	const settings = {
		openAtLogin: enabled,
	};

	// path is Windows-only. NSIS/MSI: launch app exe (not Squirrel Update.exe).
	if (isWindows) {
		settings.path = process.execPath;
	}

	// Do not pass openAsHidden on macOS 13+ (deprecated / ignored; can confuse callers).
	app.setLoginItemSettings(settings);

	if (isOSX) {
		setMacLaunchAgent(enabled);
	}

	const result = getOsLoginItemStatus();
	console.log('login item settings applied', {
		requested: enabled,
		openAtLogin: result.openAtLogin,
		status: result.status,
	});

	if (enabled && isOSX && result.status === 'requires-approval') {
		dialog
			.showMessageBox({
				type: 'info',
				title: 'Open at login',
				message:
					'macOS blocked Webitel from opening at login. Enable it in System Settings → General → Login Items.',
				buttons: [
					'Open Login Items',
					'OK',
				],
				defaultId: 0,
			})
			.then(({ response }) => {
				if (response === 0) openLoginItemsSettings();
			});
	}

	return result;
};

/** Persist to config.json and sync OS login item. */
const setOpenAtLogin = (openAtLogin) => {
	const enabled = Boolean(openAtLogin);
	updateConfig({
		openAtLogin: enabled,
	});
	return applyLoginItemSettings(enabled);
};

/** Apply OS login item from config (source of truth). Default: false. */
const syncFromConfig = () => {
	const conf = config();
	if (conf.openAtLogin === undefined) {
		updateConfig({
			openAtLogin: false,
		});
	}
	return applyLoginItemSettings(getOpenAtLogin());
};

module.exports = {
	isSupported,
	getOpenAtLogin,
	setOpenAtLogin,
	syncFromConfig,
	getOsLoginItemStatus,
	openLoginItemsSettings,
};
