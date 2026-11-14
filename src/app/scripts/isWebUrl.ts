/**
 * Whether a URL is plain `http:` or `https:`. Inside Electron a link with any
 * other scheme (`smb:`, `file:`, …) reaches its OS handler, and chat link text
 * is written by the other side. `http:` stays: on-prem runs without TLS.
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
