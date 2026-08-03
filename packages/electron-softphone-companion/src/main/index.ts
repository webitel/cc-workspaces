import { app, powerSaveBlocker } from 'electron';
import { config, devConfig, logsPath } from './config';
import LocalServer from './local-server';
import * as logger from './logger';
import { MESSAGE_TYPES } from './protocol';
import { Softphone } from './softphone';
// safe pre-ready: only extends Tray, instantiated inside main() after ready
import SoftphoneTray from './tray';

if (!app.requestSingleInstanceLock()) {
	app.exit(0);
}

// tray-only utility: keep running with no windows
app.on('window-all-closed', () => {});

// no window to show Electron's default error dialog on — log and keep running
process.on('uncaughtException', (err) => {
	logger.error('[main] uncaught exception', err);
});
process.on('unhandledRejection', (reason) => {
	logger.error('[main] unhandled rejection', reason);
});

const main = () => {
	const conf = config();
	logger.init(logsPath());
	logger.log('[main] starting webitel-softphone-companion', app.getVersion());

	// tray-only background app (dock hidden, no windows): without this macOS
	// App-Naps the process — the SIP registration and the local WS server
	// freeze until the tray menu is opened
	powerSaveBlocker.start('prevent-app-suspension');

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
				message: (err as Error).message,
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

	// dev-only: allow standalone run without a workspace (config.dev.json)
	const dev = devConfig();

	// when the last workspace connection drops, suspend the session (SIP
	// unregister + SDK socket close) after a linger window — long enough for
	// a page reload to reconnect without flapping the registration. An active
	// call postpones the suspend until it ends.
	let lingerTimer: NodeJS.Timeout | null = null;
	const armLinger = () => {
		// standalone dev session has no workspace connections by design
		if (dev?.token) return;
		if (lingerTimer) clearTimeout(lingerTimer);
		lingerTimer = setTimeout(() => {
			lingerTimer = null;
			if (server.clientCount() > 0) return;
			if (softphone.activeCalls().length > 0) {
				armLinger();
				return;
			}
			logger.log('[main] no workspace connections, suspending session');
			softphone.suspend();
		}, conf.workspaceLingerSec * 1000);
	};

	server.on('clients-changed', (count) => {
		tray.updateClients(count);
		if (count === 0) {
			armLinger();
		} else if (lingerTimer) {
			clearTimeout(lingerTimer);
			lingerTimer = null;
		}
	});
	server.on('server-error', (err) => {
		tray.updateState({
			state: 'error',
			lastError:
				err.code === 'EADDRINUSE' ? `port ${conf.port} busy` : err.message,
		});
	});

	server.start();
	if (dev?.token && dev.endpoint) {
		logger.log('[main] dev credentials found, starting standalone');
		softphone
			.handleHello({
				token: dev.token,
				endpoint: dev.endpoint,
			})
			.catch((err) => {
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
