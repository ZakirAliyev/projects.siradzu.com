import React from 'react';
import { FileText, Presentation, Calendar } from 'lucide-react';

import { API_BASE } from '../config';

const ProjectDetails = ({ project, lang }) => {
  if (!project) return null;

  const labels = {
    az: { created: 'Yaradılıb', docs: 'Sənədlər' },
    en: { created: 'Created', docs: 'Documents' }
  };

  const l = labels[lang];

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
          <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>{project.name[lang]}</h3>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '2rem' }}>
            {project.description[lang]}
          </p>

          <h4 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>{l.docs}</h4>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {project.files.word_az && (
                <a href={`${API_BASE}${project.files.word_az}`} className="btn btn-outline" target="_blank" rel="noreferrer" style={{ flex: 1 }}>
                  <FileText size={16} /> Word (AZ)
                </a>
              )}
              {project.files.word_en && (
                <a href={`${API_BASE}${project.files.word_en}`} className="btn btn-outline" target="_blank" rel="noreferrer" style={{ flex: 1 }}>
                  <FileText size={16} /> Word (EN)
                </a>
              )}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {project.files.ppt_az && (
                <a href={`${API_BASE}${project.files.ppt_az}`} className="btn btn-outline" target="_blank" rel="noreferrer" style={{ flex: 1 }}>
                  <Presentation size={16} /> PPT (AZ)
                </a>
              )}
              {project.files.ppt_en && (
                <a href={`${API_BASE}${project.files.ppt_en}`} className="btn btn-outline" target="_blank" rel="noreferrer" style={{ flex: 1 }}>
                  <Presentation size={16} /> PPT (EN)
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
