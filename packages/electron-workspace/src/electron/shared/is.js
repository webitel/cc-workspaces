const release = require('os');

const isDev = process.env.NODE_ENV == 'development';
const isProd = process.env.NODE_ENV == 'production';

const isWindows = process.platform === 'win32';
const isOSX = process.platform === 'darwin';
const isLinux = process.platform === 'linux';

const isX86 = process.arch === 'ia32';
const isX64 = process.arch === 'x64';

function isWin7() {
	if (process.platform === 'win32') {
		let releaseArray = release().split('.');
		if (releaseArray[0] !== '10') {
			return true;
		}
	}
	return false;
}

module.exports = {
	isDev,
	isProd,
	isWindows,
	isOSX,
	isLinux,
	isX86,
};
