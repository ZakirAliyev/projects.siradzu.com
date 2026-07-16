import { FileText, Presentation, Calendar, Globe } from 'lucide-react';

import { API_BASE } from '../config';

const ProjectDetails = ({ project, lang, activeLanguages = ['az', 'en'] }) => {
  if (!project) return null;

  const labels = {
    az: { created: 'Yaradılıb', docs: 'Sənədlər' },
    en: { created: 'Created', docs: 'Documents' }
  };

  const l = labels[lang];
  const showAz = activeLanguages.includes('az');
  const showEn = activeLanguages.includes('en');

  return (
    <div className="fade-in">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div>
          <img
            src={`${API_BASE}${project.cardImage}`}
            alt={project.name[lang]}
            style={{ width: '100%', borderRadius: '16px', border: '1px solid var(--border)' }}
          />
          <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
            <Calendar size={18} />
            <span>{l.created}: {new Date(project.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>{project.name[lang]}</h3>
          
          {project.website && (
            <div style={{ marginBottom: '1.5rem' }}>
              <a 
                href={project.website} 
                className="btn btn-primary" 
                target="_blank" 
                rel="noreferrer" 
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#3b82f6', color: '#fff', textDecoration: 'none', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 'bold' }}
              >
                <Globe size={16} /> {lang === 'az' ? 'Vebsayta keçid' : 'Visit Website'}
              </a>
            </div>
          )}

          <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '2rem' }}>
            {project.description[lang]}
          </p>

          {(showAz || showEn) && (
            <>
              <h4 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>{l.docs}</h4>
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {showAz && project.files.word_az && (
                    <a href={`${API_BASE}${project.files.word_az}`} className="btn btn-outline" target="_blank" rel="noreferrer" style={{ flex: 1 }}>
                      <FileText size={16} /> Word (AZ)
                    </a>
                  )}
                  {showEn && project.files.word_en && (
                    <a href={`${API_BASE}${project.files.word_en}`} className="btn btn-outline" target="_blank" rel="noreferrer" style={{ flex: 1 }}>
                      <FileText size={16} /> Word (EN)
                    </a>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {showAz && project.files.ppt_az && (
                    <a href={`${API_BASE}${project.files.ppt_az}`} className="btn btn-outline" target="_blank" rel="noreferrer" style={{ flex: 1 }}>
                      <Presentation size={16} /> PPT (AZ)
                    </a>
                  )}
                  {showEn && project.files.ppt_en && (
                    <a href={`${API_BASE}${project.files.ppt_en}`} className="btn btn-outline" target="_blank" rel="noreferrer" style={{ flex: 1 }}>
                      <Presentation size={16} /> PPT (EN)
                    </a>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
