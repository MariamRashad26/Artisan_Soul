import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AdminArtisans = () => {
  const [artisans, setArtisans] = useState([]);
  const [isOnboardModalOpen, setIsOnboardModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedArtisan, setSelectedArtisan] = useState(null);

  useEffect(() => {
    const fetchArtisans = async () => {
      try {
        const { data } = await axios.get('/api/auth/users');
        const artisanUsers = data.filter(u => u.role === 'artisan').map(u => ({
          id: u._id,
          name: u.name,
          role: 'Artisan',
          status: 'Available',
          load: Math.floor(Math.random() * 100), // Random for now
          rating: 4.8,
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80'
        }));
        setArtisans(artisanUsers);
      } catch (err) {
        console.error('Failed to fetch artisans', err);
      }
    };
    fetchArtisans();
  }, []);

  const handleOnboardSubmit = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const role = e.target.role.value;
    
    try {
      const { data } = await axios.post('/api/auth/register', {
        name,
        email: `${name.replace(/\s+/g, '').toLowerCase()}@artisansoul.com`,
        password: 'password123',
        role: 'artisan'
      });
      
      const newArtisan = {
        id: data._id,
        name: data.name,
        role: role,
        status: 'Available',
        load: 0,
        rating: 5.0,
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80'
      };
      setArtisans([newArtisan, ...artisans]);
      setIsOnboardModalOpen(false);
    } catch (err) {
      console.error('Failed to register artisan', err);
      alert('Failed to register artisan');
    }
  };

  return (
    <div className="p-8 lg:p-12 animate-in fade-in duration-1000">
      <section className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-6 mb-12">
        <div>
          <nav className="d-flex align-items-center gap-3 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700 mb-4">
            <Link to="/admin" className="hover:text-dark transition">Operations</Link>
            <span className="material-symbols-outlined fs-6 text-stone-200">chevron_right</span>
            <span className="text-primary">Artizan Collective</span>
          </nav>
          <h1 className="display-4 fw-black font-serif text-dark tracking-tighter mb-0 lowercase">Artisan.Collective</h1>
        </div>
        
        <div className="d-flex gap-4">
          <button onClick={() => setIsOnboardModalOpen(true)} className="px-8 py-3.5 rounded-2xl bg-white border border-stone-100 text-[10px] fw-black text-uppercase tracking-widest text-dark hover:bg-stone-50 transition duration-500 shadow-sm d-flex align-items-center gap-3">
            <span className="material-symbols-outlined fs-5">group_add</span>
            Onboard Master
          </button>
          <button onClick={() => setIsScheduleModalOpen(true)} className="px-8 py-3.5 rounded-2xl bg-dark text-white text-[10px] fw-black text-uppercase tracking-widest shadow-2xl hover:-translate-y-1 transition duration-500 d-flex align-items-center gap-3">
            <span className="material-symbols-outlined fs-5">calendar_month</span>
            Global Schedule
          </button>
        </div>
      </section>

      <div className="row g-8 mb-12">
        {artisans.map((artisan, i) => (
          <div key={i} className="col-lg-3 col-md-6">
            <div className="glass-panel p-6 rounded-[2.5rem] border-stone-100 shadow-premium group hover:border-dark transition-all duration-700 h-100">
              <div className="relative mb-6">
                <div className="aspect-square rounded-[2rem] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700 shadow-xl border-4 border-white">
                  <img src={artisan.image} className="w-100 h-100 object-cover" alt={artisan.name} />
                </div>
                <div className={`absolute bottom-4 right-4 px-3 py-1 rounded-full text-[8px] fw-black text-uppercase tracking-widest border border-white shadow-lg ${artisan.status === 'Available' ? 'bg-emerald-500 text-white' : 'bg-primary text-white'}`}>
                  {artisan.status}
                </div>
              </div>
              
              <div className="d-flex flex-column gap-1 mb-6">
                <h3 className="text-xl fw-black text-dark tracking-tight mb-0">{artisan.name}</h3>
                <span className="text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-600">{artisan.role}</span>
              </div>

              <div className="space-y-4 pt-6 border-top border-stone-50">
                <div>
                   <div className="d-flex justify-content-between text-[9px] fw-black text-uppercase tracking-widest text-stone-700 mb-2">
                      <span>Task Load</span>
                      <span>{artisan.load}%</span>
                   </div>
                   <div className="h-1 bg-stone-100 rounded-full overflow-hidden">
                      <div className={`h-100 rounded-full transition-all duration-1000 ${artisan.load > 80 ? 'bg-rose-500' : 'bg-primary'}`} style={{ width: `${artisan.load}%` }}></div>
                   </div>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                   <div className="d-flex align-items-center gap-1">
                      <span className="material-symbols-outlined text-amber-500 fs-6">star</span>
                      <span className="text-xs fw-black text-dark">{artisan.rating}</span>
                   </div>
                   <button onClick={() => setSelectedArtisan(artisan)} className="bg-transparent border-0 text-[9px] fw-black text-uppercase tracking-widest text-primary hover:text-dark transition">View Performance</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <section className="glass-panel p-10 rounded-[3rem] border-stone-100 shadow-premium">
        <h3 className="text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700 mb-8">Operational.Intelligence</h3>
        <div className="row g-8">
           {[
             { label: 'Avg Cycle Time', value: '12.4', unit: 'Days', detail: '0.8d optimization' },
             { label: 'Collective Yield', value: '98.2', unit: '%', detail: 'High consistency' },
             { label: 'Active Tasks', value: '34', unit: 'Builds', detail: 'Peak capacity' }
           ].map((stat, i) => (
             <div key={i} className="col-md-4">
                <div className="p-8 bg-stone-50/50 rounded-[2rem] border border-stone-100 h-100">
                   <span className="text-[9px] fw-black text-uppercase tracking-widest text-stone-600 d-block mb-4">{stat.label}</span>
                   <p className="display-6 fw-black font-serif text-dark tracking-tighter mb-1 lowercase">
                      {stat.value}<span className="fs-5 text-stone-700 italic">{stat.unit}</span>
                   </p>
                   <span className="text-[10px] fw-black text-emerald-500 tracking-widest">{stat.detail}</span>
                </div>
             </div>
           ))}
        </div>
      </section>

      {/* Onboard Master Modal */}
      {isOnboardModalOpen && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark/50 backdrop-blur-sm z-[100] d-flex align-items-center justify-content-center p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-[500px] w-100 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="px-8 py-6 border-bottom border-stone-100 d-flex justify-content-between align-items-center bg-stone-50/50">
              <h3 className="fs-5 fw-black font-serif text-dark mb-0 tracking-tight lowercase">Onboard.Master</h3>
              <button onClick={() => setIsOnboardModalOpen(false)} className="text-stone-600 hover:text-dark transition">
                <span className="material-symbols-outlined fs-5">close</span>
              </button>
            </div>
            <form onSubmit={handleOnboardSubmit} className="p-8 space-y-6">
              <div className="row g-4">
                <div className="col-12">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Full Name</label>
                  <input name="name" required className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" />
                </div>
                <div className="col-12">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Specialty Role</label>
                  <input name="role" required className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" />
                </div>
              </div>
              <div className="pt-6 border-top border-stone-100 d-flex justify-content-end gap-3 mt-8">
                <button type="button" onClick={() => setIsOnboardModalOpen(false)} className="px-6 py-2.5 rounded-xl border border-stone-200 text-[10px] fw-black text-uppercase tracking-widest text-stone-700 hover:bg-stone-50 transition">Cancel</button>
                <button type="submit" className="px-6 py-2.5 rounded-xl bg-dark text-white text-[10px] fw-black text-uppercase tracking-widest hover:bg-stone-800 transition shadow-lg">Confirm Onboard</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Global Schedule Modal */}
      {isScheduleModalOpen && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark/50 backdrop-blur-sm z-[100] d-flex align-items-center justify-content-center p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-[600px] w-100 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="px-8 py-6 border-bottom border-stone-100 d-flex justify-content-between align-items-center bg-stone-50/50">
              <h3 className="fs-5 fw-black font-serif text-dark mb-0 tracking-tight lowercase">Global.Schedule</h3>
              <button onClick={() => setIsScheduleModalOpen(false)} className="text-stone-600 hover:text-dark transition">
                <span className="material-symbols-outlined fs-5">close</span>
              </button>
            </div>
            <div className="p-8">
              <p className="text-sm fw-medium text-stone-700 mb-6">Upcoming artisan shift coverage and availability blockages for the current quarter.</p>
              <div className="d-flex flex-column gap-4">
                 {[
                   { date: 'Oct 15 - Oct 22', detail: 'Milan Design Week - 3 Artisans Unavailable' },
                   { date: 'Nov 01 - Nov 05', detail: 'Equipment Maintenance - 50% Capacity' },
                   { date: 'Dec 15 - Jan 02', detail: 'Winter Holiday Reduction - Priority Builds Only' },
                 ].map((evt, idx) => (
                   <div key={idx} className="p-4 bg-stone-50 border border-stone-100 rounded-xl d-flex flex-column gap-1">
                      <span className="text-[10px] fw-black text-uppercase tracking-widest text-primary">{evt.date}</span>
                      <span className="text-xs fw-black text-dark">{evt.detail}</span>
                   </div>
                 ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Performance Modal */}
      {selectedArtisan && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark/50 backdrop-blur-sm z-[100] d-flex align-items-center justify-content-center p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-[500px] w-100 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="px-8 py-6 border-bottom border-stone-100 d-flex justify-content-between align-items-center bg-stone-50/50">
              <h3 className="fs-5 fw-black font-serif text-dark mb-0 tracking-tight lowercase">Performance.Metrics</h3>
              <button onClick={() => setSelectedArtisan(null)} className="text-stone-600 hover:text-dark transition">
                <span className="material-symbols-outlined fs-5">close</span>
              </button>
            </div>
            <div className="p-8">
              <div className="d-flex align-items-center gap-4 mb-8">
                 <div className="size-16 rounded-2xl overflow-hidden border border-stone-100">
                    <img src={selectedArtisan.image} alt={selectedArtisan.name} className="w-100 h-100 object-cover" />
                 </div>
                 <div>
                    <h4 className="text-lg fw-black text-dark mb-1 tracking-tight">{selectedArtisan.name}</h4>
                    <span className="text-xs fw-black text-stone-600 uppercase tracking-widest">{selectedArtisan.role}</span>
                 </div>
              </div>
              <div className="row g-4">
                 <div className="col-6">
                    <div className="p-4 bg-stone-50 rounded-xl border border-stone-100">
                       <span className="text-[9px] fw-black text-uppercase tracking-widest text-stone-600 d-block mb-1">Average Yield</span>
                       <span className="text-lg fw-black text-dark">99.4%</span>
                    </div>
                 </div>
                 <div className="col-6">
                    <div className="p-4 bg-stone-50 rounded-xl border border-stone-100">
                       <span className="text-[9px] fw-black text-uppercase tracking-widest text-stone-600 d-block mb-1">Build Defects</span>
                       <span className="text-lg fw-black text-emerald-500">0</span>
                    </div>
                 </div>
                 <div className="col-6">
                    <div className="p-4 bg-stone-50 rounded-xl border border-stone-100">
                       <span className="text-[9px] fw-black text-uppercase tracking-widest text-stone-600 d-block mb-1">Task Load</span>
                       <span className="text-lg fw-black text-dark">{selectedArtisan.load}%</span>
                    </div>
                 </div>
                 <div className="col-6">
                    <div className="p-4 bg-stone-50 rounded-xl border border-stone-100">
                       <span className="text-[9px] fw-black text-uppercase tracking-widest text-stone-600 d-block mb-1">Client Rating</span>
                       <span className="text-lg fw-black text-dark d-flex align-items-center gap-2">
                         {selectedArtisan.rating} <span className="material-symbols-outlined text-amber-500 fs-6">star</span>
                       </span>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminArtisans;
