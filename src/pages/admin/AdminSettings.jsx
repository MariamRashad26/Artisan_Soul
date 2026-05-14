import { useState, useEffect } from 'react';

const AdminSettings = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  return (
    <div className="p-8 lg:p-12 animate-in fade-in slide-in-from-bottom duration-1000">
      <div className="d-flex align-items-center justify-content-between mb-8">
        <div>
          <h2 className="display-6 fw-black font-serif text-dark tracking-tighter mb-1 lowercase">Settings.</h2>
          <p className="text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-600 mb-0">System Preferences & Configuration</p>
        </div>
        <button className="px-6 py-2.5 rounded-xl bg-primary text-white text-[10px] fw-black text-uppercase tracking-widest hover:-translate-y-0.5 transition duration-500 shadow-[0_4px_20px_rgba(189,81,13,0.3)]">
          Save Changes
        </button>
      </div>

      <div className="row g-6">
        <div className="col-lg-8">
          <div className="glass-panel p-8 rounded-[2.5rem] border-stone-100 shadow-premium">
            <h3 className="fs-5 fw-black font-serif text-dark tracking-tight mb-6 lowercase">Profile Configuration</h3>
            
            <form className="space-y-6">
              <div className="row g-4">
                <div className="col-md-6">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Admin Initial</label>
                  <input type="text" defaultValue="Antonio Rossi" className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark focus:ring-1 focus:ring-dark outline-none transition duration-300" />
                </div>
                <div className="col-md-6">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Role</label>
                  <input type="text" defaultValue="Head Curator" readOnly className="w-100 px-4 py-3 bg-stone-100 border border-stone-200 rounded-xl text-sm fw-medium text-stone-700 outline-none cursor-not-allowed" />
                </div>
                <div className="col-md-12">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Email Address</label>
                  <input type="email" defaultValue="admin@artisansoul.com" className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark focus:ring-1 focus:ring-dark outline-none transition duration-300" />
                </div>
              </div>
            </form>
          </div>
        </div>

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
                    <input className="form-check-input focus:ring-0 cursor-pointer" type="checkbox" role="switch" id="emailNotifs" defaultChecked />
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
                      id="darkMode" 
                      checked={isDarkMode}
                      onChange={toggleDarkMode}
                    />
                  </div>
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
