import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const OrderHistory = () => {
  const navigate = useNavigate();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showPerksModal, setShowPerksModal] = useState(false);
  const [showConciergeModal, setShowConciergeModal] = useState(false);
  
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSavedToast, setProfileSavedToast] = useState(false);
  
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!user) return;
        const { data } = await axios.get('/api/orders');
        const userOrders = data.filter(o => o.user === user._id);
        userOrders.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
        setOrders(userOrders);
      } catch (error) {
        console.error(error);
      }
    };
    fetchOrders();
  }, [user]);

  const handleSaveProfile = () => {
    setIsSavingProfile(true);
    setTimeout(() => {
      setIsSavingProfile(false);
      setProfileSavedToast(true);
      setTimeout(() => setProfileSavedToast(false), 4000);
    }, 1500);
  };

  return (
    <div className="min-vh-100 bg-white font-display text-dark animate-in fade-in duration-700">
      {/* Luxury Profile Header */}
      <header className="py-12 px-4 md:px-10 bg-dark text-white position-relative overflow-hidden mb-12">
        <div className="position-absolute top-[-50%] left-[-10%] size-96 bg-primary rounded-full blur-[120px] opacity-10"></div>
        <div className="max-w-7xl mx-auto d-flex flex-column flex-md-row align-items-center justify-content-between gap-8 position-relative z-1">
          <div className="d-flex flex-column flex-md-row align-items-center gap-8">
            <div className="position-relative">
              <div className="size-32 rounded-2xl bg-cover bg-center border-4 border-white/10 shadow-premium" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA7FjjoPUi2RW11aZpuUiHj4HpxBXiDAD6E9GoqTf2e7NSSFPhv7zbam5rGHOosn065-7OzHjf1As1p5942G0EGURX8TNT0JvmU5cbJBiVqe2YORL41rozhBtVizjMTurhgFHcMuu7vb_sJA7eS9iC67u5ZL8_-EOcdSszSpDGCi1gkQLn6_goZNHHMMALPI7oWRPNOYMRs88-Wh4Ga0Q_XweMCOIWJ6FB_cSZbstz1QT-8xAIHu4hGZBB3aCOvTxQ7QrSFF7r0tXht')" }}></div>
              <div className="position-absolute -bottom-2 -right-2 bg-primary text-white p-2 rounded-lg shadow-lg">
                <span className="material-symbols-outlined fs-5">verified</span>
              </div>
            </div>
            <div className="text-center text-md-start">
              <h2 className="display-5 fw-black font-serif tracking-tight mb-2">{user?.name || 'Julian Ashford'}</h2>
              <div className="d-flex flex-wrap justify-content-center justify-content-md-start align-items-center gap-3">
                <span className="text-xs fw-black tracking-[0.2em] text-uppercase text-primary">Master's Circle Elite</span>
                <span className="size-1 bg-white/20 rounded-full"></span>
                <span className="text-sm text-white/40 fw-medium">Member since Oct 2022</span>
              </div>
            </div>
          </div>
          <div className="d-flex gap-4">
            <button onClick={() => setShowProfileModal(true)} className="px-8 py-3 rounded-pill border border-white/10 text-white fw-bold hover:bg-white/5 transition">Edit Profile</button>
            <Link to="/custom-designer" className="px-8 py-3 rounded-pill bg-primary text-white fw-bold shadow-lg hover:scale-105 transition decoration-none">New Commission</Link>
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
                      {orders.map((item, i) => (
                        <tr key={i} onClick={() => navigate(`/track-order/${encodeURIComponent(item.orderId.replace('#',''))}`)} className="hover:bg-gray-50 transition cursor-pointer group">
                          <td className="px-6 py-5">
                            <div className="d-flex align-items-center gap-4">
                              <div className="size-16 rounded-xl bg-gray-50 overflow-hidden border border-gray-100 flex-shrink-0">
                                <img src={item.img || "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800"} className="w-100 h-100 object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                              </div>
                              <div>
                                <p className="fw-black text-dark mb-0 tracking-tight group-hover:text-primary transition">{item.model}</p>
                                <p className="text-secondary opacity-40 text-xs fw-bold tracking-widest mb-0">{item.orderId}</p>
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
                            <span className="fs-5 fw-black text-dark font-serif">-</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <section>
              <h3 className="fs-3 fw-black font-serif tracking-tight mb-8">Personal Settings</h3>
              <div className="glass-panel p-8 rounded-2xl border-gray-100 shadow-premium">
                <div className="row g-4">
                  <div className="col-md-6">
                    <label className="text-xs fw-black text-primary tracking-widest text-uppercase mb-2 d-block">Full Name</label>
                    <input className="w-100 bg-gray-50 border border-transparent rounded-xl px-4 py-3 fw-bold text-dark outline-none focus:border-primary transition" type="text" defaultValue="Julian Ashford" />
                  </div>
                  <div className="col-md-6">
                    <label className="text-xs fw-black text-primary tracking-widest text-uppercase mb-2 d-block">Phone Number</label>
                    <input className="w-100 bg-gray-50 border border-transparent rounded-xl px-4 py-3 fw-bold text-dark outline-none focus:border-primary transition" type="tel" defaultValue="+1 (555) 123-4567" />
                  </div>
                  <div className="col-12">
                    <label className="text-xs fw-black text-primary tracking-widest text-uppercase mb-2 d-block">Default Workshop Suite</label>
                    <textarea className="w-100 bg-gray-50 border border-transparent rounded-xl px-4 py-3 fw-bold text-dark outline-none focus:border-primary transition resize-none" rows="3" defaultValue={"1248 Cognac Estate Dr.\nSuite 400\nSavile Row District, NY 10022"}></textarea>
                  </div>
                  <div className="col-12 pt-4">
                    <button 
                      onClick={handleSaveProfile}
                      disabled={isSavingProfile}
                      className="bg-dark text-white px-10 py-3 rounded-pill fw-black text-xs uppercase tracking-[0.2em] shadow-lg hover:bg-primary transition-all d-flex align-items-center gap-2"
                    >
                      {isSavingProfile ? (
                        <>
                          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                          Saving...
                        </>
                      ) : (
                        "Save Atelier Profile"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Cards */}
          <div className="col-lg-4">
            <div className="sticky-top top-32 space-y-6">
              <div className="bg-primary p-8 rounded-2xl text-white shadow-premium position-relative overflow-hidden group">
                <div className="position-absolute top-[-20%] right-[-10%] size-40 bg-white/20 rounded-full blur-[60px] group-hover:scale-110 transition duration-1000"></div>
                <div className="position-relative z-1">
                  <h4 className="fs-3 fw-black font-serif tracking-tight mb-4">Master's Rewards</h4>
                  <div className="display-4 fw-black font-serif mb-2">2,450</div>
                  <p className="text-white/60 text-xs fw-bold tracking-widest uppercase mb-6">Tier Points Earned</p>
                  <button onClick={() => setShowPerksModal(true)} className="w-100 py-3 bg-white text-dark rounded-pill fw-black text-xs uppercase tracking-widest hover:bg-dark hover:text-white transition">Redeem Perks</button>
                </div>
              </div>

              <div className="glass-panel p-8 rounded-2xl border-gray-100 shadow-premium">
                <h4 className="fs-5 fw-black font-serif tracking-tight mb-6">Support Concierge</h4>
                <div className="d-flex align-items-center gap-4 mb-8">
                  <div className="size-16 rounded-full bg-cover bg-center shadow-lg border-2 border-primary-20" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCxqdWC7ac3Vtvw-xcTdoXqQbIknQg-p4Dmhxucnn181g6ZVAh-SLZsWwkHkDhPVm3K-9UHk9AtxP3gpO2r1VU_cuNBKt6n0MGgTTA_c77-YrPlhFHITwMbSlWBVPZJGbiOHsgKW6xYc2AiiCYv6LKdjveCMAUsC6QM10r8MkMZ6O7ZslF2J7vcwnRonhcFDWYlpLJy79FAbVs3GdwD4Id5hKv-nTF6Mnn5UxeqB-Xo9nk_zkhZW_-DUbz1fyvT8je6xHdnqU-TRl3H')" }}></div>
                  <div>
                    <p className="fw-black text-dark mb-0">Marco Sartori</p>
                    <p className="text-xs text-secondary opacity-60 mb-0">Head Workshop Manager</p>
                  </div>
                </div>
                <button onClick={() => setShowConciergeModal(true)} className="w-100 py-3 bg-gray-50 text-dark border border-gray-100 rounded-pill fw-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition">Direct Workshop Line</button>
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
                <select className="w-100 bg-gray-50 border border-transparent rounded-xl px-4 py-3 fw-bold focus:border-primary outline-none">
                  <option>EU Sizing</option>
                  <option>US Sizing</option>
                  <option>UK Sizing</option>
                </select>
              </div>
              <div>
                <label className="text-xs fw-bold text-secondary text-uppercase mb-2 d-block">Default Leather Priority</label>
                <select className="w-100 bg-gray-50 border border-transparent rounded-xl px-4 py-3 fw-bold focus:border-primary outline-none">
                  <option>Cognac Calfskin</option>
                  <option>Ebony Cordovan</option>
                  <option>Suede</option>
                </select>
              </div>
            </div>
            <button onClick={() => setShowProfileModal(false)} className="w-100 py-3 bg-dark text-white rounded-pill fw-black text-xs uppercase tracking-widest hover:bg-primary transition">Save Preferences</button>
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
                <button key={f} className="px-4 py-2 border border-gray-100 rounded-pill text-xs fw-bold hover:bg-primary hover:text-white hover:border-primary transition">{f}</button>
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
               <input autoFocus type="text" placeholder="Search by bespoke piece, SKU or material..." className="flex-grow-1 border-0 bg-transparent fs-5 fw-medium outline-none" />
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
            <p className="text-secondary text-sm mb-6">You currently have 2,450 points. Select a reward to redeem.</p>
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

      {/* Concierge Modal */}
      {showConciergeModal && (
        <div className="position-fixed top-0 start-0 w-100 h-100 z-50 d-flex align-items-center justify-content-center">
          <div className="position-absolute w-100 h-100 bg-black/60 backdrop-blur-sm animate-in fade-in" onClick={() => setShowConciergeModal(false)}></div>
          <div className="position-relative z-1 bg-white rounded-3xl p-8 max-w-md w-100 mx-4 shadow-2xl animate-in zoom-in-95">
            <div className="d-flex align-items-center gap-4 mb-6">
              <div className="size-16 rounded-full bg-cover bg-center shadow-lg" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCxqdWC7ac3Vtvw-xcTdoXqQbIknQg-p4Dmhxucnn181g6ZVAh-SLZsWwkHkDhPVm3K-9UHk9AtxP3gpO2r1VU_cuNBKt6n0MGgTTA_c77-YrPlhFHITwMbSlWBVPZJGbiOHsgKW6xYc2AiiCYv6LKdjveCMAUsC6QM10r8MkMZ6O7ZslF2J7vcwnRonhcFDWYlpLJy79FAbVs3GdwD4Id5hKv-nTF6Mnn5UxeqB-Xo9nk_zkhZW_-DUbz1fyvT8je6xHdnqU-TRl3H')" }}></div>
              <div>
                <h4 className="fs-5 fw-black font-serif mb-0">Marco Sartori</h4>
                <p className="text-xs text-green-500 fw-bold d-flex align-items-center gap-1"><span className="size-2 rounded-full bg-green-500 d-inline-block"></span> Currently in workshop</p>
              </div>
            </div>
            <textarea className="w-100 bg-gray-50 border border-gray-100 rounded-2xl p-4 mb-4 resize-none outline-none focus:border-primary transition fw-medium" rows="4" placeholder="Message Marco about your order specifics..."></textarea>
            <div className="d-flex gap-3">
               <button onClick={() => setShowConciergeModal(false)} className="flex-grow-1 py-3 bg-dark text-white rounded-pill fw-black text-xs uppercase tracking-widest shadow-lg d-flex align-items-center justify-content-center gap-2 hover:bg-primary transition border-0">
                 <span className="material-symbols-outlined fs-5">send</span>
                 Direct Message
               </button>
               <button onClick={() => setShowConciergeModal(false)} className="size-12 rounded-full bg-gray-50 text-dark d-flex align-items-center justify-content-center hover:bg-gray-100 border-0 transition">
                 <span className="material-symbols-outlined">call</span>
               </button>
            </div>
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
              <p className="text-white/60 text-xs mb-0">Your atelier preferences have been saved.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
