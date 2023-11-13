import { createI18n } from 'vue-i18n';
import en from './en/en';
import ru from './ru/ru';
import ua from './ua/ua';
import kz from './kz/kz';

const messages = {
  en,
  ru,
  ua,
  kz,
};

export default createI18n({
  allowComposition: true,
  locale: 'en',
  fallbackLocale: 'en',
  messages,
});
