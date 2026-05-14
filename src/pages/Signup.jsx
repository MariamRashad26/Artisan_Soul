import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    // Allow user to select role
    const result = await register(name, email, password, role);
    
    if (result.success) {
      if (role === 'admin') navigate('/admin');
      else if (role === 'artisan') navigate('/artisan');
      else navigate('/user/tracker');
    } else {
      setError(result.message || 'Registration failed');
    }
    
    setIsSubmitting(false);
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
            <div className="alert alert-danger p-3 mb-4 rounded-xl text-sm d-flex align-items-center gap-2">
              <span className="material-symbols-outlined fs-5">error</span>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleRegister} className="d-flex flex-column gap-4">
            <div className="d-flex flex-column gap-2">
              <label className="text-sm font-bold text-dark ps-1">Full Name</label>
              <div className="position-relative group">
                <input 
                  className="form-control px-4 py-4 bg-white border border-primary-20 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-muted" 
                  placeholder="John Doe" 
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="d-flex flex-column gap-2">
              <label className="text-sm font-bold text-dark ps-1">Email Address</label>
              <div className="position-relative group">
                <input 
                  className="form-control px-4 py-4 bg-white border border-primary-20 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-muted" 
                  placeholder="email@example.com" 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="d-flex flex-column gap-2">
              <label className="text-sm font-bold text-dark ps-1">Phone Number</label>
              <div className="position-relative group">
                <input 
                  className="form-control px-4 py-4 bg-white border border-primary-20 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-muted" 
                  placeholder="+1 (555) 000-0000" 
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="d-flex flex-column gap-2">
              <label className="text-sm font-bold text-dark ps-1">Password</label>
              <div className="position-relative group">
                <input 
                  className="form-control px-4 py-4 bg-white border border-primary-20 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-muted" 
                  placeholder="••••••••" 
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="d-flex flex-column gap-2">
              <label className="text-sm font-bold text-dark ps-1">Account Type</label>
              <div className="position-relative group">
                <select 
                  className="form-select px-4 py-4 bg-white border border-primary-20 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-dark" 
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="user">Customer</option>
                  <option value="artisan">Artisan</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            </div>

            <button disabled={isSubmitting} className="mt-4 btn btn-primary py-4 rounded-xl fw-bold fs-6 shadow-lg shadow-primary-20 d-flex align-items-center justify-content-center gap-2 hover-scale transition-all border-0" type="submit">
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
              {!isSubmitting && <span className="material-symbols-outlined fs-5">arrow_forward</span>}
            </button>
          </form>

          <div className="position-relative d-flex align-items-center justify-content-center">
            <div className="w-100 border-top border-primary-10"></div>
            <span className="position-absolute bg-background-light px-4 text-secondary text-xs fw-bold text-uppercase tracking-widest">or continue with</span>
          </div>

          {/* Social Logins */}
          <div className="row g-3">
            <div className="col-6">
              <button className="btn btn-outline-light w-100 d-flex align-items-center justify-content-center gap-2 py-3 rounded-xl border-primary-10 hover:bg-primary-5 transition-all text-dark fw-bold">
                <svg className="size-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 1.2-4.53z" fill="#EA4335"></path>
                </svg>
                <span className="text-sm">Google</span>
              </button>
            </div>
            <div className="col-6">
              <button className="btn btn-outline-light w-100 d-flex align-items-center justify-content-center gap-2 py-3 rounded-xl border-primary-10 hover:bg-primary-5 transition-all text-dark fw-bold">
                <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.05 20.28c-.98.95-2.05 1.79-3.23 1.79-1.15 0-1.52-.73-2.92-.73-1.4 0-1.8.72-2.92.73-1.14 0-2.31-.92-3.3-2.32C2.65 16.89 1.13 12.33 3.12 8.89c.99-1.71 2.76-2.78 4.67-2.81 1.45-.02 2.81.98 3.7.98.88 0 2.53-1.2 4.26-1.03.72.03 2.75.29 4.05 2.19-.11.06-2.42 1.41-2.4 4.14.02 3.28 2.87 4.43 2.9 4.45-.02.07-.46 1.58-1.5 3.03l-.75 1.41zM14.18 4.77c.78-.94 1.29-2.25 1.15-3.56-1.12.05-2.48.75-3.28 1.69-.73.83-1.37 2.18-1.2 3.45 1.26.1 2.54-.64 3.33-1.58z"></path>
                </svg>
                <span className="text-sm">Apple</span>
              </button>
            </div>
          </div>

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
