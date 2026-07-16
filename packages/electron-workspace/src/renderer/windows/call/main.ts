import { createWindowApp } from '../../shared/createWindowApp';
import App from './App.vue';
import en from './i18n/en.json';
import ru from './i18n/ru.json';
import uk from './i18n/uk.json';

createWindowApp(App, {
	en,
	ru,
	uk,
}).mount('#app');
