/**
 * Whether a URL is a plain web URL (`http:` or `https:`).
 *
 * The renderer runs inside Electron, where a click on a link with any other
 * scheme reaches `shell.openExternal` and from there the OS handler for that
 * scheme (`smb:`, `file:`, `ms-settings:`, …). Link text in a chat message is
 * written by the person on the other end, so the scheme is not ours to trust.
 * `http:` is allowed because on-prem is served without TLS.
 */
export const isWebUrl = (value?: string | null): boolean => {
	if (!value) return false;

	try {
		const { protocol } = new URL(value);

		return protocol === 'http:' || protocol === 'https:';
	} catch {
		return false;
	}
};
