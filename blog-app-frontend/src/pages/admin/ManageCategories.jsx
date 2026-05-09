import React, { useEffect, useState } from 'react';
import { getAllCategories, adminAddCategory, adminDeleteCategory } from '../../api/axios';
import ConfirmModal from '../../components/ConfirmModal';
import '../../styles/Admin.css';

export default function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [newName, setNewName]       = useState('');
  const [loading, setLoading]       = useState(true);
  const [adding, setAdding]         = useState(false);
  const [error, setError]           = useState('');
  const [success, setSuccess]       = useState('');
  const [modal, setModal]           = useState(null);

  useEffect(() => {
    getAllCategories()
      .then(res => setCategories(res.data))
      .catch(() => setError('Failed to load categories.'))
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;
    setAdding(true);
    setError('');
    setSuccess('');
    try {
      const res = await adminAddCategory(name);
      setCategories(p => [...p, res.data]);
      setNewName('');
      setSuccess(`Category "${res.data.name}" added.`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add category.');
    } finally {
      setAdding(false);
    }
  };

  const handleConfirmDelete = async () => {
    const { id, name } = modal;
    setModal(null);
    try {
      await adminDeleteCategory(id);
      setCategories(p => p.filter(c => c.id !== id));
      setSuccess(`Category "${name}" deleted.`);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete category.');
    }
  };

  return (
    <div className="page-wrapper">
      {modal && (
        <ConfirmModal
          title={`Delete "${modal.name}"?`}
          message="This will permanently delete the category and all blogs that have no other categories."
          onConfirm={handleConfirmDelete}
          onCancel={() => setModal(null)}
        />
      )}
      <h1 className="page-title">Manage Categories</h1>
      <form className="admin-add-form" onSubmit={handleAdd} noValidate>
        <input
          type="text"
          placeholder="New category name"
          value={newName}
          onChange={e => { setNewName(e.target.value); setError(''); setSuccess(''); }}
        />
        <button type="submit" className="btn btn-primary" disabled={adding || !newName.trim()}>
          {adding ? 'Adding...' : 'Add Category'}
        </button>
      </form>
      {error   && <p className="error-msg"  style={{ marginBottom: '14px' }}>{error}</p>}
      {success && <p className="success-msg" style={{ marginBottom: '14px' }}>{success}</p>}
      {loading ? (
        <div className="loading">Loading...</div>
      ) : categories.length === 0 ? (
        <div className="empty-state">No categories yet.</div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr><th>#</th><th>Name</th><th>Action</th></tr>
          </thead>
          <tbody>
            {categories.map((cat, i) => (
              <tr key={cat.id}>
                <td style={{ color: 'var(--text-faint)', width: '48px' }}>{i + 1}</td>
                <td style={{ color: 'var(--text)' }}>{cat.name}</td>
                <td style={{ width: '100px' }}>
                  <button className="btn btn-danger" style={{ fontSize: '12px', padding: '5px 12px' }}
                    onClick={() => setModal({ id: cat.id, name: cat.name })}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}