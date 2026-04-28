const { EventEmitter } = require('node:events');
const baresip = require('baresip-node');

class BaresipNativeClient extends EventEmitter {
	constructor(options = {}) {
		super();
		this._registered = false;
		this._sessionsById = new Map();
		this._sessionsByCallId = new Map();
		this._initOptions = options;
		this._callbacksBound = false;
	}

	async callOption() {
		return {};
	}

	async register(sipConf = {}) {
		this._bindCallbacks();

		const registerServer = (sipConf.proxy || sipConf.domain || '').replace(
			/^sips?:/i,
			'',
		);
		const initPayload = {
			SipRegisterServer: registerServer,
			SipUserName: sipConf.extension,
			SipAuthUser: sipConf.auth,
			SipPassword: sipConf.password,
			logLevel: 'debug',
			sipTrace: true,
			// SipDomain: sipConf.domain,
			RegisterExpires: Number(
				sipConf.register_expires || this._initOptions.timeoutSIP || 90,
			),
		};

		// baresip.SetLogLevel('debug');
		// baresip.EnableSipTrace(true);

		console.log('[baresip] Init', initPayload);
		await baresip.Init(initPayload);

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
			Promise.resolve(baresip.Register()).catch(onErr);
		});
	}

	async unregister() {
		await baresip.Shutdown();
		this._registered = false;
		this._sessionsById.clear();
		this._sessionsByCallId.clear();
	}

	async destroy() {
		return this.unregister();
	}

	async call(req = {}) {
		const destination = req.destination || req.number || req.to;
		if (!destination) throw new Error('Destination is empty');
		const session = await baresip.Invite(destination, {
			id: String(Date.now()),
		});
		if (session) this._registerSession(session);
	}

	answer(id) {
		const session = this.sipSessionByCallId(id) || this.sipSessionBySipId(id);
		if (session?.Answer) session.Answer();
	}

	hangup(id) {
		const session = this.sipSessionByCallId(id) || this.sipSessionBySipId(id);
		if (session?.Hangup) {
			session.Hangup();
			return;
		}
		const callId = Number(id);
		if (Number.isFinite(callId)) baresip.Hangup(callId);
	}

	isRegistered() {
		return this._registered;
	}

	sipSessionByCallId(id) {
		return this._sessionsByCallId.get(String(id)) || null;
	}

	sipSessionBySipId(id) {
		return this._sessionsById.get(String(id)) || null;
	}

	_bindCallbacks() {
		if (this._callbacksBound) return;
		this._callbacksBound = true;

		baresip.Callbacks.OnRegisterSuccess = () => {
			console.log('[baresip] OnRegisterSuccess');
			this._registered = true;
			this.emit('registered');
		};

		baresip.Callbacks.OnRegisterFailure = (err) => {
			console.error('[baresip] OnRegisterFailure', err);
			this._registered = false;
			const message = err?.text || err?.message || String(err);
			this.emit('error', err instanceof Error ? err : new Error(message));
		};

		baresip.Callbacks.OnUnregistering = () => {
			console.log('[baresip] OnUnregistering');
			this._registered = false;
			this.emit('unregistered');
		};

		const onSession = (session) => {
			console.log('[baresip] session', session);
			this.emit('newSession', this._registerSession(session));
		};
		baresip.Callbacks.OnInviteIncoming = onSession;
		baresip.Callbacks.OnCallOutgoing = onSession;

		baresip.Callbacks.OnCallEnded = (session) => {
			const normalized = this._registerSession(session);
			this._sessionsById.delete(String(normalized.id));
			this._sessionsByCallId.delete(String(normalized.callId));
			this.emit('callEnded', normalized);
		};
	}

	_registerSession(rawSession = {}) {
		const session = rawSession;
		if (session.callId != null && session.id == null) {
			session.id = String(session.callId);
		}
		if (session.Answer && !session.answer) {
			session.answer = (...args) => session.Answer(...args);
		}
		if (session.Hangup && !session.hangup) {
			session.hangup = (...args) => session.Hangup(...args);
		}
		if (session.id != null) this._sessionsById.set(String(session.id), session);
		if (session.callId != null)
			this._sessionsByCallId.set(String(session.callId), session);
		return session;
	}
}

module.exports = BaresipNativeClient;
