import eventEmitter from 'event-emitter';
import BaseStoreModule
  from '@webitel/ui-sdk/src/store/BaseStoreModules/BaseStoreModule';

const emitter = eventEmitter();

let subscriber = null;

const sw = navigator.serviceWorker;

const actions = {
  INITIALIZE: async (context) => {
    subscriber = (payload) => context.dispatch('WORKER_MESSAGE_HANDLER', payload);
    sw.addEventListener('message', subscriber);
  },

  DESTROY: async (context) => {
    sw.removeEventListener('message', subscriber);
  },

  WORKER_MESSAGE_HANDLER: async (context, event) => {
    emitter.emit(event.data.type, event.data.action);
  },

  SUBSCRIBE_TO_MESSAGE: async (context, { type, handler, once }) => {
    if (once) {
      emitter.once(type, handler);
    } else {
      emitter.on(type, handler);
    }
  },


  // https://webitel.atlassian.net/browse/WTEL-4240
  SEND_NOTIFICATION: async (context, {
    body,
    title,
    actions,
  }) => {
    return sw.controller.postMessage({
      type: 'notification',
      payload: {
        body,
        title,
        actions,
      },
    });
  },
};

const swController = new BaseStoreModule().getModule({ actions });

export default swController;

