import '@webitel/ui-sdk/dist/ui-sdk.css';

import WebitelUI from '@webitel/ui-sdk';
import * as locales from '@webitel/ui-sdk/locale';
import { eventBus } from '@webitel/ui-sdk/scripts';
import type { I18n } from 'vue-i18n';

/**
 * @webitel/ui-sdk Vue plugin setup for renderer windows.
 * Mirrors ../../../src/app/plugins/webitel/ui-sdk.ts.
 */

const globals = {
	$baseURL: import.meta.env.BASE_URL,
};

export const plugin = WebitelUI;

export const options = {
	eventBus,
	globals,
};

/** Merge ui-sdk locale messages into a window i18n instance. */
export function registerUiSdkLocales(i18n: I18n) {
	Object.entries(locales).forEach(([locale, messages]) => {
		i18n.global.mergeLocaleMessage(locale, messages as Record<string, unknown>);
	});
}
