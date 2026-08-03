import fs from 'node:fs';
import path from 'node:path';
import { app } from 'electron';

const CONFIG_FILE = 'config.json';
const LOGS_FOLDER = 'logs';

export interface SoftphoneAppConfig {
	port: number;
	originAllowlist: string[];
	sipRegisterSec: number;
	codecs: string[];
	nat: string;
	debug: boolean;
	workspaceLingerSec: number;
}

export interface DevCredentials {
	endpoint?: string;
	token?: string;
}

const DEFAULT_CONFIG: SoftphoneAppConfig = {
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
	// when the last workspace connection drops, keep the SIP registration and
	// SDK session alive this long before suspending — a page reload reconnects
	// well within the window, so registration doesn't flap
	workspaceLingerSec: 30,
};

let _conf: SoftphoneAppConfig | null = null;

export const configPath = (): string =>
	path.join(app.getPath('userData'), CONFIG_FILE);
export const logsPath = (): string =>
	path.join(app.getPath('userData'), LOGS_FOLDER);

export const config = (): SoftphoneAppConfig => {
	if (_conf) return _conf;

	if (!fs.existsSync(logsPath())) {
		fs.mkdirSync(logsPath(), {
			recursive: true,
		});
	}

	const p = configPath();
	if (fs.existsSync(p)) {
		try {
			const loaded: SoftphoneAppConfig = {
				...DEFAULT_CONFIG,
				...JSON.parse(fs.readFileSync(p, 'utf8')),
			};
			_conf = loaded;
			return loaded;
		} catch (err) {
			console.error(`[config] failed to parse ${p}, using defaults`, err);
		}
	}
	const fresh: SoftphoneAppConfig = {
		...DEFAULT_CONFIG,
	};
	_conf = fresh;
	fs.writeFileSync(p, JSON.stringify(fresh, null, '\t'));
	return fresh;
};

export const updateConfig = (
	partial: Partial<SoftphoneAppConfig>,
): SoftphoneAppConfig => {
	_conf = {
		...config(),
		...partial,
	};
	fs.writeFileSync(configPath(), JSON.stringify(_conf, null, '\t'));
	return _conf;
};

// dev-only credentials for running the softphone standalone, without a web
// workspace sending `hello` (see config.dev.example.json)
export const devConfig = (): DevCredentials | null => {
	if (app.isPackaged) return null;
	const p = path.join(__dirname, '../../config.dev.json');
	if (!fs.existsSync(p)) return null;
	try {
		return JSON.parse(fs.readFileSync(p, 'utf8'));
	} catch {
		return null;
	}
};
