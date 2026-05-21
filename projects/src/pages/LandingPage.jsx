import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Layers, Globe, FileText, Presentation, Eye, Download, 
  Share2, ArrowRight, X, Calendar, Lock, ExternalLink, Copy, Check 
} from 'lucide-react';

import { API_BASE } from '../config';

const LandingPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [lang, setLang] = useState('az');
  const [selectedProject, setSelectedProject] = useState(null);
  const [copiedId, setCopiedId] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/projects`);
        // Sort projects by order ascending
        const sorted = (res.data || []).sort((a, b) => (a.order || 0) - (b.order || 0));
        setProjects(sorted);
      } catch (err) {
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleCopyLink = (slug) => {
    const link = `${window.location.origin}/${slug}`;
    navigator.clipboard.writeText(link).then(() => {
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    });
  };

  const getPreviewUrl = (fileUrl) => {
    // Resolve absolute URL for Microsoft Office Online Viewer (extremely reliable and high fidelity)
    const absoluteUrl = `${API_BASE}${fileUrl}`;
    return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(absoluteUrl)}`;
  };

  const filteredProjects = projects.filter(p => {
    const name = p.name[lang] || '';
    const desc = p.description[lang] || '';
    return name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           desc.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const translations = {
    az: {
      heroTitle: "Rəqəmsal Layihələr Portalı",
      heroSubtitle: "Siradzu platformasının ən son həlləri, rəqəmsal konseptləri və korporativ təqdimat sənədlərinin vahid arxiv portalı.",
      searchPlaceholder: "Layihələrdə axtarış...",
      noProjects: "Hələ ki, heç bir layihə əlavə edilməyib.",
      adminBtn: "Admin Panel",
      detailsTitle: "Layihə Təfərrüatı",
      viewDetails: "Ətraflı Bax",
      download: "Yüklə",
      preview: "Onlayn Bax",
      share: "Linki Kopyala",
      copied: "Kopyalandı!",
      fullPage: "Tam Ekran",
      close: "Bağla",
      createdAt: "Yaradılma tarixi",
      resources: "Mövcud Resurslar",
      resourcesDesc: "Aşağıdakı sənədlərə onlayn baxa və ya onları cihazınıza yükləyə bilərsiniz."
    },
    en: {
      heroTitle: "Digital Projects Portal",
      heroSubtitle: "Unified archive portal for Siradzu's latest digital solutions, concepts, and corporate presentation resources.",
      searchPlaceholder: "Search projects...",
      noProjects: "No projects have been added yet.",
      adminBtn: "Admin Portal",
      detailsTitle: "Project Details",
      viewDetails: "View Details",
      download: "Download",
      preview: "Preview Online",
      share: "Copy Link",
      copied: "Copied!",
      fullPage: "Full Screen",
      close: "Close",
      createdAt: "Created Date",
      resources: "Available Resources",
      resourcesDesc: "You can preview the documents online or download them directly to your device."
    }
  };

  const t = translations[lang];

  return (
    <div className="landing-page">
      {/* Sleek Blurred Navigation */}
      <nav className="glass-nav">
        <div className="nav-content">
          <div className="brand">
            <div className="brand-logo">
              <Layers size={20} className="logo-icon" />
            </div>
            <span className="brand-name">SIRADZU</span>
          </div>

          <div className="nav-actions">
            {/* Language Switch */}
            <div className="lang-switcher">
              <button 
                className={lang === 'az' ? 'active' : ''} 
                onClick={() => setLang('az')}
              >
                AZ
              </button>
              <button 
                className={lang === 'en' ? 'active' : ''} 
                onClick={() => setLang('en')}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-background-gradient"></div>
        <div className="hero-grid-pattern"></div>
        <div className="hero-content">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="hero-badge">
              <span className="pulse-dot"></span>
              <span>Active Projects Arxiv</span>
            </div>
            <h1>{t.heroTitle}</h1>
            <p>{t.heroSubtitle}</p>
          </motion.div>

          {/* Minimalist Search Bar */}
          <motion.div 
            className="search-container"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder={t.searchPlaceholder} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="search-clear">
                <X size={16} />
              </button>
            )}
          </motion.div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="projects-section">
        {loading ? (
          <div className="loading-state">
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }} 
              className="custom-spinner"
            />
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon-wrapper">
              <Layers size={40} className="empty-icon" />
            </div>
            <h3>{t.noProjects}</h3>
            {searchTerm && <p>Axtarışa uyğun layihə tapılmadı.</p>}
          </div>
        ) : (
          <div className="projects-grid">
            {filteredProjects.map((project, idx) => (
              <motion.div 
                key={project.id}
                className="project-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                onClick={() => setSelectedProject(project)}
                whileHover={{ y: -6 }}
              >
                <div className="card-image-wrapper">
                  <img 
                    src={`${API_BASE}${project.cardImage}`} 
                    alt={project.name[lang]} 
                    className="card-img"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000';
                    }}
                  />
                  <div className="card-hover-overlay">
                    <span className="overlay-btn">
                      {t.viewDetails} <ArrowRight size={14} />
                    </span>
                  </div>
                </div>

                <div className="card-content">
                  <span className="card-date">
                    <Calendar size={12} />
                    {new Date(project.createdAt).toLocaleDateString(lang === 'az' ? 'az-AZ' : 'en-US', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </span>
                  <h3>{project.name[lang]}</h3>
                  <p className="card-desc">{project.description[lang]}</p>

                  <div className="card-footer">
                    <div className="resource-indicators">
                      {project.files.word_az || project.files.word_en ? (
                        <span className="indicator-badge doc" title="Word Document Available">DOC</span>
                      ) : null}
                      {project.files.ppt_az || project.files.ppt_en ? (
                        <span className="indicator-badge ppt" title="Presentation Available">PPT</span>
                      ) : null}
                    </div>
                    <span className="learn-more">
                      {t.viewDetails}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Modern Slide-out Side Drawer for Project Details */}
      <AnimatePresence>
        {selectedProject && (
          <>
            {/* Drawer Backdrop Overlay */}
            <motion.div 
              className="drawer-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
            />

            {/* Slide-out Drawer */}
            <motion.div 
              className="drawer-container"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            >
              {/* Drawer Header */}
              <div className="drawer-header">
                <div className="drawer-header-left">
                  <span className="drawer-badge">{t.detailsTitle}</span>
                </div>
                <button 
                  className="drawer-close-btn"
                  onClick={() => setSelectedProject(null)}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Drawer Body Scroll */}
              <div className="drawer-body">
                {/* Project Banner Image */}
                <div className="drawer-banner">
                  <img 
                    src={`${API_BASE}${selectedProject.cardImage}`} 
                    alt={selectedProject.name[lang]} 
                    className="drawer-img"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000';
                    }}
                  />
                </div>

                {/* Info and Metadata */}
                <div className="drawer-meta-section">
                  <h2>{selectedProject.name[lang]}</h2>
                  <div className="drawer-date-badge">
                    <Calendar size={14} />
                    <span>
                      {t.createdAt}: {new Date(selectedProject.createdAt).toLocaleDateString(lang === 'az' ? 'az-AZ' : 'en-US', {
                        year: 'numeric', month: 'long', day: 'numeric'
                      })}
                    </span>
                  </div>
                  
                  <p className="drawer-description">{selectedProject.description[lang]}</p>
                </div>

                {/* Resource List */}
                <div className="drawer-resources-section">
                  <div className="drawer-section-header">
                    <h4>{t.resources}</h4>
                    <p>{t.resourcesDesc}</p>
                  </div>

                  <div className="drawer-files-list">
                    {[
                      { id: 'word_az', type: 'word', label: lang === 'az' ? 'MVP Konsepti (AZ)' : 'MVP Concept (AZ)', file: selectedProject.files.word_az },
                      { id: 'word_en', type: 'word', label: lang === 'az' ? 'MVP Konsepti (EN)' : 'MVP Concept (EN)', file: selectedProject.files.word_en },
                      { id: 'ppt_az', type: 'ppt', label: lang === 'az' ? 'Təqdimat Sənədi (AZ)' : 'Presentation Document (AZ)', file: selectedProject.files.ppt_az },
                      { id: 'ppt_en', type: 'ppt', label: lang === 'az' ? 'Təqdimat Sənədi (EN)' : 'Presentation Document (EN)', file: selectedProject.files.ppt_en },
                    ].filter(f => f.file).map((item) => (
                      <div key={item.id} className="drawer-file-card">
                        <div className={`drawer-file-icon ${item.type}`}>
                          {item.type === 'word' ? <FileText size={20} /> : <Presentation size={20} />}
                        </div>
                        <div className="drawer-file-info">
                          <h5>{item.label}</h5>
                          <div className="drawer-file-actions">
                            <button 
                              className="drawer-action-btn preview"
                              onClick={() => setPreviewFile(item.file)}
                            >
                              <Eye size={13} />
                              <span>{t.preview}</span>
                            </button>
                            <a 
                              href={`${API_BASE}${item.file}`}
                              className="drawer-action-btn download"
                              download
                            >
                              <Download size={13} />
                              <span>{t.download}</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Drawer Footer Actions */}
              <div className="drawer-footer">
                <button 
                  className="drawer-footer-btn share"
                  onClick={() => handleCopyLink(selectedProject.slug)}
                >
                  {copiedId ? <Check size={15} color="#10b981" /> : <Copy size={15} />}
                  <span>{copiedId ? t.copied : t.share}</span>
                </button>

                <Link 
                  to={`/${selectedProject.slug}`} 
                  className="drawer-footer-btn full-view"
                >
                  <ExternalLink size={15} />
                  <span>{t.fullPage}</span>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Online Document Preview Overlay Modal */}
      <AnimatePresence>
        {previewFile && (
          <motion.div 
            className="preview-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="preview-modal-content"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="preview-modal-header">
                <h3>{lang === 'az' ? 'Sənədə Baxış' : 'Document Preview'}</h3>
                <button 
                  onClick={() => setPreviewFile(null)}
                  className="preview-modal-close"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="preview-modal-body">
                <iframe 
                  src={getPreviewUrl(previewFile)} 
                  width="100%" 
                  height="100%" 
                  style={{ border: 'none' }} 
                  title="Document Preview" 
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global CSS Styling for Premium Aesthetics */}
      <style>{`
        .landing-page {
          background: #09090b;
          color: #f4f4f5;
          min-height: 100vh;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          overflow-x: hidden;
          padding-bottom: 5rem;
        }

        /* Glass Nav */
        .glass-nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 1000;
          background: rgba(9, 9, 11, 0.7);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .nav-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1rem 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .brand-logo {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          width: 32px; height: 32px;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
        }

        .logo-icon {
          color: #fff;
        }

        .brand-name {
          font-weight: 800;
          font-size: 1.25rem;
          letter-spacing: -0.5px;
          background: linear-gradient(to right, #fff, #a1a1aa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .lang-switcher {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          padding: 3px;
          border-radius: 8px;
          display: flex;
        }

        .lang-switcher button {
          background: transparent;
          border: none;
          color: #71717a;
          padding: 6px 12px;
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
          border-radius: 6px;
          transition: all 0.2s;
        }

        .lang-switcher button.active {
          background: rgba(255, 255, 255, 0.08);
          color: #fff;
        }

        .admin-link-btn {
          background: #fff;
          color: #09090b;
          text-decoration: none;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s;
        }

        .admin-link-btn:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }

        /* Hero Section */
        .hero-section {
          position: relative;
          padding: 10rem 1.5rem 6rem;
          text-align: center;
          background: radial-gradient(circle at top, rgba(37, 99, 235, 0.08) 0%, transparent 60%);
          overflow: hidden;
        }

        .hero-grid-pattern {
          position: absolute;
          inset: 0;
          opacity: 0.03;
          background-size: 40px 40px;
          background-image: linear-gradient(to right, #fff 1px, transparent 1px),
                            linear-gradient(to bottom, #fff 1px, transparent 1px);
          pointer-events: none;
        }

        .hero-content {
          max-width: 800px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(37, 99, 235, 0.1);
          border: 1px solid rgba(37, 99, 235, 0.2);
          color: #60a5fa;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
        }

        .pulse-dot {
          width: 6px; height: 6px;
          background-color: #3b82f6;
          border-radius: 50%;
          display: inline-block;
          animation: pulse 1.8s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(0.9); opacity: 0.6; }
          50% { transform: scale(1.3); opacity: 1; }
          100% { transform: scale(0.9); opacity: 0.6; }
        }

        .hero-section h1 {
          font-size: 3rem;
          font-weight: 900;
          letter-spacing: -1.5px;
          line-height: 1.15;
          margin-bottom: 1.25rem;
          background: linear-gradient(to bottom, #fff, #a1a1aa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-section p {
          color: #a1a1aa;
          font-size: 1.1rem;
          line-height: 1.6;
          max-width: 650px;
          margin: 0 auto 2.5rem;
        }

        /* Search Bar */
        .search-container {
          max-width: 500px;
          margin: 0 auto;
          position: relative;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          display: flex;
          align-items: center;
          padding: 0 1rem;
          transition: all 0.3s;
        }

        .search-container:focus-within {
          border-color: rgba(37, 99, 235, 0.5);
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.15);
          background: rgba(255, 255, 255, 0.04);
        }

        .search-icon {
          color: #71717a;
          margin-right: 0.75rem;
        }

        .search-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: #fff;
          font-size: 0.95rem;
          padding: 0.85rem 0;
        }

        .search-input::placeholder {
          color: #71717a;
        }

        .search-clear {
          background: transparent;
          border: none;
          color: #71717a;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          border-radius: 50%;
          transition: background 0.2s;
        }

        .search-clear:hover {
          background: rgba(255, 255, 255, 0.05);
          color: #fff;
        }

        /* Projects Section */
        .projects-section {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        .loading-state {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 6rem 0;
        }

        .custom-spinner {
          width: 32px; height: 32px;
          border: 3px solid rgba(255, 255, 255, 0.05);
          border-top-color: #3b82f6;
          border-radius: 50%;
        }

        .empty-state {
          text-align: center;
          padding: 6rem 1.5rem;
          background: rgba(255,255,255, 0.01);
          border: 1px dashed rgba(255, 255, 255, 0.06);
          border-radius: 16px;
          max-width: 400px;
          margin: 0 auto;
        }

        .empty-icon-wrapper {
          background: rgba(255, 255, 255, 0.02);
          width: 80px; height: 80px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 1.5rem;
          border: 1px solid rgba(255,255,255, 0.04);
        }

        .empty-icon {
          color: #52525b;
        }

        .empty-state h3 {
          font-size: 1.1rem;
          font-weight: 600;
          color: #e4e4e7;
          margin-bottom: 0.5rem;
        }

        .empty-state p {
          color: #71717a;
          font-size: 0.9rem;
        }

        /* Projects Grid */
        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 2rem;
        }

        /* Project Card */
        .project-card {
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 16px;
          overflow: hidden;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          box-shadow: 0 4px 30px rgba(0,0,0,0.2);
          transition: border-color 0.3s, background-color 0.3s;
        }

        .project-card:hover {
          border-color: rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.02);
        }

        .card-image-wrapper {
          position: relative;
          aspect-ratio: 16 / 9;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.02);
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        }

        .card-img {
          width: 100%; height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .project-card:hover .card-img {
          transform: scale(1.05);
        }

        .card-hover-overlay {
          position: absolute;
          inset: 0;
          background: rgba(9, 9, 11, 0.4);
          backdrop-filter: blur(4px);
          opacity: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 0.3s;
        }

        .project-card:hover .card-hover-overlay {
          opacity: 1;
        }

        .overlay-btn {
          background: #fff;
          color: #09090b;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 6px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .card-content {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .card-date {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.75rem;
          color: #71717a;
          margin-bottom: 0.75rem;
        }

        .card-content h3 {
          font-size: 1.2rem;
          font-weight: 700;
          margin-bottom: 0.75rem;
          color: #fff;
          line-height: 1.4;
        }

        .card-desc {
          font-size: 0.9rem;
          color: #a1a1aa;
          line-height: 1.6;
          margin-bottom: 1.5rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .card-footer {
          margin-top: auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1rem;
          border-top: 1px solid rgba(255,255,255, 0.04);
        }

        .resource-indicators {
          display: flex;
          gap: 4px;
        }

        .indicator-badge {
          font-size: 0.65rem;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 4px;
          letter-spacing: 0.5px;
        }

        .indicator-badge.doc {
          background: rgba(59, 130, 246, 0.1);
          color: #60a5fa;
        }

        .indicator-badge.ppt {
          background: rgba(239, 68, 68, 0.1);
          color: #f87171;
        }

        .learn-more {
          font-size: 0.8rem;
          font-weight: 700;
          color: #3b82f6;
          display: flex;
          align-items: center;
          gap: 4px;
          transition: transform 0.2s;
        }

        .project-card:hover .learn-more {
          color: #60a5fa;
          transform: translateX(3px);
        }

        /* Modern Slide-out Side Drawer */
        .drawer-backdrop {
          position: fixed; inset: 0; z-index: 2000;
          background: rgba(9, 9, 11, 0.75);
          backdrop-filter: blur(8px);
        }

        .drawer-container {
          position: fixed;
          top: 0; right: 0; bottom: 0;
          width: 100%;
          max-width: 500px;
          z-index: 2001;
          background: #09090b;
          border-left: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: -10px 0 40px rgba(0,0,0,0.5);
          display: flex;
          flex-direction: column;
        }

        .drawer-header {
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .drawer-badge {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 700;
          color: #a1a1aa;
        }

        .drawer-close-btn {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          color: #a1a1aa;
          width: 36px; height: 36px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
        }

        .drawer-close-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          color: #fff;
        }

        .drawer-body {
          flex: 1;
          overflow-y: auto;
          padding: 0 0 2rem;
        }

        .drawer-banner {
          aspect-ratio: 16 / 9;
          background: rgba(255, 255, 255, 0.01);
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          overflow: hidden;
        }

        .drawer-img {
          width: 100%; height: 100%;
          object-fit: cover;
        }

        .drawer-meta-section {
          padding: 1.5rem 1.5rem 1rem;
        }

        .drawer-meta-section h2 {
          font-size: 1.5rem;
          font-weight: 800;
          color: #fff;
          margin-bottom: 0.75rem;
          line-height: 1.3;
        }

        .drawer-date-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #71717a;
          font-size: 0.8rem;
          margin-bottom: 1.25rem;
        }

        .drawer-description {
          color: #a1a1aa;
          font-size: 0.95rem;
          line-height: 1.7;
        }

        .drawer-resources-section {
          padding: 1rem 1.5rem 2rem;
        }

        .drawer-section-header {
          margin-bottom: 1.25rem;
        }

        .drawer-section-header h4 {
          font-size: 1rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 0.25rem;
        }

        .drawer-section-header p {
          font-size: 0.8rem;
          color: #71717a;
        }

        .drawer-files-list {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }

        .drawer-file-card {
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid rgba(255, 255, 255, 0.04);
          padding: 1rem;
          border-radius: 12px;
          display: flex;
          gap: 1rem;
        }

        .drawer-file-icon {
          width: 44px; height: 44px;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        .drawer-file-icon.word {
          background: rgba(59, 130, 246, 0.1);
          color: #60a5fa;
        }

        .drawer-file-icon.ppt {
          background: rgba(239, 68, 68, 0.1);
          color: #f87171;
        }

        .drawer-file-info {
          flex: 1;
        }

        .drawer-file-info h5 {
          font-size: 0.9rem;
          font-weight: 600;
          color: #fff;
          margin-bottom: 0.6rem;
        }

        .drawer-file-actions {
          display: flex;
          gap: 0.5rem;
        }

        .drawer-action-btn {
          border: none;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          text-decoration: none;
          transition: all 0.2s;
        }

        .drawer-action-btn.preview {
          background: rgba(255, 255, 255, 0.03);
          color: #e4e4e7;
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .drawer-action-btn.preview:hover {
          background: rgba(255, 255, 255, 0.08);
          color: #fff;
        }

        .drawer-action-btn.download {
          background: #3b82f6;
          color: #fff;
        }

        .drawer-action-btn.download:hover {
          background: #2563eb;
        }

        .drawer-footer {
          padding: 1.25rem 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .drawer-footer-btn {
          border: none;
          padding: 10px;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          text-decoration: none;
          transition: all 0.2s;
        }

        .drawer-footer-btn.share {
          background: rgba(255, 255, 255, 0.03);
          color: #e4e4e7;
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .drawer-footer-btn.share:hover {
          background: rgba(255, 255, 255, 0.08);
        }

        .drawer-footer-btn.full-view {
          background: #fff;
          color: #09090b;
        }

        .drawer-footer-btn.full-view:hover {
          opacity: 0.9;
        }

        /* Online Document Preview Overlay Modal */
        .preview-modal-overlay {
          position: fixed; inset: 0; z-index: 3000;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center;
          padding: 2rem;
        }

        .preview-modal-content {
          background: #09090b;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          width: 100%;
          max-width: 900px;
          height: 80vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0,0,0,0.6);
        }

        .preview-modal-header {
          padding: 1rem 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .preview-modal-header h3 {
          font-size: 1.1rem;
          font-weight: 700;
          color: #fff;
        }

        .preview-modal-close {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          color: #a1a1aa;
          width: 32px; height: 32px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
        }

        .preview-modal-body {
          flex: 1;
          background: #fff;
        }

        @media (max-width: 768px) {
          .hero-section { padding-top: 8rem; }
          .hero-section h1 { font-size: 2.2rem; }
          .hero-section p { font-size: 0.95rem; }
          .projects-grid { grid-template-columns: 1fr; }
          .drawer-container { max-width: 100%; border-left: none; }
          .preview-modal-overlay { padding: 0.5rem; }
          .preview-modal-content { height: 90vh; }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
