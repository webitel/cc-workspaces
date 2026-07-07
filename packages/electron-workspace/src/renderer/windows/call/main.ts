import { createApp } from 'vue';
import { createWindowI18n } from '../../shared/i18n';
import App from './App.vue';
import en from './i18n/en.json';
import ru from './i18n/ru.json';
import uk from './i18n/uk.json';

createApp(App)
	.use(
		createWindowI18n({
			en,
			ru,
			uk,
		}),
	)
	.mount('#app');
