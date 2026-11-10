import type { MediaUrlAuth } from '@webitel/api-services/api';

/** [Claude] api-services media URL helpers take the API url and token from the app; read on every call, as the token changes after login */
export const getMediaUrlAuth = (): MediaUrlAuth => ({
	baseUrl: import.meta.env.VITE_API_URL,
	accessToken: localStorage.getItem('access-token') || '',
});
