import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Presentation, Globe, ArrowLeft, Download, Eye, Layers, Share2, Calendar } from 'lucide-react';

const API_BASE = 'https://projects-back.siradzu.com';

const PublicProjectPage = () => {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [lang, setLang] = useState('az');
  const [loading, setLoading] = useState(true);
  const [previewFile, setPreviewFile] = useState(null);

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
    const absoluteUrl = `${window.location.origin.replace('5173', '5001')}${fileUrl}`;
    return `https://docs.google.com/viewer?url=${encodeURIComponent(absoluteUrl)}&embedded=true`;
  };

  if (loading) return <div className="loader-container"><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="loader" /></div>;
  if (!project) return <div className="error-container"><h1>404</h1><p>Not Found</p></div>;

  return (
    <div className="public-site">
      <nav className="glass-nav">
        <div className="nav-content">
          <div className="brand">
            <Layers size={18} color="#2563eb" />
            <span>SIRADZU</span>
          </div>
          <div className="nav-actions">
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

      <style>{`
        .public-site {
          background: #fdfdfd;
          color: #1a1a1a;
          min-height: 100vh;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          line-height: 1.6;
        }

        .glass-nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 1000;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid #eee;
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
          gap: 0.6rem;
          font-weight: 700;
          font-size: 1.1rem;
          color: #000;
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: nowrap;
        }

        .lang-switch-mini {
          background: #f1f5f9;
          padding: 3px;
          border-radius: 8px;
          display: flex;
        }

        .lang-switch-mini button {
          background: transparent;
          border: none;
          color: #64748b;
          padding: 4px 10px;
          font-size: 0.75rem;
          font-weight: 700;
          cursor: pointer;
          border-radius: 6px;
        }

        .lang-switch-mini button.active { background: #fff; color: #000; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }

        .icon-btn {
          background: #fff;
          border: 1px solid #e2e8f0;
          color: #64748b;
          width: 32px; height: 32px;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          margin-left: 0.5rem;
        }

        .hero { padding-top: 50px; }

        .hero-image-container {
          max-width: 1100px;
          margin: 0 auto;
          width: 100%;
          aspect-ratio: 3000 / 1055;
          background: #fff;
          overflow: hidden;
          border-bottom: 1px solid #f1f5f9;
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
          background: #f1f5f9;
          color: #64748b;
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
          color: #000;
        }

        .hero-text p {
          color: #666;
          font-size: 1rem;
          margin-bottom: 1.5rem;
          max-width: 800px;
        }

        .meta-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #94a3b8;
          font-size: 0.8rem;
        }

        .resources {
          padding: 0 1.5rem 5rem;
          max-width: 1100px;
          margin: 0 auto;
        }

        .section-header { margin-bottom: 2rem; text-align: left; }
        .section-header h2 { font-size: 1.1rem; font-weight: 700; color: #000; margin-bottom: 0.5rem; }
        .section-header p { color: #64748b; font-size: 0.9rem; }

        .resource-grid { display: grid; gap: 0.8rem; }

        .resource-card {
          background: #fff;
          border: 1px solid #f1f5f9;
          padding: 1.2rem;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 1.2rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.02);
        }

        .icon-box {
          width: 44px; height: 44px;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        .icon-box.word { background: #eff6ff; color: #2563eb; }
        .icon-box.ppt { background: #fff1f2; color: #e11d48; }

        .res-info { flex: 1; }
        .res-info h3 { font-size: 0.95rem; font-weight: 600; margin-bottom: 0.8rem; color: #000; }
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

        .action-link.view { background: #f8fafc; color: #64748b; border: 1px solid #e2e8f0; }
        .action-link.download { background: #2563eb; color: #fff; }
        .action-link:hover { opacity: 0.8; }

        .preview-overlay {
          position: fixed; inset: 0; z-index: 2000;
          background: rgba(0,0,0,0.4);
          backdrop-filter: blur(4px);
          display: flex; align-items: flex-end;
        }

        .preview-sheet {
          width: 100%; height: 90vh;
          background: #fff;
          border-top-left-radius: 24px; border-top-right-radius: 24px;
          display: flex; flex-direction: column;
          box-shadow: 0 -10px 25px rgba(0,0,0,0.1);
        }

        .sheet-header {
          padding: 1rem 1.5rem;
          display: flex; justify-content: space-between; align-items: center;
          color: #000; border-bottom: 1px solid #f1f5f9;
        }

        .sheet-header h3 { font-size: 1.1rem; font-weight: 700; }

        .close-sheet {
          background: #f1f5f9; border: none;
          width: 36px; height: 36px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
        }

        .loader-container { height: 100vh; display: flex; align-items: center; justify-content: center; background: #fff; }
        .loader { width: 30px; height: 30px; border: 2px solid #f1f5f9; border-top-color: #2563eb; border-radius: 50%; }
        
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
      `}</style>
    </div>
  );
};

export default PublicProjectPage;
