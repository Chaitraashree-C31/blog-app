import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../api/axios';
import '../styles/Auth.css';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm]       = useState({ name: '', email: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => { setForm(p => ({ ...p, [e.target.name]: e.target.value })); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setError('All fields are required.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await registerUser(form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Create account</h2>
        <p className="auth-subtitle">Join the community today</p>
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label>Name <span style={{ color: 'var(--danger)' }}>*</span></label>
            <input type="text" name="name" value={form.name} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Email <span style={{ color: 'var(--danger)' }}>*</span></label>
            <input type="email" name="email" value={form.email} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>
              Password <span style={{ color: 'var(--danger)' }}>*</span>{' '}
              <span style={{ fontSize: '11px', color: 'var(--text-faint)', fontWeight: 400 }}>(min 8 characters)</span>
            </label>
            <input type="password" name="password" value={form.password} onChange={handleChange} />
          </div>
          {error && <p className="error-msg">{error}</p>}
          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}