import { Configuration } from 'webitel-sdk';

const configuration = new Configuration({
  basePath: import.meta.env.VITE_API_URL,
  apiKey: localStorage.getItem('access-key') || '',
  accessToken: localStorage.getItem('access-key') || '',
});

export default configuration;
