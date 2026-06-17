import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute — guards routes by role.
 * Props:
 *   allowedRole: 'admin' | 'artisan' | 'user' — required role
 *   children: component to render if access granted
 */
const ProtectedRoute = ({ allowedRole, children }) => {
  const { user, token, loading } = useAuth();

  // Still loading auth state — render nothing (avoids flash redirect)
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner-border" style={{ color: '#BD510D' }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  // Not logged in → go to login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Wrong role → redirect to correct dashboard
  if (user.role !== allowedRole) {
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    if (user.role === 'artisan') return <Navigate to="/artisan" replace />;
    return <Navigate to="/user/tracker" replace />;
  }

  return children;
};

export default ProtectedRoute;
