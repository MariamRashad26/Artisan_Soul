import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../utils/axiosInstance';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resendStatus, setResendStatus] = useState('idle'); // 'idle' | 'sending' | 'sent'
  const [error, setError] = useState('');
  const [isEmailUnverified, setIsEmailUnverified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login, user } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') navigate('/admin', { replace: true });
      else if (user.role === 'artisan') navigate('/artisan', { replace: true });
      else navigate('/user/tracker', { replace: true });
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsEmailUnverified(false);
    setResendStatus('idle');
    setIsSubmitting(true);
    
    const result = await login(email, password);
    
    if (result.success) {
      if (result.role === 'admin') navigate('/admin');
      else if (result.role === 'artisan') navigate('/artisan');
      else navigate('/user/tracker');
    } else {
      setError(result.message || 'Login failed');
      // Detect unverified email error
      if (result.message && result.message.toLowerCase().includes('verify')) {
        setIsEmailUnverified(true);
      }
    }
    
    setIsSubmitting(false);
  };

  const handleResendVerification = async () => {
    if (!email) {
      setError('Please enter your email address above first.');
      return;
    }
    setResendStatus('sending');
    try {
      await axiosInstance.post('/api/auth/resend-verification', { email });
      setResendStatus('sent');
    } catch {
      setResendStatus('idle');
      setError('Failed to resend. Please try again.');
    }
  };

  return (
    <div className="d-flex min-vh-100 bg-white font-display antialiased">
      {/* Left Side: Atmospheric Image Section */}
      <div className="d-none d-lg-flex w-50 position-relative overflow-hidden">
        <div className="position-absolute inset-0 z-10 bg-gradient-to-t from-dark/70 via-transparent to-transparent"></div>
        <div 
          className="position-absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDoFpqpLv9vM0LzBZ4x3WQA9qweuwFdj3h96GZ3Cp9yguQUmbw29sKxBdL74HseSohYkmmndlb172ggY98e4rhaT0afPGfjsGxbuNSM6ipxrgIkDjP8vOYsKb9JEeVeQL86_34WuGbPfnhaM8N-peMt45L54ZWgqLmFUyBJjyAx4WHoZYV5Q5k89cKxfSAUij3kMFB2Ckauhd7xOSwoBxgM6okohsNk9JCO3vUjyqQWCCI1XpC009sDc3gw7cq90rGzmzHjlJtDZO-P')" }}
        ></div>
        <div className="position-relative z-20 d-flex flex-column justify-content-end p-5 text-white h-100 pb-24">
          <div className="max-w-md">
            <h1 className="display-4 fw-black leading-tight mb-4 tracking-tight" style={{ fontSize: '3.5rem' }}>Mastering the Art of Living.</h1>
            <p className="fs-5 text-light opacity-80 mb-0">Connect with fellow artisans and discover the soul behind every stitch, cut, and creation.</p>
          </div>
        </div>
      </div>

      {/* Right Side: Login Form Section */}
      <div className="d-flex flex-column w-100 w-lg-50 justify-content-center align-items-center bg-gray-50 px-4 py-5 px-lg-0">
        <div className="w-100" style={{ maxWidth: '440px' }}>
          {/* Branding */}
          <div className="d-flex align-items-center gap-3 mb-5">
            <div className="p-2 rounded-lg" style={{ backgroundColor: '#BD510D', color: 'white' }}>
              <span className="material-symbols-outlined fs-2 d-block">edit_note</span>
            </div>
            <h2 className="fs-4 fw-black text-dark tracking-tighter mb-0">Artisan Soul</h2>
          </div>

          <div className="mb-4">
            <h3 className="display-6 fw-black text-dark tracking-tight mb-2" style={{ fontWeight: 900 }}>Welcome Back</h3>
            <p className="text-secondary opacity-70">Please enter your details to access your studio.</p>
          </div>
          
          {/* Error Alert — with smart Resend button for unverified accounts */}
          {error && (
            <div className="alert alert-danger p-3 mb-4 rounded-xl text-sm" style={{ borderRadius: 12 }}>
              <div className="d-flex align-items-start gap-2">
                <span className="material-symbols-outlined fs-5 mt-1">error</span>
                <div>
                  <div>{error}</div>
                  {isEmailUnverified && (
                    <div className="mt-2">
                      {resendStatus === 'sent' ? (
                        <span style={{ color: '#15803d', fontWeight: 600, fontSize: '0.85rem' }}>
                          ✓ Verification email sent! Check your inbox.
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={handleResendVerification}
                          disabled={resendStatus === 'sending'}
                          className="btn btn-sm border-0 p-0 text-decoration-underline"
                          style={{ color: '#7f1d1d', fontSize: '0.85rem', fontWeight: 600 }}
                        >
                          {resendStatus === 'sending' ? 'Sending...' : '→ Resend verification email'}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} className="d-flex flex-column gap-4">
            {/* Email Field */}
            <div className="d-flex flex-column gap-2">
              <label className="text-xs fw-bold text-dark text-uppercase tracking-wider opacity-80" htmlFor="login-email">
                Email Address
              </label>
              <div className="position-relative">
                <input 
                  autoComplete="email" 
                  className="form-control px-4 py-3 rounded-xl border-gray-200 bg-white shadow-sm focus:border-primary transition-all outline-none" 
                  id="login-email" 
                  name="email" 
                  placeholder="artisan@example.com" 
                  required 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ height: '56px' }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="d-flex flex-column gap-2">
              <label className="text-xs fw-bold text-dark text-uppercase tracking-wider opacity-80" htmlFor="login-password">
                Password
              </label>
              <div className="position-relative">
                <input 
                  autoComplete="current-password" 
                  className="form-control px-4 py-3 rounded-xl border-gray-200 bg-white shadow-sm focus:border-primary transition-all outline-none" 
                  id="login-password" 
                  name="password" 
                  placeholder="••••••••" 
                  required 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ height: '56px' }}
                />
                <button 
                  className="position-absolute end-0 top-0 bottom-0 pe-4 d-flex align-items-center text-secondary hover:text-primary transition-colors border-0 bg-transparent opacity-40" 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined fs-5">
                    {showPassword ? 'visibility' : 'visibility_off'}
                  </span>
                </button>
              </div>
            </div>

            {/* Forgot Password — now links to the real page */}
            <div className="d-flex align-items-center justify-content-end">
              <div className="text-sm">
                <Link className="fw-bold transition-colors text-decoration-none" to="/forgot-password" style={{ color: '#BD510D' }}>
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Login Button */}
            <button 
              className="btn w-100 d-flex justify-content-center align-items-center gap-2 rounded-pill py-3 text-base fw-bold text-white shadow-lg transition-all border-0" 
              type="submit"
              disabled={isSubmitting}
              style={{ backgroundColor: '#BD510D', height: '56px' }}
            >
              {isSubmitting ? 'Logging in...' : 'Log In to Your Account'}
              {!isSubmitting && <span className="material-symbols-outlined fs-5">arrow_forward</span>}
            </button>
          </form>

          {/* Footer Sign Up Link */}
          <p className="mt-5 text-center text-sm text-secondary opacity-60">
            Not a member of the guild?
            <Link className="fw-bold ms-1 text-decoration-none" to="/signup" style={{ color: '#BD510D' }}>
              Request an Invite
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
