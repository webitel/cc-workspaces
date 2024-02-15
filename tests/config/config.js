import { config } from '@vue/test-utils';
import axiosMock from '@webitel/ui-sdk/src/tests/mocks/axiosMock';
import WebitelUi from '../../src/app/plugins/webitel-ui';
import i18n from '../../src/app/locale/i18n';

config.global.plugins = [WebitelUi, i18n];

vi.doMock('axios', axiosMock());
