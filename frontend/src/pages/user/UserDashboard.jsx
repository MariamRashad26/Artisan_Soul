import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../utils/axiosInstance';
import { useAuth } from '../../context/AuthContext';

const UserDashboard = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeVideo, setActiveVideo] = useState(null);


  const { user } = useAuth();
  const [activeOrder, setActiveOrder] = useState(null);

  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const { data } = await axios.get('/api/notifications');
      setNotifications(data);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await axios.delete('/api/notifications');
      fetchNotifications();
    } catch (err) {
      console.error('Failed to clear notifications', err);
    }
  };

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
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, [user]);

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
            {notifications.some(n => !n.read) && (
              <span className="position-absolute top-0 right-0 size-3 bg-red-500 rounded-full border-2 border-white"></span>
            )}
          </button>
          
          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="position-absolute top-100 end-0 mt-3 w-80 bg-white/90 backdrop-blur-xl border border-gray-100 shadow-2xl rounded-2xl p-4 z-50 animate-in slide-in-from-top-4 fade-in duration-300">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="font-serif fs-5 fw-black mb-0">Notifications</h4>
                <button onClick={handleMarkAllRead} className="text-xs text-primary fw-bold hover:underline bg-transparent border-0">Mark all read</button>
              </div>
              <div className="space-y-3 overflow-y-auto max-h-60 custom-scrollbar">
                {notifications.map(notif => (
                  <div key={notif._id} className={`p-3 rounded-xl transition ${!notif.read ? 'bg-primary-5' : 'hover:bg-gray-50'}`}>
                    <p className="text-sm fw-medium text-dark mb-1">{notif.message}</p>
                    <span className="text-[10px] text-secondary fw-bold text-uppercase tracking-widest">{new Date(notif.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                ))}
                {notifications.length === 0 && (
                  <p className="text-xs text-stone-400 text-center py-4">No notifications yet.</p>
                )}
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
              <div className="col-12">
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
            <span className="fs-6 fw-bold text-primary">{activeOrder ? activeOrder.progress : 0}% Complete</span>
          </div>
        </div>
        <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
          <div className="min-w-[1000px] d-flex justify-content-between position-relative px-10">
            <div className="position-absolute top-5 translate-middle-y left-10 right-10 h-1 bg-gray-200 rounded-full" style={{ top: '24px' }}></div>
            <div className="position-absolute top-5 translate-middle-y left-10 h-1 bg-primary rounded-full transition-all duration-1000" style={{ top: '24px', width: `${activeOrder ? activeOrder.progress : 0}%` }}></div>

            {['Design Prep', 'Cutting', 'Lasting', 'Stitching', 'Quality Control', 'Finished'].map((stageName, idx) => {
              const stagesList = ['Design Prep', 'Cutting', 'Lasting', 'Stitching', 'Quality Control', 'Finished'];
              const iconsList = ['draw', 'content_cut', 'layers', 'straighten', 'verified', 'local_shipping'];
              const activePhase = activeOrder ? activeOrder.phase : 'Design Prep';
              const currentIdx = stagesList.indexOf(activePhase) !== -1 ? stagesList.indexOf(activePhase) : 0;
              
              let status = 'pending';
              if (idx < currentIdx) status = 'completed';
              else if (idx === currentIdx) status = 'active';

              return (
                <div key={idx} className="d-flex flex-column align-items-center gap-4 position-relative z-1 w-24">
                  <div className={`size-12 rounded-full d-flex align-items-center justify-content-center transition-all duration-500 shadow-sm ${
                    status === 'completed' ? 'bg-primary text-white' :
                    status === 'active' ? 'bg-white border-4 border-primary text-primary scale-125 shadow-lg' :
                    'bg-white border-2 border-gray-100 text-gray-300'
                  }`}>
                    <span className={`material-symbols-outlined fs-5 ${status === 'active' ? 'fw-black' : ''}`}>{iconsList[idx]}</span>
                  </div>
                  <div className="text-center">
                    <span className={`text-xs fw-black text-uppercase tracking-wider ${
                      status === 'completed' ? 'text-primary' :
                      status === 'active' ? 'text-dark' :
                      'text-gray-300'
                    }`}>{stageName}</span>
                  </div>
                </div>
              );
            })}
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


    </div>
  );
};

export default UserDashboard;
