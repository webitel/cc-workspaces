import { config } from '@vue/test-utils';
import WebitelUi from '../../src/app/plugins/webitel-ui';
import i18n from '../../src/app/locale/i18n';

config.global.plugins = [WebitelUi, i18n];
