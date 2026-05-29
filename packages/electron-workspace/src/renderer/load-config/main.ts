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
			uploadConfigurationText: 'Choose the file to upload the configuration',
			UploadFile: 'Upload file',
		},
		ru: {
			uploadConfigurationText: 'Выберите файл для загрузки конфигурации',
			UploadFile: 'Загрузить файл',
		},
		uk: {
			uploadConfigurationText: 'Оберіть файл для завантаження конфігурації',
			UploadFile: 'Завантажити файл',
		},
	},
});

createApp(App).use(i18n).mount('#app');
