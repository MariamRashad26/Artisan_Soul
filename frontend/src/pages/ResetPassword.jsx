import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState('idle'); // 'idle' | 'submitting' | 'success' | 'error'
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      setMessage('Password must be at least 6 characters.');
      setStatus('error');
      return;
    }

    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      setStatus('error');
      return;
    }

    setStatus('submitting');
    setMessage('');

    try {
      const { data } = await axiosInstance.post(`/api/auth/reset-password/${token}`, { password });
      setMessage(data.message);
      setStatus('success');
      // Redirect to login after 3 seconds
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Reset failed. The link may have expired.');
      setStatus('error');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fafaf9 0%, #f5f0eb 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Georgia, serif',
      padding: '40px 16px',
    }}>
      <div style={{
        maxWidth: 480,
        width: '100%',
        background: '#fff',
        borderRadius: 24,
        padding: '48px 40px',
        boxShadow: '0 8px 48px rgba(0,0,0,0.10)',
        textAlign: 'center',
      }}>
        {/* Logo */}
        <div style={{
          width: 56, height: 56,
          background: '#BD510D',
          borderRadius: 16,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px',
        }}>
          <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: 28 }}>key</span>
        </div>

        <p style={{ color: '#a8a29e', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>
          Artisan Soul
        </p>

        {status === 'success' ? (
          <>
            <div style={{
              width: 64, height: 64,
              background: 'rgba(34, 197, 94, 0.1)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
            }}>
              <span className="material-symbols-outlined" style={{ color: '#22c55e', fontSize: 32 }}>check_circle</span>
            </div>
            <h2 style={{ color: '#1c1917', fontSize: '1.5rem', fontWeight: 900, marginBottom: 8 }}>Password Reset!</h2>
            <p style={{ color: '#57534e', lineHeight: 1.6, marginBottom: 28, fontSize: '0.95rem' }}>
              {message} You'll be redirected to login shortly.
            </p>
            <Link to="/login" style={{
              display: 'inline-block', padding: '14px 40px',
              background: '#BD510D', color: '#fff', textDecoration: 'none',
              borderRadius: 50, fontWeight: 700, fontSize: '0.85rem',
              letterSpacing: '0.08em', textTransform: 'uppercase',
            }}>
              Go to Login
            </Link>
          </>
        ) : (
          <>
            <h2 style={{ color: '#1c1917', fontSize: '1.6rem', fontWeight: 900, marginBottom: 8 }}>Set New Password</h2>
            <p style={{ color: '#57534e', lineHeight: 1.6, marginBottom: 28, fontSize: '0.95rem' }}>
              Enter a new password for your Artisan Soul account.
            </p>

            {status === 'error' && message && (
              <div style={{
                background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12,
                padding: '12px 16px', marginBottom: 20, color: '#b91c1c', fontSize: '0.88rem',
                display: 'flex', alignItems: 'center', gap: 8, textAlign: 'left',
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>error</span>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
              <div style={{ marginBottom: 16 }}>
                <label style={{
                  display: 'block', marginBottom: 6,
                  fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em',
                  textTransform: 'uppercase', color: '#1c1917',
                }}>
                  New Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{
                      width: '100%', height: 52, padding: '0 48px 0 16px',
                      border: '1.5px solid #e7e5e4', borderRadius: 12,
                      fontSize: '0.95rem', outline: 'none',
                      boxSizing: 'border-box',
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#BD510D'}
                    onBlur={(e) => e.target.style.borderColor = '#e7e5e4'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                      color: '#a8a29e',
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                      {showPassword ? 'visibility' : 'visibility_off'}
                    </span>
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{
                  display: 'block', marginBottom: 6,
                  fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em',
                  textTransform: 'uppercase', color: '#1c1917',
                }}>
                  Confirm Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: '100%', height: 52, padding: '0 16px',
                    border: '1.5px solid #e7e5e4', borderRadius: 12,
                    fontSize: '0.95rem', outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#BD510D'}
                  onBlur={(e) => e.target.style.borderColor = '#e7e5e4'}
                />
              </div>

              <button
                type="submit"
                disabled={status === 'submitting'}
                style={{
                  width: '100%', height: 52,
                  background: status === 'submitting' ? '#d97706' : '#BD510D',
                  color: '#fff', border: 'none', borderRadius: 50,
                  fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.08em',
                  textTransform: 'uppercase', cursor: status === 'submitting' ? 'not-allowed' : 'pointer',
                  transition: 'background 0.2s',
                }}
              >
                {status === 'submitting' ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>

            <div style={{ marginTop: 24 }}>
              <Link
                to="/login"
                style={{
                  color: '#BD510D', textDecoration: 'none', fontWeight: 700,
                  fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: 6,
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_back</span>
                Back to Login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
