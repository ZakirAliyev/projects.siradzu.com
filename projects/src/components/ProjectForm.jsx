import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Upload } from 'lucide-react';

const ProjectForm = ({ onProjectAdded, lang, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name_az: '',
    name_en: '',
    desc_az: '',
    desc_en: '',
  });
  const [files, setFiles] = useState({
    cardImage: null,
    word_az: null,
    word_en: null,
    ppt_az: null,
    ppt_en: null,
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!files.cardImage) return toast.error('Card image is required');

    setLoading(true);
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    Object.keys(files).forEach(key => {
      if (files[key]) data.append(key, files[key]);
    });

    try {
      await axios.post('http://localhost:5001/api/projects', data, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      toast.success(lang === 'az' ? 'Layihə uğurla əlavə edildi!' : 'Project added successfully!');
      onProjectAdded();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Failed to upload project');
    } finally {
      setLoading(false);
    }
  };

  const labels = {
    az: { name: 'Ad', desc: 'Təsvir', cardImg: 'Kard Şəkli', word: 'Word Sənədi', ppt: 'PPT Sənədi', submit: 'Yarat' },
    en: { name: 'Name', desc: 'Description', cardImg: 'Card Image', word: 'Word Doc', ppt: 'PPT Doc', submit: 'Create' }
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
        <div className="file-dropzone">
          <label className="form-label">{l.cardImg}</label>
          <input type="file" name="cardImage" accept="image/*" onChange={handleFileChange} required />
        </div>
        <div className="file-dropzone">
          <label className="form-label">{l.word} (AZ/EN)</label>
          <input type="file" name="word_az" accept=".doc,.docx" onChange={handleFileChange} />
          <input type="file" name="word_en" accept=".doc,.docx" onChange={handleFileChange} style={{ marginTop: '0.5rem' }} />
        </div>
        <div className="file-dropzone">
          <label className="form-label">{l.ppt} (AZ/EN)</label>
          <input type="file" name="ppt_az" accept=".ppt,.pptx" onChange={handleFileChange} />
          <input type="file" name="ppt_en" accept=".ppt,.pptx" onChange={handleFileChange} style={{ marginTop: '0.5rem' }} />
        </div>
      </div>

      <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '2rem', padding: '1rem' }} disabled={loading}>
        {loading ? 'Processing...' : l.submit}
      </button>
    </form>
  );
};

export default ProjectForm;
