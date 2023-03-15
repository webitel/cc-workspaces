import { Client } from 'webitel-sdk';
import { reactive, markRaw, toRaw, shallowReactive } from 'vue';
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

  _config = getConfig();
  _on = {
    [WebSocketClientEvent.ERROR]: [websocketErrorEventHandler],
    [WebSocketClientEvent.AFTER_AUTH]: [],
  };

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
    const configCli = getConfig();

    if (typeof configCli.registerWebDevice === 'undefined') {
      configCli.registerWebDevice = true;
    }

    const config = {
      endpoint,
      token,
      registerWebDevice: configCli.registerWebDevice,
      debug: configCli.debug,
    };

    // why reactive? https://github.com/vuejs/core/discussions/7811#discussioncomment-5181921
    // const cli = new Client(config);
    const cli = shallowReactive(new Client(config));

    // why reactive? https://github.com/vuejs/core/discussions/7811#discussioncomment-5181921
    cli.conversationStore = reactive(cli.conversationStore);
    cli.callStore = reactive(cli.callStore);

    this._on[WebSocketClientEvent.AFTER_AUTH].forEach((callback) => callback());
    this._on[WebSocketClientEvent.ERROR].forEach((callback) => cli.on('error', callback));

    await cli.connect();

    await cli.auth();

    window.cli = cli;
    return cli;
  };
}

const webSocketClientController = new WebSocketClientController();

window.cliController = webSocketClientController;

export default webSocketClientController;
