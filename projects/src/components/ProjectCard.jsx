import React from 'react';
import { FileText, Presentation, Trash2, ExternalLink } from 'lucide-react';

const API_BASE = 'https://projects-back.siradzu.com';

const ProjectCard = ({ project, lang, onDelete, onView }) => {
  const detailsText = lang === 'az' ? 'Detallar' : 'Details';

  return (
    <div className="project-card fade-in">
      <div className="card-img-wrapper">
        <img src={`${API_BASE}${project.cardImage}`} alt={project.name[lang]} />
      </div>
      <div className="card-body">
        <h3 style={{ marginBottom: '0.5rem', fontWeight: '700' }}>{project.name[lang]}</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', height: '3.6rem', overflow: 'hidden' }}>
          {project.description[lang]}
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
        </div>

        <div className="card-actions">
          <button
            className="btn btn-primary"
            style={{ flex: 1 }}
            onClick={onView}
          >
            <ExternalLink size={16} /> {detailsText}
          </button>
          <button
            className="btn btn-outline"
            style={{ color: '#ef4444', borderColor: '#ef44441a' }}
            onClick={() => onDelete(project.id)}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
