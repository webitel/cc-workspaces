const { EventEmitter } = require('node:events');
const pjsip = require('pjsip-node');

class PjsipNativeClient extends EventEmitter {
	constructor(options = {}) {
		super();
		this._registered = false;
		this._sessionsByCallId = new Map();
		this._initOptions = options;
		this._callbacksBound = false;
		this._ready = false;
	}

	async callOption() {
		return {};
	}

	async register(sipConf = {}) {
		this._bindCallbacks();

		const registrarHost = (sipConf.proxy || sipConf.domain || '').replace(
			/^sips?:/i,
			'',
		);
		const initPayload = {
			logLevel: this._initOptions.debugMode ? 5 : 3,
			userAgent: 'Webitel Workspace',
			maxCalls: 10,
			transport: 'UDP',
		};

		console.log('[pjsip] Init', initPayload);
		const initResult = pjsip.Init(initPayload);
		if (!initResult.ok) {
			throw new Error(initResult.message || 'pjsip Init failed');
		}

		await this._waitReady();

		const registerPayload = {
			username: sipConf.extension || sipConf.auth,
			password: sipConf.password,
			domain: sipConf.domain,
			registrar: sipConf.proxy,
			displayName: sipConf.displayName,
			expires: Number(
				sipConf.register_expires || this._initOptions.timeoutSIP || 90,
			),
		};

		console.log('[pjsip] Register', {
			...registerPayload,
			password: '***',
		});

		return new Promise((resolve, reject) => {
			const cleanup = () => {
				this.off('registered', onOk);
				this.off('error', onErr);
			};
			const onOk = () => {
				cleanup();
				resolve();
			};
			const onErr = (err) => {
				cleanup();
				reject(err);
			};
			this.once('registered', onOk);
			this.once('error', onErr);

			const res = pjsip.Register(registerPayload);
			if (!res.ok) {
				cleanup();
				reject(new Error(res.message || 'pjsip Register failed'));
			}
		});
	}

	async unregister() {
		try {
			pjsip.Unregister();
		} catch (err) {
			console.error('[pjsip] Unregister error', err);
		}
		try {
			pjsip.Shutdown();
		} catch (err) {
			console.error('[pjsip] Shutdown error', err);
		}
		this._registered = false;
		this._ready = false;
		this._sessionsByCallId.clear();
	}

	async destroy() {
		return this.unregister();
	}

	async call(req = {}) {
		const destination = req.destination || req.number || req.to;
		if (!destination) throw new Error('Destination is empty');
		const to = destination.startsWith('sip:')
			? destination
			: `sip:${destination}`;
		const res = pjsip.Invite({
			to,
		});
		if (!res.ok) throw new Error(res.message || 'pjsip Invite failed');
		const callId = res.data;
		const session = this._registerSession({
			callId,
			id: String(callId),
			direction: 'outbound',
			destination,
		});
		this.emit('newSession', session);
	}

	answer(id) {
		const callId = this._resolveCallId(id);
		if (callId == null) return;
		const res = pjsip.Answer({
			callId,
		});
		if (!res.ok) console.error('[pjsip] Answer failed', res);
	}

	hangup(id) {
		const callId = this._resolveCallId(id);
		if (callId == null) return;
		const res = pjsip.Bye({
			callId,
		});
		if (!res.ok) console.error('[pjsip] Bye failed', res);
	}

	isRegistered() {
		return this._registered;
	}

	sipSessionByCallId(id) {
		return this._sessionsByCallId.get(String(id)) || null;
	}

	sipSessionBySipId(id) {
		return this.sipSessionByCallId(id);
	}

	_waitReady() {
		if (this._ready) return Promise.resolve();
		return new Promise((resolve, reject) => {
			const cleanup = () => {
				this.off('_ready', onOk);
				this.off('error', onErr);
			};
			const onOk = () => {
				cleanup();
				resolve();
			};
			const onErr = (err) => {
				cleanup();
				reject(err);
			};
			this.once('_ready', onOk);
			this.once('error', onErr);
		});
	}

	_resolveCallId(id) {
		const session = this.sipSessionByCallId(id);
		if (session?.callId != null) return session.callId;
		const numeric = Number(id);
		return Number.isFinite(numeric) ? numeric : id;
	}

	_bindCallbacks() {
		if (this._callbacksBound) return;
		this._callbacksBound = true;

		pjsip.setCallbacks({
			onReady: (info) => {
				console.log('[pjsip] onReady', info);
				this._ready = true;
				this.emit('_ready');
			},
			onError: (err) => {
				console.error('[pjsip] onError', err);
				const message = err?.message || String(err);
				this.emit('error', new Error(message));
			},
			onRegisterSuccess: (e) => {
				console.log('[pjsip] onRegisterSuccess', e);
				this._registered = true;
				this.emit('registered');
			},
			onRegisterFailed: (e) => {
				console.error('[pjsip] onRegisterFailed', e);
				this._registered = false;
				const message = e?.data?.message || e?.message || 'Register failed';
				this.emit('error', new Error(message));
			},
			onUnregister: () => {
				console.log('[pjsip] onUnregister');
				this._registered = false;
				this.emit('unregistered');
			},
			onInvite: (e) => {
				console.log('[pjsip] onInvite', e);
				const data = e?.data || {};
				const session = this._registerSession({
					callId: data.callId,
					id: String(data.callId),
					direction: 'inbound',
					from: data.caller || data.from,
					to: data.to,
				});
				this.emit('newSession', session);
			},
			onConnected: (e) => {
				const data = e?.data || {};
				const session = this.sipSessionByCallId(data.callId);
				if (session) {
					session.state = 'CONFIRMED';
					session.answeredAt = Date.now();
				}
			},
			onBye: (e) => {
				console.log('[pjsip] onBye', e);
				const data = e?.data || {};
				const session = this.sipSessionByCallId(data.callId) || {
					callId: data.callId,
					id: String(data.callId),
				};
				this._sessionsByCallId.delete(String(session.callId));
				this.emit('callEnded', session);
			},
			onFailure: (e) => {
				console.error('[pjsip] onFailure', e);
				const data = e?.data || {};
				const session = this.sipSessionByCallId(data.callId);
				if (session) {
					this._sessionsByCallId.delete(String(session.callId));
					this.emit('callEnded', session);
				}
			},
		});
	}

	_registerSession(rawSession = {}) {
		const session = rawSession;
		if (session.callId != null && session.id == null) {
			session.id = String(session.callId);
		}
		if (session.callId != null) {
			this._sessionsByCallId.set(String(session.callId), session);
		}
		return session;
	}
}

module.exports = PjsipNativeClient;
