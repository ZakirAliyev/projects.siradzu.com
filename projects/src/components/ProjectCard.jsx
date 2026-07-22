import React from 'react';
import { FileText, Presentation, Trash2, ExternalLink, Pencil } from 'lucide-react';

import { API_BASE } from '../config';

const ProjectCard = ({ project, lang, onDelete, onView, onEdit, onToggleVisibility }) => {
  const detailsText = lang === 'az' ? 'Detallar' : 'Details';

  return (
    <div className="project-card fade-in">
      <div className="card-img-wrapper">
        <img src={`${API_BASE}${project.cardImage}`} alt={project.name[lang]} />
        <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 10 }}>
          {project.showInMenu !== false ? (
            <span className="badge-visible">{lang === 'az' ? 'Görünür' : 'Visible'}</span>
          ) : (
            <span className="badge-hidden">{lang === 'az' ? 'Gizli' : 'Hidden'}</span>
          )}
        </div>
      </div>
      <div className="card-body">
        <h3 style={{ marginBottom: '0.5rem', fontWeight: '700' }}>{project.name[lang] || project.name.az || project.name.en || project.name.ru}</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', height: '3.6rem', overflow: 'hidden' }}>
          {project.description[lang] || project.description.az || project.description.en || project.description.ru}
        </p>

        <div style={{ marginTop: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {project.files.word_az && (
            <a href={`${API_BASE}${project.files.word_az}`} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }} target="_blank" rel="noreferrer">
              <FileText size={14} /> Word (AZ)
            </a>
          )}
          {project.files.word_en && (
            <a href={`${API_BASE}${project.files.word_en}`} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }} target="_blank" rel="noreferrer">
              <FileText size={14} /> Word (EN)
            </a>
          )}
          {project.files.word_ru && (
            <a href={`${API_BASE}${project.files.word_ru}`} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }} target="_blank" rel="noreferrer">
              <FileText size={14} /> Word (RU)
            </a>
          )}
          {project.files.ppt_az && (
            <a href={`${API_BASE}${project.files.ppt_az}`} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }} target="_blank" rel="noreferrer">
              <Presentation size={14} /> PPT (AZ)
            </a>
          )}
          {project.files.ppt_en && (
            <a href={`${API_BASE}${project.files.ppt_en}`} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }} target="_blank" rel="noreferrer">
              <Presentation size={14} /> PPT (EN)
            </a>
          )}
          {project.files.ppt_ru && (
            <a href={`${API_BASE}${project.files.ppt_ru}`} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }} target="_blank" rel="noreferrer">
              <Presentation size={14} /> PPT (RU)
            </a>
          )}
        </div>

        <div style={{ marginTop: '1.2rem' }}>
          <div 
            className="switch-container" 
            onClick={(e) => {
              e.stopPropagation();
              onToggleVisibility(project.id, project.showInMenu !== false);
            }}
          >
            <span className="switch-label-text" style={{ fontSize: '0.8rem' }}>
              {lang === 'az' ? 'Menuda göstər' : 'Show in menu'}
            </span>
            <div className={`switch-track ${project.showInMenu !== false ? 'active' : ''}`}>
              <div className="switch-thumb"></div>
            </div>
          </div>
        </div>

        <div className="card-actions" style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
          <button
            className="btn btn-primary"
            style={{ flex: 1 }}
            onClick={onView}
          >
            <ExternalLink size={16} /> {detailsText}
          </button>
          <button
            className="btn btn-outline"
            style={{ color: '#3b82f6', borderColor: 'rgba(59, 130, 246, 0.2)' }}
            onClick={onEdit}
            title={lang === 'az' ? 'Redaktə et' : 'Edit'}
          >
            <Pencil size={16} />
          </button>
          <button
            className="btn btn-outline"
            style={{ color: '#ef4444', borderColor: '#ef44441a' }}
            onClick={() => onDelete(project.id)}
            title={lang === 'az' ? 'Sil' : 'Delete'}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
