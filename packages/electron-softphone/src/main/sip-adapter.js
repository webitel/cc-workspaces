const { EventEmitter } = require('node:events');
const sip = require('electron-sip');
const logger = require('./logger');

// Adapts the electron-sip pjsip N-API addon to the webitel-sdk SipClient
// interface. The addon holds exactly ONE handler per event name and silently
// ignores unknown names, so this adapter is its sole subscriber and fans out
// through a real EventEmitter (Client.subscribePhone attaches several
// listeners, including events the addon never emits — harmless here).
class SipAdapter extends EventEmitter {
	type = 'sip';
	extension = null;
	#client;
	#registered = false;

	constructor({ debug = false } = {}) {
		super();
		this.#client = new sip.SipClient({
			debug,
		});

		this.#client.on('newSession', (session) => {
			logger.log('[sip] new session', session && session.id);
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
	async callOption(req) {
		return this.#client.callOption(req);
	}

	async register(sipConf) {
		this.extension = sipConf.extension || null;
		return this.#client.register(sipConf);
	}

	async unregister() {
		this.#registered = false;
		return this.#client.unregister();
	}

	async call(req) {
		return this.#client.call(req);
	}

	isRegistered() {
		return this.#registered;
	}

	// pjsip handles echo cancellation natively; SDK calls this on web phones
	setAudioProcessing() {}

	sipSessionByCallId(id) {
		return this.#client.sipSessionByCallId(id);
	}

	sipSessionBySipId(id) {
		return this.#client.sipSessionBySipId(id);
	}

	destroy() {
		this.#registered = false;
		return this.#client.destroy();
	}
}

module.exports = SipAdapter;
