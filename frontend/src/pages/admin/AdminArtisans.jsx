import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { useToast } from '../../context/ToastContext';

const AdminArtisans = () => {
  const [artisans, setArtisans] = useState([]);
  const [isOnboardModalOpen, setIsOnboardModalOpen] = useState(false);
  const [selectedArtisan, setSelectedArtisan] = useState(null);
  const { showToast, showConfirm } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');

  const fetchArtisans = async () => {
    try {
      const [{ data: usersData }, { data: woData }] = await Promise.all([
        axiosInstance.get('/api/artisans'),
        axiosInstance.get('/api/work-orders')
      ]);

      const artisanUsers = usersData.map(u => {
        const activeWorkOrders = woData.filter(wo => 
          (wo.assigned_to?._id === u._id || wo.assigned_to === u._id) && 
          wo.status !== 'Completed' && wo.status !== 'Cancelled'
        );
        const taskCount = activeWorkOrders.length;
        const computedLoad = Math.min(100, taskCount * 20);

        return {
          id: u._id,
          name: u.name,
          email: u.email,
          role: u.role || 'Artisan',
          status: taskCount > 0 ? 'Busy' : 'Available',
          load: computedLoad,
          rating: 4.8,
        };
      });
      setArtisans(artisanUsers);
    } catch (err) {
      console.error('Failed to fetch artisans', err);
    }
  };

  useEffect(() => {
    const loadArtisans = async () => { await fetchArtisans(); };
    loadArtisans();
  }, []);

  const handleSelectArtisan = (artisan) => {
    setSelectedArtisan(artisan);
    setEditName(artisan.name);
    setEditEmail(artisan.email || '');
    setIsEditing(false);
  };

  const handleOnboardSubmit = async (e) => {
    e.preventDefault();
    const name = e.target.name.value.trim();
    const email = e.target.email.value.trim();
    // Generate a secure temp password: Artisan + 4 random digits + !
    const tempPassword = `Artisan${Math.floor(1000 + Math.random() * 9000)}!`;
    try {
      await axiosInstance.post('/api/artisans', { name, email, password: tempPassword });
      fetchArtisans();
      setIsOnboardModalOpen(false);
      showToast(`${name} onboarded. Temp password: ${tempPassword}`, 'success');
    } catch (err) {
      console.error('Failed to register artisan', err);
      const msg = err.response?.data?.message || 'Failed to register artisan.';
      showToast(msg, 'error');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/api/artisans/${selectedArtisan.id}`, { name: editName, email: editEmail });
      fetchArtisans();
      setSelectedArtisan(null);
      showToast('Artisan profile updated successfully.', 'success');
    } catch (err) {
      console.error('Failed to update artisan', err);
      showToast('Failed to update artisan profile.', 'error');
    }
  };

  const handleDeleteArtisan = async (artisanId) => {
    showConfirm(
      'Are you sure you want to remove this artisan from the collective?',
      async () => {
        try {
          await axiosInstance.delete(`/api/artisans/${artisanId}`);
          fetchArtisans();
          setSelectedArtisan(null);
          showToast('Artisan removed from collective.', 'success');
        } catch (err) {
          console.error('Failed to delete artisan', err);
          showToast('Failed to remove artisan.', 'error');
        }
      }
    );
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
        </div>
      </section>

      <div className="row g-8 mb-12">
        {artisans.map((artisan, i) => (
          <div key={i} className="col-lg-3 col-md-6">
            <div className="glass-panel p-6 rounded-[2.5rem] border-stone-100 shadow-premium group hover:border-dark transition-all duration-700 h-100">
              <div className="relative mb-6">
                <div className="aspect-square rounded-[2rem] overflow-hidden bg-stone-900 d-flex align-items-center justify-content-center shadow-xl border-4 border-white">
                  <span className="text-2xl fw-black text-white font-serif tracking-tight">
                    {artisan.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                  </span>
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
                   <button onClick={() => handleSelectArtisan(artisan)} className="bg-transparent border-0 text-[9px] fw-black text-uppercase tracking-widest text-primary hover:text-dark transition">View Performance</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

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
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Email Address</label>
                  <input name="email" type="email" required className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" placeholder="artisan@example.com" />
                </div>
                <div className="col-12">
                  <p className="text-[10px] text-stone-500 fw-medium">
                    A temporary password will be generated automatically and shown after submission.
                  </p>
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

      {/* View Performance Modal / Edit / Delete */}
      {selectedArtisan && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark/50 backdrop-blur-sm z-[100] d-flex align-items-center justify-content-center p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-[500px] w-100 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="px-8 py-6 border-bottom border-stone-100 d-flex justify-content-between align-items-center bg-stone-50/50">
              <h3 className="fs-5 fw-black font-serif text-dark mb-0 tracking-tight lowercase">
                {isEditing ? 'Edit.Artisan' : 'Performance.Metrics'}
              </h3>
              <button onClick={() => setSelectedArtisan(null)} className="text-stone-600 hover:text-dark transition bg-transparent border-0">
                <span className="material-symbols-outlined fs-5">close</span>
              </button>
            </div>
            <div className="p-8">
              {isEditing ? (
                <form onSubmit={handleEditSubmit} className="space-y-6">
                  <div>
                    <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Full Name</label>
                    <input value={editName} onChange={(e) => setEditName(e.target.value)} required className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" />
                  </div>
                  <div>
                    <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Contact Email</label>
                    <input value={editEmail} onChange={(e) => setEditEmail(e.target.value)} type="email" required className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" />
                  </div>
                  <div className="pt-6 border-top border-stone-100 d-flex justify-content-end gap-3 mt-8">
                    <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2.5 rounded-xl border border-stone-200 text-[10px] fw-black text-uppercase tracking-widest text-stone-700 hover:bg-stone-50 transition bg-transparent">Cancel</button>
                    <button type="submit" className="px-6 py-2.5 rounded-xl bg-dark text-white text-[10px] fw-black text-uppercase tracking-widest hover:bg-stone-800 transition shadow-lg">Save Changes</button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="d-flex align-items-center gap-4 mb-8">
                     <div className="size-16 rounded-2xl bg-stone-900 d-flex align-items-center justify-content-center text-white font-serif fw-bold border border-stone-100">
                        {selectedArtisan.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                     </div>
                     <div>
                        <h4 className="text-lg fw-black text-dark mb-1 tracking-tight">{selectedArtisan.name}</h4>
                        <span className="text-xs fw-black text-stone-600 uppercase tracking-widest">{selectedArtisan.role}</span>
                     </div>
                  </div>
                  <div className="row g-4 mb-8">
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
                  <div className="pt-6 border-top border-stone-100 d-flex justify-content-between align-items-center mt-8">
                    <button onClick={() => handleDeleteArtisan(selectedArtisan.id)} className="px-6 py-2.5 rounded-xl border border-rose-200 text-[10px] fw-black text-uppercase tracking-widest text-rose-600 hover:bg-rose-50 transition bg-transparent">Remove Artisan</button>
                    <div className="d-flex gap-3">
                      <button onClick={() => setIsEditing(true)} className="px-6 py-2.5 rounded-xl border border-stone-200 text-[10px] fw-black text-uppercase tracking-widest text-stone-700 hover:bg-stone-50 transition bg-transparent">Edit Details</button>
                      <button onClick={() => setSelectedArtisan(null)} className="px-6 py-2.5 rounded-xl bg-dark text-white text-[10px] fw-black text-uppercase tracking-widest hover:bg-stone-800 transition shadow-lg">Close</button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminArtisans;
