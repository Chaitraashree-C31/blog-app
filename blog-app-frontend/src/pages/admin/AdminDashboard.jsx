import React, { useEffect, useState } from 'react';
import { adminGetAllUsers, adminGetAllBlogs, getAllCategories } from '../../api/axios';
import '../../styles/Admin.css';

export default function AdminDashboard() {
  const [stats, setStats]     = useState({ users: 0, blogs: 0, categories: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([adminGetAllUsers(), adminGetAllBlogs(0), getAllCategories()])
      .then(([u, b, c]) => setStats({
        users: u.data.length,
        blogs: b.data.totalElements,
        categories: c.data.length,
      }))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-wrapper">
      <h1 className="page-title">Admin Dashboard</h1>
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="admin-stats">
          <div className="admin-stat-card">
            <div className="admin-stat-label">Total Users</div>
            <div className="admin-stat-value">{stats.users}</div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-label">Total Blogs</div>
            <div className="admin-stat-value">{stats.blogs}</div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-label">Categories</div>
            <div className="admin-stat-value">{stats.categories}</div>
          </div>
        </div>
      )}
    </div>
  );
}