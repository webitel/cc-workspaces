const EXTERNAL_PROTOCOLS = [
	'http:',
	'https:',
	'mailto:',
	'tel:',
];

// shell.openExternal hands any other scheme (smb:, file:) to the OS; http: stays for on-prem
function isExternalUrl(value) {
	try {
		const { protocol } = new URL(value);

		return EXTERNAL_PROTOCOLS.includes(protocol);
	} catch {
		return false;
	}
}

module.exports = {
	isExternalUrl,
};
