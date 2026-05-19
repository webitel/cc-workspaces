#!/usr/bin/env node
// Resolve the native addon at install time:
//   1. If a matching prebuild exists in prebuilds/<platform>-<arch>/, use it.
//   2. Otherwise compile from source via node-gyp.
//
// Prebuilds are produced by the build-electron-sip CI workflow.

const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');

const PLATFORM_TAG = `${process.platform}-${process.arch}`;
const PREBUILD_DIR = path.join(__dirname, 'prebuilds', PLATFORM_TAG);

function hasPrebuild() {
	if (!fs.existsSync(PREBUILD_DIR)) return false;
	return fs.readdirSync(PREBUILD_DIR).some((file) => file.endsWith('.node'));
}

function compileFromSource() {
	console.log(`[electron-sip] no prebuild for ${PLATFORM_TAG}, compiling`);
	execSync('npx --no-install node-gyp rebuild', {
		stdio: 'inherit',
		cwd: __dirname,
	});
}

if (hasPrebuild()) {
	console.log(`[electron-sip] using prebuild for ${PLATFORM_TAG}`);
	process.exit(0);
}

compileFromSource();
