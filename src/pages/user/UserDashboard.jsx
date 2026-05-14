import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const UserDashboard = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeVideo, setActiveVideo] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showUpgradeSuccess, setShowUpgradeSuccess] = useState(false);

  const { user } = useAuth();
  const [activeOrder, setActiveOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!user) return;
        const { data } = await axios.get('/api/orders');
        const userOrders = data.filter(o => o.user === user._id && o.phase !== 'Finished');
        // Sort to get latest if multiple active
        userOrders.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
        if (userOrders.length > 0) setActiveOrder(userOrders[0]);
      } catch (err) {
        console.error(err);
      }
    };
    fetchOrders();
  }, [user]);

  const handleUpgrade = () => {
    setShowUpgradeModal(false);
    setShowUpgradeSuccess(true);
    setTimeout(() => setShowUpgradeSuccess(false), 4000);
  };

  const notifications = [
    { id: 1, text: 'Your order #AS-8821 has entered the Stitching phase.', time: '2h ago', unread: true },
    { id: 2, text: 'New artisan clip uploaded for Heritage Sovereign Wingtip.', time: '5h ago', unread: true },
    { id: 3, text: 'Exclusive Master\'s Circle preview is now available.', time: '1d ago', unread: false },
  ];

  return (
    <div className="p-4 lg:p-10 bg-white animate-in fade-in duration-700 position-relative">
      {/* Header */}
      <header className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-10 gap-4">
        <div>
          <h2 className="font-serif display-5 fw-black text-dark tracking-tight mb-2">Welcome back, {user?.name || 'Julian'}</h2>
          <p className="text-secondary opacity-60 fs-5 fw-medium">Your bespoke collection is currently being crafted by our master artisans.</p>
        </div>
        <div className="d-flex gap-3 position-relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`size-12 rounded-full border d-flex align-items-center justify-content-center transition shadow-sm position-relative ${showNotifications ? 'bg-primary text-white border-primary' : 'border-gray-100 bg-white text-dark hover:bg-gray-50'}`}
          >
            <span className="material-symbols-outlined fs-5">notifications</span>
            <span className="position-absolute top-0 right-0 size-3 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          
          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="position-absolute top-100 end-0 mt-3 w-80 bg-white/90 backdrop-blur-xl border border-gray-100 shadow-2xl rounded-2xl p-4 z-50 animate-in slide-in-from-top-4 fade-in duration-300">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="font-serif fs-5 fw-black mb-0">Notifications</h4>
                <button className="text-xs text-primary fw-bold hover:underline bg-transparent border-0">Mark all read</button>
              </div>
              <div className="space-y-3">
                {notifications.map(notif => (
                  <div key={notif.id} className={`p-3 rounded-xl transition ${notif.unread ? 'bg-primary-5' : 'hover:bg-gray-50'}`}>
                    <p className="text-sm fw-medium text-dark mb-1">{notif.text}</p>
                    <span className="text-[10px] text-secondary fw-bold text-uppercase tracking-widest">{notif.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Link to="/custom-designer" className="bg-primary hover:scale-105 transition-all text-white px-6 py-3 rounded-pill fw-bold d-flex align-items-center gap-2 shadow-lg text-decoration-none">
            <span className="material-symbols-outlined fs-5">add</span>
            New Bespoke Design
          </Link>
        </div>
      </header>

      {/* Active Order Highlight */}
      <section className="mb-12">
        <h3 className="font-serif fs-3 mb-6 fw-black text-dark tracking-tight">Active Workshop Session</h3>
        <div className="glass-panel rounded-2xl overflow-hidden d-flex flex-column flex-lg-row border border-gray-100 shadow-premium group">
          <div className="col-lg-5 position-relative min-h-[400px]">
            <div className="position-absolute top-0 bottom-0 start-0 end-0 bg-cover bg-center transition-transform duration-[2000ms] group-hover:scale-110" style={{ backgroundImage: `url('${activeOrder ? activeOrder.img : "https://lh3.googleusercontent.com/aida-public/AB6AXuBAb-QZ9lUfEDUGV4Hu2nSjXJs_a60V_wJ8xFHycdTfo2cUw-v5FT0uHycwttnpxV5Gw8i3gZZN7LBNwg1HCqU4pQFHXiHBdSBK2485yHamBjVntlQswcUwfS-6Y9Y7bThvuF_8bxfdEhQJKRzZWcCmoCTQI_WZ37WWkBsIKsHRRNIFdEsXXRMlDCQPM_uvqAo9UCqEBLgT9SuLEgSUsvYsFQZQQG_r7z8RK0PO7F9SV1E4eoO9PKvWMsL_BCDgz6jLpiBkkSIO1UmE"}')` }}></div>
            <div className="position-absolute top-6 left-6 d-flex gap-2">
              <span className="bg-white/90 backdrop-blur-md text-dark text-xs fw-black text-uppercase tracking-widest px-3 py-1.5 rounded-pill shadow-sm">Phase: {activeOrder ? activeOrder.phase : 'Stitching'}</span>
              <span className="bg-primary text-white text-xs fw-black text-uppercase tracking-widest px-3 py-1.5 rounded-pill shadow-lg animate-pulse">Live</span>
            </div>
          </div>
          <div className="col-lg-7 p-8 lg:p-12 d-flex flex-column justify-content-between bg-white/40">
            <div>
              <div className="d-flex justify-content-between align-items-start mb-6">
                <div>
                  <h4 className="display-6 fw-black text-dark tracking-tight font-serif mb-2">{activeOrder ? activeOrder.model : 'Heritage Sovereign Wingtip'}</h4>
                  <p className="text-secondary opacity-60 fs-6 fw-bold tracking-widest uppercase">Order {activeOrder ? activeOrder.orderId : '#AS-8821'} • ETA: {activeOrder ? activeOrder.deadline : 'Oct 24, 2024'}</p>
                </div>
              </div>
              <p className="fs-5 text-secondary opacity-70 lh-lg mb-10">
                {activeOrder ? `Your bespoke creation is currently in the ${activeOrder.phase} phase. Our master artisans are working diligently to ensure perfection in every detail.` : 'Crafted from Grade A Cognac Calfskin. Currently on the lasting bench for traditional shaping. The hand-stitching process will commence in the next 24 hours.'}
              </p>
            </div>
            
            <div className="row g-3">
              <div className="col-md-6">
                <Link to={activeOrder ? `/track-order/${encodeURIComponent(activeOrder.orderId.replace('#',''))}` : "/track-order/AS-8821"} className="w-100 d-flex align-items-center justify-content-center gap-2 border-2 border-primary-20 py-4 rounded-pill fw-bold text-dark hover:border-primary hover:bg-primary-5 transition text-decoration-none">
                  Track Progress Details
                  <span className="material-symbols-outlined fs-5">monitoring</span>
                </Link>
              </div>
              <div className="col-md-6">
                <button 
                  onClick={() => setActiveVideo("https://lh3.googleusercontent.com/aida-public/AB6AXuBAb-QZ9lUfEDUGV4Hu2nSjXJs_a60V_wJ8xFHycdTfo2cUw-v5FT0uHycwttnpxV5Gw8i3gZZN7LBNwg1HCqU4pQFHXiHBdSBK2485yHamBjVntlQswcUwfS-6Y9Y7bThvuF_8bxfdEhQJKRzZWcCmoCTQI_WZ37WWkBsIKsHRRNIFdEsXXRMlDCQPM_uvqAo9UCqEBLgT9SuLEgSUsvYsFQZQQG_r7z8RK0PO7F9SV1E4eoO9PKvWMsL_BCDgz6jLpiBkkSIO1UmE")}
                  className="w-100 d-flex align-items-center justify-content-center gap-2 bg-dark text-white py-4 rounded-pill fw-bold hover:opacity-90 transition shadow-lg border-0"
                >
                  <span className="material-symbols-outlined fs-5 text-primary">videocam</span>
                  Enter Workshop Feed
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Progress Tracker Horizontal */}
      <section className="mb-16">
        <div className="d-flex justify-content-between align-items-center mb-8">
          <h3 className="font-serif fs-4 fw-black text-dark tracking-tight">Timeline Milestone</h3>
          <div className="px-4 py-2 bg-gray-50 rounded-pill border border-gray-100">
            <span className="fs-6 fw-bold text-primary">45% Complete</span>
          </div>
        </div>
        <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
          <div className="min-w-[1000px] d-flex justify-content-between position-relative px-10">
            <div className="position-absolute top-5 translate-middle-y left-10 right-10 h-1 bg-gray-200 rounded-full" style={{ top: '24px' }}></div>
            <div className="position-absolute top-5 translate-middle-y left-10 h-1 bg-primary rounded-full transition-all duration-1000" style={{ top: '24px', width: '40%' }}></div>

            {[
              { icon: 'draw', title: 'Design', status: 'completed' },
              { icon: 'shopping_basket', title: 'Material', status: 'completed' },
              { icon: 'content_cut', title: 'Cutting', status: 'completed' },
              { icon: 'straighten', title: 'Stitching', status: 'active' },
              { icon: 'layers', title: 'Lasting', status: 'pending' },
              { icon: 'brush', title: 'Finishing', status: 'pending' },
              { icon: 'verified', title: 'Quality', status: 'pending' },
              { icon: 'local_shipping', title: 'Shipping', status: 'pending' }
            ].map((step, idx) => (
              <div key={idx} className="d-flex flex-column align-items-center gap-4 position-relative z-1 w-24">
                <div className={`size-12 rounded-full d-flex align-items-center justify-content-center transition-all duration-500 shadow-sm ${
                  step.status === 'completed' ? 'bg-primary text-white' :
                  step.status === 'active' ? 'bg-white border-4 border-primary text-primary scale-125 shadow-lg' :
                  'bg-white border-2 border-gray-100 text-gray-300'
                }`}>
                  <span className={`material-symbols-outlined fs-5 ${step.status === 'active' ? 'fw-black' : ''}`}>{step.icon}</span>
                </div>
                <div className="text-center">
                  <span className={`text-xs fw-black text-uppercase tracking-wider ${
                    step.status === 'completed' ? 'text-primary' :
                    step.status === 'active' ? 'text-dark' :
                    'text-gray-300'
                  }`}>{step.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Grid: Clips & Recommendations */}
      <div className="row g-5">
        <div className="col-lg-8">
          <div className="d-flex justify-content-between align-items-center mb-6">
            <h3 className="font-serif fs-4 fw-black text-dark tracking-tight">Recent Workshop Clips</h3>
            <Link to="/craftsmanship" className="text-primary fw-bold text-xs tracking-widest text-uppercase text-decoration-none hover:underline">View All</Link>
          </div>
          <div className="row g-4 overflow-x-auto pb-4 flex-nowrap hide-scrollbar">
            {[
              { id: 1, time: '2h ago', label: 'Lasting Bench', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-hIGc7cKW1i7eg_Ua4bbHpnTf3GjzmKvfKG6BBsWcGvEXSeO78Q8c9fL9JTeNkQ_A57IWDLP503UKdHOu5dB3yYGyglcLPBxhppkN9sVpLM7RivAf8sOQ6hol0R8pH1DJIhl_kUzdKKjm_awdO2pVtxSbpmTuS9P6G0sdpIR4WUL9kePRYCKOVZTh-tl5qZzTtzeD3_lqMJgq4WoOVUK6jvAAI19DpcngLAvt-28xpDizj8dRp8wZ4JSYxJX1ebtkKxYhaxNPsToG' },
              { id: 2, time: '5h ago', label: 'Brogue Punching', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCArZXsKUDgfQ2wQOTUB19xG_r7lRx8liAmYFzeAGM052-YKpO8hM7FEEEdGabgvs_WjdnsjHQSwTcdDBHWPypj3apceQ7Bg8Wl0cjjYzEhv9IA1TiWd2VT3SMSpWvtIjqER2764jzMM9aA8lIisoEffCbsXzEzjg0mlwWWbGTxMAuC_mt_JNHcBrpyUi3Tyvvl26y559G_w1NRGAkGBB_4rECwDQe6yfjIWaExhrWYVn8xSNeg1hRrkA6qe0mMB_v-YKlTjVGl8Bpf' },
              { id: 3, time: 'Yesterday', label: 'Leather Cutting', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBiG0aqhhLH5BXIv9_Oyamh5rB5d8G5utx8WqjkUURTotJpdfY5Jt1SNDr2pPUqfj_cwdfMwh4ksUFBed9E2hESC25Ce3zvtshFrKZEX3wivS-bPggDjfZIZyBw4F8Hbj8D1s5kfD-YUn60nxjMAEDzvmheM71LBfQlC-YPbMgG6JsPNIA6r9pbgLxqzRDtXms4rZ4S5q2N6dofsYTeSJUOw1wkMpjYPDVGYNL9jhJiNMlXFbPyHG9oEAPwySdwjtcLGaaNsCdx0Rf' }
            ].map(clip => (
              <div key={clip.id} className="col-10 col-md-5">
                <div 
                  onClick={() => setActiveVideo(clip.img)}
                  className="aspect-ratio-4-5 rounded-2xl overflow-hidden glass-panel border border-gray-100 shadow-premium group cursor-pointer"
                >
                  <div className="w-100 h-100 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url("${clip.img}")` }}></div>
                  <div className="position-absolute bottom-0 start-0 end-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <span className="text-white text-xs fw-black text-uppercase tracking-widest d-block mb-1">{clip.label}</span>
                    <span className="text-white/60 text-[10px] fw-medium">{clip.time}</span>
                  </div>
                  <div className="position-absolute top-50 start-50 translate-middle size-12 bg-white/20 backdrop-blur-md rounded-full d-flex align-items-center justify-content-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-white fs-4">play_arrow</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-lg-4">
          <h3 className="font-serif fs-4 fw-black text-dark tracking-tight mb-6">Explore the High Life</h3>
          <div className="d-flex flex-column gap-6">
            <div className="bg-dark p-6 rounded-2xl border border-white/5 shadow-premium position-relative overflow-hidden group">
              <div className="position-absolute top-[-20%] right-[-20%] size-40 bg-primary rounded-full blur-[80px] opacity-20 group-hover:scale-150 transition-transform duration-1000"></div>
              <div className="position-relative z-1">
                <span className="text-primary text-xs fw-black tracking-widest text-uppercase d-block mb-3">Loyalty Program</span>
                <h4 className="display-6 fw-black text-white font-serif mb-4">Master's Circle</h4>
                <p className="text-white/60 fs-6 lh-lg mb-6">Unlock priority artisan access and exotic hide collections.</p>
                <button 
                  onClick={() => setShowUpgradeModal(true)}
                  className="w-100 py-3 bg-white text-dark border-0 rounded-pill fw-black text-uppercase tracking-widest text-xs hover:bg-primary hover:text-white transition-all shadow-lg"
                >
                  Upgrade Now
                </button>
              </div>
            </div>

            <Link to="/catalog" className="glass-panel p-6 rounded-2xl border border-gray-100 d-flex gap-4 group text-decoration-none hover:shadow-premium transition">
              <div className="size-20 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0">
                <img className="w-100 h-100 object-cover group-hover:scale-110 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuABO-z_C0iHdFtG7wBWCKrkJ9so_anDJwRbt7UaD_9MUNBS4m2j-IjKH4nytVmAHaeyA2eNnr_ZR41XyfqsCytGyErWLAHx1QFbbRBvXHvKc8DoAU6yMal2mCfzquY6qAMFnHFcYGiMQDu0IP8-YA3OjdsGGy_-1uqwcm017bH4DWlVgyZRxB_YlkA5mIs6UNWHcORL1pioLacJgORqDjFVc2hPLdzT6RL5MT7qloNUBD3ljgkd-LhDMgLvwjvD-cYiyX2gFVWKP3Y1" alt="Rec" />
              </div>
              <div>
                <span className="text-primary text-[10px] fw-black text-uppercase tracking-widest d-block mb-1">Recommended for You</span>
                <h4 className="fs-6 fw-bold text-dark mb-1">The Oxford Noir</h4>
                <p className="text-xs text-secondary opacity-60 mb-0">Matches your bespoke style preferences.</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {activeVideo && (
        <div className="position-fixed top-0 start-0 w-100 h-100 z-50 d-flex align-items-center justify-content-center">
          <div className="position-absolute top-0 start-0 w-100 h-100 bg-black/80 backdrop-blur-md animate-in fade-in" onClick={() => setActiveVideo(null)}></div>
          <div className="position-relative z-1 w-100 max-w-5xl px-4 animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setActiveVideo(null)}
              className="position-absolute -top-12 right-4 text-white hover:text-primary transition bg-transparent border-0 d-flex align-items-center gap-2"
            >
               <span className="text-xs fw-bold text-uppercase tracking-widest">Close</span>
               <span className="material-symbols-outlined">close</span>
            </button>
            <div className="aspect-ratio-16-9 bg-dark rounded-2xl overflow-hidden shadow-2xl border border-white/10 d-flex align-items-center justify-content-center relative">
               <div className="position-absolute top-0 left-0 w-100 h-100 bg-cover bg-center opacity-50 blur-sm" style={{backgroundImage: `url('${activeVideo}')`}}></div>
               <img src={activeVideo} className="h-100 w-auto max-w-100 position-relative z-1 object-contain shadow-2xl" alt="Video Feed" />
               <div className="position-absolute bottom-6 left-6 z-1 bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 d-flex gap-3 align-items-center">
                 <span className="size-2 bg-red-500 rounded-full animate-pulse"></span>
                 <span className="text-white text-xs fw-black text-uppercase tracking-widest">Live Artisan Feed</span>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="position-fixed top-0 start-0 w-100 h-100 z-50 d-flex align-items-center justify-content-center">
          <div className="position-absolute top-0 start-0 w-100 h-100 bg-black/60 backdrop-blur-sm animate-in fade-in" onClick={() => setShowUpgradeModal(false)}></div>
          <div className="position-relative z-1 bg-white rounded-3xl p-8 max-w-md w-100 mx-4 shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden">
            <div className="position-absolute top-0 left-0 w-100 h-1 bg-gradient-to-r from-primary to-primary-20"></div>
            <div className="text-center mb-8">
              <div className="size-20 bg-primary/10 text-primary rounded-full d-flex align-items-center justify-content-center mx-auto mb-6">
                <span className="material-symbols-outlined fs-1">workspace_premium</span>
              </div>
              <h3 className="font-serif fs-3 fw-black text-dark mb-2">Join Master's Circle</h3>
              <p className="text-secondary mb-0">Confirm your upgrade to access exclusive hides, priority shaping, and a personal atelier concierge.</p>
            </div>
            <div className="d-flex align-items-center justify-content-between p-4 bg-gray-50 rounded-xl mb-8 border border-gray-100">
              <span className="fw-bold text-dark text-sm text-uppercase tracking-widest">Annual Fee</span>
              <span className="fs-5 fw-black text-primary">$495.00</span>
            </div>
            <div className="d-flex flex-column gap-3">
              <button onClick={handleUpgrade} className="w-100 py-3 bg-dark text-white border-0 rounded-pill fw-black text-xs text-uppercase tracking-widest shadow-lg hover:bg-primary transition">Confirm Upgrade</button>
              <button onClick={() => setShowUpgradeModal(false)} className="w-100 py-3 bg-transparent text-secondary border-0 rounded-pill fw-bold text-xs text-uppercase tracking-widest hover:bg-gray-50 transition">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Success Toast */}
      {showUpgradeSuccess && (
        <div className="position-fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-500">
          <div className="bg-dark text-white px-6 py-4 rounded-2xl shadow-2xl d-flex align-items-center gap-4 border border-white/10">
            <div className="size-10 bg-green-500/20 text-green-400 rounded-full d-flex align-items-center justify-content-center">
              <span className="material-symbols-outlined fs-5">check_circle</span>
            </div>
            <div>
              <h5 className="fs-6 fw-bold mb-1">Welcome to the Circle</h5>
              <p className="text-white/60 text-xs mb-0">Your profile has been upgraded to Master's Circle.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
