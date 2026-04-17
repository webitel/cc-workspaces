import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import App from './App.vue';
import './styles.css';

const i18n = createI18n({
	legacy: false,
	locale: 'en',
	fallbackLocale: 'en',
	messages: {
		en: {
			title: 'Call Popup (Vue)',
			noCall: 'No active call',
			answer: 'Answer',
			reject: 'Reject',
			hold: 'Hold',
			mute: 'Mute',
		},
	},
});

createApp(App).use(i18n).mount('#app');
