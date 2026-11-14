/**
 * Whether a URL is plain `http:` or `https:`. `shell.openExternal` launches
 * the OS handler of any scheme (`smb:`, `file:`, …), and links come from chat
 * messages and flow variables. `http:` stays: on-prem runs without TLS.
 */
function isWebUrl(value) {
	try {
		const { protocol } = new URL(value);

		return protocol === 'http:' || protocol === 'https:';
	} catch {
		return false;
	}
}

/**
 * The origin of a URL, or `null` when there is none to compare.
 *
 * A non-special scheme (`smb:`, `wtel:`, …) has an opaque origin, which the
 * URL API reports as the *string* `'null'` — returned verbatim it would make
 * any two such URLs compare equal.
 */
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
