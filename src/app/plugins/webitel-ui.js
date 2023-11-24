import WebitelUI from '@webitel/ui-sdk/dist/ui-sdk.umd';
import WebitelUIEn from '@webitel/ui-sdk/src/locale/en/en';
import WebitelUIRu from '@webitel/ui-sdk/src/locale/ru/ru';
import WebitelUIUa from '@webitel/ui-sdk/src/locale/ua/ua';
import WebitelUIKz from '@webitel/ui-sdk/src/locale/kz/kz';
import eventBus from '@webitel/ui-sdk/src/scripts/eventBus';
import i18n from '../locale/i18n';
import '@webitel/ui-sdk/dist/ui-sdk.css';
import '@webitel/ui-sdk/dist/img/sprite';

const globals = {
  $baseURL: process.env.BASE_URL,
};
export default [WebitelUI, { eventBus, globals }];

i18n.global.mergeLocaleMessage('en', WebitelUIEn);
i18n.global.mergeLocaleMessage('ru', WebitelUIRu);
i18n.global.mergeLocaleMessage('ua', WebitelUIUa);
i18n.global.mergeLocaleMessage('kz', WebitelUIKz);
