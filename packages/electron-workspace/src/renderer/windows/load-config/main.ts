import { createWindowApp } from '../../shared/createWindowApp';
import App from './App.vue';

createWindowApp(App, {
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
}).mount('#app');
