import {createContext, useContext, useState, useEffect} from 'react';
import i18n from "../../locales/i18n.js";

const LanguageContext = createContext();

export const LanguageProvider = ({children}) => {
    const isProjectsSite = typeof window !== 'undefined' && window.location.hostname === 'projects.siradzu.com';
    const [language, setLanguage] = useState(isProjectsSite ? 'en' : 'az');

    useEffect(() => {
        if (isProjectsSite) {
            setLanguage('en');
            i18n.changeLanguage('en');
        } else {
            const savedLang = localStorage.getItem('lang');
            const defaultLang = savedLang || 'az';
            setLanguage(defaultLang);
            i18n.changeLanguage(defaultLang);
        }
    }, [isProjectsSite]);

    const changeLanguage = (lang) => {
        if (isProjectsSite) {
            setLanguage('en');
            i18n.changeLanguage('en');
            localStorage.setItem('lang', 'en');
        } else {
            setLanguage(lang);
            i18n.changeLanguage(lang);
            localStorage.setItem('lang', lang);
        }
    };

    return (
        <LanguageContext.Provider value={{language: isProjectsSite ? 'en' : language, changeLanguage}}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
