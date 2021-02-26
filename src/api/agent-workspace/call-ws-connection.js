import { Client } from 'webitel-sdk';

const { hostname, protocol } = window.location;
const origin = (`${protocol}//${hostname}`).replace(/^http/, 'ws');
const BASE_URL = process.env.NODE_ENV === 'production'
  ? `${origin}/ws` : 'wss://dev.webitel.com/ws';
// const BASE_URL = 'ws://10.10.10.25:10025';

let cliInstance = null;

const createCliInstance = async () => {
  const token = localStorage.getItem('access-token');
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

export const destroyCliInstance = async () => {
  if (!window.cli) return;
  // if (cliInstance) {
  // cliInstance.then((cli) => cli.destroy());
  // }
    if (window.cli.phone && window.cli.phone.ua) {
      await window.cli.phone.ua.stop();
    }
    await window.cli.disconnect();
    window.cli.eventHandler.off('*');
    cliInstance = null;
  // }
  // cliInstance = null;
};

export const getCliInstance = () => {
  if (!cliInstance) cliInstance = createCliInstance();
  return cliInstance;
};
