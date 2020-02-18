import axios from 'axios';
import eventBus from '../utils/eventBus';
import { objCamelToSnake, objSnakeToCamel } from './utils/caseConverters';

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

instance.interceptors.response.use(
  (response) => objSnakeToCamel(response.data),
  (error) => { // catches 401 error across all api's
    if (error.response && error.response.status === 401) {
      console.warn('intercepted 401');
      localStorage.removeItem('access-token');
    }
    // if error isn't 401, returns it
    eventBus.$emit('notificationError', error.response.data.detail);
    return Promise.reject(error.response.data);
  },
);

export default instance;
