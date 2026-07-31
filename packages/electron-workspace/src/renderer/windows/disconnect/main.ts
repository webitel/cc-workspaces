import { createWindowApp } from '../../shared/createWindowApp';
import App from './App.vue';

createWindowApp(App, {
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
}).mount('#app');
