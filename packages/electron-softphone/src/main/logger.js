const path = require('node:path');
const fs = require('node:fs');

let stream = null;

const MAX_LOG_SIZE = 5 * 1024 * 1024;

const init = (logsDir) => {
	const file = path.join(logsDir, 'softphone.log');
	// always-on tray utility: rotate once on start so the log can't grow
	// unbounded across long uptimes/restarts
	try {
		if (fs.existsSync(file) && fs.statSync(file).size > MAX_LOG_SIZE) {
			fs.renameSync(file, `${file}.old`);
		}
	} catch {
		// rotation is best-effort
	}
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
