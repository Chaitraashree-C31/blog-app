import React, { useEffect, useState, useCallback } from 'react';
import { getAllBlogs } from '../api/axios';
import BlogCard from '../components/BlogCard';
import CategoryFilter from '../components/CategoryFilter';
import Pagination from '../components/Pagination';
import '../styles/Home.css';

export default function Home() {
  const [blogs, setBlogs]               = useState([]);
  const [page, setPage]                 = useState(0);
  const [totalPages, setTotalPages]     = useState(0);
  const [selectedCats, setSelectedCats] = useState([]);
  const [loading, setLoading]           = useState(true);

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAllBlogs(page, selectedCats);
      setBlogs(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch {
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  }, [page, selectedCats]);

  useEffect(() => { fetchBlogs(); }, [fetchBlogs]);

  const handleCategoryChange = (ids) => { setSelectedCats(ids); setPage(0); };

  const handleReactionUpdate = (updated) =>
    setBlogs(prev => prev.map(b => b.id === updated.id ? updated : b));

  return (
    <div className="page-wrapper">
      <div className="home-hero"><h1>Explore Stories</h1></div>
      <div className="home-toolbar">
        <CategoryFilter selected={selectedCats} onChange={handleCategoryChange} />
      </div>
      {loading ? (
        <div className="loading">Loading...</div>
      ) : blogs.length === 0 ? (
        <div className="empty-state">No blogs found.</div>
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