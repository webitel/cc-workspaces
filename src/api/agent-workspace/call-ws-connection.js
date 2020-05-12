import { Client } from 'webitel-sdk';

// eslint-disable-next-line no-restricted-globals
const BASE_URL = process.env.NODE_ENV === 'production' ? `${location.origin.replace(/^http/, 'ws')}/ws` : 'wss://dev.webitel.com/ws';
// const BASE_URL = 'wss://dev.webitel.com/ws';
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
  if (!cliInstance) cliInstance = await createCliInstance();
  return cliInstance;
};
