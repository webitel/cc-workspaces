declare module 'electron-sip' {
	import type { CallSession } from 'webitel-sdk';

	/** Shape accepted by SipClient.register(): the `user_default_device
	 * {name:'sip'}` response spread together with local pjsip options. */
	export interface SipRegisterConfig {
		auth: string;
		extension: string;
		domain: string;
		password: string;
		proxy: string;
		nat?: string;
		register_sec?: number | string;
		codecs?: string[];
	}

	export interface SipCallRequest {
		destination?: string;
		params?: object;
	}

	/**
	 * pjsua2 N-API wrapper (CJS: module.exports = { SipClient, version }).
	 * Import with `import * as sip from 'electron-sip'` — the bundler then
	 * emits plain property access on the CJS export; a default import would
	 * compile to `.default` and break at runtime.
	 *
	 * `on()` keeps exactly ONE handler per event name and silently ignores
	 * unknown names; there is no `off()`.
	 */
	export class SipClient {
		constructor(options?: {
			debug?: boolean;
		});
		readonly type: 'sip';
		readonly version: string;
		callOption(req: object): object;
		register(conf: SipRegisterConfig): Promise<void>;
		unregister(): Promise<void>;
		call(req: SipCallRequest): Promise<void>;
		destroy(): Promise<void>;
		sipSessionByCallId(id: string): CallSession | null;
		sipSessionBySipId(id: string): CallSession | null;
		on(event: 'newSession', cb: (session: CallSession) => void): void;
		on(event: 'registered' | 'unregistered', cb: () => void): void;
	}

	export function version(): string;
}
