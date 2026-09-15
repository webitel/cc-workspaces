import fs from 'node:fs';
import path from 'node:path';
import { app } from 'electron';

const CONFIG_FILE = 'config.json';
const LOGS_FOLDER = 'logs';

export interface PairedWorkspace {
	/** webitel backend endpoint of the workspace this utility is paired with */
	endpoint: string;
	/** browser origin the pairing hello arrived from, null for non-browser clients */
	origin: string | null;
}

export interface SoftphoneAppConfig {
	port: number;
	originAllowlist: string[];
	endpointAllowlist: string[];
	pairedWorkspace: PairedWorkspace | null;
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
	// WebSocket server. When empty the allowed origin is derived instead from
	// `pairedWorkspace` (see below) — an empty list is NOT "allow anything":
	// validating the hello token proves nothing on its own, because the client
	// also supplies the backend the token is validated against.
	originAllowlist: [],
	// non-empty list restricts which webitel endpoints a `hello` may point this
	// utility at. Empty means trust-on-first-use: the first endpoint that
	// authenticates successfully is written to `pairedWorkspace` and every later
	// hello must match it.
	endpointAllowlist: [],
	// set on first successful pairing; clear it (tray → "Unpair workspace", or
	// by deleting the key here) when the operator moves to another workspace
	pairedWorkspace: null,
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
