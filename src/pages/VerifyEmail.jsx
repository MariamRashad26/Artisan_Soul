import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verify = async () => {
      try {
        const { data } = await axiosInstance.get(`/api/auth/verify/${token}`);
        setMessage(data.message);
        setStatus('success');
      } catch (err) {
        setMessage(err.response?.data?.message || 'Verification failed. The link may have expired.');
        setStatus('error');
      }
    };
    verify();
  }, [token]);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#fafaf9',
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
        boxShadow: '0 8px 48px rgba(0,0,0,0.08)',
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
          <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: 28 }}>edit_note</span>
        </div>

        <p style={{ color: '#a8a29e', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>
          Artisan Soul
        </p>

        {status === 'loading' && (
          <>
            <div className="spinner-border" style={{ color: '#BD510D', width: 32, height: 32 }} role="status" />
            <p style={{ color: '#57534e', marginTop: 16 }}>Verifying your account…</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div style={{
              width: 64, height: 64,
              background: 'rgba(34,197,94,0.1)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
            }}>
              <span className="material-symbols-outlined" style={{ color: '#22c55e', fontSize: 32 }}>check_circle</span>
            </div>
            <h2 style={{ color: '#1c1917', fontSize: '1.5rem', fontWeight: 900, marginBottom: 8 }}>Email Verified!</h2>
            <p style={{ color: '#57534e', lineHeight: 1.6, marginBottom: 28 }}>{message}</p>
            <Link
              to="/login"
              style={{
                display: 'inline-block',
                padding: '14px 40px',
                background: '#BD510D',
                color: '#fff',
                textDecoration: 'none',
                borderRadius: 50,
                fontWeight: 700,
                fontSize: '0.85rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              Log In to Your Account
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div style={{
              width: 64, height: 64,
              background: 'rgba(239,68,68,0.1)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
            }}>
              <span className="material-symbols-outlined" style={{ color: '#ef4444', fontSize: 32 }}>error</span>
            </div>
            <h2 style={{ color: '#1c1917', fontSize: '1.5rem', fontWeight: 900, marginBottom: 8 }}>Verification Failed</h2>
            <p style={{ color: '#57534e', lineHeight: 1.6, marginBottom: 28 }}>{message}</p>
            <Link
              to="/signup"
              style={{
                display: 'inline-block',
                padding: '14px 40px',
                background: '#1c1917',
                color: '#fff',
                textDecoration: 'none',
                borderRadius: 50,
                fontWeight: 700,
                fontSize: '0.85rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              Register Again
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
