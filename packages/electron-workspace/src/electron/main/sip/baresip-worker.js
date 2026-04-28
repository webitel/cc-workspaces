const BaresipNativeClient = require('./baresip-native-client');

let client = null;

function bindEvents() {
	for (const event of [
		'registered',
		'unregistered',
		'newSession',
		'callEnded',
	]) {
		client.on(event, (payload) =>
			process.send({
				type: 'event',
				event,
				payload,
			}),
		);
	}
	client.on('error', (err) =>
		process.send({
			type: 'event',
			event: 'error',
			payload: {
				message: err.message,
			},
		}),
	);
}

async function handle(method, args = []) {
	switch (method) {
		case 'register': {
			const [sipConf = {}, options = {}] = args;
			if (!client) {
				client = new BaresipNativeClient(options);
				bindEvents();
			}
			await client.register(sipConf);
			return true;
		}
		case 'unregister':
			if (!client) return true;
			await client.unregister();
			return true;
		case 'destroy':
			if (!client) return true;
			await client.destroy();
			client = null;
			return true;
		case 'call':
			if (!client) throw new Error('SIP client not initialized');
			return client.call(args[0] || {});
		case 'answer':
			if (!client) throw new Error('SIP client not initialized');
			return client.answer(args[0]);
		case 'hangup':
			if (!client) throw new Error('SIP client not initialized');
			return client.hangup(args[0]);
		case 'isRegistered':
			return Boolean(client?.isRegistered());
		default:
			throw new Error(`Unknown SIP method: ${method}`);
	}
}

process.on('message', async (msg) => {
	if (!msg || msg.type !== 'request') return;
	const { id, method, args } = msg;
	try {
		const result = await handle(method, args);
		process.send({
			type: 'response',
			id,
			ok: true,
			result,
		});
	} catch (err) {
		process.send({
			type: 'response',
			id,
			ok: false,
			error: {
				message: err.message,
			},
		});
	}
});

process.on('disconnect', async () => {
	try {
		if (client) await client.destroy();
	} catch {}
	process.exit(0);
});
