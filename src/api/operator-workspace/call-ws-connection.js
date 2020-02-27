import { Client } from 'webitel-sdk';

const BASE_URL = 'wss://dev.webitel.com/ws';
// const BASE_URL = 'ws://10.10.10.25:10025';
const token = localStorage.getItem('access-token');

export default async (callHandler) => {
  const config = {
    endpoint: BASE_URL,
    registerWebDevice: true,
    token,
  };

  const cli = new Client(config);
  await cli.connect();
  await cli.auth();
  await cli.subscribeCall(callHandler, null);
  window.cli = cli;

  return cli;
};
