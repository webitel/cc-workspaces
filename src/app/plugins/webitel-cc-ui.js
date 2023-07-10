import WebitelCCUI from '@webitel/cc-ui-sdk/dist/cc-ui-sdk.common';
import '@webitel/cc-ui-sdk/dist/cc-ui-sdk.css';
import InstallOptionsRepository from '@webitel/cc-ui-sdk/src/_install/InstallOptionsRepository';

import WebitelCCUIEn from '@webitel/cc-ui-sdk/src/locale/en/en';
import WebitelCCUIRu from '@webitel/cc-ui-sdk/src/locale/ru/ru';
import WebitelCCUIUa from '@webitel/cc-ui-sdk/src/locale/ua/ua';
import i18n from '../locale/i18n';

import instance from '../api/old/instance';
import openAPIConfig from '../api/old/openAPIConfig';

export default WebitelCCUI;
InstallOptionsRepository.setBulk({ instance, openAPIConfig });

i18n.global.mergeLocaleMessage('en', WebitelCCUIEn);
i18n.global.mergeLocaleMessage('ru', WebitelCCUIRu);
i18n.global.mergeLocaleMessage('ua', WebitelCCUIUa);
