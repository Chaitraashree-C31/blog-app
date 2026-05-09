import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const cls = ({ isActive }) => 'nav-link' + (isActive ? ' active' : '');

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <NavLink to={user?.role === 'ROLE_ADMIN' ? '/admin' : '/'} className="navbar-logo">
          BlogApp
        </NavLink>
        <div className="navbar-links">
          {!user && (
            <>
              <NavLink to="/" className={cls}>All Blogs</NavLink>
              <NavLink to="/login" className={cls}>Login</NavLink>
              <NavLink to="/register" className={cls}>Register</NavLink>
            </>
          )}
          {user?.role === 'ROLE_USER' && (
            <>
              <NavLink to="/" className={cls}>All Blogs</NavLink>
              <NavLink to="/my-blogs" className={cls}>My Blogs</NavLink>
              <NavLink to="/reacted" className={cls}>Reacted</NavLink>
              <NavLink to="/profile" className={cls}>Profile</NavLink>
              <button className="nav-link-logout" onClick={handleLogout}>Logout</button>
            </>
          )}
          {user?.role === 'ROLE_ADMIN' && (
            <>
              <NavLink to="/admin" end className={cls}>Dashboard</NavLink>
              <NavLink to="/admin/categories" className={cls}>Categories</NavLink>
              <NavLink to="/admin/users" className={cls}>Users</NavLink>
              <NavLink to="/admin/blogs" className={cls}>Blogs</NavLink>
              <button className="nav-link-logout" onClick={handleLogout}>Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}