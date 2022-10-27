import { Client } from 'webitel-sdk';
import call from '../../../../features/modules/call/call';
import websocketErrorEventHandler from './websocketErrorEventHandler';

const { hostname, protocol } = window.location;
const origin = (`${protocol}//${hostname}`).replace(/^http/, 'ws');
const endpoint = process.env.NODE_ENV === 'production'
  ? `${origin}/ws` : 'wss://dev.webitel.com/ws';

const getConfig = () => {
  let cliConfig = {};
  try {
    const CONFIG = JSON.parse(localStorage.getItem('CONFIG'));
    cliConfig = CONFIG.CLI || {};
  } catch {}
  return cliConfig;
};

const WebSocketClientEvent = Object.freeze({
  AFTER_AUTH: 'afterAuth',
  ERROR: 'error',
});

class WebSocketClientController {
  cli = null;
  Event = WebSocketClientEvent;

  _config = getConfig(); // readonly, used on init
  _on = {
    [WebSocketClientEvent.ERROR]: [websocketErrorEventHandler],
    [WebSocketClientEvent.AFTER_AUTH]: [],
  }

  getCliInstance() {
    if (!this.cli) this.cli = this._createCliInstance();
    return this.cli;
  }

  async destroyCliInstance() {
    if (!window.cli) return;

    await window.cli.destroy();
    this.cli = null;
    window.cli = null;
  }

  addEventListener(event, callback) {
    if (Array.isArray(callback)) this._on[event] = this._on[event].concat(callback);
    else this._on[event].push(callback);
  }

  _createCliInstance = async () => {
    const token = localStorage.getItem('access-token');

    const config = {
      endpoint,
      token,
      registerWebDevice: this._config.registerWebDevice,
      debug: this._config.debug,
    };
    const cli = new Client(config);

    this._on[WebSocketClientEvent.AFTER_AUTH].forEach((callback) => callback());
    this._on[WebSocketClientEvent.ERROR].forEach((callback) => cli.on('error', callback));

    await cli.connect();

    await cli.auth();

    window.cli = cli;
    return cli;
  }
}

const webSocketClientController = new WebSocketClientController();

window.cliController = webSocketClientController;

export default webSocketClientController;
