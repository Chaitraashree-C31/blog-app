import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MyBlogs from './pages/MyBlogs';
import ReactedBlogs from './pages/ReactedBlogs';
import Profile from './pages/Profile';
import CreateBlog from './pages/CreateBlog';
import EditBlog from './pages/EditBlog';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageCategories from './pages/admin/ManageCategories';
import ManageUsers from './pages/admin/ManageUsers';
import ManageBlogs from './pages/admin/ManageBlogs';

function UserRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'ROLE_ADMIN') return <Navigate to="/admin" replace />;
  return children;
}

function AdminRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'ROLE_ADMIN') return <Navigate to="/" replace />;
  return children;
}

function GuestRoute({ children }) {
  const { user } = useAuth();
  if (user) return user.role === 'ROLE_ADMIN'
    ? <Navigate to="/admin" replace />
    : <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/"             element={<Home />} />
        <Route path="/login"        element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/register"     element={<GuestRoute><Register /></GuestRoute>} />
        <Route path="/my-blogs"     element={<UserRoute><MyBlogs /></UserRoute>} />
        <Route path="/reacted"      element={<UserRoute><ReactedBlogs /></UserRoute>} />
        <Route path="/profile"      element={<UserRoute><Profile /></UserRoute>} />
        <Route path="/create-blog"  element={<UserRoute><CreateBlog /></UserRoute>} />
        <Route path="/edit-blog/:id" element={<UserRoute><EditBlog /></UserRoute>} />
        <Route path="/admin"            element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/categories" element={<AdminRoute><ManageCategories /></AdminRoute>} />
        <Route path="/admin/users"      element={<AdminRoute><ManageUsers /></AdminRoute>} />
        <Route path="/admin/blogs"      element={<AdminRoute><ManageBlogs /></AdminRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}