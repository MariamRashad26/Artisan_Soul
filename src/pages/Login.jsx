import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    const result = await login(email, password);
    
    if (result.success) {
      if (result.role === 'admin') navigate('/admin');
      else if (result.role === 'artisan') navigate('/artisan');
      else navigate('/user/tracker');
    } else {
      setError(result.message || 'Login failed');
    }
    
    setIsSubmitting(false);
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
          
          {error && (
            <div className="alert alert-danger p-3 mb-4 rounded-xl text-sm d-flex align-items-center gap-2">
              <span className="material-symbols-outlined fs-5">error</span>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="d-flex flex-column gap-4">
            {/* Email Field */}
            <div className="d-flex flex-column gap-2">
              <label className="text-xs fw-bold text-dark text-uppercase tracking-wider opacity-80" htmlFor="email">
                Email Address
              </label>
              <div className="position-relative">
                <input 
                  autoComplete="email" 
                  className="form-control px-4 py-3 rounded-xl border-gray-200 bg-white shadow-sm focus:border-primary transition-all outline-none" 
                  id="email" 
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
              <label className="text-xs fw-bold text-dark text-uppercase tracking-wider opacity-80" htmlFor="password">
                Password
              </label>
              <div className="position-relative">
                <input 
                  autoComplete="current-password" 
                  className="form-control px-4 py-3 rounded-xl border-gray-200 bg-white shadow-sm focus:border-primary transition-all outline-none" 
                  id="password" 
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

            {/* Helpers: Remember me & Forgot Password */}
            <div className="d-flex align-items-center justify-content-between mb-2">
              <div className="d-flex align-items-center">
                <input className="form-check-input h-4 w-4 rounded-full border-gray-300 text-primary cursor-pointer mt-0" id="remember-me" name="remember-me" type="checkbox" style={{ borderRadius: '50%' }}/>
                <label className="ms-2 text-sm font-medium text-secondary opacity-80 cursor-pointer" htmlFor="remember-me">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <Link className="fw-bold transition-colors text-decoration-none" to="#" style={{ color: '#BD510D' }}>
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Login Button */}
            <button 
              className="btn w-100 d-flex justify-content-center align-items-center gap-2 rounded-pill py-3 text-base fw-bold text-white shadow-lg transition-all border-0 shadow-primary-30" 
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

          {/* Social Logins */}
          <div className="mt-5">
            <div className="position-relative d-flex align-items-center justify-content-center">
              <div className="w-100 border-top border-gray-200"></div>
              <span className="position-absolute bg-gray-50 px-4 text-secondary text-xs opacity-50 fw-medium">Or continue with</span>
            </div>
            <div className="mt-4 d-flex gap-3">
              <button className="btn btn-white flex-grow-1 d-flex align-items-center justify-content-center gap-3 rounded-pill py-3 border border-gray-200 shadow-sm hover:bg-gray-50 transition-all text-dark fw-bold">
                <svg className="size-5" viewBox="0 0 24 24"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.908 3.152-1.928 4.176-1.024 1.024-2.612 2.12-5.912 2.12-5.388 0-9.712-4.356-9.712-9.712s4.324-9.712 9.712-9.712c3.024 0 5.272 1.184 6.88 2.704l2.308-2.308c-2.032-1.96-4.712-3.112-9.188-3.112-7.728 0-14 6.272-14 14s6.272 14 14 14c4.148 0 7.28-1.36 9.532-3.708 2.328-2.328 3.072-5.584 3.072-8.188 0-.6-.048-1.18-.14-1.704h-12.432z" fill="currentColor"/></svg>
                Google
              </button>
              <button className="btn btn-white flex-grow-1 d-flex align-items-center justify-content-center gap-3 rounded-pill py-3 border border-gray-200 shadow-sm hover:bg-gray-50 transition-all text-dark fw-bold">
                <svg className="size-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.041-1.61-4.041-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                GitHub
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
