import Vue from 'vue';
import VueI18n from 'vue-i18n';
import en from './en/en';
import ru from './ru/ru';
import ua from './ua/ua';

Vue.use(VueI18n);

const messages = {
  en,
  ru,
  ua,
};

export default new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages,
});
