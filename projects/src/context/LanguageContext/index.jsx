import {createContext, useContext, useState, useEffect} from 'react';
import i18n from "../../locales/i18n.js";

const LanguageContext = createContext();

export const LanguageProvider = ({children}) => {
    const [language, setLanguage] = useState('en');

    useEffect(() => {
        setLanguage('en');
        i18n.changeLanguage('en');
        localStorage.setItem('lang', 'en');
    }, []);

    const changeLanguage = (lang) => {
        setLanguage('en');
        i18n.changeLanguage('en');
        localStorage.setItem('lang', 'en');
    };

    return (
        <LanguageContext.Provider value={{language: 'en', changeLanguage}}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
