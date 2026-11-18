// in Electron any other scheme reaches its OS handler; http: stays for on-prem
export const isWebUrl = (value?: string | null): boolean => {
	if (!value) return false;

	try {
		const { protocol } = new URL(value);

		return protocol === 'http:' || protocol === 'https:';
	} catch {
		return false;
	}
};
