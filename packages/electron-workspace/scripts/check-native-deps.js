#!/usr/bin/env node
const { execSync } = require('node:child_process');

if (process.platform !== 'darwin') process.exit(0);

try {
	execSync('brew --prefix pjproject', {
		stdio: 'ignore',
	});
} catch {
	console.warn(
		'\n[electron-workspace] pjproject not found via Homebrew.\n' +
			'Native SIP module (electron-sip) needs it to build/link on macOS.\n' +
			'Install:  brew install pjproject\n',
	);
}
