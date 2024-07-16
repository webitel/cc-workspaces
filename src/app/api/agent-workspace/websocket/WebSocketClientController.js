import eventBus from '@webitel/ui-sdk/src/scripts/eventBus.js';
import { markRaw, reactive, shallowReactive } from 'vue';
import { Client } from 'webitel-sdk';
import websocketErrorEventHandler from './websocketErrorEventHandler';

const { hostname, protocol } = window.location;
const origin = (`${protocol}//${hostname}`).replace(/^http/, 'ws');
const endpoint = import.meta.env.MODE === 'production'
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
    cli.on(`show_message`, e => eventBus.$emit('notification', {
      type: e.type,
      text: e.message,
      timeout: e.timeout,
    }));

    await cli.connect();

    await cli.auth();

    /*
    cli.phone.ua contains "configuration" property, which has no setter so cannot be wrapped with reactivity.
    so that, reactivity breaks
     for more info, see WTEL-4236
     */
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        console.error('Phone user agent is not connected :(');
        resolve();
      }, 5000);

      const markUa = () => cli.phone?.ua && (cli.phone.ua = markRaw(cli.phone.ua));

      if (cli.phone?.ua) {
        markUa();
        clearTimeout(timeout);
        resolve();
      } else cli.on('phone_connected', () => {
        markUa();
        clearTimeout(timeout);
        resolve();
      });
    });

    window.cli = cli;
    return cli;
  };
}

const webSocketClientController = new WebSocketClientController();

window.cliController = webSocketClientController;

export default webSocketClientController;
