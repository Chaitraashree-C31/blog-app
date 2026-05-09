import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBlog, getAllCategories } from '../api/axios';
import '../styles/BlogForm.css';

export default function CreateBlog() {
  const navigate = useNavigate();
  const [form, setForm]                 = useState({ title: '', content: '' });
  const [selectedCats, setSelectedCats] = useState([]);
  const [imageFiles, setImageFiles]     = useState([]);
  const [categories, setCategories]     = useState([]);
  const [error, setError]               = useState('');
  const [loading, setLoading]           = useState(false);

  useEffect(() => {
    getAllCategories().then(res => setCategories(res.data)).catch(() => {});
  }, []);

  const handleChange = (e) => { setForm(p => ({ ...p, [e.target.name]: e.target.value })); setError(''); };

  const toggleCategory = (id) => {
    setSelectedCats(p => p.includes(id) ? p.filter(c => c !== id) : [...p, id]);
    setError('');
  };

  const handleImages = (e) => {
    const incoming = Array.from(e.target.files);
    setImageFiles(prev => {
      const existing = new Set(prev.map(f => f.file.name + f.file.size));
      const fresh = incoming
        .filter(f => !existing.has(f.name + f.size))
        .map(file => ({ file, preview: URL.createObjectURL(file) }));
      return [...prev, ...fresh];
    });
    e.target.value = '';
  };

  const handleRemoveImage = (index) => {
    setImageFiles(prev => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim())        { setError('Title is required.'); return; }
    if (!form.content.trim())      { setError('Content is required.'); return; }
    if (selectedCats.length === 0) { setError('Select at least one category.'); return; }
    if (imageFiles.length === 0)   { setError('At least one image is required.'); return; }
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('data', new Blob([JSON.stringify({
        title: form.title.trim(), content: form.content.trim(), categoryIds: selectedCats,
      })], { type: 'application/json' }));
      imageFiles.forEach(({ file }) => formData.append('images', file));
      await createBlog(formData);
      navigate('/my-blogs');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create blog.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <h1 className="page-title">Create Blog</h1>
      <div className="blog-form-card">
        <form className="blog-form" onSubmit={handleSubmit} noValidate>

          <div className="form-group">
            <label>Title <span style={{ color: 'var(--danger)' }}>*</span></label>
            <input type="text" name="title" value={form.title} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Categories <span style={{ color: 'var(--danger)' }}>*</span></label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
              {categories.map(cat => {
                const active = selectedCats.includes(cat.id);
                return (
                  <button key={cat.id} type="button" onClick={() => toggleCategory(cat.id)} style={{
                    padding: '5px 13px', borderRadius: '6px', fontSize: '13px', fontWeight: 500,
                    cursor: 'pointer',
                    border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
                    background: active ? 'var(--accent-dim)' : 'transparent',
                    color: active ? 'var(--accent)' : 'var(--text-muted)',
                    transition: 'all 0.18s ease',
                  }}>
                    {active ? '✓ ' : ''}{cat.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="form-group">
            <label>Content <span style={{ color: 'var(--danger)' }}>*</span></label>
            <textarea name="content" value={form.content} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Images <span style={{ color: 'var(--danger)' }}>*</span></label>
            <label className="image-upload-label">
              + Add Images
              <input type="file" accept="image/*" multiple onChange={handleImages} />
            </label>
            {imageFiles.length > 0 && (
              <div className="image-upload-grid" style={{ marginTop: '10px' }}>
                {imageFiles.map(({ file, preview }, i) => (
                  <div key={i} style={{ position: 'relative', display: 'inline-block' }}>
                    <img src={preview} alt="preview" className="image-preview-thumb" />
                    <button type="button" onClick={() => handleRemoveImage(i)} style={{
                      position: 'absolute', top: '3px', right: '3px',
                      width: '18px', height: '18px', borderRadius: '50%',
                      background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: '10px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: 'none', cursor: 'pointer', padding: 0,
                    }}>✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && <p className="error-msg">{error}</p>}

          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={() => navigate('/my-blogs')}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Publishing...' : 'Publish Blog'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}