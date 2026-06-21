
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const result = await register(name, email, password, 'user');

    if (result.success) {
      // Auto-logged in, navigate to user dashboard
      navigate('/user/tracker');
    } else {
      setError(result.message || 'Registration failed');
    }

    setIsSubmitting(false);
  };

  return (
    <div className="d-flex min-vh-100 bg-background-light dark:bg-background-dark font-display text-dark antialiased overflow-x-hidden">
      {/* Image Section (Left) */}
      <div className="d-none d-lg-flex position-relative" style={{ width: '50%' }}>
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
      <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center px-4 py-5 px-sm-5">
        <div className="w-100 max-w-md d-flex flex-column gap-5">
          <div className="d-flex d-lg-none align-items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-primary fs-2">workspace_premium</span>
            <span className="text-dark fs-4 fw-black tracking-tighter uppercase">Artisan Soul</span>
          </div>

          <div className="d-flex flex-column gap-2">
            <h2 className="display-6 fw-black text-dark tracking-tight">Create your account</h2>
            <p className="text-secondary">Join our exclusive circle of artisans and collectors.</p>
          </div>



          {error && (
            <div className="alert alert-danger p-3 mb-2 rounded-xl text-sm d-flex align-items-center gap-2">
              <span className="material-symbols-outlined fs-5">error</span>
              {error}
            </div>
          )}

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
                <label className="text-sm font-bold text-dark ps-1">Phone Number</label>
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

          <div className="text-center mt-2">
            <p className="text-secondary text-sm">
              Already have an account?
              <Link className="text-primary fw-bold ms-1 text-decoration-none" to="/login">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;

