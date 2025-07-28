import '@webitel/ui-sdk/dist/ui-sdk.css';

import WebitelUI from '@webitel/ui-sdk/dist/ui-sdk.js';
import * as locales from '@webitel/ui-sdk/locale';
import eventBus from '@webitel/ui-sdk/src/scripts/eventBus';

import i18n from '../locale/i18n';
// import '@webitel/ui-sdk/dist/img/sprite';

const globals = {
  $baseURL: import.meta.env.BASE_URL,
};
export default [WebitelUI, { eventBus, globals }];

Object.entries(locales).forEach(([locale, messages]) => {
  i18n.global.mergeLocaleMessage(locale, messages);
});
