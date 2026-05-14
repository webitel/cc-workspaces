const { ipcRenderer } = require('electron');
const { ExternalClient } = require('webitel-sdk');

const instances = new Set();

ipcRenderer.on('sip-worker:event', (_event, payload = {}) => {
	for (const instance of instances) {
		instance._handleWorkerEvent(payload);
	}
});

class PjsipClient extends ExternalClient {
	constructor(options = {}) {
		super(options);
		this._registered = false;
		this._sessionsById = new Map();
		this._sessionsByCallId = new Map();
		this._initOptions = options;
		instances.add(this);
	}

	async _request(method, args = []) {
		return ipcRenderer.invoke('sip-worker:request', {
			method,
			args,
		});
	}

	async callOption() {
		return {};
	}

	async register(sipConf = {}) {
		await this._request('register', [
			sipConf,
			this._initOptions,
		]);
		this._registered = true;
	}

	async unregister() {
		await this._request('unregister');
		this._registered = false;
		this._sessionsById.clear();
		this._sessionsByCallId.clear();
	}

	async destroy() {
		await this._request('destroy');
		this._registered = false;
		this._sessionsById.clear();
		this._sessionsByCallId.clear();
		instances.delete(this);
	}

	async call(req = {}) {
		return this._request('call', [
			req,
		]);
	}

	async answer(id) {
		return this._request('answer', [
			id,
		]);
	}

	async hangup(id) {
		return this._request('hangup', [
			id,
		]);
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

	_handleWorkerEvent({ event, payload }) {
		switch (event) {
			case 'registered':
				this._registered = true;
				this.emit('registered');
				break;
			case 'unregistered':
				this._registered = false;
				this.emit('unregistered');
				break;
			case 'error':
				this.emit('error', new Error(payload.message));
				break;
			case 'newSession': {
				const session = this._registerSession(payload || {});
				this.emit('newSession', session);
				break;
			}
			case 'callEnded': {
				const session = this._registerSession(payload || {});
				this._sessionsById.delete(String(session.id));
				this._sessionsByCallId.delete(String(session.callId));
				break;
			}
			default:
		}
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

		if (session.id != null) {
			this._sessionsById.set(String(session.id), session);
		}
		if (session.callId != null) {
			this._sessionsByCallId.set(String(session.callId), session);
		}
		return session;
	}
}

module.exports = PjsipClient;
