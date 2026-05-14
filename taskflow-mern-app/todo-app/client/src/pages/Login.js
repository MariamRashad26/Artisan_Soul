import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div>
          <div className="auth-brand">
            <div className="auth-brand-mark">✓</div>
            <div className="auth-title">Taskflow</div>
            <div className="auth-subtitle">The intelligent task manager for modern teams.</div>
          </div>
          <div className="auth-features">
            {[
              ['⚡', 'Lightning fast', 'Create and manage tasks in seconds'],
              ['🎯', 'Priority-driven', 'Focus on what matters with smart prioritization'],
              ['📊', 'Visual dashboard', 'Track progress with beautiful analytics'],
              ['🌙', 'Dark mode', 'Works beautifully day and night'],
            ].map(([icon, title, desc]) => (
              <div className="auth-feature" key={title}>
                <div className="auth-feature-icon">{icon}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{title}</div>
                  <div style={{ fontSize: '0.82rem' }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-container animate-fade-in">
          <div className="auth-form-title">Welcome back</div>
          <div className="auth-form-subtitle">Sign in to your Taskflow account</div>

          {error && (
            <div style={{
              padding: '0.875rem',
              background: 'var(--danger-bg)',
              color: 'var(--danger)',
              borderRadius: 'var(--radius)',
              fontSize: '0.875rem',
              marginBottom: '1rem',
              border: '1px solid var(--danger)',
            }}>
              {error}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="label">Email</label>
              <input
                className="input"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={set('email')}
                autoComplete="email"
                required
              />
            </div>

            <div className="form-group">
              <label className="label">Password</label>
              <input
                className="input"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={set('password')}
                autoComplete="current-password"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
              {loading ? <><div className="spinner spinner-sm" /> Signing in...</> : 'Sign in →'}
            </button>
          </form>

          <div className="auth-switch">
            Don't have an account? <Link to="/register">Create one free</Link>
          </div>

          {/* Demo credentials */}
          <div style={{
            marginTop: '1.5rem',
            padding: '0.875rem',
            background: 'var(--bg-surface-2)',
            borderRadius: 'var(--radius)',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            border: '1px solid var(--border)',
          }}>
            <strong style={{ color: 'var(--text-secondary)' }}>First time?</strong> Create an account to get started.
          </div>
        </div>
      </div>
    </div>
  );
}
