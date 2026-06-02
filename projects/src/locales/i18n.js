import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from '/src/locales/languages/en.json';
import az from '/src/locales/languages/az.json';
import ru from '/src/locales/languages/ru.json';

const resources = {
    en: { translation: en },
    az: { translation: az },
    ru: { translation: ru },
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'en',
        fallbackLng: 'en',
        supportedLngs: ['en'],
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
