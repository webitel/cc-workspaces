import { createI18n } from 'vue-i18n';

export type Locale = 'en' | 'ru' | 'uk';

declare global {
	interface Window {
		electronStorage?: {
			getItem: (k: string) => string | null;
		};
	}
}

function detectLocale(): Locale {
	const stored =
		window.electronStorage?.getItem?.('lang') ||
		(typeof require === 'function'
			? require('electron-localstorage').getItem('lang')
			: null);
	if (stored === 'ru' || stored === 'uk' || stored === 'en') return stored;
	return 'en';
}

export function createWindowI18n(
	messages: Partial<Record<Locale, Record<string, string>>> = {},
) {
	return createI18n({
		legacy: false,
		locale: detectLocale(),
		fallbackLocale: 'en',
		messages,
	});
}
