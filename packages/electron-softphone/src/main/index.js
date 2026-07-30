const { app } = require('electron');
const { config, devConfig, logsPath } = require('./config');
const logger = require('./logger');
const LocalServer = require('./local-server');
const { Softphone } = require('./softphone');
const { MESSAGE_TYPES } = require('./protocol');

if (!app.requestSingleInstanceLock()) {
	app.exit(0);
}

// tray-only utility: keep running with no windows
app.on('window-all-closed', () => {});

const main = () => {
	const conf = config();
	logger.init(logsPath());
	logger.log('[main] starting webitel-softphone', app.getVersion());

	// require after ready: Tray needs the app to be initialized
	const SoftphoneTray = require('./tray');
	const tray = new SoftphoneTray();
	const softphone = new Softphone(conf);
	const server = new LocalServer(conf);

	softphone.on('state', (state) => {
		server.broadcastState(state);
		tray.updateState(state);
	});
	softphone.on('calls-changed', () => {
		tray.updateInCall(softphone.activeCalls().length > 0);
	});

	server.on('hello', async (message, reply) => {
		try {
			await softphone.handleHello(message);
			reply(true);
		} catch (err) {
			logger.error('[main] hello failed', err);
			reply(false, {
				code: 'hello_failed',
				message: err.message,
			});
		}
		server.broadcastState(softphone.getState());
	});

	server.on('command', async (message, reply) => {
		switch (message.type) {
			case MESSAGE_TYPES.TOKEN: {
				softphone.updateToken(message.token);
				reply(true);
				break;
			}
			case MESSAGE_TYPES.ANSWER: {
				const result = await softphone.answer(message.callId);
				reply(result.ok, result.error);
				break;
			}
			case MESSAGE_TYPES.CALL: {
				const result = await softphone.call(
					message.destination,
					message.params,
				);
				reply(result.ok, result.error);
				break;
			}
			case MESSAGE_TYPES.HANGUP: {
				const result = await softphone.hangup(message.callId);
				reply(result.ok, result.error);
				break;
			}
			default:
				reply(false, {
					code: 'unknown_type',
				});
		}
	});

	server.on('clients-changed', (count) => tray.updateClients(count));
	server.on('server-error', (err) => {
		tray.updateState({
			state: 'error',
			lastError:
				err.code === 'EADDRINUSE' ? `port ${conf.port} busy` : err.message,
		});
	});

	server.start();

	// dev-only: allow standalone run without a workspace (config.dev.json)
	const dev = devConfig();
	if (dev?.token && dev.endpoint) {
		logger.log('[main] dev credentials found, starting standalone');
		softphone.handleHello(dev).catch((err) => {
			logger.error('[main] dev bootstrap failed', err);
		});
	}

	// graceful shutdown: unregister SIP and close the local server before the
	// process dies. The tray's Quit item calls app.quit(), which lands here;
	// the teardown is async, so hold the quit until it finishes.
	let quitting = false;
	app.on('before-quit', (event) => {
		if (quitting) return;
		event.preventDefault();
		quitting = true;
		(async () => {
			try {
				server.stop();
				await softphone.destroy();
			} catch (err) {
				logger.error('[main] shutdown error', err);
			} finally {
				app.exit(0);
			}
		})();
	});
};

app
	.whenReady()
	.then(main)
	.catch((err) => {
		// a tray-only app failing during startup would otherwise die silently
		console.error('[main] startup failed', err);
		app.exit(1);
	});
