// shell.openExternal hands any other scheme (smb:, file:) to the OS; http: stays for on-prem
function isWebUrl(value) {
	try {
		const { protocol } = new URL(value);

		return protocol === 'http:' || protocol === 'https:';
	} catch {
		return false;
	}
}

// a non-special scheme reports its origin as the string 'null'; two such URLs would compare equal
function originOf(value) {
	try {
		const { origin } = new URL(value);

		return origin === 'null' ? null : origin;
	} catch {
		return null;
	}
}

module.exports = {
	isWebUrl,
	originOf,
};
