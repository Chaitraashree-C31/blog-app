import React, { useEffect, useState, useCallback } from 'react';
import { adminGetAllBlogs, adminDeleteBlog } from '../../api/axios';
import BlogCard from '../../components/BlogCard';
import Pagination from '../../components/Pagination';
import ConfirmModal from '../../components/ConfirmModal';
import '../../styles/Admin.css';

export default function ManageBlogs() {
  const [blogs, setBlogs]           = useState([]);
  const [page, setPage]             = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [success, setSuccess]       = useState('');
  const [modal, setModal]           = useState(null);

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminGetAllBlogs(page);
      setBlogs(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch {
      setError('Failed to load blogs.');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchBlogs(); }, [fetchBlogs]);

  const handleConfirmDelete = async () => {
    const { id } = modal;
    setModal(null);
    try {
      await adminDeleteBlog(id);
      setBlogs(prev => {
        const updated = prev.filter(b => b.id !== id);
        if (updated.length === 0 && page > 0) setPage(p => p - 1);
        return updated;
      });
      setSuccess('Blog deleted.');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete blog.');
    }
  };

  return (
    <div className="page-wrapper">
      {modal && (
        <ConfirmModal
          title="Delete Blog"
          message={`Are you sure you want to delete "${modal.title}"? This cannot be undone.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setModal(null)}
        />
      )}
      <h1 className="page-title">Manage Blogs</h1>
      {error   && <p className="error-msg"  style={{ marginBottom: '14px' }}>{error}</p>}
      {success && <p className="success-msg" style={{ marginBottom: '14px' }}>{success}</p>}
      {loading ? (
        <div className="loading">Loading...</div>
      ) : blogs.length === 0 ? (
        <div className="empty-state">No blogs found.</div>
      ) : (
        <>
          <div className="blog-list">
            {blogs.map(blog => (
              <BlogCard
                key={blog.id}
                blog={blog}
                showActions={true}
                onDelete={(id) => setModal({ id, title: blog.title })}
                hideReactions={true}
              />
            ))}
          </div>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}