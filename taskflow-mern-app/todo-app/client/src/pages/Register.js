import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.name.trim() || form.name.length < 2) errs.name = 'Name must be at least 2 characters';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Valid email required';
    if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirm) errs.confirm = 'Passwords do not match';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setErrors({ general: err.response?.data?.message || 'Registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const set = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div>
          <div className="auth-brand">
            <div className="auth-brand-mark">✓</div>
            <div className="auth-title">Start for free</div>
            <div className="auth-subtitle">Join thousands already using Taskflow to stay organized.</div>
          </div>
          <div className="auth-features">
            {[
              ['🔒', 'Secure by default', 'JWT authentication & encrypted passwords'],
              ['☁️', 'Cloud synced', 'Access your tasks from anywhere'],
              ['🏷️', 'Tags & categories', 'Organize tasks exactly how you want'],
              ['📅', 'Due date tracking', 'Never miss a deadline again'],
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
          <div className="auth-form-title">Create account</div>
          <div className="auth-form-subtitle">Free forever. No credit card needed.</div>

          {errors.general && (
            <div style={{
              padding: '0.875rem',
              background: 'var(--danger-bg)',
              color: 'var(--danger)',
              borderRadius: 'var(--radius)',
              fontSize: '0.875rem',
              marginBottom: '1rem',
              border: '1px solid var(--danger)',
            }}>
              {errors.general}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="label">Full Name</label>
              <input className="input" type="text" placeholder="Jane Doe" value={form.name} onChange={set('name')} required style={errors.name ? { borderColor: 'var(--danger)' } : {}} />
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label className="label">Email</label>
              <input className="input" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} autoComplete="email" required style={errors.email ? { borderColor: 'var(--danger)' } : {}} />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="label">Password</label>
              <input className="input" type="password" placeholder="Min 6 characters" value={form.password} onChange={set('password')} required style={errors.password ? { borderColor: 'var(--danger)' } : {}} />
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label className="label">Confirm Password</label>
              <input className="input" type="password" placeholder="Repeat password" value={form.confirm} onChange={set('confirm')} required style={errors.confirm ? { borderColor: 'var(--danger)' } : {}} />
              {errors.confirm && <span className="form-error">{errors.confirm}</span>}
            </div>

            <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
              {loading ? <><div className="spinner spinner-sm" /> Creating account...</> : 'Create account →'}
            </button>
          </form>

          <div className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
