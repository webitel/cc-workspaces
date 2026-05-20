#!/usr/bin/env node
// Resolve the native addon at install time from prebuilds/<platform>-<arch>/.
// We do NOT compile from source here — building pjproject locally is slow and
// platform-specific. Prebuilds are produced by the build-electron-sip CI
// workflow; download the electron-sip-prebuilds-all artifact and commit it
// under prebuilds/ before installing.

const fs = require('node:fs');
const path = require('node:path');

const PLATFORM_TAG = `${process.platform}-${process.arch}`;
const PREBUILD_DIR = path.join(__dirname, 'prebuilds', PLATFORM_TAG);

function hasPrebuild() {
	if (!fs.existsSync(PREBUILD_DIR)) return false;
	return fs.readdirSync(PREBUILD_DIR).some((file) => file.endsWith('.node'));
}

if (hasPrebuild()) {
	console.log(`[electron-sip] using prebuild for ${PLATFORM_TAG}`);
	process.exit(0);
}

console.error(
	`[electron-sip] no prebuild for ${PLATFORM_TAG} at ${PREBUILD_DIR}\n` +
		'Generate prebuilds via the build-electron-sip GitHub Actions workflow,\n' +
		'download the electron-sip-prebuilds-all artifact, and commit its\n' +
		'contents under packages/electron-workspace/electron-sip/prebuilds/.',
);
process.exit(1);
