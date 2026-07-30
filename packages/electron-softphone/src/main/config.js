const path = require('node:path');
const fs = require('node:fs');
const { app } = require('electron');

const CONFIG_FILE = 'config.json';
const LOGS_FOLDER = 'logs';

const DEFAULT_CONFIG = {
	port: 10029,
	// non-empty list restricts which web origins may connect to the local
	// WebSocket server; empty allows any origin (the hello token is still
	// validated against the Webitel backend before anything executes)
	originAllowlist: [],
	sipRegisterSec: 90,
	codecs: [
		'opus/48000/2',
		'G722/16000/1',
		'PCMA/8000/1',
		'PCMU/8000/1',
	],
	// pjsip NAT mode: 'auto' enables STUN+ICE, anything else disables both
	nat: '',
	debug: false,
};

let _conf = null;

const configPath = () => path.join(app.getPath('userData'), CONFIG_FILE);
const logsPath = () => path.join(app.getPath('userData'), LOGS_FOLDER);

const config = () => {
	if (_conf) return _conf;

	if (!fs.existsSync(logsPath())) {
		fs.mkdirSync(logsPath(), {
			recursive: true,
		});
	}

	const p = configPath();
	if (fs.existsSync(p)) {
		try {
			_conf = {
				...DEFAULT_CONFIG,
				...JSON.parse(fs.readFileSync(p, 'utf8')),
			};
			return _conf;
		} catch (err) {
			console.error(`[config] failed to parse ${p}, using defaults`, err);
		}
	}
	_conf = {
		...DEFAULT_CONFIG,
	};
	fs.writeFileSync(p, JSON.stringify(_conf, null, '\t'));
	return _conf;
};

const updateConfig = (partial) => {
	_conf = {
		...config(),
		...partial,
	};
	fs.writeFileSync(configPath(), JSON.stringify(_conf, null, '\t'));
	return _conf;
};

// dev-only credentials for running the softphone standalone, without a web
// workspace sending `hello` (see config.dev.example.json)
const devConfig = () => {
	if (app.isPackaged) return null;
	const p = path.join(__dirname, '../../config.dev.json');
	if (!fs.existsSync(p)) return null;
	try {
		return JSON.parse(fs.readFileSync(p, 'utf8'));
	} catch {
		return null;
	}
};

module.exports = {
	config,
	updateConfig,
	configPath,
	logsPath,
	devConfig,
};
