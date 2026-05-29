import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import App from './App.vue';

declare global {
	interface Window {
		electronStorage?: {
			getItem: (k: string) => string | null;
		};
	}
}

function detectLocale(): 'en' | 'ru' | 'uk' {
	const stored =
		window.electronStorage?.getItem?.('lang') ||
		(typeof require === 'function'
			? require('electron-localstorage').getItem('lang')
			: null);
	if (stored === 'ru' || stored === 'uk' || stored === 'en') return stored;
	return 'en';
}

const i18n = createI18n({
	legacy: false,
	locale: detectLocale(),
	fallbackLocale: 'en',
	messages: {
		en: {
			Text: 'Connection was accidenttally interrupted',
			Connect: 'Connect',
		},
		ru: {
			Text: 'Связь была утеряна.',
			Connect: 'Соединить',
		},
		uk: {
			Text: "Зв'язок було втрачено.",
			Connect: 'Підключити',
		},
	},
});

createApp(App).use(i18n).mount('#app');
