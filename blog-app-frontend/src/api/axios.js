import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
  try {
    const stored = localStorage.getItem('blogapp_user');
    if (stored) {
      const { token } = JSON.parse(stored);
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {}
  return config;
});

export const registerUser = (data) => api.post('/api/auth/register', data);
export const loginUser    = (data) => api.post('/api/auth/login', data);

export const getAllBlogs = (page = 0, categoryIds = []) => {
  const params = new URLSearchParams();
  params.append('page', page);
  if (categoryIds && categoryIds.length > 0) {
    categoryIds.forEach(id => params.append('categoryIds', id));
  }
  return api.get('/api/blogs', { params });
};

export const getBlogById  = (id)       => api.get(`/api/blogs/${id}`);
export const getMyBlogs   = (page = 0) => api.get('/api/blogs/my', { params: { page } });

export const createBlog = (formData) =>
  api.post('/api/blogs', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

export const updateBlog = (id, formData) =>
  api.put(`/api/blogs/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });

export const deleteBlog = (id) => api.delete(`/api/blogs/${id}`);

export const getAllCategories = () => api.get('/api/categories');

export const reactToBlog     = (blogId, type) =>
  api.post(`/api/reactions/${blogId}`, null, { params: { type } });

export const getReactedBlogs = (page = 0) =>
  api.get('/api/reactions/my-reacted', { params: { page } });

export const getProfile       = ()     => api.get('/api/users/profile');
export const updateProfile    = (data) => api.put('/api/users/profile', data);
export const deleteOwnAccount = ()     => api.delete('/api/users/account');

export const adminGetAllUsers    = ()         => api.get('/api/admin/users');
export const adminDeleteUser     = (id)       => api.delete(`/api/admin/users/${id}`);
export const adminGetAllBlogs    = (page = 0) => api.get('/api/admin/blogs', { params: { page } });
export const adminDeleteBlog     = (id)       => api.delete(`/api/admin/blogs/${id}`);
export const adminAddCategory    = (name)     => api.post('/api/admin/categories', null, { params: { name } });
export const adminDeleteCategory = (id)       => api.delete(`/api/admin/categories/${id}`);

export default api;