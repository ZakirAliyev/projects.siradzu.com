import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Presentation, Globe, ArrowLeft, Download, Eye, Layers, Share2, Calendar, Sun, Moon } from 'lucide-react';

import { API_BASE } from '../config';
import logoImg from '../assets/logo.png';

const PublicProjectPage = () => {
  const { slug } = useParams();
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [project, setProject] = useState(null);
  const [lang, setLang] = useState('az');
  const [loading, setLoading] = useState(true);
  const [previewFile, setPreviewFile] = useState(null);

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/projects/${slug}`);
        setProject(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [slug]);

  const getPreviewUrl = (fileUrl) => {
    const absoluteUrl = `${API_BASE}${fileUrl}`;
    return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(absoluteUrl)}`;
  };

  if (loading) return <div className={`loader-container ${theme === 'dark' ? 'dark-theme' : ''}`}><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="loader" /></div>;
  if (!project) return <div className={`error-container ${theme === 'dark' ? 'dark-theme' : ''}`}><h1>404</h1><p>Not Found</p></div>;

  return (
    <div className={`public-site ${theme === 'dark' ? 'dark-theme' : ''}`}>
      <nav className="glass-nav">
        <div className="nav-content">
          <div className="brand">
            <img src={logoImg} alt="SIRADZU" className="brand-logo-img" />
          </div>
          <div className="nav-actions">
            {/* Theme Toggle */}
            <button 
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="theme-toggle-btn"
              title={lang === 'az' ? 'Mövzunu dəyiş' : 'Toggle theme'}
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>

            <div className="lang-switch-mini">
              <button className={lang === 'az' ? 'active' : ''} onClick={() => setLang('az')}>AZ</button>
              <button className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>EN</button>
            </div>
            <button className="icon-btn"><Share2 size={16} /></button>
          </div>
        </div>
      </nav>

      <main>
        <section className="hero">
          <div className="hero-image-container">
            <img src={`${API_BASE}${project.cardImage}`} alt={project.name[lang]} className="hero-img" />
          </div>

          <div className="hero-text">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="badge">{lang === 'az' ? 'Layihə Təfərrüatı' : 'Project Details'}</div>
              <h1>{project.name[lang]}</h1>
              <p>{project.description[lang]}</p>

              {project.website && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <a 
                    href={project.website} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="action-link download"
                    style={{ display: 'inline-flex', width: 'auto', padding: '10px 20px', fontSize: '0.85rem', alignValues: 'center' }}
                  >
                    <Globe size={16} />
                    <span>{lang === 'az' ? 'Vebsaytı Ziyarət Et' : 'Visit Website'}</span>
                  </a>
                </div>
              )}

              <div className="meta-info">
                <Calendar size={14} />
                <span>{new Date(project.createdAt).toLocaleDateString()}</span>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="resources">
          <div className="section-header">
            <h2>{lang === 'az' ? 'Resurslar' : 'Resources'}</h2>
            <p>{lang === 'az' ? 'Sənədlərə onlayn baxa və ya yükləyə bilərsiniz.' : 'You can preview or download documents below.'}</p>
          </div>

          <div className="resource-grid">
            {[
              { id: 'word_az', type: 'word', label: lang === 'az' ? 'MVP (AZ)' : 'MVP (AZ)', file: project.files.word_az },
              { id: 'word_en', type: 'word', label: lang === 'az' ? 'MVP (EN)' : 'MVP (EN)', file: project.files.word_en },
              { id: 'ppt_az', type: 'ppt', label: lang === 'az' ? 'Təqdimat (AZ)' : 'Presentation (AZ)', file: project.files.ppt_az },
              { id: 'ppt_en', type: 'ppt', label: lang === 'az' ? 'Təqdimat (EN)' : 'Presentation (EN)', file: project.files.ppt_en },
            ].filter(f => f.file).map((item, idx) => (
              <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className="resource-card">
                <div className={`icon-box ${item.type}`}>
                  {item.type === 'word' ? <FileText size={20} /> : <Presentation size={20} />}
                </div>
                <div className="res-info">
                  <h3>{item.label}</h3>
                  <div className="res-actions">
                    <button className="action-link view" onClick={() => setPreviewFile(item.file)}>
                      <Eye size={14} /> {lang === 'az' ? 'Bax' : 'View'}
                    </button>
                    <a
                      href={`${API_BASE}${item.file}`}
                      className="action-link download"
                      download={`${project.name[lang]}-${item.label.replace(/\s+/g, '-')}.docx`}
                    >
                      <Download size={14} /> {lang === 'az' ? 'Yüklə' : 'Download'}
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <AnimatePresence>
        {previewFile && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="preview-overlay">
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="preview-sheet">
              <div className="sheet-header">
                <h3>{lang === 'az' ? 'Sənədə Baxış' : 'Document Preview'}</h3>
                <button className="close-sheet" onClick={() => setPreviewFile(null)}>
                  <ArrowLeft size={20} />
                </button>
              </div>
              <div className="sheet-body">
                <iframe src={getPreviewUrl(previewFile)} width="100%" height="100%" style={{ border: 'none' }} title="Preview" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="public-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <img src={logoImg} alt="SIRADZU" className="brand-logo-img" />
          </div>
          <p className="footer-text">
            {lang === 'az' 
              ? '© 2026 SIRADZU. Bütün hüquqlar qorunur.' 
              : '© 2026 SIRADZU. All rights reserved.'}
          </p>
        </div>
      </footer>

      <style>{`
        .public-site {
          --bg-page: #F7F7F7;
          --bg-card: #FFFFFF;
          --bg-nav: rgba(255, 255, 255, 0.85);
          --text-main: #0A1029;
          --text-muted: #9BA7B8;
          --border-color: rgba(155, 167, 184, 0.15);
          --logo-filter: none;
          --switcher-bg: rgba(155, 167, 184, 0.1);
          --switcher-btn-active: #FFFFFF;
          --switcher-btn-active-text: #0A1029;
          --card-shadow: rgba(0,0,0,0.02);
          --icon-box-word-bg: #eff6ff;
          --icon-box-word-color: #2563eb;
          --icon-box-ppt-bg: #fff1f2;
          --icon-box-ppt-color: #e11d48;
          --btn-view-bg: #f8fafc;
          --btn-view-border: #e2e8f0;
          --btn-view-text: #64748b;
        }

        .public-site.dark-theme {
          --bg-page: #0A1029;
          --bg-card: #0d1430;
          --bg-nav: rgba(10, 16, 41, 0.85);
          --text-main: #FFFFFF;
          --text-muted: #9BA7B8;
          --border-color: rgba(155, 167, 184, 0.15);
          --logo-filter: brightness(0) invert(1);
          --switcher-bg: rgba(255, 255, 255, 0.03);
          --switcher-btn-active: rgba(255, 255, 255, 0.08);
          --switcher-btn-active-text: #FFFFFF;
          --card-shadow: rgba(0,0,0,0.2);
          --icon-box-word-bg: rgba(59, 130, 246, 0.08);
          --icon-box-word-color: #60a5fa;
          --icon-box-ppt-bg: rgba(239, 68, 68, 0.08);
          --icon-box-ppt-color: #f87171;
          --btn-view-bg: rgba(255, 255, 255, 0.03);
          --btn-view-border: rgba(255, 255, 255, 0.06);
          --btn-view-text: #e4e4e7;
        }

        .public-site {
          background: var(--bg-page);
          color: var(--text-main);
          min-height: 100vh;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          line-height: 1.6;
          transition: background-color 0.3s, color 0.3s;
        }

        .glass-nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 1000;
          background: var(--bg-nav);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border-color);
          transition: background-color 0.3s, border-color 0.3s;
        }

        .nav-content {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0.8rem 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .brand {
          display: flex;
          align-items: center;
        }

        .brand-logo-img {
          height: 34px;
          width: auto;
          object-fit: contain;
          filter: var(--logo-filter);
          transition: filter 0.3s;
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: nowrap;
        }

        .theme-toggle-btn {
          background: var(--switcher-bg);
          border: 1px solid var(--border-color);
          color: var(--text-main);
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .theme-toggle-btn:hover {
          background: rgba(155, 167, 184, 0.2);
        }

        .lang-switch-mini {
          background: var(--switcher-bg);
          padding: 3px;
          border-radius: 8px;
          display: flex;
          border: 1px solid var(--border-color);
          transition: background-color 0.3s, border-color 0.3s;
        }

        .lang-switch-mini button {
          background: transparent;
          border: none;
          color: var(--text-muted);
          padding: 4px 10px;
          font-size: 0.75rem;
          font-weight: 700;
          cursor: pointer;
          border-radius: 6px;
          transition: all 0.2s;
        }

        .lang-switch-mini button.active { 
          background: var(--switcher-btn-active); 
          color: var(--switcher-btn-active-text); 
          box-shadow: 0 2px 4px rgba(0,0,0,0.05); 
        }

        .icon-btn {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          color: var(--text-muted);
          width: 32px; height: 32px;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          margin-left: 0.5rem;
          transition: all 0.2s;
        }
        .icon-btn:hover {
          background: var(--switcher-bg);
          color: var(--text-main);
        }

        .hero { padding-top: 50px; }

        .hero-image-container {
          max-width: 1100px;
          margin: 0 auto;
          width: 100%;
          aspect-ratio: 3000 / 1055;
          background: var(--bg-card);
          overflow: hidden;
          border-bottom: 1px solid var(--border-color);
        }

        .hero-img { width: 100%; height: 100%; object-fit: contain; }

        .hero-text {
          padding: 3rem 1.5rem;
          max-width: 1100px;
          margin: 0 auto;
          text-align: left;
        }

        .hero-text .badge {
          display: inline-block;
          padding: 4px 10px;
          background: var(--switcher-bg);
          color: var(--text-main);
          border: 1px solid var(--border-color);
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .hero-text h1 {
          font-size: 1.4rem;
          font-weight: 800;
          margin-bottom: 1rem;
          letter-spacing: -0.5px;
          color: var(--text-main);
        }

        .hero-text p {
          color: var(--text-muted);
          font-size: 1rem;
          margin-bottom: 1.5rem;
          max-width: 800px;
        }

        .meta-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-muted);
          font-size: 0.8rem;
        }

        .resources {
          padding: 0 1.5rem 5rem;
          max-width: 1100px;
          margin: 0 auto;
        }

        .section-header { margin-bottom: 2rem; text-align: left; }
        .section-header h2 { font-size: 1.1rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.5rem; }
        .section-header p { color: var(--text-muted); font-size: 0.9rem; }

        .resource-grid { display: grid; gap: 0.8rem; }

        .resource-card {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          padding: 1.2rem;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 1.2rem;
          box-shadow: var(--card-shadow);
        }

        .icon-box {
          width: 44px; height: 44px;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        .icon-box.word { background: var(--icon-box-word-bg); color: var(--icon-box-word-color); }
        .icon-box.ppt { background: var(--icon-box-ppt-bg); color: var(--icon-box-ppt-color); }

        .res-info { flex: 1; }
        .res-info h3 { font-size: 0.95rem; font-weight: 600; margin-bottom: 0.8rem; color: var(--text-main); }
        .res-actions { display: flex; gap: 0.5rem; }

        .action-link {
          padding: 6px 14px;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          border: none;
          display: flex; align-items: center; gap: 6px;
          text-decoration: none;
          transition: 0.2s;
        }

        .action-link.view { background: var(--btn-view-bg); color: var(--btn-view-text); border: 1px solid var(--btn-view-border); }
        .action-link.download { background: var(--text-main); color: var(--bg-page); }
        .action-link:hover { opacity: 0.8; }

        .preview-overlay {
          position: fixed; inset: 0; z-index: 2000;
          background: var(--drawer-backdrop-bg);
          backdrop-filter: blur(4px);
          display: flex; align-items: flex-end;
        }

        .preview-sheet {
          width: 100%; height: 90vh;
          background: var(--bg-card);
          border-top-left-radius: 24px; border-top-right-radius: 24px;
          display: flex; flex-direction: column;
          box-shadow: 0 -10px 25px rgba(0,0,0,0.1);
        }

        .sheet-header {
          padding: 1rem 1.5rem;
          display: flex; justify-content: space-between; align-items: center;
          color: var(--text-main); border-bottom: 1px solid var(--border-color);
        }

        .sheet-header h3 { font-size: 1.1rem; font-weight: 700; }

        .close-sheet {
          background: var(--switcher-bg); border: none;
          color: var(--text-main);
          width: 36px; height: 36px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
        }

        .loader-container {
          --bg-page: #F7F7F7;
          --border-color: rgba(155, 167, 184, 0.15);
          --text-main: #0A1029;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-page);
        }
        .loader-container.dark-theme {
          --bg-page: #0A1029;
          --border-color: rgba(255, 255, 255, 0.05);
          --text-main: #FFFFFF;
        }
        .loader {
          width: 30px;
          height: 30px;
          border: 2px solid var(--border-color);
          border-top-color: var(--text-main);
          border-radius: 50%;
        }

        .error-container {
          --bg-page: #F7F7F7;
          --text-main: #0A1029;
          --text-muted: #9BA7B8;
          height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: var(--bg-page);
          color: var(--text-main);
        }
        .error-container.dark-theme {
          --bg-page: #0A1029;
          --text-main: #FFFFFF;
          --text-muted: #9BA7B8;
        }
        
        @media (max-width: 600px) {
          .hero-image-container { aspect-ratio: 3000 / 1055; border-radius: 0; }
          .hero-text { padding: 2rem 1rem; }
          .hero-text h1 { font-size: 1.4rem; }
          .resources { padding: 0 1rem 4rem; }
          .resource-card { padding: 1rem; gap: 1rem; }
          .icon-box { width: 36px; height: 36px; }
          .icon-box svg { width: 18px; height: 18px; }
          .res-info h3 { font-size: 0.9rem; margin-bottom: 0.5rem; }
          .action-link { padding: 6px 10px; font-size: 0.7rem; }
          .nav-content { padding: 0.8rem 1rem; }
        }

        /* Public Footer */
        .public-footer {
          border-top: 1px solid var(--border-color);
          background: var(--bg-card);
          padding: 2.5rem 1.5rem;
          margin-top: 5rem;
          transition: background-color 0.3s, border-color 0.3s;
        }

        .footer-content {
          max-width: 1100px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .footer-brand {
          display: flex;
          align-items: center;
        }

        .footer-text {
          color: var(--text-muted);
          font-size: 0.85rem;
        }
      `}</style>
    </div>
  );
};

export default PublicProjectPage;
