import { createApp } from 'vue';
import { createWindowI18n } from '../../shared/i18n';
import App from './App.vue';

const i18n = createWindowI18n({
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
});

createApp(App).use(i18n).mount('#app');
