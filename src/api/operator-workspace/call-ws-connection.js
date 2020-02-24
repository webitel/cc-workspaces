import { Client } from 'webitel-sdk';

const BASE_URL = 'wss://dev.webitel.com/ws';
const token = 'azrhabwxcjygpefgo8zqa5nwgy';

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
