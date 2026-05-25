import React from 'react';
import './index.scss';
import logoImg from '../../../assets/logo.png';
import { useTranslation } from "react-i18next";

function Navbar() {
    const { t, i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <section id="navbar">
            <div className="container">
                <nav className="nav-wrapper">
                    <div className="brand">
                        <img src={logoImg} alt="SIRADZU" className="nav-logo" />
                    </div>
                    <div className="nav-actions">
                        <div className="lang-switcher">
                            <button 
                                className={i18n.language === 'az' ? 'active' : ''} 
                                onClick={() => changeLanguage('az')}
                            >
                                AZ
                            </button>
                            <button 
                                className={i18n.language === 'en' ? 'active' : ''} 
                                onClick={() => changeLanguage('en')}
                            >
                                EN
                            </button>
                        </div>
                    </div>
                </nav>
            </div>
        </section>
    );
}

export default Navbar;