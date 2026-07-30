const path = require('node:path');
const fs = require('node:fs');

let stream = null;

const init = (logsDir) => {
	const file = path.join(logsDir, 'softphone.log');
	stream = fs.createWriteStream(file, {
		flags: 'a',
	});
};

const line = (level, args) => {
	const text = args
		.map((arg) => {
			if (arg instanceof Error) return arg.stack || arg.message;
			if (typeof arg === 'object') {
				try {
					return JSON.stringify(arg);
				} catch {
					return String(arg);
				}
			}
			return String(arg);
		})
		.join(' ');
	return `${new Date().toISOString()} [${level}] ${text}\n`;
};

const log = (...args) => {
	console.log(...args);
	if (stream) stream.write(line('info', args));
};

const error = (...args) => {
	console.error(...args);
	if (stream) stream.write(line('error', args));
};

module.exports = {
	init,
	log,
	error,
};
