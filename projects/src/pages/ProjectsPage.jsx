import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { Reorder } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import ProjectCard from '../components/ProjectCard';
import ProjectForm from '../components/ProjectForm';
import ProjectDetails from '../components/ProjectDetails';
import Modal from '../components/Modal';
import { Plus, LayoutGrid, List, Save, GripVertical, Trash2, ExternalLink } from 'lucide-react';

const translations = {
  az: {
    projects: 'Layihələr',
    newProject: 'Yeni Layihə',
    createTitle: 'Yeni Layihə Yaradın',
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
  const [loading, setLoading] = useState(true);
  const [hasOrderChanged, setHasOrderChanged] = useState(false);

  const t = translations[lang];

  const getHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
  });

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await axios.get('https://projects-back.siradzu.com/api/projects');
      setProjects(res.data);
      setHasOrderChanged(false);
    } catch (err) {
      toast.error(t.loadError);
    } finally {
      setLoading(false);
    }
  };

  const saveOrder = async (reorderedProjects) => {
    const listToSave = reorderedProjects || projects;
    try {
      await axios.put('https://projects-back.siradzu.com/api/projects/reorder', {
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
        await axios.delete(`https://projects-back.siradzu.com/api/projects/${id}`, getHeaders());
        toast.success(t.deleteSuccess);
        fetchProjects();
      } catch (err) {
        toast.error('Delete failed');
      }
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="admin-layout">
      <Toaster position="top-right" />

      <Sidebar lang={lang} setLang={setLang} translations={t} />

      <main className="main-content">
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
              />
            ))}
          </div>
        ) : (
          <Reorder.Group axis="y" values={projects} onReorder={handleReorder} className="fade-in">
            <div style={{ background: 'var(--glass)', borderRadius: '16px', border: '1px solid var(--border)', overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '50px 80px 1fr 1fr 150px', padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>
                <div></div>
                <div>{lang === 'az' ? 'Şəkil' : 'Image'}</div>
                <div>{lang === 'az' ? 'Ad' : 'Name'}</div>
                <div>Slug</div>
                <div style={{ textAlign: 'right' }}>{lang === 'az' ? 'Əməliyyatlar' : 'Actions'}</div>
              </div>
              {projects.map((project) => (
                <Reorder.Item key={project.id} value={project} style={{ listStyle: 'none' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '50px 80px 1fr 1fr 150px', alignItems: 'center', padding: '1rem 1.5rem', background: 'var(--sidebar-bg)', borderBottom: '1px solid var(--border)', cursor: 'grab' }}>
                    <div style={{ color: 'var(--text-muted)' }}><GripVertical size={20} /></div>
                    <img src={`https://projects-back.siradzu.com${project.cardImage}`} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                    <div style={{ fontWeight: '600' }}>{project.name[lang]}</div>
                    <div style={{ color: 'var(--primary)', fontSize: '0.9rem' }}>/{project.slug}</div>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button className="btn btn-outline" style={{ padding: '0.4rem' }} onClick={() => setSelectedProject(project)}>
                        <ExternalLink size={16} />
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
      </main>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={t.createTitle}>
        <ProjectForm lang={lang} onProjectAdded={fetchProjects} onClose={() => setIsModalOpen(false)} />
      </Modal>

      <Modal isOpen={!!selectedProject} onClose={() => setSelectedProject(null)} title={selectedProject?.name[lang]}>
        <ProjectDetails project={selectedProject} lang={lang} />
      </Modal>
    </div>
  );
};

export default ProjectsPage;
