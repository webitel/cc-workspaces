import { Client } from 'webitel-sdk';

const { hostname, protocol } = window.location;
const origin = (`${protocol}//${hostname}`).replace(/^http/, 'ws');
const BASE_URL = process.env.NODE_ENV === 'production'
  ? `${origin}/ws` : 'wss://dev.webitel.com/ws';

let cliInstance = null;

const getCLIDebug = () => {
  let debug = false;
  try {
    const CONFIG = JSON.parse(localStorage.getItem('CONFIG'));
    debug = CONFIG.CLI?.debug;
  } catch {}
  return debug;
};

const createCliInstance = async () => {
  const debug = getCLIDebug();
  const token = localStorage.getItem('access-token');
  const config = {
    endpoint: BASE_URL,
    registerWebDevice: true,
    token,
    debug,
  };

  const cli = new Client(config);
  await cli.connect();
  await cli.auth();
  window.cli = cli;
  return cli;
};

export const destroyCliInstance = async () => {
  if (!window.cli) return;

  await window.cli.destroy();
  cliInstance = null;
  window.cli = null;
};

export const getCliInstance = () => {
  if (!cliInstance) cliInstance = createCliInstance();
  return cliInstance;
};
