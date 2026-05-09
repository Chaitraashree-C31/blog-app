import React, { useEffect, useState } from 'react';
import { adminGetAllUsers, adminDeleteUser } from '../../api/axios';
import ConfirmModal from '../../components/ConfirmModal';
import '../../styles/Admin.css';

export default function ManageUsers() {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');
  const [modal, setModal]     = useState(null);

  useEffect(() => {
    adminGetAllUsers()
      .then(res => setUsers(res.data))
      .catch(() => setError('Failed to load users.'))
      .finally(() => setLoading(false));
  }, []);

  const handleConfirmDelete = async () => {
    const { id, name } = modal;
    setModal(null);
    try {
      await adminDeleteUser(id);
      setUsers(p => p.filter(u => u.id !== id));
      setSuccess(`User "${name}" deleted.`);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user.');
    }
  };

  return (
    <div className="page-wrapper">
      {modal && (
        <ConfirmModal
          title={`Delete "${modal.name}"?`}
          message="This will permanently delete the user along with all their blogs and reactions."
          onConfirm={handleConfirmDelete}
          onCancel={() => setModal(null)}
        />
      )}
      <h1 className="page-title">Manage Users</h1>
      {error   && <p className="error-msg"  style={{ marginBottom: '14px' }}>{error}</p>}
      {success && <p className="success-msg" style={{ marginBottom: '14px' }}>{success}</p>}
      {loading ? (
        <div className="loading">Loading...</div>
      ) : users.length === 0 ? (
        <div className="empty-state">No users found.</div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr><th>#</th><th>Name</th><th>Email</th><th>Role</th><th>Action</th></tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={u.id}>
                <td style={{ color: 'var(--text-faint)', width: '48px' }}>{i + 1}</td>
                <td style={{ color: 'var(--text)' }}>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <span style={{
                    fontSize: '11px', fontWeight: 600, letterSpacing: '0.6px', textTransform: 'uppercase',
                    padding: '2px 8px', borderRadius: '4px',
                    background: u.role === 'ROLE_ADMIN' ? 'var(--accent-dim)' : 'rgba(255,255,255,0.05)',
                    color: u.role === 'ROLE_ADMIN' ? 'var(--accent)' : 'var(--text-muted)',
                  }}>
                    {u.role === 'ROLE_ADMIN' ? 'Admin' : 'User'}
                  </span>
                </td>
                <td style={{ width: '100px' }}>
                  {u.role !== 'ROLE_ADMIN' ? (
                    <button className="btn btn-danger" style={{ fontSize: '12px', padding: '5px 12px' }}
                      onClick={() => setModal({ id: u.id, name: u.name })}>
                      Delete
                    </button>
                  ) : (
                    <span style={{ color: 'var(--text-faint)', fontSize: '13px' }}>—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}