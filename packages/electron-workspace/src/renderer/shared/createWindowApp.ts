import { type Component, createApp } from 'vue';
import { createWindowI18n, type Locale } from './i18n';
import {
	options as WebitelUiOptions,
	plugin as WebitelUi,
	registerUiSdkLocales,
} from './plugins/webitel-ui';

/**
 * Bootstraps a renderer window Vue app with vue-i18n and the
 * @webitel/ui-sdk plugin, so ui-sdk (wt-*) components are available
 * in every window. Mirrors the app setup in ../../src/main.ts.
 */
export function createWindowApp(
	root: Component,
	messages: Partial<Record<Locale, Record<string, string>>> = {},
) {
	const i18n = createWindowI18n(messages);
	registerUiSdkLocales(i18n);

	return createApp(root).use(i18n).use(WebitelUi, WebitelUiOptions);
}
