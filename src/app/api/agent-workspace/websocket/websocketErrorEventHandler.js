import eventBus from '@webitel/ui-sdk/src/scripts/eventBus';
import i18n from '../../../locale/i18n';

const websocketErrorEventHandler = (error) => {
  const errLocale = `error.websocket.${error.id.replaceAll('.', '_')}`;
  console.info(error.id, i18n.t(errLocale));
  const message = {
    type: 'error',
    text: i18n.te(errLocale) ? i18n.t(errLocale) : error,
  };
  eventBus.$emit('notification', message);
  return error;
};

export default websocketErrorEventHandler;
