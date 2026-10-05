import fs from 'node:fs';
import path from 'node:path';

let stream: fs.WriteStream | null = null;

const MAX_LOG_SIZE = 5 * 1024 * 1024;

export const init = (logsDir: string): void => {
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

const line = (level: string, args: unknown[]): string => {
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

export const log = (...args: unknown[]): void => {
	console.log(...args);
	if (stream) stream.write(line('info', args));
};

export const error = (...args: unknown[]): void => {
	console.error(...args);
	if (stream) stream.write(line('error', args));
};
