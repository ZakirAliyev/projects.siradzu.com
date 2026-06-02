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

const isProjectsSite = typeof window !== 'undefined' && window.location.hostname === 'projects.siradzu.com';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        lng: isProjectsSite ? 'en' : undefined,
        fallbackLng: 'en',
        supportedLngs: isProjectsSite ? ['en'] : ['en', 'az', 'ru'],
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
