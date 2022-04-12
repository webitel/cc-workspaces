import eventBus from '@webitel/ui-sdk/src/scripts/eventBus';
import i18n from '../../../locale/i18n';

const websocketErrorEventHandler = (error) => {
  console.error(error);
  window.error = error;
  console.info(error, error.constructor, i18n.t('error.websocket'));
  const errLocale = `error.websocket.${error.constructor}`;
  const message = {
    type: 'error',
    text: i18n.te(errLocale) ? i18n.t(errLocale) : error,
  };
  eventBus.$emit('notification', message);
  return error;
};

export default websocketErrorEventHandler;
