import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const icons = {
  dashboard: '▦',
  tasks: '✓',
  logout: '→',
  moon: '◐',
  sun: '○',
  menu: '≡',
};

export default function Layout() {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ?.split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="app-layout">
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 99 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div className="sidebar-logo-mark">✓</div>
          <span className="sidebar-logo-text">Taskflow</span>
        </div>

        <nav className="sidebar-nav">
          <NavLink
            to="/dashboard"
            className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <span className="nav-icon">▦</span>
            Dashboard
          </NavLink>
          <NavLink
            to="/tasks"
            className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <span className="nav-icon">☑</span>
            My Tasks
          </NavLink>
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-user">
            <div className="avatar">{initials}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="user-name">{user?.name}</div>
              <div className="user-email">{user?.email}</div>
            </div>
          </div>
          <button
            className="sidebar-nav-item"
            onClick={handleLogout}
            style={{ color: 'var(--danger)', marginTop: '0.25rem' }}
          >
            <span className="nav-icon">⎋</span>
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="main-content">
        <header className="header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              className="btn btn-ghost btn-icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{ display: 'none' }}
              id="mobile-menu-btn"
            >
              ≡
            </button>
          </div>
          <div className="header-actions">
            <button
              className="theme-toggle"
              onClick={toggleDarkMode}
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label="Toggle dark mode"
            />
            <div className="avatar avatar-sm">{initials}</div>
          </div>
        </header>

        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
