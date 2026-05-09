import React from 'react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', marginTop: '36px' }}>
      <button
        className="btn btn-outline"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
      >
        ←
      </button>
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i}
          className={`btn ${i === currentPage ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => onPageChange(i)}
          style={{ minWidth: '38px', justifyContent: 'center' }}
        >
          {i + 1}
        </button>
      ))}
      <button
        className="btn btn-outline"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
      >
        →
      </button>
    </div>
  );
}