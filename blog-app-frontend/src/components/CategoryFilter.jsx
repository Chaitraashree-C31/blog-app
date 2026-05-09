import React, { useEffect, useState } from 'react';
import { getAllCategories } from '../api/axios';

export default function CategoryFilter({ selected, onChange }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getAllCategories().then(res => setCategories(res.data)).catch(() => {});
  }, []);

  const toggle = (id) =>
    onChange(selected.includes(id) ? selected.filter(c => c !== id) : [...selected, id]);

  return (
    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
      <button
        className={`btn ${selected.length === 0 ? 'btn-primary' : 'btn-outline'}`}
        onClick={() => onChange([])}
      >
        All
      </button>
      {categories.map(cat => (
        <button
          key={cat.id}
          className={`btn ${selected.includes(cat.id) ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => toggle(cat.id)}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}