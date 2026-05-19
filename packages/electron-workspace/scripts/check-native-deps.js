#!/usr/bin/env node
const { execSync } = require('node:child_process');

const warn = (msg) => console.warn(`\n[electron-workspace] ${msg}\n`);

if (process.platform === 'darwin') {
	try {
		execSync('brew --prefix pjproject', {
			stdio: 'ignore',
		});
	} catch {
		warn(
			'pjproject not found via Homebrew. Native SIP module needs it.\n' +
				'Install:  brew install pjproject',
		);
	}
} else if (process.platform === 'linux') {
	try {
		execSync('pkg-config --exists libpjproject', {
			stdio: 'ignore',
		});
	} catch {
		warn(
			'pjproject not found via pkg-config. Native SIP module needs it.\n' +
				'Install pjproject dev package and ensure pkg-config can resolve libpjproject.',
		);
	}
} else if (process.platform === 'win32') {
	if (!process.env.PJSIP_PREFIX) {
		warn(
			'PJSIP_PREFIX env var not set. Native SIP module needs it on Windows.\n' +
				'Build/install pjproject and set PJSIP_PREFIX to its install root (containing include/ and lib/).',
		);
	}
}
