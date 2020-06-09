import { Client } from 'webitel-sdk';

const { hostname, protocol } = window.location;
const origin = (`${protocol}//${hostname}`).replace(/^http/, 'ws');
const BASE_URL = process.env.NODE_ENV === 'production'
  ? `${origin}/ws` : 'wss://dev.webitel.com/ws';
// const BASE_URL = 'ws://10.10.10.25:10025';
const token = localStorage.getItem('access-token');

let cliInstance = null;

const createCliInstance = async () => {
  const config = {
    endpoint: BASE_URL,
    registerWebDevice: true,
    token,
    // debug: true,
  };

  const cli = new Client(config);
  await cli.connect();
  await cli.auth();
  window.cli = cli;
  return cli;
};

export default async () => {
  if (!cliInstance) cliInstance = createCliInstance();
  return cliInstance;
};
