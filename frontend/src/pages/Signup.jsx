import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../utils/axiosInstance';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [resendStatus, setResendStatus] = useState('idle');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [devVerifyUrl, setDevVerifyUrl] = useState('');
  const navigate = useNavigate();
  const { register, user } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') navigate('/admin', { replace: true });
      else if (user.role === 'artisan') navigate('/artisan', { replace: true });
      else navigate('/user/tracker', { replace: true });
    }
  }, [user, navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setDevVerifyUrl('');
    setIsSubmitting(true);

    const result = await register(name, email, password);

    if (result.success) {
      setRegisteredEmail(email);
      if (result.autoLoggedIn) {
        setSuccessMessage('Welcome to Artisan Soul! Redirecting...');
      } else {
        setSuccessMessage(result.message || 'Registration successful!');
        if (result.devVerifyUrl) {
          setDevVerifyUrl(result.devVerifyUrl);
        }
      }
    } else {
      setError(result.message || 'Registration failed');
    }

    setIsSubmitting(false);
  };

  const handleResend = async () => {
    setResendStatus('sending');
    try {
      const { data } = await axiosInstance.post('/api/auth/resend-verification', { 
        email: registeredEmail || email 
      });
      if (data?.devVerifyUrl) {
        setDevVerifyUrl(data.devVerifyUrl);
      }
      setResendStatus('sent');
    } catch (err) {
      setResendStatus('error');
    }
  };

  return (
    <div className="d-flex min-vh-100 bg-background-light dark:bg-background-dark font-display text-dark antialiased overflow-x-hidden">
      {/* Image Section (Left) */}
      <div className="d-none d-lg-flex w-50 position-relative">
        <div className="position-absolute inset-0 bg-primary opacity-20 mix-blend-multiply z-10"></div>
        <div className="position-absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-transparent z-20"></div>
        <div 
          className="w-100 h-100 bg-center bg-no-repeat bg-cover" 
          style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAz2YGQEgO_6HPiYTqbBVuIvBUeoHW8ifaTT36H---xWE_-gLrtD2D6_oDGjT1l53zn6wr4uiigtvDLEpqUf8ZC-m-i6VoeRo1viSuOXmFfpwO-4cweao5eMN_RpmG_Kq37X_1HvtawnO227y-DEd149CdP2GQ5pXSAWumLGig8sIsrLhc7gAjrwMSPaHxy-0d4XJ62V0JKxqvDZSLabhnQC81YLjhub8VMTJMfcbodhGMxkHO2zaOb4io_i0vT7opPrJDkmJ6BI8JS')" }}
        ></div>
        <div className="position-absolute bottom-5 start-5 z-30 max-w-md p-5">
          <div className="d-flex align-items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-white fs-1">workspace_premium</span>
            <span className="text-white fs-3 fw-black tracking-tighter">ARTISAN SOUL</span>
          </div>
          <h1 className="text-white display-5 fw-black leading-tight tracking-tight mb-4">The craft of luxury, curated for you.</h1>
          <p className="text-white opacity-80 fs-5 leading-relaxed">Join a community dedicated to timeless craftsmanship and the soul of hand-finished excellence.</p>
        </div>
      </div>

      {/* Form Section (Right) */}
      <div className="w-100 w-lg-50 d-flex flex-column justify-content-center align-items-center px-4 py-5 px-sm-5 px-lg-24">
        <div className="w-100 max-w-md d-flex flex-column gap-5">
          {/* Mobile Header */}
          <div className="d-flex d-lg-none align-items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-primary fs-2">workspace_premium</span>
            <span className="text-dark fs-4 fw-black tracking-tighter uppercase">Artisan Soul</span>
          </div>

          <div className="d-flex flex-column gap-2">
            <h2 className="display-6 fw-black text-dark tracking-tight">Create your account</h2>
            <p className="text-secondary">Join our exclusive circle of artisans and collectors.</p>
          </div>

          {error && (
            <div className="alert alert-danger p-3 rounded-xl text-sm d-flex align-items-center gap-2">
              <span className="material-symbols-outlined fs-5">error</span>
              {error}
            </div>
          )}

          {successMessage && (
            <div className="alert alert-success p-4 rounded-xl d-flex align-items-start gap-3">
              <span className="material-symbols-outlined fs-5 mt-1" style={{ color: '#16a34a' }}>mark_email_read</span>
              <div style={{ flex: 1 }}>
                <p className="fw-bold mb-1" style={{ color: '#15803d' }}>Account Created!</p>
                <p className="text-sm mb-3" style={{ color: '#166534' }}>{successMessage}</p>
                 {/* Resend option if email might not have arrived */}
                <div style={{ borderTop: '1px solid #bbf7d0', paddingTop: 12 }}>
                  {resendStatus === 'sent' ? (
                    <span style={{ color: '#15803d', fontSize: '0.83rem', fontWeight: 600 }}>
                      ✓ New verification email sent!
                    </span>
                  ) : resendStatus === 'error' ? (
                    <span style={{ color: '#b45309', fontSize: '0.83rem' }}>
                      Could not resend. Check your email address is correct.
                    </span>
                  ) : (
                    <div>
                      <p className="text-sm mb-2" style={{ color: '#166534', fontSize: '0.82rem' }}>
                        Didn't receive the email? Check spam, or resend:
                      </p>
                      <button
                        type="button"
                        onClick={handleResend}
                        disabled={resendStatus === 'sending'}
                        className="btn btn-sm border-0 text-white"
                        style={{
                          background: '#16a34a', borderRadius: 20,
                          fontSize: '0.78rem', fontWeight: 700,
                          padding: '4px 16px',
                        }}
                      >
                        {resendStatus === 'sending' ? 'Sending...' : '→ Resend Verification Email'}
                      </button>
                    </div>
                  )}

                  {devVerifyUrl && (
                    <div style={{
                      background: '#fffbeb',
                      border: '1px solid #fcd34d',
                      borderRadius: 12,
                      padding: '16px',
                      marginTop: 16,
                      color: '#92400e',
                      fontSize: '0.82rem',
                      textAlign: 'left'
                    }}>
                      <p style={{ fontWeight: 900, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>warning</span>
                        Local Dev Mode Bypass
                      </p>
                      <p style={{ marginBottom: 10, fontSize: '0.78rem', color: '#b45309' }}>
                        Since SMTP email delivery failed locally, you can verify this account directly using this link:
                      </p>
                      <a 
                        href={devVerifyUrl}
                        style={{
                          display: 'block',
                          width: '100%',
                          padding: '10px 12px',
                          background: '#d97706',
                          color: '#fff',
                          textDecoration: 'none',
                          fontWeight: 800,
                          fontSize: '0.78rem',
                          textTransform: 'uppercase',
                          textAlign: 'center',
                          borderRadius: 8,
                          boxSizing: 'border-box'
                        }}
                      >
                        Verify Account Directly
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {!successMessage && (
            <form onSubmit={handleRegister} className="d-flex flex-column gap-4">
              <div className="d-flex flex-column gap-2">
                <label className="text-sm font-bold text-dark ps-1">Full Name</label>
                <input 
                  className="form-control px-4 py-4 bg-white border border-primary-20 rounded-xl outline-none transition-all placeholder:text-muted" 
                  placeholder="John Doe" 
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="d-flex flex-column gap-2">
                <label className="text-sm font-bold text-dark ps-1">Email Address</label>
                <input 
                  className="form-control px-4 py-4 bg-white border border-primary-20 rounded-xl outline-none transition-all placeholder:text-muted" 
                  placeholder="email@example.com" 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="d-flex flex-column gap-2">
                <label className="text-sm font-bold text-dark ps-1">Phone Number <span className="text-muted fw-normal">(optional)</span></label>
                <input 
                  className="form-control px-4 py-4 bg-white border border-primary-20 rounded-xl outline-none transition-all placeholder:text-muted" 
                  placeholder="+92 300 0000000" 
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="d-flex flex-column gap-2">
                <label className="text-sm font-bold text-dark ps-1">Password</label>
                <input 
                  className="form-control px-4 py-4 bg-white border border-primary-20 rounded-xl outline-none transition-all placeholder:text-muted" 
                  placeholder="••••••••" 
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button 
                disabled={isSubmitting} 
                className="mt-4 btn btn-primary py-4 rounded-xl fw-bold fs-6 shadow-lg d-flex align-items-center justify-content-center gap-2 border-0" 
                type="submit"
              >
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
                {!isSubmitting && <span className="material-symbols-outlined fs-5">arrow_forward</span>}
              </button>
            </form>
          )}

          <div className="text-center mt-2">
            <p className="text-secondary text-sm">
              Already have an account? 
              <Link className="text-primary fw-bold hover:text-decoration-underline ms-1 text-decoration-none" to="/login">Login</Link>
            </p>
          </div>

          {/* Legal */}
          <p className="text-xs text-center text-muted mt-2 leading-relaxed px-4 opacity-60">
            By joining, you agree to Artisan Soul's 
            <Link className="text-decoration-underline ms-1 text-muted" to="#">Terms of Service</Link> and 
            <Link className="text-decoration-underline ms-1 text-muted" to="#">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
