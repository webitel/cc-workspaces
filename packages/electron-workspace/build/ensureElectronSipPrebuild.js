/**
 * electron-builder beforePack hook.
 *
 * npmRebuild is false, so the host's electron-sip build/Release/.node (wrong
 * arch on cross-builds) must never be the only binary shipped. Runtime load
 * uses node-gyp-build → prebuilds/<platform>-<arch>/. Fail packing when that
 * prebuild is missing instead of producing a broken installer.
 */
const fs = require('node:fs');
const path = require('node:path');

const ARCH_NAME = {
	0: 'ia32',
	1: 'x64',
	3: 'arm64',
};

exports.default = async function ensureElectronSipPrebuild(context) {
	const platform = context.electronPlatformName; // darwin | linux | win32
	const arch = ARCH_NAME[context.arch];
	if (!arch) {
		throw new Error(
			`[electron-sip] unknown electron-builder arch id: ${context.arch}`,
		);
	}

	const tag = `${platform}-${arch}`;
	const prebuildDir = path.join(
		__dirname,
		'..',
		'..',
		'electron-sip',
		'prebuilds',
		tag,
	);

	const hasNode =
		fs.existsSync(prebuildDir) &&
		fs.readdirSync(prebuildDir).some((file) => file.endsWith('.node'));

	if (!hasNode) {
		throw new Error(
			`[electron-sip] no prebuild for ${tag} at ${prebuildDir}\n` +
				'Run build-electron-sip workflow, commit prebuilds/<platform>-<arch>/,\n' +
				'or drop this arch from build.mac/linux/win targets.',
		);
	}

	console.log(`[electron-sip] prebuild OK for ${tag}`);
};
