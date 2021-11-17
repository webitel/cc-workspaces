import { Client } from 'webitel-sdk';

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
});

class WebSocketClientController {
  cli = null;
  Event = WebSocketClientEvent;

  _config = getConfig(); // readonly, used on init
  _on = {
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
    await cli.connect();

    await cli.auth();
    this._on[WebSocketClientEvent.AFTER_AUTH].forEach((callback) => callback());

    window.cli = cli;
    return cli;
  }
}

const webSocketClientController = new WebSocketClientController();

window.cliController = webSocketClientController;

export default webSocketClientController;
