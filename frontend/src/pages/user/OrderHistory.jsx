import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const OrderHistory = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showPerksModal, setShowPerksModal] = useState(false);
  
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSavedToast, setProfileSavedToast] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All Time');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { user, refreshUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [displayedOrders, setDisplayedOrders] = useState([]);

  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileAddress, setProfileAddress] = useState('');
  const [prefMeasurement, setPrefMeasurement] = useState('EU Sizing');
  const [prefLeather, setPrefLeather] = useState('Cognac Calfskin');

  const [assignedArtisan, setAssignedArtisan] = useState(null);

  useEffect(() => {
    if (user) {
      setProfileName(user.name || '');
      setProfilePhone(user.phone || '');
      setProfileAddress(user.address || '');
      setPrefMeasurement(user.preferredMeasurement || 'EU Sizing');
      setPrefLeather(user.leatherPriority || 'Cognac Calfskin');
    }
  }, [user]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!user) return;
        const { data } = await axiosInstance.get('/api/orders');
        const userOrders = data.filter(o => 
          o.user === user._id || 
          o.user?._id === user._id || 
          o.user_id === user._id || 
          o.patron === user.name ||
          o.patron === `${user.firstName} ${user.lastName}`
        );
        userOrders.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
        setOrders(userOrders);
        setDisplayedOrders(userOrders);
      } catch (error) {
        console.error(error);
      }
    };
    fetchOrders();
  }, [user]);

  // Re-filter whenever filter or search changes
  useEffect(() => {
    let filtered = [...orders];
    if (activeFilter === 'Completed') {
      filtered = filtered.filter(o => o.phase === 'Finished');
    } else if (activeFilter === 'In Production') {
      filtered = filtered.filter(o => o.phase !== 'Finished');
    } else if (activeFilter === 'This Year') {
      const year = new Date().getFullYear();
      filtered = filtered.filter(o => new Date(o.createdAt).getFullYear() === year);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(o =>
        (o.model || '').toLowerCase().includes(q) ||
        (o.orderId || '').toLowerCase().includes(q)
      );
    }
    setDisplayedOrders(filtered);
  }, [orders, activeFilter, searchQuery]);

  useEffect(() => {
    const fetchAssignedArtisan = async () => {
      try {
        if (!user || orders.length === 0) return;
        const { data: woData } = await axiosInstance.get('/api/work-orders');
        const userOrderIds = orders.map(o => o._id);
        const activeWO = woData.find(wo => 
          (userOrderIds.includes(wo.order_id?._id) || userOrderIds.includes(wo.order_id)) && 
          wo.assigned_to
        );
        if (activeWO) {
          setAssignedArtisan(activeWO.assigned_to);
        } else {
          setAssignedArtisan(null);
        }
      } catch (err) {
        console.error('Failed to fetch assigned artisan', err);
      }
    };
    fetchAssignedArtisan();
  }, [orders, user]);

  const handleSaveProfile = async () => {
    setIsSavingProfile(true);
    try {
      await axiosInstance.put('/api/auth/profile', {
        name: profileName,
        phone: profilePhone,
        address: profileAddress,
        preferredMeasurement: prefMeasurement,
        leatherPriority: prefLeather,
      });
      await refreshUser();
      showToast('Profile preferences saved successfully.', 'success');
      setShowProfileModal(false);
    } catch (err) {
      console.error(err);
      showToast('Failed to save profile preferences.', 'error');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleConciergeChat = () => {
    if (orders && orders.length > 0) {
      const mostRecent = orders[0];
      const trackingId = (mostRecent.orderId || mostRecent._id).replace('#', '');
      navigate(`/track-order/${trackingId}?chat=true`);
    } else {
      showToast('You have no active commissions. Create one to chat with the atelier concierge!', 'info');
    }
  };

  return (
    <div className="min-vh-100 bg-white font-display text-dark animate-in fade-in duration-700">
      {/* Luxury Profile Header */}
      <header className="py-12 px-4 md:px-10 bg-dark text-white position-relative overflow-hidden mb-12">
        <div className="position-absolute top-[-50%] left-[-10%] size-96 bg-primary rounded-full blur-[120px] opacity-10"></div>
        <div className="max-w-7xl mx-auto d-flex flex-column flex-md-row align-items-center justify-content-between gap-8 position-relative z-1">
          <div className="d-flex flex-column flex-md-row align-items-center gap-8">
            <div className="position-relative">
              <div className="size-32 rounded-2xl bg-stone-800 d-flex align-items-center justify-content-center text-white fw-bold border-4 border-white/10 shadow-premium fs-2 text-uppercase">
                {user?.name ? user.name.substring(0, 2) : 'US'}
              </div>
            </div>
            <div className="text-center text-md-start">
              <h2 className="display-5 fw-black font-serif tracking-tight mb-2">{user?.name || 'Patron'}</h2>
              <div className="d-flex flex-wrap justify-content-center justify-content-md-start align-items-center gap-3">
                <span className="text-xs fw-black tracking-[0.2em] text-uppercase text-stone-400">Atelier Patron</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-10 pb-20">
        <div className="row g-5">
          {/* Main Content Area */}
          <div className="col-lg-8">
            <section className="mb-12">
              <div className="d-flex align-items-center justify-content-between mb-8">
                <h3 className="fs-3 fw-black font-serif tracking-tight mb-0">Atelier History</h3>
                <div className="d-flex gap-2">
                  <button onClick={() => setShowFilterModal(true)} className="size-10 bg-gray-50 rounded-full d-flex align-items-center justify-content-center hover:bg-gray-100 transition">
                    <span className="material-symbols-outlined fs-5">filter_list</span>
                  </button>
                  <button onClick={() => setShowSearchModal(true)} className="size-10 bg-gray-50 rounded-full d-flex align-items-center justify-content-center hover:bg-gray-100 transition">
                    <span className="material-symbols-outlined fs-5">search</span>
                  </button>
                </div>
              </div>

              <div className="glass-panel rounded-2xl border-gray-100 overflow-hidden shadow-premium">
                <div className="table-responsive">
                  <table className="table table-borderless align-middle mb-0">
                    <thead className="bg-gray-50/50">
                      <tr>
                        <th className="px-6 py-4 text-xs fw-black text-secondary tracking-widest text-uppercase">Bespoke Piece</th>
                        <th className="px-6 py-4 text-xs fw-black text-secondary tracking-widest text-uppercase">Date</th>
                        <th className="px-6 py-4 text-xs fw-black text-secondary tracking-widest text-uppercase">Status</th>
                        <th className="px-6 py-4 text-xs fw-black text-secondary tracking-widest text-uppercase text-end">Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                    {displayedOrders.map((item, i) => (
                        <tr key={i} onClick={() => navigate(`/track-order/${encodeURIComponent((item.orderId || item._id).replace('#',''))}`)} className="hover:bg-gray-50 transition cursor-pointer group">
                          <td className="px-6 py-5">
                            <div className="d-flex align-items-center gap-4">
                              <div className="size-16 rounded-xl bg-gray-50 overflow-hidden border border-gray-100 flex-shrink-0">
                                <img src={item.img || "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800"} className="w-100 h-100 object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                              </div>
                              <div>
                                <p className="fw-black text-dark mb-0 tracking-tight group-hover:text-primary transition">{item.model}</p>
                                <p className="text-secondary opacity-40 text-xs fw-bold tracking-widest mb-0">{item.orderId || item._id.substring(0, 8)}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <span className="text-secondary opacity-60 fw-bold fs-6">{new Date(item.createdAt).toLocaleDateString()}</span>
                          </td>
                          <td className="px-6 py-5">
                            <div className={`px-3 py-1.5 rounded-full d-inline-flex align-items-center gap-2 border ${
                              item.phase !== 'Finished' ? 'bg-primary-10 text-primary border-primary-20' : 
                              item.phase === 'Finished' ? 'bg-green-50 text-green-600 border-green-100' :
                              'bg-blue-50 text-blue-600 border-blue-100'
                            }`}>
                              <span className={`material-symbols-outlined fs-6 ${item.phase !== 'Finished' ? 'animate-pulse' : ''}`}>{item.phase === 'Finished' ? 'verified' : 'precision_manufacturing'}</span>
                              <span className="text-xs fw-black text-uppercase tracking-widest">{item.phase === 'Finished' ? 'Delivered' : item.phase}</span>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-end">
                            <span className="fs-5 fw-black text-dark font-serif">
                              {item.price ? `${item.price.toLocaleString()} PKR` : 'Bespoke'}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {displayedOrders.length === 0 && (
                        <tr>
                          <td colSpan="4" className="text-center py-8 text-secondary font-medium">No order history found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

          </div>

          {/* Right Column: Cards */}
          <div className="col-lg-4">
            <div className="sticky-top top-32 space-y-6">
              <div className="glass-panel p-8 rounded-2xl border-gray-100 shadow-premium">
                <h4 className="fs-5 fw-black font-serif tracking-tight mb-6">Support Concierge</h4>
                <div className="d-flex align-items-center gap-4 mb-8">
                  <div className="size-16 rounded-full bg-cover bg-center shadow-lg border-2 border-primary-20" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80')" }}></div>
                  <div>
                    <p className="fw-black text-dark mb-0">{assignedArtisan ? assignedArtisan.name : 'Atelier Concierge'}</p>
                    <p className="text-xs text-secondary opacity-60 mb-0">{assignedArtisan ? 'Assigned Master Artisan' : 'Head Workshop Manager'}</p>
                  </div>
                </div>
                <button onClick={handleConciergeChat} className="w-100 py-3 bg-gray-50 text-dark border border-gray-100 rounded-pill fw-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition">
                  {assignedArtisan ? `Chat with ${assignedArtisan.name}` : 'Direct Workshop Line'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modals & Toasts */}
      
      {/* Edit Profile Modal */}
      {showProfileModal && (
        <div className="position-fixed top-0 start-0 w-100 h-100 z-50 d-flex align-items-center justify-content-center">
          <div className="position-absolute w-100 h-100 bg-black/60 backdrop-blur-sm animate-in fade-in" onClick={() => setShowProfileModal(false)}></div>
          <div className="position-relative z-1 bg-white rounded-3xl p-8 max-w-md w-100 mx-4 shadow-2xl animate-in zoom-in-95">
            <h3 className="font-serif fs-4 fw-black mb-4">Edit Profile Preferences</h3>
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-xs fw-bold text-secondary text-uppercase mb-2 d-block">Preferred Measurement Unit</label>
                <select value={prefMeasurement} onChange={(e) => setPrefMeasurement(e.target.value)} className="w-100 bg-gray-50 border border-transparent rounded-xl px-4 py-3 fw-bold focus:border-primary outline-none">
                  <option>EU Sizing</option>
                  <option>US Sizing</option>
                  <option>UK Sizing</option>
                </select>
              </div>
              <div>
                <label className="text-xs fw-bold text-secondary text-uppercase mb-2 d-block">Default Leather Priority</label>
                <select value={prefLeather} onChange={(e) => setPrefLeather(e.target.value)} className="w-100 bg-gray-50 border border-transparent rounded-xl px-4 py-3 fw-bold focus:border-primary outline-none">
                  <option>Cognac Calfskin</option>
                  <option>Ebony Cordovan</option>
                  <option>Suede</option>
                </select>
              </div>
            </div>
            <button onClick={handleSaveProfile} className="w-100 py-3 bg-dark text-white rounded-pill fw-black text-xs uppercase tracking-widest hover:bg-primary transition">Save Preferences</button>
          </div>
        </div>
      )}

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="position-fixed top-0 start-0 w-100 h-100 z-50 d-flex align-items-center justify-content-center">
          <div className="position-absolute w-100 h-100 bg-black/30 backdrop-blur-sm animate-in fade-in" onClick={() => setShowFilterModal(false)}></div>
          <div className="position-relative z-1 bg-white rounded-3xl p-6 max-w-sm w-100 mx-4 shadow-2xl animate-in fade-in slide-in-from-bottom-10">
            <h4 className="font-serif fs-5 fw-black mb-4">Refine History</h4>
            <div className="d-flex flex-wrap gap-2 mb-6">
          {['All Time', 'This Year', 'Completed', 'In Production'].map(f => (
                <button 
                  key={f} 
                  onClick={() => { setActiveFilter(f); }}
                  className={`px-4 py-2 border rounded-pill text-xs fw-bold transition ${ activeFilter === f ? 'bg-primary text-white border-primary' : 'border-gray-100 hover:bg-primary hover:text-white hover:border-primary'}`}
                >{f}</button>
              ))}
            </div>
            <button onClick={() => setShowFilterModal(false)} className="w-100 py-3 bg-dark text-white rounded-pill fw-black text-xs uppercase tracking-widest">Apply Filter</button>
          </div>
        </div>
      )}

      {/* Search Modal */}
      {showSearchModal && (
        <div className="position-fixed top-0 start-0 w-100 h-100 z-50 d-flex align-items-center justify-content-center">
          <div className="position-absolute w-100 h-100 bg-black/50 backdrop-blur-md animate-in fade-in" onClick={() => setShowSearchModal(false)}></div>
          <div className="position-relative z-1 max-w-lg w-100 mx-4 animate-in zoom-in-95">
             <div className="bg-white rounded-pill p-3 d-flex align-items-center gap-3 shadow-2xl">
                <span className="material-symbols-outlined fs-4 text-secondary ml-2">search</span>
                <input 
                  autoFocus 
                  type="text" 
                  placeholder="Search by bespoke piece or order ID..." 
                  className="flex-grow-1 border-0 bg-transparent fs-5 fw-medium outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button onClick={() => setShowSearchModal(false)} className="size-10 bg-gray-50 rounded-full d-flex align-items-center justify-content-center hover:bg-gray-100 border-0">
                  <span className="material-symbols-outlined fs-5">close</span>
                </button>
             </div>
          </div>
        </div>
      )}

      {/* Perks Modal */}
      {showPerksModal && (
        <div className="position-fixed top-0 start-0 w-100 h-100 z-50 d-flex align-items-center justify-content-center">
          <div className="position-absolute w-100 h-100 bg-black/60 backdrop-blur-sm animate-in fade-in" onClick={() => setShowPerksModal(false)}></div>
          <div className="position-relative z-1 bg-white rounded-3xl p-8 max-w-md w-100 mx-4 shadow-2xl animate-in zoom-in-95 text-center">
            <div className="size-16 bg-primary/10 text-primary rounded-full d-flex align-items-center justify-content-center mx-auto mb-4">
              <span className="material-symbols-outlined fs-3">redeem</span>
            </div>
            <h3 className="font-serif fs-4 fw-black mb-2">Exclusive Tier Perks</h3>
            <p className="text-secondary text-sm mb-6">You currently have {user?.tierPoints !== undefined ? user.tierPoints : 1000} points. Select a reward to redeem.</p>
            <div className="space-y-3 mb-6">
              <button className="w-100 p-4 border border-gray-100 rounded-2xl d-flex justify-content-between align-items-center hover:border-primary transition group text-start bg-transparent">
                <div>
                  <h5 className="fw-bold fs-6 mb-1 group-hover:text-primary transition">Premium Shoetree Set</h5>
                  <span className="text-xs text-secondary">Aromatic Cedar Wood</span>
                </div>
                <span className="fw-black text-primary">1,200 pts</span>
              </button>
              <button className="w-100 p-4 border border-gray-100 rounded-2xl d-flex justify-content-between align-items-center hover:border-primary transition group text-start bg-transparent">
                <div>
                  <h5 className="fw-bold fs-6 mb-1 group-hover:text-primary transition">Priority Lasting Queue</h5>
                  <span className="text-xs text-secondary">Skip ahead in production</span>
                </div>
                <span className="fw-black text-primary">2,000 pts</span>
              </button>
            </div>
            <button onClick={() => setShowPerksModal(false)} className="text-xs fw-bold text-secondary text-uppercase tracking-widest bg-transparent border-0 hover:underline">Close</button>
          </div>
        </div>
      )}



      {/* Success Toast */}
      {profileSavedToast && (
        <div className="position-fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-500">
          <div className="bg-dark text-white px-6 py-4 rounded-2xl shadow-2xl d-flex align-items-center gap-4 border border-white/10">
            <div className="size-10 bg-green-500/20 text-green-400 rounded-full d-flex align-items-center justify-content-center">
              <span className="material-symbols-outlined fs-5">check_circle</span>
            </div>
            <div>
              <h5 className="fs-6 fw-bold mb-1">Profile Updated</h5>
              <p className="text-white/60 text-xs mb-0">Your preferences have been saved.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
