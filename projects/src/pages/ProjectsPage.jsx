import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { Reorder } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import ProjectCard from '../components/ProjectCard';
import ProjectForm from '../components/ProjectForm';
import ProjectDetails from '../components/ProjectDetails';
import Modal from '../components/Modal';
import { Plus, LayoutGrid, List, Save, GripVertical, Trash2, ExternalLink, Pencil } from 'lucide-react';
import { API_BASE } from '../config';

const translations = {
  az: {
    projects: 'Layihələr',
    newProject: 'Yeni Layihə',
    createTitle: 'Yeni Layihə Yaradın',
    editTitle: 'Layihəni Redaktə Et',
    noProjects: 'Layihə tapılmadı.',
    saveOrder: 'Sıranı Yadda Saxla',
    orderSaved: 'Sıralama yadda saxlanıldı',
    confirmDelete: 'Bu layihəni silmək istədiyinizə əminsiniz?',
    deleteSuccess: 'Layihə silindi',
    loadError: 'Yükləmə xətası',
    list: 'Siyahı',
    grid: 'Tor'
  },
  en: {
    projects: 'Projects',
    newProject: 'New Project',
    createTitle: 'Create New Project',
    editTitle: 'Edit Project',
    noProjects: 'No projects found.',
    saveOrder: 'Save Order',
    orderSaved: 'Order updated successfully',
    confirmDelete: 'Are you sure you want to delete this project?',
    deleteSuccess: 'Project deleted',
    loadError: 'Load failed',
    list: 'List',
    grid: 'Grid'
  }
};

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [lang, setLang] = useState('az');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasOrderChanged, setHasOrderChanged] = useState(false);
  const [activeTab, setActiveTab] = useState('projects'); // 'projects' or 'settings'
  const [activeLanguages, setActiveLanguages] = useState(['az', 'en']);

  const t = translations[lang];

  const getHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
  });

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/projects`);
      setProjects(res.data);
      setHasOrderChanged(false);
    } catch (err) {
      toast.error(t.loadError);
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/settings`);
      if (res.data && res.data.activeLanguages) {
        setActiveLanguages(res.data.activeLanguages);
        if (!res.data.activeLanguages.includes(lang)) {
          setLang(res.data.activeLanguages[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load settings');
    }
  };

  const handleSaveSettings = async (selectedLangs) => {
    try {
      const res = await axios.put(`${API_BASE}/api/settings`, {
        activeLanguages: selectedLangs
      }, getHeaders());
      setActiveLanguages(res.data.activeLanguages);
      if (!res.data.activeLanguages.includes(lang)) {
        setLang(res.data.activeLanguages[0]);
      }
      toast.success(lang === 'az' ? 'Sazlamalar yadda saxlanıldı!' : 'Settings saved successfully!');
    } catch (err) {
      toast.error(lang === 'az' ? 'Xəta baş verdi!' : 'An error occurred!');
    }
  };

  const saveOrder = async (reorderedProjects) => {
    const listToSave = reorderedProjects || projects;
    try {
      await axios.put(`${API_BASE}/api/projects/reorder`, {
        projectIds: listToSave.map(p => p.id)
      }, getHeaders());
      toast.success(t.orderSaved);
      setHasOrderChanged(false);
    } catch (err) {
      toast.error('Failed to save order');
    }
  };

  const handleReorder = (newOrder) => {
    setProjects(newOrder);
    setHasOrderChanged(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm(t.confirmDelete)) {
      try {
        await axios.delete(`${API_BASE}/api/projects/${id}`, getHeaders());
        toast.success(t.deleteSuccess);
        fetchProjects();
      } catch (err) {
        toast.error('Delete failed');
      }
    }
  };

  const handleToggleShowInMenu = async (id, currentVal) => {
    try {
      const data = new FormData();
      data.append('showInMenu', (!currentVal).toString());
      
      const res = await axios.put(`${API_BASE}/api/projects/${id}`, data, getHeaders());
      
      setProjects(prev => prev.map(p => p.id === id ? { ...p, showInMenu: res.data.showInMenu } : p));
      toast.success(lang === 'az' ? 'Görünüş yeniləndi!' : 'Visibility updated!');
    } catch (err) {
      toast.error('Failed to update visibility');
    }
  };

  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    localStorage.setItem('theme', theme);
    const favicon = document.querySelector("link[rel*='icon']");
    if (favicon) {
      favicon.href = theme === 'dark' ? '/favicon-white.png' : '/favicon.png';
    }
  }, [theme]);

  useEffect(() => {
    fetchProjects();
    fetchSettings();
  }, []);

  const SettingsView = () => {
    const [selectedLangs, setSelectedLangs] = useState(activeLanguages);

    const handleToggle = (l) => {
      if (selectedLangs.includes(l)) {
        if (selectedLangs.length === 1) {
          toast.error(lang === 'az' ? 'Ən azı bir dil aktiv olmalıdır!' : 'At least one language must be active!');
          return;
        }
        setSelectedLangs(selectedLangs.filter(x => x !== l));
      } else {
        setSelectedLangs([...selectedLangs, l]);
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      await handleSaveSettings(selectedLangs);
    };

    return (
      <div className="fade-in" style={{ maxWidth: '600px' }}>
        <div style={{ background: 'var(--sidebar-bg)', border: '1px solid var(--border)', borderRadius: '24px', padding: '2.5rem', marginTop: '1rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '0.5rem' }}>
            {lang === 'az' ? 'Dil Sazlamaları' : 'Language Settings'}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem', lineHeight: '1.6' }}>
            {lang === 'az' 
              ? 'Portalda və idarəetmə panelində aktiv olacaq dilləri seçin. Aktiv olmayan dillər və onlara aid olan resurslar (MVP-lər, təqdimatlar) istifadəçilərdən gizlədiləcək.'
              : 'Select the languages that will be active on the portal and the admin panel. Inactive languages and their corresponding resources (MVPs, presentations) will be hidden from users.'}
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gap: '1rem', marginBottom: '2.5rem' }}>
              <div 
                className="switch-container"
                onClick={() => handleToggle('az')}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <span className="switch-label-text" style={{ fontWeight: '600' }}>
                  {lang === 'az' ? 'Azərbaycan dili (AZ)' : 'Azerbaijani (AZ)'}
                </span>
                <div className={`switch-track ${selectedLangs.includes('az') ? 'active' : ''}`}>
                  <div className="switch-thumb"></div>
                </div>
              </div>

              <div 
                className="switch-container"
                onClick={() => handleToggle('en')}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <span className="switch-label-text" style={{ fontWeight: '600' }}>
                  {lang === 'az' ? 'İngilis dili (EN)' : 'English (EN)'}
                </span>
                <div className={`switch-track ${selectedLangs.includes('en') ? 'active' : ''}`}>
                  <div className="switch-thumb"></div>
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
              <Save size={18} /> {lang === 'az' ? 'Yadda Saxla' : 'Save Settings'}
            </button>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className={`admin-layout ${theme === 'dark' ? '' : 'light-theme'}`}>
      <Toaster position="top-right" />

      <Sidebar 
        lang={lang} 
        setLang={setLang} 
        translations={t} 
        theme={theme} 
        setTheme={setTheme} 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeLanguages={activeLanguages}
      />

      <main className="main-content">
        {activeTab === 'projects' ? (
          <>
            <div className="top-bar">
              <div>
                <h1 className="page-title">{t.projects}</h1>
              </div>

              <div style={{ display: 'flex', gap: '0.8rem' }}>
                <div className="lang-switch" style={{ marginRight: '1rem' }}>
                  <button className={viewMode === 'grid' ? 'active' : ''} onClick={() => setViewMode('grid')}>
                    <LayoutGrid size={18} />
                  </button>
                  <button className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')}>
                    <List size={18} />
                  </button>
                </div>

                {hasOrderChanged && (
                  <button className="btn btn-primary" onClick={() => saveOrder()} style={{ background: '#3b82f6' }}>
                    <Save size={18} /> {t.saveOrder}
                  </button>
                )}
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                  <Plus size={18} /> {t.newProject}
                </button>
              </div>
            </div>

            {loading ? (
              <p>Loading...</p>
            ) : viewMode === 'grid' ? (
              <div className="project-grid">
                {projects.map((project, index) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    lang={lang}
                    onDelete={handleDelete}
                    onView={() => setSelectedProject(project)}
                    onEdit={() => setEditingProject(project)}
                    onToggleVisibility={handleToggleShowInMenu}
                  />
                ))}
              </div>
            ) : (
              <Reorder.Group axis="y" values={projects} onReorder={handleReorder} className="fade-in">
                <div style={{ background: 'var(--glass)', borderRadius: '16px', border: '1px solid var(--border)', overflow: 'hidden' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '50px 80px 1.5fr 1fr 1.2fr 150px', padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>
                    <div></div>
                    <div>{lang === 'az' ? 'Şəkil' : 'Image'}</div>
                    <div>{lang === 'az' ? 'Ad' : 'Name'}</div>
                    <div>Slug</div>
                    <div>{lang === 'az' ? 'Görünüş' : 'Visibility'}</div>
                    <div style={{ textAlign: 'right' }}>{lang === 'az' ? 'Əməliyyatlar' : 'Actions'}</div>
                  </div>
                  {projects.map((project) => (
                    <Reorder.Item key={project.id} value={project} style={{ listStyle: 'none' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '50px 80px 1.5fr 1fr 1.2fr 150px', alignItems: 'center', padding: '1rem 1.5rem', background: 'var(--sidebar-bg)', borderBottom: '1px solid var(--border)', cursor: 'grab' }}>
                        <div style={{ color: 'var(--text-muted)' }}><GripVertical size={20} /></div>
                        <img src={`${API_BASE}${project.cardImage}`} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                        <div style={{ fontWeight: '600' }}>{project.name[lang]}</div>
                        <div style={{ color: 'var(--primary)', fontSize: '0.9rem' }}>/{project.slug}</div>
                        <div>
                          <div 
                            className={`switch-track ${project.showInMenu !== false ? 'active' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleShowInMenu(project.id, project.showInMenu !== false);
                            }}
                            style={{ cursor: 'pointer' }}
                          >
                            <div className="switch-thumb"></div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          <button className="btn btn-outline" style={{ padding: '0.4rem' }} onClick={() => setSelectedProject(project)}>
                            <ExternalLink size={16} />
                          </button>
                          <button className="btn btn-outline" style={{ padding: '0.4rem', color: 'var(--primary)' }} onClick={() => setEditingProject(project)}>
                            <Pencil size={16} />
                          </button>
                          <button className="btn btn-outline" style={{ padding: '0.4rem', color: '#ef4444' }} onClick={() => handleDelete(project.id)}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </Reorder.Item>
                  ))}
                </div>
                {hasOrderChanged && (
                  <p style={{ marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center' }}>
                    {lang === 'az' ? 'Sıranı yadda saxlamaq üçün yuxarıdakı düyməni sıxın.' : 'Click the save button above to persist the new order.'}
                  </p>
                )}
              </Reorder.Group>
            )}

            {!loading && projects.length === 0 && (
              <div style={{ textAlign: 'center', padding: '10rem 2rem' }}>
                <p style={{ color: 'var(--text-muted)' }}>{t.noProjects}</p>
              </div>
            )}
          </>
        ) : (
          <SettingsView />
        )}
      </main>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={t.createTitle}>
        <ProjectForm 
          lang={lang} 
          onProjectAdded={fetchProjects} 
          onClose={() => setIsModalOpen(false)} 
          activeLanguages={activeLanguages}
        />
      </Modal>

      <Modal isOpen={!!editingProject} onClose={() => setEditingProject(null)} title={t.editTitle}>
        <ProjectForm
          lang={lang}
          projectToEdit={editingProject}
          onProjectAdded={fetchProjects}
          onClose={() => setEditingProject(null)}
          activeLanguages={activeLanguages}
        />
      </Modal>

      <Modal isOpen={!!selectedProject} onClose={() => setSelectedProject(null)} title={selectedProject?.name[lang]}>
        <ProjectDetails project={selectedProject} lang={lang} activeLanguages={activeLanguages} />
      </Modal>
    </div>
  );
};

export default ProjectsPage;
