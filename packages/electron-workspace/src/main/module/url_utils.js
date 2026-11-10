/**
 * Whether a URL is a plain web URL.
 *
 * `shell.openExternal` hands the URL to the OS, which launches whatever
 * handler the scheme is registered to (`smb:`, `file:`, `ms-settings:`, …).
 * Links here come from chat messages and flow-defined task variables, so the
 * scheme is not ours to trust. `http:` is allowed because on-prem is served
 * without TLS.
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
