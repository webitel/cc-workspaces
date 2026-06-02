import { createApp } from 'vue';
import { createWindowI18n } from '../../shared/i18n';
import App from './App.vue';

const i18n = createWindowI18n({
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
});

createApp(App).use(i18n).mount('#app');
