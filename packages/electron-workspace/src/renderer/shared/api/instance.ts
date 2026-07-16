import generateInstance from '@webitel/ui-sdk/src/api/axios/generateInstance';
import handleUnauthorizedInterceptor from '@webitel/ui-sdk/src/api/interceptors/response/handleUnauthorized.interceptor';
import updateTokenInterceptor from '@webitel/ui-sdk/src/api/interceptors/request/updateToken.interceptor';

/**
 * Axios instance consumed by @webitel/ui-sdk via the
 * `@aliasedDeps/api-services/axios` alias (see electron.vite.config.ts).
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
