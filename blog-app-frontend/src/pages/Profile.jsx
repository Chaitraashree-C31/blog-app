import React, { useEffect, useState } from 'react';
import { getProfile, updateProfile, deleteOwnAccount } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../components/ConfirmModal';
import '../styles/Profile.css';

export default function Profile() {
  const { login, logout, user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile]       = useState(null);
  const [form, setForm]             = useState({ name: '', email: '', newPassword: '' });
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [success, setSuccess]       = useState('');
  const [error, setError]           = useState('');
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    getProfile()
      .then(res => {
        setProfile(res.data);
        setForm({ name: res.data.name, email: res.data.email, newPassword: '' });
      })
      .catch(() => setError('Failed to load profile.'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    setSuccess('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) { setError('Name and email are required.'); return; }
    setSaving(true);
    setSuccess('');
    setError('');
    try {
      const res = await updateProfile({
        name:        form.name,
        email:       form.email,
        newPassword: form.newPassword || null,
      });
      if (res.data.requiresLogout) {
        logout();
        navigate('/login');
      } else {
        login({ ...user, name: form.name });
        setSuccess('Profile updated.');
        setForm(p => ({ ...p, newPassword: '' }));
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteOwnAccount();
      logout();
      navigate('/');
    } catch {
      setError('Failed to delete account.');
      setShowDelete(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="page-wrapper" style={{ maxWidth: '520px' }}>
      {showDelete && (
        <ConfirmModal
          title="Delete Account"
          message="Permanently delete your account? This will also delete all your blogs and reactions."
          onConfirm={handleDeleteAccount}
          onCancel={() => setShowDelete(false)}
        />
      )}

      <h1 className="page-title">Profile</h1>

      <div className="profile-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.05rem' }}>{profile?.name}</div>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>{profile?.email}</div>
        </div>
        <span className="profile-role-badge">{profile?.role === 'ROLE_ADMIN' ? 'Admin' : 'User'}</span>
      </div>

      <div className="profile-card">
        <h2 style={{ fontSize: '1.1rem', marginBottom: '18px' }}>Edit Profile</h2>
        <form className="profile-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label>Name <span style={{ color: 'var(--danger)' }}>*</span></label>
            <input type="text" name="name" value={form.name} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>
              Email <span style={{ color: 'var(--danger)' }}>*</span>{' '}
              <span style={{ fontSize: '11px', color: 'var(--text-faint)', fontWeight: 400 }}>(changing logs you out)</span>
            </label>
            <input type="email" name="email" value={form.email} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>
              New Password{' '}
              <span style={{ fontSize: '11px', color: 'var(--text-faint)', fontWeight: 400 }}>(min 8 characters — changing logs you out)</span>
            </label>
            <input type="password" name="newPassword" value={form.newPassword} onChange={handleChange} minLength={8} />
          </div>
          {error   && <p className="error-msg">{error}</p>}
          {success && <p className="success-msg">{success}</p>}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      <div className="profile-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ fontSize: '14px', fontWeight: 500 }}>Delete Account</div>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>Permanently delete your account and all your blogs.</div>
        </div>
        <button className="btn btn-danger" onClick={() => setShowDelete(true)}>Delete Account</button>
      </div>
    </div>
  );
}