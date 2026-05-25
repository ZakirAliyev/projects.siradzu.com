import React from 'react';
import { FolderKanban, Globe, LogOut } from 'lucide-react';
import logoImg from '../assets/logo.png';

const Sidebar = ({ lang, setLang, translations }) => {
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    window.location.href = '/login';
  };

  return (
    <div className="sidebar">
      <div className="logo">
        <img src={logoImg} alt="SIRADZU" />
      </div>
      
      <ul className="nav-links">
        <li className="nav-item active">
          <FolderKanban size={20} />
          <span>{translations.projects}</span>
        </li>
      </ul>

      <div style={{ marginTop: 'auto' }}>
        <div 
          className="sidebar-lang-toggle" 
          onClick={() => setLang(lang === 'az' ? 'en' : 'az')}
        >
          <Globe size={20} />
          <span>{lang.toUpperCase()}</span>
        </div>

        <div 
          className="sidebar-lang-toggle" 
          onClick={handleLogout}
          style={{ background: '#fff1f2', color: '#e11d48', borderColor: '#fecaca', marginTop: '0.5rem' }}
        >
          <LogOut size={20} />
          <span>{lang === 'az' ? 'Çıxış' : 'Logout'}</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
