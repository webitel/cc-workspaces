import { config } from '@vue/test-utils';
import axiosMock from '@webitel/ui-sdk/src/tests/mocks/axiosMock.js';
import {
	plugin as WebitelUi,
	options as WebitelUiOptions,
} from '../../src/app/plugins/webitel/ui-sdk.ts';
import i18n from '../../src/app/locale/i18n.js';

config.global.plugins = [
	[
		WebitelUi,
		WebitelUiOptions,
	],
	i18n,
];

vi.doMock('axios', axiosMock());
