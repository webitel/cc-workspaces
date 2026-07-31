import { EventEmitter } from 'node:events';
import type { SipCallRequest, SipRegisterConfig } from 'electron-sip';
import * as sip from 'electron-sip';
import type { CallSession } from 'webitel-sdk';
import * as logger from './logger';

interface SipAdapterEvents {
	newSession: [
		session: CallSession,
	];
	registered: [];
	unregistered: [];
}

// Adapts the electron-sip pjsip N-API addon to the webitel-sdk SipClient
// interface. The addon holds exactly ONE handler per event name and silently
// ignores unknown names, so this adapter is its sole subscriber and fans out
// through a real EventEmitter (Client.subscribePhone attaches several
// listeners, including events the addon never emits — harmless here).
//
// Not declared `implements SipClient`: the SDK types register() against the
// webrtc-shaped SipConfiguration, while the 'sip' device config is a
// different field set (auth/password/domain/proxy) — the caller casts at the
// cli.phone attach point instead.
class SipAdapter extends EventEmitter<SipAdapterEvents> {
	readonly type = 'sip';
	extension: string | null = null;
	#client: sip.SipClient;
	#registered = false;

	constructor({
		debug = false,
	}: {
		debug?: boolean;
	} = {}) {
		super();
		this.#client = new sip.SipClient({
			debug,
		});

		this.#client.on('newSession', (session) => {
			logger.log('[sip] new session', session?.id);
			this.emit('newSession', session);
		});
		this.#client.on('registered', () => {
			logger.log('[sip] registered');
			this.#registered = true;
			this.emit('registered');
		});
		this.#client.on('unregistered', () => {
			logger.log('[sip] unregistered');
			this.#registered = false;
			this.emit('unregistered');
		});
	}

	// Call.answer() passes the resolved value to session.answer(); the addon
	// echoes the request back, matching electron-workspace behavior.
	async callOption(req: object): Promise<object> {
		return this.#client.callOption(req);
	}

	async register(sipConf: SipRegisterConfig): Promise<void> {
		this.extension = sipConf.extension || null;
		return this.#client.register(sipConf);
	}

	async unregister(): Promise<void> {
		this.#registered = false;
		return this.#client.unregister();
	}

	async call(req: SipCallRequest): Promise<void> {
		return this.#client.call(req);
	}

	isRegistered(): boolean {
		return this.#registered;
	}

	// pjsip handles echo cancellation natively; SDK calls this on web phones
	setAudioProcessing(): void {}

	sipSessionByCallId(id: string): CallSession | null {
		return this.#client.sipSessionByCallId(id);
	}

	sipSessionBySipId(id: string): CallSession | null {
		return this.#client.sipSessionBySipId(id);
	}

	destroy(): Promise<void> {
		this.#registered = false;
		return this.#client.destroy();
	}
}

export default SipAdapter;
