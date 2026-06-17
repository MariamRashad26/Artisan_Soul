import { useState, useEffect } from 'react';
import axios from '../../utils/axiosInstance';

const AdminSettings = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  const [settings, setSettings] = useState({
    admin_name: 'Antonio Rossi',
    admin_email: 'admin@artisansoul.com',
    email_notifications: true
  });

  // Create Staff Account state
  const [staffForm, setStaffForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'artisan',
  });
  const [staffStatus, setStaffStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [staffMessage, setStaffMessage] = useState('');
  const [showStaffPassword, setShowStaffPassword] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await axios.get('/api/settings');
        if (Object.keys(data).length > 0) {
           setSettings(prev => ({
             ...prev,
             ...data,
             email_notifications: data.email_notifications === 'true' || data.email_notifications === true
           }));
           if (data.dark_mode) {
             setIsDarkMode(data.dark_mode === 'true' || data.dark_mode === true);
           }
        }
      } catch (error) {
        console.error('Failed to fetch settings', error);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    try {
      const payload = {
        ...settings,
        dark_mode: isDarkMode
      };
      await axios.put('/api/settings', payload);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings', error);
      alert('Failed to save settings');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  // ─── Create Staff Handler ───────────────────────────────────────────────────
  const handleCreateStaff = async (e) => {
    e.preventDefault();
    setStaffStatus('loading');
    setStaffMessage('');

    try {
      const { data } = await axios.post('/api/auth/create-staff', staffForm);
      setStaffMessage(data.message);
      setStaffStatus('success');
      setStaffForm({ name: '', email: '', password: '', role: 'artisan' });
    } catch (err) {
      setStaffMessage(err.response?.data?.message || 'Failed to create account. Please try again.');
      setStaffStatus('error');
    }
  };

  const handleStaffChange = (e) => {
    setStaffForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    // Reset status on new input
    if (staffStatus !== 'idle') {
      setStaffStatus('idle');
      setStaffMessage('');
    }
  };

  return (
    <div className="p-8 lg:p-12 animate-in fade-in slide-in-from-bottom duration-1000">
      <div className="d-flex align-items-center justify-content-between mb-8">
        <div>
          <h2 className="display-6 fw-black font-serif text-dark tracking-tighter mb-1 lowercase">Settings.</h2>
          <p className="text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-600 mb-0">System Preferences & Configuration</p>
        </div>
        <button onClick={handleSave} className="px-6 py-2.5 rounded-xl bg-primary text-white text-[10px] fw-black text-uppercase tracking-widest hover:-translate-y-0.5 transition duration-500 shadow-[0_4px_20px_rgba(189,81,13,0.3)]">
          Save Changes
        </button>
      </div>

      <div className="row g-6">
        {/* Left Column */}
        <div className="col-lg-8">
          {/* Profile Configuration */}
          <div className="glass-panel p-8 rounded-[2.5rem] border-stone-100 shadow-premium mb-6">
            <h3 className="fs-5 fw-black font-serif text-dark tracking-tight mb-6 lowercase">Profile Configuration</h3>
            
            <form className="space-y-6">
              <div className="row g-4">
                <div className="col-md-6">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Admin Name</label>
                  <input name="admin_name" value={settings.admin_name} onChange={handleChange} type="text" className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark focus:ring-1 focus:ring-dark outline-none transition duration-300" />
                </div>
                <div className="col-md-6">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Role</label>
                  <input type="text" defaultValue="Head Curator" readOnly className="w-100 px-4 py-3 bg-stone-100 border border-stone-200 rounded-xl text-sm fw-medium text-stone-700 outline-none cursor-not-allowed" />
                </div>
                <div className="col-md-12">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Email Address</label>
                  <input name="admin_email" value={settings.admin_email} onChange={handleChange} type="email" className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark focus:ring-1 focus:ring-dark outline-none transition duration-300" />
                </div>
              </div>
            </form>
          </div>

          {/* ─── Create Staff Account Panel ─────────────────────────────────── */}
          <div className="glass-panel p-8 rounded-[2.5rem] border-stone-100 shadow-premium">
            <div className="d-flex align-items-center gap-3 mb-6">
              <div style={{
                width: 40, height: 40,
                background: 'linear-gradient(135deg, #BD510D, #d97706)',
                borderRadius: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: 20 }}>manage_accounts</span>
              </div>
              <div>
                <h3 className="fs-5 fw-black font-serif text-dark tracking-tight mb-0 lowercase">Create Staff Account</h3>
                <p className="text-[10px] text-stone-500 mb-0">Add admin or artisan accounts — pre-verified, no email required</p>
              </div>
            </div>

            {/* Status messages */}
            {staffStatus === 'success' && (
              <div style={{
                background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12,
                padding: '12px 16px', marginBottom: 20,
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <span className="material-symbols-outlined" style={{ color: '#16a34a', fontSize: 20 }}>check_circle</span>
                <span style={{ color: '#15803d', fontWeight: 600, fontSize: '0.88rem' }}>{staffMessage}</span>
              </div>
            )}
            {staffStatus === 'error' && (
              <div style={{
                background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12,
                padding: '12px 16px', marginBottom: 20,
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <span className="material-symbols-outlined" style={{ color: '#dc2626', fontSize: 20 }}>error</span>
                <span style={{ color: '#b91c1c', fontWeight: 600, fontSize: '0.88rem' }}>{staffMessage}</span>
              </div>
            )}

            <form onSubmit={handleCreateStaff}>
              <div className="row g-4">
                <div className="col-md-6">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Full Name</label>
                  <input
                    name="name"
                    value={staffForm.name}
                    onChange={handleStaffChange}
                    type="text"
                    required
                    placeholder="e.g. Master Ali"
                    className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark outline-none transition duration-300"
                    style={{ height: 48 }}
                  />
                </div>
                <div className="col-md-6">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Role</label>
                  <select
                    name="role"
                    value={staffForm.role}
                    onChange={handleStaffChange}
                    className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark outline-none transition duration-300"
                    style={{ height: 48 }}
                  >
                    <option value="artisan">Artisan</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="col-md-12">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Email Address</label>
                  <input
                    name="email"
                    value={staffForm.email}
                    onChange={handleStaffChange}
                    type="email"
                    required
                    placeholder="staff@artisansoul.com"
                    className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark outline-none transition duration-300"
                    style={{ height: 48 }}
                  />
                </div>
                <div className="col-md-12">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      name="password"
                      value={staffForm.password}
                      onChange={handleStaffChange}
                      type={showStaffPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      placeholder="Min. 6 characters"
                      className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark outline-none transition duration-300"
                      style={{ height: 48, paddingRight: 44 }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowStaffPassword(p => !p)}
                      style={{
                        position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                        background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#a8a29e',
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                        {showStaffPassword ? 'visibility' : 'visibility_off'}
                      </span>
                    </button>
                  </div>
                </div>
                <div className="col-md-12">
                  <button
                    type="submit"
                    disabled={staffStatus === 'loading'}
                    className="btn w-100 fw-black text-uppercase text-white border-0"
                    style={{
                      background: staffStatus === 'loading'
                        ? '#d97706'
                        : 'linear-gradient(135deg, #BD510D, #d97706)',
                      borderRadius: 50,
                      height: 48,
                      letterSpacing: '0.1em',
                      fontSize: '0.78rem',
                      cursor: staffStatus === 'loading' ? 'not-allowed' : 'pointer',
                      boxShadow: '0 4px 16px rgba(189,81,13,0.3)',
                    }}
                  >
                    {staffStatus === 'loading' ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined me-2" style={{ fontSize: 16, verticalAlign: 'middle' }}>person_add</span>
                        Create {staffForm.role === 'admin' ? 'Admin' : 'Artisan'} Account
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>

            {/* Info box */}
            <div style={{
              marginTop: 20,
              padding: '12px 16px',
              background: '#fefce8',
              borderRadius: 12,
              border: '1px solid #fef08a',
              fontSize: '0.8rem',
              color: '#713f12',
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 16, verticalAlign: 'middle', marginRight: 6 }}>info</span>
              Staff accounts are <strong>pre-verified</strong> — they can log in immediately at <code>/login</code> without email confirmation.
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-lg-4">
          <div className="d-flex flex-column gap-6 h-100">
            <div className="glass-panel p-8 rounded-[2.5rem] border-stone-100 shadow-premium">
              <h3 className="fs-5 fw-black font-serif text-dark tracking-tight mb-6 lowercase">Preferences</h3>
              
              <div className="d-flex flex-column gap-4">
                <div className="d-flex align-items-center justify-content-between p-4 border border-stone-100 rounded-xl">
                  <div>
                    <h4 className="text-xs fw-black text-dark mb-1">Email Notifications</h4>
                    <p className="text-[10px] text-stone-600 mb-0">Receive daily operation summaries</p>
                  </div>
                  <div className="form-check form-switch fs-5 mb-0">
                    <input 
                      name="email_notifications"
                      checked={settings.email_notifications}
                      onChange={handleChange}
                      className="form-check-input focus:ring-0 cursor-pointer" 
                      type="checkbox" 
                      role="switch" 
                    />
                  </div>
                </div>
                
                <div className="d-flex align-items-center justify-content-between p-4 border border-stone-100 rounded-xl">
                  <div>
                    <h4 className="text-xs fw-black text-dark mb-1">Dark Mode</h4>
                    <p className="text-[10px] text-stone-600 mb-0">Toggle system dark theme</p>
                  </div>
                  <div className="form-check form-switch fs-5 mb-0">
                    <input 
                      className="form-check-input focus:ring-0 cursor-pointer" 
                      type="checkbox" 
                      role="switch" 
                      checked={isDarkMode}
                      onChange={toggleDarkMode}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Login Credentials Card */}
            <div className="glass-panel p-6 rounded-[2rem] border-stone-100 shadow-premium">
              <div className="d-flex align-items-center gap-2 mb-4">
                <span className="material-symbols-outlined" style={{ color: '#BD510D', fontSize: 20 }}>key</span>
                <h4 className="text-xs fw-black text-uppercase tracking-widest text-dark mb-0">Default Login Credentials</h4>
              </div>
              <div style={{ fontSize: '0.78rem', color: '#57534e', lineHeight: 1.8 }}>
                <div style={{ padding: '8px 12px', background: '#fafaf9', borderRadius: 8, marginBottom: 8 }}>
                  <div style={{ fontWeight: 700, color: '#1c1917', marginBottom: 2 }}>👑 Admin</div>
                  <div>admin@artisansoul.com</div>
                  <div style={{ color: '#a8a29e', fontSize: '0.72rem' }}>Run: node backend/seedUsers.js</div>
                </div>
                <div style={{ padding: '8px 12px', background: '#fafaf9', borderRadius: 8 }}>
                  <div style={{ fontWeight: 700, color: '#1c1917', marginBottom: 2 }}>🔨 Artisan</div>
                  <div>artisan@artisansoul.com</div>
                  <div style={{ color: '#a8a29e', fontSize: '0.72rem' }}>Run: node backend/seedUsers.js</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
