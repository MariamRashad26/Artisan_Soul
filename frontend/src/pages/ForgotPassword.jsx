import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [devResetUrl, setDevResetUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setDevResetUrl('');
    setIsSubmitting(true);

    try {
      const { data } = await axiosInstance.post('/api/auth/forgot-password', { email });
      if (data?.devResetUrl) {
        setDevResetUrl(data.devResetUrl);
      }
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
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
          <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: 28 }}>lock_reset</span>
        </div>

        <p style={{ color: '#a8a29e', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>
          Artisan Soul
        </p>

        {!submitted ? (
          <>
            <h2 style={{ color: '#1c1917', fontSize: '1.6rem', fontWeight: 900, marginBottom: 8 }}>Forgot Password?</h2>
            <p style={{ color: '#57534e', lineHeight: 1.6, marginBottom: 28, fontSize: '0.95rem' }}>
              Enter your registered email address and we'll send you a link to reset your password.
            </p>

            {error && (
              <div style={{
                background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12,
                padding: '12px 16px', marginBottom: 20, color: '#b91c1c', fontSize: '0.88rem',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>error</span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
              <div style={{ marginBottom: 20 }}>
                <label style={{
                  display: 'block', marginBottom: 6,
                  fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em',
                  textTransform: 'uppercase', color: '#1c1917',
                }}>
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  style={{
                    width: '100%', height: 52, padding: '0 16px',
                    border: '1.5px solid #e7e5e4', borderRadius: 12,
                    fontSize: '0.95rem', outline: 'none',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#BD510D'}
                  onBlur={(e) => e.target.style.borderColor = '#e7e5e4'}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: '100%', height: 52,
                  background: isSubmitting ? '#d97706' : '#BD510D',
                  color: '#fff', border: 'none', borderRadius: 50,
                  fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.08em',
                  textTransform: 'uppercase', cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  transition: 'background 0.2s',
                }}
              >
                {isSubmitting ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          </>
        ) : (
          <>
            <div style={{
              width: 64, height: 64,
              background: 'rgba(34, 197, 94, 0.1)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
            }}>
              <span className="material-symbols-outlined" style={{ color: '#22c55e', fontSize: 32 }}>mark_email_read</span>
            </div>
            <h2 style={{ color: '#1c1917', fontSize: '1.5rem', fontWeight: 900, marginBottom: 8 }}>Check your inbox</h2>
            <p style={{ color: '#57534e', lineHeight: 1.6, marginBottom: 28, fontSize: '0.95rem' }}>
              If <strong>{email}</strong> is registered, we've sent a password reset link. Check your spam folder if it doesn't arrive within a few minutes.
            </p>

            {devResetUrl && (
              <div style={{
                background: '#fffbeb',
                border: '1px solid #fcd34d',
                borderRadius: 16,
                padding: '20px',
                marginTop: 20,
                color: '#92400e',
                fontSize: '0.88rem',
                textAlign: 'left'
              }}>
                <p style={{ fontWeight: 900, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>warning</span>
                  Local Dev Mode Bypass
                </p>
                <p style={{ marginBottom: 12, fontSize: '0.8rem', color: '#b45309' }}>
                  Since SMTP email delivery failed locally, you can reset the password directly using this link:
                </p>
                <a 
                  href={devResetUrl}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '12px 16px',
                    background: '#d97706',
                    color: '#fff',
                    textDecoration: 'none',
                    fontWeight: 800,
                    fontSize: '0.8rem',
                    textTransform: 'uppercase',
                    textAlign: 'center',
                    borderRadius: 10,
                    boxSizing: 'border-box'
                  }}
                >
                  Reset Password Directly
                </a>
              </div>
            )}
          </>
        )}

        <div style={{ marginTop: 28, paddingTop: 24, borderTop: '1px solid #f5f5f4' }}>
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
      </div>
    </div>
  );
};

export default ForgotPassword;
