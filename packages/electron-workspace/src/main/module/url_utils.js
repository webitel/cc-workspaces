// shell.openExternal hands any other scheme (smb:, file:) to the OS; http: stays for on-prem
function isWebUrl(value) {
	try {
		const { protocol } = new URL(value);

		return protocol === 'http:' || protocol === 'https:';
	} catch {
		return false;
	}
}

module.exports = {
	isWebUrl,
};
