import eventBus from '@webitel/ui-sdk/src/scripts/eventBus.js';
import { markRaw, reactive, shallowReactive } from 'vue';
import { Client } from 'webitel-sdk';

import websocketErrorEventHandler from './websocketErrorEventHandler';

const { hostname, protocol } = window.location;
const origin = (`${protocol}//${hostname}`).replace(/^http/, 'ws');
const endpoint = import.meta.env.MODE === 'production'
  ? `${origin}/ws` : import.meta.env.VITE_WEB_SOCKET_URL;
const getConfig = () => {
  let cliConfig = {};
  try {
    const CONFIG = JSON.parse(localStorage.getItem('CONFIG'));
    cliConfig = CONFIG.CLI || {};
  } catch {}
  return cliConfig;
};

const ConnectionState = Object.freeze({
  IDLE: 'IDLE',
  CONNECTING: 'CONNECTING',
  CONNECTED: 'CONNECTED',
  RECONNECTING: 'RECONNECTING',
  DISCONNECTED: 'DISCONNECTED',
});

const WebSocketClientEvent = Object.freeze({
  AFTER_AUTH: 'afterAuth',
  ERROR: 'error',
});

class WebSocketClientController {
  cli = null;
  state = ConnectionState.IDLE;

  _connectPromise = null;

  Event = WebSocketClientEvent;

  _on = {
    [WebSocketClientEvent.ERROR]: [websocketErrorEventHandler],
    [WebSocketClientEvent.AFTER_AUTH]: [],
  };

  async getCliInstance({ force = false } = {}) {
    if (this._connectPromise) return this._connectPromise;

    if (!force && this.cli && this.state === ConnectionState.CONNECTED) {
      return this.cli;
    }

    this.state = this.cli
      ? ConnectionState.RECONNECTING
      : ConnectionState.CONNECTING;

    this._connectPromise = this._createCliInstance()
    .then((cli) => {
      this.cli = cli;
      this.state = ConnectionState.CONNECTED;
      return cli;
    })
    .catch((err) => {
      this.state = ConnectionState.DISCONNECTED;
      this.cli = null;
      throw err;
    })
    .finally(() => {
      this._connectPromise = null;
    });

    return this._connectPromise;
  }

  async destroyCliInstance() {
    if (!this.cli) return;

    try {
      if (this.cli.destroy) {
        await this.cli.destroy();
      }
    } catch (e) {
      console.warn('[WS] destroy error', e);
    }

    this.cli = null;
    this.state = ConnectionState.DISCONNECTED;
  }

  addEventListener(event, callback) {
    if (Array.isArray(callback)) {
      this._on[event].push(...callback);
    } else {
      this._on[event].push(callback);
    }
  }

  async _createCliInstance() {
    const token = localStorage.getItem('access-token');
    const cliConfig = getConfig();

    if (typeof cliConfig.registerWebDevice === 'undefined') {
      cliConfig.registerWebDevice = true;
    }

    const config = {
      endpoint,
      token,
      registerWebDevice: cliConfig.registerWebDevice,
      debug: cliConfig.debug,
    };

    // why reactive? https://github.com/vuejs/core/discussions/7811#discussioncomment-5181921
    // const cli = new Client(config);
    const cli = shallowReactive(new Client(config));

    // why reactive? https://github.com/vuejs/core/discussions/7811#discussioncomment-5181921
    cli.conversationStore = reactive(cli.conversationStore);
    cli.callStore = reactive(cli.callStore);

    this._attachCoreHandlers(cli);

    await cli.connect();
    await cli.auth();

    this._on[WebSocketClientEvent.AFTER_AUTH].forEach((cb) => cb(cli));

    await this._ensurePhoneUA(cli);

    window.cli = cli;
    return cli;
  }

  _attachCoreHandlers(cli) {
    this._on[WebSocketClientEvent.ERROR].forEach((cb) =>
      cli.on('error', cb),
    );

    cli.on('disconnected', () => this._handleDisconnect());

    cli.on('show_message', (e) =>
      eventBus.$emit('notification', {
        type: e.type,
        text: e.message,
        timeout: e.timeout,
      }),
    );

    cli.on('open_link', (e) => {
      window.open(
        e.url.startsWith('https://') ? e.url : `https://${e.url}`,
        '_blank',
      );
    });
  }

  async _ensurePhoneUA(cli) {
    return new Promise((resolve) => {
      const timeout = setTimeout(() => resolve(), 5000);

      const markUa = () => {
        if (cli.phone?.ua) {
          cli.phone.ua = markRaw(cli.phone.ua);
          clearTimeout(timeout);
          resolve();
        }
      };

      if (cli.phone?.ua) {
        markUa();
      } else {
        cli.on('phone_connected', markUa);
      }
    });
  }

  async _handleDisconnect() {
    if (
      this.state === ConnectionState.RECONNECTING ||
      this.state === ConnectionState.CONNECTING
    ) return;

    this.state = ConnectionState.RECONNECTING;

    await this.destroyCliInstance();
    this._reconnectWithBackoff();
  }

  _reconnectWithBackoff(attempt = 1) {
    const delay = Math.min(1000 * 2 ** attempt, 15000);

    setTimeout(async () => {
      try {
        await this.getCliInstance({ force: true });
        console.info('[WS] Reconnected');
      } catch {
        this._reconnectWithBackoff(attempt + 1);
      }
    }, delay);
  }
}

const webSocketClientController = new WebSocketClientController();

window.cliController = webSocketClientController;

export default webSocketClientController;
