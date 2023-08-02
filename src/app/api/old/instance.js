import axios from 'axios';
import eventBus from '@webitel/ui-sdk/src/scripts/eventBus';
import { objCamelToSnake, objSnakeToCamel } from '@webitel/ui-sdk/src/scripts/caseConverters';
import updateTokenInterceptor
  from '@webitel/ui-sdk/src/api/interceptors/request/updateToken.interceptor';
import handleUnauthorizedInterceptor
  from '@webitel/ui-sdk/src/api/interceptors/response/handleUnauthorized.interceptor';
import attachStarToRequestUrlSearchQuery from '../interceptors/request/attachStarToRequestUrlSearchQuery.interceptor';

// global API configuration
// 'X-Webitel-Access' ~ 'X-Access-Token'
const instance = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  headers: {
    'X-Webitel-Access': localStorage.getItem('access-token') || '',
    // 'X-Webitel-Access': 'USER_TOKEN',
    // 'X-Webitel-Access': 'ITS_TOKEN',
  },
});

instance.interceptors.request.use(
  (request) => {
    if (request.method === 'post'
      || request.method === 'put'
      || request.method === 'patch') {
      if (typeof request.data === 'string') {
        // eslint-disable-next-line no-param-reassign
        request.data = JSON.stringify(objCamelToSnake(JSON.parse(request.data)));
      } else {
        // eslint-disable-next-line no-param-reassign
        request.data = objCamelToSnake(request.data);
      }
    }
    return request;
  },
);

instance.interceptors.request.use(...attachStarToRequestUrlSearchQuery.default);

instance.interceptors.request.use(...updateTokenInterceptor);

instance.interceptors.response.use(
  (response) => objSnakeToCamel(response.data),
  (error) => { // catches 401 error across all api's
    if (error.response && error.response.status === 401) {
      console.warn('intercepted 401');
      localStorage.removeItem('access-token');
    }
    // if error isn't 401, returns it
    eventBus.$emit('notification', { type: 'error', text: error.response.data.detail });
    return Promise.reject(error.response.data);
  },
);

instance.interceptors.response.use(...handleUnauthorizedInterceptor);

export default instance;
