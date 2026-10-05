const { hostname, protocol } = window.location;
const origin = `${protocol}//${hostname}`.replace(/^http/, 'ws');

export const endpoint =
	import.meta.env.MODE === 'production'
		? `${origin}/ws`
		: import.meta.env.VITE_WEB_SOCKET_URL;
