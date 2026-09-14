import generateInstance from '@webitel/ui-sdk/src/api/axios/generateInstance';
import handleUnauthorizedInterceptor from '@webitel/ui-sdk/src/api/interceptors/response/handleUnauthorized.interceptor';
import updateTokenInterceptor from '@webitel/ui-sdk/src/api/interceptors/request/updateToken.interceptor';

/**
 * Axios instance for the renderer windows. Registered as the default for
 * generated api-services clients in ../createWindowApp.ts.
 * Mirrors ../../src/app/api/instance.js.
 */
export default generateInstance({
	interceptors: {
		request: [
			updateTokenInterceptor,
		],
		response: [
			handleUnauthorizedInterceptor,
		],
	},
	baseURL: import.meta.env.VITE_API_URL,
});
