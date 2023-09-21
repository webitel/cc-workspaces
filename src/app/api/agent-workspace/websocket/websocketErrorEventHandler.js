import eventBus from '@webitel/ui-sdk/src/scripts/eventBus';
import i18n from '../../../locale/i18n';

const websocketErrorEventHandler = (error) => {
  const errLocale = `error.websocket.${error.id.replaceAll('.', '_')}`;
  const message = {
    type: 'error',
    text: i18n.global.te(errLocale) ? i18n.global.t(errLocale) : error,
  };
  eventBus.$emit('notification', message);
  return error;
};

export default websocketErrorEventHandler;
