import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Upload, Trash2 } from 'lucide-react';
import { API_BASE } from '../config';

const ProjectForm = ({ onProjectAdded, lang, onClose, projectToEdit }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name_az: projectToEdit ? projectToEdit.name.az : '',
    name_en: projectToEdit ? projectToEdit.name.en : '',
    desc_az: projectToEdit ? projectToEdit.description.az : '',
    desc_en: projectToEdit ? projectToEdit.description.en : '',
  });
  const [files, setFiles] = useState({
    cardImage: null,
    word_az: null,
    word_en: null,
    ppt_az: null,
    ppt_en: null,
  });
  const [deleteFlags, setDeleteFlags] = useState({
    word_az: false,
    word_en: false,
    ppt_az: false,
    ppt_en: false,
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
    // If a new file is uploaded, automatically unmark it for deletion
    const fieldName = e.target.name;
    if (deleteFlags[fieldName] !== undefined) {
      setDeleteFlags(prev => ({ ...prev, [fieldName]: false }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!projectToEdit && !files.cardImage) return toast.error('Card image is required');

    setLoading(true);
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    Object.keys(files).forEach(key => {
      if (files[key]) data.append(key, files[key]);
    });

    if (projectToEdit) {
      Object.keys(deleteFlags).forEach(key => {
        if (deleteFlags[key]) data.append(`delete_${key}`, 'true');
      });
    }

    try {
      if (projectToEdit) {
        await axios.put(`${API_BASE}/api/projects/${projectToEdit.id}`, data, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        });
        toast.success(lang === 'az' ? 'Layihə uğurla yeniləndi!' : 'Project updated successfully!');
      } else {
        await axios.post(`${API_BASE}/api/projects`, data, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        });
        toast.success(lang === 'az' ? 'Layihə uğurla əlavə edildi!' : 'Project added successfully!');
      }
      onProjectAdded();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(projectToEdit ? 'Failed to update project' : 'Failed to upload project');
    } finally {
      setLoading(false);
    }
  };

  const labels = {
    az: { name: 'Ad', desc: 'Təsvir', cardImg: 'Kard Şəkli', word: 'Word Sənədi', ppt: 'PPT Sənədi', submit: 'Yarat', submitEdit: 'Yadda Saxla' },
    en: { name: 'Name', desc: 'Description', cardImg: 'Card Image', word: 'Word Doc', ppt: 'PPT Doc', submit: 'Create', submitEdit: 'Save Changes' }
  };

  const l = labels[lang];

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="form-section">
          <label className="form-label">{l.name} (AZ)</label>
          <input className="form-control" type="text" name="name_az" value={formData.name_az} onChange={handleInputChange} required />

          <label className="form-label" style={{ marginTop: '1rem' }}>{l.desc} (AZ)</label>
          <textarea className="form-control" name="desc_az" rows="4" value={formData.desc_az} onChange={handleInputChange} required />
        </div>
        <div className="form-section">
          <label className="form-label">{l.name} (EN)</label>
          <input className="form-control" type="text" name="name_en" value={formData.name_en} onChange={handleInputChange} required />

          <label className="form-label" style={{ marginTop: '1rem' }}>{l.desc} (EN)</label>
          <textarea className="form-control" name="desc_en" rows="4" value={formData.desc_en} onChange={handleInputChange} required />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '1.5rem' }}>
        <div className="file-dropzone" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <label className="form-label">{l.cardImg}</label>
          {projectToEdit?.cardImage && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <img src={`${API_BASE}${projectToEdit.cardImage}`} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--border)' }} />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{lang === 'az' ? 'Mövcud Şəkil' : 'Current Image'}</span>
            </div>
          )}
          <input type="file" name="cardImage" accept="image/*" onChange={handleFileChange} required={!projectToEdit} />
        </div>
        
        <div className="file-dropzone">
          <label className="form-label">{l.word} (AZ/EN)</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div>
              {projectToEdit?.files?.word_az && !deleteFlags.word_az && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.8rem', background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                  <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '120px' }}>Word (AZ)</span>
                  <button type="button" onClick={() => setDeleteFlags(prev => ({ ...prev, word_az: true }))} style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
              {deleteFlags.word_az && (
                <div style={{ fontSize: '0.75rem', color: '#ef4444', marginBottom: '0.25rem', textDecoration: 'line-through', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Word (AZ) - {lang === 'az' ? 'Silinəcək' : 'To be deleted'}</span>
                  <button type="button" onClick={() => setDeleteFlags(prev => ({ ...prev, word_az: false }))} style={{ border: 'none', background: 'none', color: '#3b82f6', cursor: 'pointer', fontSize: '0.75rem', padding: 0 }}>
                    {lang === 'az' ? 'Geri al' : 'Undo'}
                  </button>
                </div>
              )}
              <input type="file" name="word_az" accept=".doc,.docx" onChange={handleFileChange} />
            </div>

            <div style={{ marginTop: '0.5rem' }}>
              {projectToEdit?.files?.word_en && !deleteFlags.word_en && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.8rem', background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                  <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '120px' }}>Word (EN)</span>
                  <button type="button" onClick={() => setDeleteFlags(prev => ({ ...prev, word_en: true }))} style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
              {deleteFlags.word_en && (
                <div style={{ fontSize: '0.75rem', color: '#ef4444', marginBottom: '0.25rem', textDecoration: 'line-through', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Word (EN) - {lang === 'az' ? 'Silinəcək' : 'To be deleted'}</span>
                  <button type="button" onClick={() => setDeleteFlags(prev => ({ ...prev, word_en: false }))} style={{ border: 'none', background: 'none', color: '#3b82f6', cursor: 'pointer', fontSize: '0.75rem', padding: 0 }}>
                    {lang === 'az' ? 'Geri al' : 'Undo'}
                  </button>
                </div>
              )}
              <input type="file" name="word_en" accept=".doc,.docx" onChange={handleFileChange} />
            </div>
          </div>
        </div>

        <div className="file-dropzone">
          <label className="form-label">{l.ppt} (AZ/EN)</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div>
              {projectToEdit?.files?.ppt_az && !deleteFlags.ppt_az && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.8rem', background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                  <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '120px' }}>PPT (AZ)</span>
                  <button type="button" onClick={() => setDeleteFlags(prev => ({ ...prev, ppt_az: true }))} style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
              {deleteFlags.ppt_az && (
                <div style={{ fontSize: '0.75rem', color: '#ef4444', marginBottom: '0.25rem', textDecoration: 'line-through', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>PPT (AZ) - {lang === 'az' ? 'Silinəcək' : 'To be deleted'}</span>
                  <button type="button" onClick={() => setDeleteFlags(prev => ({ ...prev, ppt_az: false }))} style={{ border: 'none', background: 'none', color: '#3b82f6', cursor: 'pointer', fontSize: '0.75rem', padding: 0 }}>
                    {lang === 'az' ? 'Geri al' : 'Undo'}
                  </button>
                </div>
              )}
              <input type="file" name="ppt_az" accept=".ppt,.pptx" onChange={handleFileChange} />
            </div>

            <div style={{ marginTop: '0.5rem' }}>
              {projectToEdit?.files?.ppt_en && !deleteFlags.ppt_en && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.8rem', background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                  <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '120px' }}>PPT (EN)</span>
                  <button type="button" onClick={() => setDeleteFlags(prev => ({ ...prev, ppt_en: true }))} style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
              {deleteFlags.ppt_en && (
                <div style={{ fontSize: '0.75rem', color: '#ef4444', marginBottom: '0.25rem', textDecoration: 'line-through', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>PPT (EN) - {lang === 'az' ? 'Silinəcək' : 'To be deleted'}</span>
                  <button type="button" onClick={() => setDeleteFlags(prev => ({ ...prev, ppt_en: false }))} style={{ border: 'none', background: 'none', color: '#3b82f6', cursor: 'pointer', fontSize: '0.75rem', padding: 0 }}>
                    {lang === 'az' ? 'Geri al' : 'Undo'}
                  </button>
                </div>
              )}
              <input type="file" name="ppt_en" accept=".ppt,.pptx" onChange={handleFileChange} />
            </div>
          </div>
        </div>
      </div>

      <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '2rem', padding: '1rem' }} disabled={loading}>
        {loading ? 'Processing...' : (projectToEdit ? l.submitEdit : l.submit)}
      </button>
    </form>
  );
};

export default ProjectForm;
