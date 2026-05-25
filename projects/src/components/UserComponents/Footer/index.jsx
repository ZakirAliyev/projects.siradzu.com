import React from 'react';
import './index.scss';
import logoImg from '../../../assets/logo.png';
import { useTranslation } from "react-i18next";

function Footer() {
    const { t, i18n } = useTranslation();

    return (
        <section id="footer">
            <div className="container">
                <div className="footer-wrapper">
                    <div className="brand">
                        <img src={logoImg} alt="SIRADZU" className="footer-logo" />
                    </div>
                    <p className="copyright-text">
                        {i18n.language === 'az' 
                          ? '© 2026 SIRADZU. Bütün hüquqlar qorunur.' 
                          : '© 2026 SIRADZU. All rights reserved.'}
                    </p>
                </div>
            </div>
        </section>
    );
}

export default Footer;