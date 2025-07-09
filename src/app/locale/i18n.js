import { createI18n } from 'vue-i18n';

import en from './en/en';
import kz from './kz/kz';
import ru from './ru/ru';
import uk from './uk/uk';

const messages = {
  en,
  ru,
  uk,
  kz,
};

export default createI18n({
  allowComposition: true,
  locale: 'en',
  fallbackLocale: 'en',
  messages,
});
