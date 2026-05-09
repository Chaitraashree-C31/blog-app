import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { reactToBlog } from '../api/axios';
import '../styles/BlogCard.css';
import '../styles/BlogDetail.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export default function BlogCard({ blog, onReactionUpdate, showActions, onEdit, onDelete, hideReactions }) {
  const { user } = useAuth();
  const [current, setCurrent] = useState(0);
  const images = blog.imageUrls || [];

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  }) : '';

  const handleReact = async (type, e) => {
    e.stopPropagation();
    if (!user) return;
    try {
      const res = await reactToBlog(blog.id, type);
      if (onReactionUpdate) onReactionUpdate(res.data);
    } catch {}
  };

  const prev = (e) => { e.stopPropagation(); setCurrent(c => (c - 1 + images.length) % images.length); };
  const next = (e) => { e.stopPropagation(); setCurrent(c => (c + 1) % images.length); };

  return (
    <div className="blog-card-full">

      {images.length > 0 && (
        <div className="carousel">
          <div className="carousel-track">
            <img src={`${API}${images[current]}`} alt="slide" className="carousel-img" />
            {images.length > 1 && (
              <>
                <button className="carousel-btn carousel-btn-left" onClick={prev}>‹</button>
                <button className="carousel-btn carousel-btn-right" onClick={next}>›</button>
              </>
            )}
          </div>
          {images.length > 1 && (
            <div className="carousel-dots">
              {images.map((_, i) => (
                <button
                  key={i}
                  className={`carousel-dot ${i === current ? 'active' : ''}`}
                  onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
                />
              ))}
            </div>
          )}
          {images.length > 1 && (
            <div className="carousel-thumbs">
              {images.map((url, i) => (
                <img
                  key={i}
                  src={`${API}${url}`}
                  alt="thumb"
                  className={`carousel-thumb ${i === current ? 'active' : ''}`}
                  onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <div className="blog-card-full-body">

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '10px' }}>
          {(blog.categoryNames || []).map((name, i) => (
            <span key={i} className="blog-card-category">{name}</span>
          ))}
        </div>

        <h2 className="blog-card-full-title">{blog.title}</h2>

        <div className="blog-card-full-meta">
          <span>{blog.authorName}</span>
          <span>·</span>
          <span>{formatDate(blog.createdAt)}</span>
        </div>

        <div className="blog-card-full-content">{blog.content}</div>

        <div className="blog-card-full-footer">
          {!hideReactions ? (
            <div className="blog-card-reactions">
              <button
                className={`reaction-btn ${blog.userReaction === 'LIKE' ? 'liked' : ''}`}
                onClick={(e) => handleReact('LIKE', e)}
                disabled={!user}
                title={user ? 'Like' : 'Login to react'}
              >
                👍 {blog.likeCount}
              </button>
              <button
                className={`reaction-btn ${blog.userReaction === 'DISLIKE' ? 'disliked' : ''}`}
                onClick={(e) => handleReact('DISLIKE', e)}
                disabled={!user}
                title={user ? 'Dislike' : 'Login to react'}
              >
                👎 {blog.dislikeCount}
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '12px', fontSize: '13px', color: 'var(--text-faint)' }}>
              <span>👍 {blog.likeCount}</span>
              <span>👎 {blog.dislikeCount}</span>
            </div>
          )}

          {showActions && (
            <div style={{ display: 'flex', gap: '8px' }}>
              {onEdit && (
                <button className="btn btn-outline" onClick={(e) => { e.stopPropagation(); onEdit(blog.id); }} style={{ fontSize: '13px', padding: '6px 14px' }}>
                  Edit
                </button>
              )}
              {onDelete && (
                <button className="btn btn-danger" onClick={(e) => { e.stopPropagation(); onDelete(blog.id); }} style={{ fontSize: '13px', padding: '6px 14px' }}>
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}