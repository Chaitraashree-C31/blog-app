import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyBlogs, deleteBlog } from '../api/axios';
import BlogCard from '../components/BlogCard';
import Pagination from '../components/Pagination';
import ConfirmModal from '../components/ConfirmModal';

export default function MyBlogs() {
  const navigate = useNavigate();
  const [blogs, setBlogs]           = useState([]);
  const [page, setPage]             = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [modal, setModal]           = useState(null);

  const fetchMyBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getMyBlogs(page);
      setBlogs(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch {
      setError('Failed to load your blogs.');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchMyBlogs(); }, [fetchMyBlogs]);

  const handleConfirmDelete = async () => {
    const { id } = modal;
    setModal(null);
    try {
      await deleteBlog(id);
      setBlogs(prev => {
        const updated = prev.filter(b => b.id !== id);
        if (updated.length === 0 && page > 0) setPage(p => p - 1);
        return updated;
      });
    } catch {
      setError('Failed to delete blog.');
    }
  };

  const handleReactionUpdate = (updated) =>
    setBlogs(prev => prev.map(b => b.id === updated.id ? updated : b));

  return (
    <div className="page-wrapper">
      {modal && (
        <ConfirmModal
          title="Delete Blog"
          message="Are you sure you want to delete this blog? This cannot be undone."
          onConfirm={handleConfirmDelete}
          onCancel={() => setModal(null)}
        />
      )}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <h1 className="page-title" style={{ margin: 0 }}>My Blogs</h1>
        <button className="btn btn-primary" onClick={() => navigate('/create-blog')}>+ New Blog</button>
      </div>
      {loading ? (
        <div className="loading">Loading...</div>
      ) : error ? (
        <div className="empty-state">{error}</div>
      ) : blogs.length === 0 ? (
        <div className="empty-state">No blogs yet.</div>
      ) : (
        <div className="blog-list">
          {blogs.map(blog => (
            <BlogCard
              key={blog.id}
              blog={blog}
              showActions={true}
              onEdit={(id) => navigate(`/edit-blog/${id}`)}
              onDelete={(id) => setModal({ id })}
              onReactionUpdate={handleReactionUpdate}
            />
          ))}
        </div>
      )}
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}