import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getBlogById, updateBlog, getAllCategories } from '../api/axios';
import '../styles/BlogForm.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export default function EditBlog() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const [form, setForm]                     = useState({ title: '', content: '' });
  const [selectedCats, setSelectedCats]     = useState([]);
  const [categories, setCategories]         = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [newImageFiles, setNewImageFiles]   = useState([]);
  const [error, setError]                   = useState('');
  const [loading, setLoading]               = useState(false);
  const [fetching, setFetching]             = useState(true);

  useEffect(() => {
    Promise.all([getBlogById(id), getAllCategories()])
      .then(([blogRes, catRes]) => {
        const blog = blogRes.data;
        setForm({ title: blog.title, content: blog.content });
        setSelectedCats(blog.categoryIds || []);
        setExistingImages((blog.imageUrls || []).map(url => ({ url, removed: false })));
        setCategories(Array.isArray(catRes.data) ? catRes.data : []);
      })
      .catch(() => setError('Failed to load blog.'))
      .finally(() => setFetching(false));
  }, [id]);

  const handleChange = (e) => { setForm(p => ({ ...p, [e.target.name]: e.target.value })); setError(''); };

  const toggleCategory = (catId) => {
    setSelectedCats(p => p.includes(catId) ? p.filter(c => c !== catId) : [...p, catId]);
    setError('');
  };

  const toggleRemoveExisting = (index) =>
    setExistingImages(p => p.map((img, i) => i === index ? { ...img, removed: !img.removed } : img));

  const handleNewImages = (e) => {
    const incoming = Array.from(e.target.files);
    setNewImageFiles(prev => {
      const existing = new Set(prev.map(f => f.file.name + f.file.size));
      const fresh = incoming
        .filter(f => !existing.has(f.name + f.size))
        .map(file => ({ file, preview: URL.createObjectURL(file) }));
      return [...prev, ...fresh];
    });
    e.target.value = '';
  };

  const handleRemoveNewImage = (index) => {
    setNewImageFiles(prev => {
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
    const keptCount = existingImages.filter(img => !img.removed).length;
    if (keptCount + newImageFiles.length === 0) { setError('At least one image is required.'); return; }
    setLoading(true);
    setError('');
    try {
      const keepImageUrls = existingImages.filter(img => !img.removed).map(img => img.url);
      const formData = new FormData();
      formData.append('data', new Blob([JSON.stringify({
        title: form.title.trim(), content: form.content.trim(),
        categoryIds: selectedCats, keepImageUrls,
      })], { type: 'application/json' }));
      newImageFiles.forEach(({ file }) => formData.append('images', file));
      await updateBlog(id, formData);
      navigate('/my-blogs');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update blog.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="loading">Loading...</div>;

  return (
    <div className="page-wrapper">
      <h1 className="page-title">Edit Blog</h1>
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

          {existingImages.length > 0 && (
            <div className="form-group">
              <label>Current Images <span style={{ color: 'var(--text-faint)', fontWeight: 400, fontSize: '12px' }}>(click ✕ to remove)</span></label>
              <div className="image-upload-grid" style={{ marginTop: '8px' }}>
                {existingImages.map((img, i) => (
                  <div key={i} style={{ position: 'relative', display: 'inline-block' }}>
                    <img
                      src={`${API}${img.url}`}
                      alt="existing"
                      className="image-preview-thumb"
                      style={{ opacity: img.removed ? 0.3 : 1, transition: 'opacity 0.18s ease' }}
                    />
                    <button type="button" onClick={() => toggleRemoveExisting(i)} style={{
                      position: 'absolute', top: '3px', right: '3px',
                      width: '18px', height: '18px', borderRadius: '50%',
                      background: img.removed ? 'rgba(92,184,92,0.85)' : 'rgba(0,0,0,0.7)',
                      color: '#fff', fontSize: '10px', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      border: 'none', cursor: 'pointer', padding: 0,
                    }}>
                      {img.removed ? '↩' : '✕'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Add Images</label>
            <label className="image-upload-label">
              + Choose images
              <input type="file" accept="image/*" multiple onChange={handleNewImages} />
            </label>
            {newImageFiles.length > 0 && (
              <div className="image-upload-grid" style={{ marginTop: '10px' }}>
                {newImageFiles.map(({ file, preview }, i) => (
                  <div key={i} style={{ position: 'relative', display: 'inline-block' }}>
                    <img src={preview} alt="new" className="image-preview-thumb" />
                    <button type="button" onClick={() => handleRemoveNewImage(i)} style={{
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
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}