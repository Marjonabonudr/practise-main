import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationEN from './locales/en/translation.json';
import translationUZ from './locales/uz/translation.json';

const resources = {
  en: { translation: translationEN },
  uz: { translation: translationUZ },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('i18nLang') || 'uz', // default uz
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

export default i18n;
