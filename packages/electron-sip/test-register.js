const sip = require('./index.js');

const required = [
	'SIP_DOMAIN',
	'SIP_EXT',
	'SIP_PASS',
	'SIP_PROXY',
];
const missing = required.filter((k) => !process.env[k]);
if (missing.length) {
	console.error(`Set env vars: ${missing.join(', ')}`);
	console.error(
		`Example: SIP_DOMAIN=example.com SIP_EXT=200 SIP_PASS=secret SIP_PROXY=sip:10.0.0.1 SIP_AUTH=200 node test-register.js`,
	);
	process.exit(1);
}

const cli = new sip.SipClient({
	debug: true,
});

cli.on('registered', () => {
	console.error('REGISTERED');
	setTimeout(async () => {
		await cli.unregister();
	}, 10000);
});

cli.on('unregistered', async () => {
	console.error('UNREGISTERED');
	await cli.destroy();
	process.exit(0);
});

(async () => {
	await cli.register({
		register_sec: process.env.SIP_REGISTER_SEC || '90',
		codecs: [
			'opus/48000/2',
			'PCMA/8000/1',
		],
		nat: 'auto',
		domain: process.env.SIP_DOMAIN,
		extension: process.env.SIP_EXT,
		password: process.env.SIP_PASS,
		proxy: process.env.SIP_PROXY,
		auth: process.env.SIP_AUTH || process.env.SIP_EXT,
	});
})();

setInterval(() => {}, 1000);
