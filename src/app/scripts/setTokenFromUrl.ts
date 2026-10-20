/**
 * [https://webitel.atlassian.net/browse/WTEL-10705]
 * Dev-only: a locally served app runs on its own origin, so it doesn't share
 * localStorage with the auth app and needs `?accessToken=` to log in.
 *
 * Never in production: there the auth app and every app share one origin, so
 * the token is already in localStorage after login, and storing a token from
 * the URL would let any link plant someone else's session (session fixation).
 */
export const setTokenFromUrl = () => {
	if (!import.meta.env.DEV) return;

	try {
		const accessToken = new URLSearchParams(window.location.search).get(
			'accessToken',
		);

		if (accessToken) {
			localStorage.setItem('access-token', accessToken);
		}
	} catch (err) {
		console.error('Error restoring token from url', err);
	}
};
