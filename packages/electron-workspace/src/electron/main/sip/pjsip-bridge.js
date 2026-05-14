const { spawn } = require('node:child_process');
const path = require('node:path');

function createPjsipBridge({ sendToWindows }) {
	let child = null;
	const pending = new Map();
	let reqId = 0;

	function start() {
		if (child) return;
		const childPath = path.join(__dirname, 'pjsip-worker.js');
		const nodeBin = process.env.PJSIP_NODE_EXEC_PATH || 'node';
		const childEnv = {
			...process.env,
		};
		delete childEnv.PJSIP_NODE_NATIVE;

		console.log('[sip] spawning worker', nodeBin, childPath);
		child = spawn(
			nodeBin,
			[
				childPath,
			],
			{
				stdio: [
					'ignore',
					'pipe',
					'pipe',
					'ipc',
				],
				env: childEnv,
			},
		);

		child.stdout.on('data', (d) => process.stdout.write(`[sip-worker] ${d}`));
		child.stderr.on('data', (d) => process.stderr.write(`[sip-worker] ${d}`));

		child.on('message', (msg) => {
			if (!msg || typeof msg !== 'object') return;
			if (msg.type === 'event') {
				sendToWindows('sip-worker:event', {
					event: msg.event,
					payload: msg.payload,
				});
				return;
			}
			if (msg.type !== 'response') return;
			const p = pending.get(msg.id);
			if (!p) return;
			pending.delete(msg.id);
			if (msg.ok) p.resolve(msg.result);
			else p.reject(new Error(msg.error?.message || 'worker error'));
		});

		child.on('exit', (code, signal) => {
			console.error('[sip-worker] exit', code, signal);
			child = null;
			for (const [, p] of pending) {
				p.reject(
					new Error(
						`SIP worker exited (code=${code ?? 'null'} signal=${signal ?? 'null'})`,
					),
				);
			}
			pending.clear();
		});

		child.on('error', (err) => {
			console.error('[sip-worker] spawn error', err);
		});
	}

	function request(method, args = []) {
		start();
		return new Promise((resolve, reject) => {
			const id = `${Date.now()}-${++reqId}`;
			pending.set(id, {
				resolve,
				reject,
			});
			child.send({
				type: 'request',
				id,
				method,
				args,
			});
		});
	}

	async function stop() {
		if (!child) return;
		try {
			await request('destroy');
		} catch (err) {
			console.error('[sip] stop error', err);
		}
		child?.kill();
		child = null;
	}

	return {
		request,
		stop,
	};
}

module.exports = {
	createPjsipBridge,
};
