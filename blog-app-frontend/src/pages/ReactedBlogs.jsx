import React, { useEffect, useState, useCallback } from 'react';
import { getReactedBlogs } from '../api/axios';
import BlogCard from '../components/BlogCard';
import Pagination from '../components/Pagination';

export default function ReactedBlogs() {
  const [blogs, setBlogs]           = useState([]);
  const [page, setPage]             = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');

  const fetchReacted = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getReactedBlogs(page);
      setBlogs(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch {
      setError('Failed to load reacted blogs.');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchReacted(); }, [fetchReacted]);

  const handleReactionUpdate = (updated) =>
    setBlogs(prev => prev.map(b => b.id === updated.id ? updated : b));

  return (
    <div className="page-wrapper">
      <h1 className="page-title">Reacted Blogs</h1>
      {loading ? (
        <div className="loading">Loading...</div>
      ) : error ? (
        <div className="empty-state">{error}</div>
      ) : blogs.length === 0 ? (
        <div className="empty-state">No reacted blogs yet.</div>
      ) : (
        <div className="blog-list">
          {blogs.map(blog => (
            <BlogCard key={blog.id} blog={blog} onReactionUpdate={handleReactionUpdate} />
          ))}
        </div>
      )}
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}