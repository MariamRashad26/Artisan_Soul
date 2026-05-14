import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

const UserOrderTracking = () => {
  const { id } = useParams();
  const orderId = id || 'AS-88219';

  const [activeVideo, setActiveVideo] = useState(null);
  const [showConciergeModal, setShowConciergeModal] = useState(false);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(`/api/orders/${orderId}`);
        setOrder(data);
      } catch (err) {
        console.error('Failed to fetch order', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-vh-100 bg-white d-flex align-items-center justify-content-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-vh-100 bg-white d-flex align-items-center justify-content-center flex-column gap-4">
        <h2>Order Not Found</h2>
        <Link to="/" className="btn btn-primary rounded-pill px-6 fw-bold">Return Home</Link>
      </div>
    );
  }

  const stages = ['Design Prep', 'Cutting', 'Lasting', 'Stitching', 'Finished'];
  const icons = ['draw', 'content_cut', 'layers', 'straighten', 'verified'];
  let currentIdx = stages.indexOf(order.phase);
  if (currentIdx === -1) currentIdx = 0; // fallback if phase not in array

  // Current stage label
  const currentStageName = stages[currentIdx];

  return (
    <div className="min-vh-100 bg-white font-display text-dark animate-in fade-in duration-700 pb-20">
      {/* Immersive Header Section */}
      <section className="bg-dark text-white py-20 px-4 md:px-10 position-relative overflow-hidden mb-12">
        <div className="position-absolute top-[-20%] right-[-10%] size-96 bg-primary rounded-full blur-[120px] opacity-20"></div>
        <div className="max-w-7xl mx-auto position-relative z-1">
          <div className="d-flex align-items-center gap-3 text-primary text-xs fw-black text-uppercase tracking-[0.3em] mb-4">
            <span className="material-symbols-outlined fs-5">auto_awesome</span>
            Artisanal Production Stage
          </div>
          <h1 className="display-4 fw-black font-serif tracking-tight mb-4">The Birth of a Masterpiece</h1>
          <p className="fs-4 text-white/60 mb-0 font-display">Tracking your bespoke <span className="text-white italic">{order.model}</span> • {order.orderId || orderId}</p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 md:px-10">
        <div className="row g-5">
          {/* Left Column: Timeline & Progress */}
          <div className="col-12 col-lg-7">
            {/* Status Card */}
            <div className="glass-panel p-8 rounded-2xl border-primary-10 mb-10 d-flex align-items-center justify-content-between shadow-premium">
              <div className="d-flex align-items-center gap-4">
                <div className="size-16 bg-primary rounded-full d-flex align-items-center justify-content-center text-white shadow-lg animate-pulse">
                  <span className="material-symbols-outlined fs-2">precision_manufacturing</span>
                </div>
                <div>
                  <h4 className="fs-5 fw-black text-dark tracking-tight mb-1">Current: {currentStageName}</h4>
                  <p className="text-secondary opacity-60 mb-0 fw-bold text-xs tracking-widest uppercase">Stage {currentIdx + 1} of {stages.length}</p>
                </div>
              </div>
              <div className="text-end d-none d-md-block">
                <p className="text-xs text-secondary opacity-60 fw-black text-uppercase tracking-widest mb-1">Estimated Handover</p>
                <p className="fs-5 fw-black text-primary font-serif mb-0">{new Date(order.deadline).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Visual Timeline */}
            <div className="space-y-12 position-relative pt-4">
              <div className="position-absolute left-6 top-8 bottom-8 w-px bg-gray-100"></div>
              
              {stages.map((stageName, idx) => {
                let status = 'pending';
                if (idx < currentIdx) status = 'completed';
                if (idx === currentIdx) status = 'active';
                if (order.is_delivered && idx === stages.length - 1) status = 'completed';

                return (
                  <div key={idx} className={`d-flex gap-8 position-relative transition-all duration-500 ${status === 'pending' ? 'opacity-30' : ''}`}>
                    <div className={`size-12 rounded-full d-flex align-items-center justify-content-center z-1 transition-all duration-500 shadow-sm ${
                      status === 'completed' ? 'bg-primary text-white' :
                      status === 'active' ? 'bg-white border-4 border-primary text-primary scale-125 shadow-lg' :
                      'bg-white border text-gray-200'
                    }`}>
                      <span className="material-symbols-outlined fs-5">{icons[idx]}</span>
                    </div>
                    <div className="flex-grow-1 pt-1">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h4 className={`fs-5 fw-black tracking-tight ${status === 'active' ? 'text-primary' : 'text-dark'}`}>{stageName}</h4>
                        <span className="text-xs fw-bold text-secondary opacity-60">{status === 'completed' ? 'Done' : (status === 'active' ? 'In Progress' : 'Pending')}</span>
                      </div>
                      {status === 'active' && (
                        <div className="mt-4 w-100 h-1.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                          <div className="h-100 bg-primary rounded-full transition-all duration-1000" style={{ width: `${order.progress || 0}%` }}></div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Workshop Feed & Controls */}
          <div className="col-12 col-lg-5">
            <div className="sticky-top top-32 space-y-8">
              {/* Workshop Feed Card */}
              <div className="glass-panel p-6 rounded-2xl border-gray-100 shadow-premium">
                <div className="d-flex align-items-center justify-content-between mb-6">
                  <h3 className="fs-4 fw-black font-serif tracking-tight">Workshop Live Feed</h3>
                  <div className="px-3 py-1.5 bg-primary-10 rounded-pill d-flex align-items-center gap-2">
                    <span className="size-2 bg-primary rounded-full animate-pulse"></span>
                    <span className="text-[10px] fw-black text-primary text-uppercase tracking-widest">Active Bench</span>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Main Video Highlight */}
                  <div onClick={() => setActiveVideo("https://lh3.googleusercontent.com/aida-public/AB6AXuDb0C3cEaNfKo-hIuYaHmXGdHxWxa_u-Atuf2jNNAhXlztzOExPtP2n77PM8gKzXPvsDw4RfI9cXALBwH-BSbLtCwJQIMx1ZNEPsAuGGovVNpoxa1ORrYkMfOaDWk-BA7nQD1519Fd0qHaPod1tDtkG4KnE57O49z3_oJjZjzWb9A2gch0HSviExa7KMFWP7p-5NWl_zVw-AdHS8tEHlv9_5ex0drSJuHzXfXtWFLxzur6umDlAMHpXRdLsz2bAGU9iQExV1CmMEKi1")} className="aspect-ratio-16-9 rounded-xl overflow-hidden shadow-premium group cursor-pointer position-relative">
                    <div className="w-100 h-100 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url('${order.img || "https://lh3.googleusercontent.com/aida-public/AB6AXuDb0C3cEaNfKo-hIuYaHmXGdHxWxa_u-Atuf2jNNAhXlztzOExPtP2n77PM8gKzXPvsDw4RfI9cXALBwH-BSbLtCwJQIMx1ZNEPsAuGGovVNpoxa1ORrYkMfOaDWk-BA7nQD1519Fd0qHaPod1tDtkG4KnE57O49z3_oJjZjzWb9A2gch0HSviExa7KMFWP7p-5NWl_zVw-AdHS8tEHlv9_5ex0drSJuHzXfXtWFLxzur6umDlAMHpXRdLsz2bAGU9iQExV1CmMEKi1"}')` }}></div>
                    <div className="position-absolute top-0 bottom-0 start-0 end-0 bg-black/30 d-flex align-items-center justify-content-center">
                      <div className="size-16 bg-white/20 backdrop-blur-md rounded-full d-flex align-items-center justify-content-center text-white border border-white/30 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined fs-1">play_arrow</span>
                      </div>
                    </div>
                    <div className="position-absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded text-white text-[10px] fw-bold uppercase tracking-widest">Current Bench Stream</div>
                  </div>

                  {/* Artisan Quote */}
                  <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 position-relative">
                    <span className="material-symbols-outlined position-absolute top-[-10px] left-[-5px] text-primary opacity-20 fs-1 rotate-180">format_quote</span>
                    <p className="fs-6 text-secondary opacity-70 italic mb-4 font-display fw-medium">
                      "The material takes to molding beautifully. We are seeing exceptional tension across the major panels. A true heritage piece in the making."
                    </p>
                    <div className="d-flex align-items-center gap-3">
                      <div className="size-10 rounded-full bg-cover bg-center shadow-sm" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCxqdWC7ac3Vtvw-xcTdoXqQbIknQg-p4Dmhxucnn181g6ZVAh-SLZsWwkHkDhPVm3K-9UHk9AtxP3gpO2r1VU_cuNBKt6n0MGgTTA_c77-YrPlhFHITwMbSlWBVPZJGbiOHsgKW6xYc2AiiCYv6LKdjveCMAUsC6QM10r8MkMZ6O7ZslF2J7vcwnRonhcFDWYlpLJy79FAbVs3GdwD4Id5hKv-nTF6Mnn5UxeqB-Xo9nk_zkhZW_-DUbz1fyvT8je6xHdnqU-TRl3H')" }}></div>
                      <div>
                        <h5 className="fs-6 fw-black text-dark mb-0">Marco Sartori</h5>
                        <p className="text-[10px] text-secondary opacity-60 fw-bold text-uppercase tracking-widest mb-0">Master Artisan</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions Card */}
              <div className="p-8 bg-dark rounded-2xl text-white shadow-premium flex-column d-flex gap-6">
                <div>
                  <h4 className="fs-5 fw-black font-serif tracking-tight mb-2">Need to adjust your order?</h4>
                  <p className="text-white/40 fs-6 mb-0">Our bespoke concierges are available for any minor adjustments before sole attachment.</p>
                </div>
                <div className="d-flex gap-3 position-relative">
                  <button onClick={() => setShowConciergeModal(true)} className="flex-grow-1 py-3 bg-white text-dark rounded-pill fw-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition shadow-lg border-0">Chat with Marco</button>
                  <button onClick={() => setShowSettingsDropdown(!showSettingsDropdown)} className="size-12 bg-white/10 rounded-full d-flex align-items-center justify-content-center hover:bg-white/20 transition border-0">
                    <span className="material-symbols-outlined text-white">more_horiz</span>
                  </button>
                  
                  {showSettingsDropdown && (
                    <div className="position-absolute top-100 end-0 mt-2 w-64 bg-white/90 backdrop-blur-xl border border-gray-100 shadow-2xl rounded-2xl p-2 z-50 animate-in slide-in-from-top-4 fade-in duration-300 text-dark">
                      <button className="w-100 d-flex align-items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition border-0 bg-transparent text-start mb-1 text-sm fw-medium">
                        <span className="material-symbols-outlined fs-5">receipt_long</span> View Full Invoice
                      </button>
                      <button className="w-100 d-flex align-items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition border-0 bg-transparent text-start mb-1 text-sm fw-medium">
                        <span className="material-symbols-outlined fs-5">share</span> Share Progress
                      </button>
                      <div className="w-100 h-px bg-gray-100 my-1"></div>
                      <button className="w-100 d-flex align-items-center gap-3 p-3 rounded-xl hover:bg-red-50 text-red-500 transition border-0 bg-transparent text-start text-sm fw-medium">
                        <span className="material-symbols-outlined fs-5 text-red-500">cancel</span> Cancel Commission
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Video Modal */}
      {activeVideo && (
        <div className="position-fixed top-0 start-0 w-100 h-100 z-50 d-flex align-items-center justify-content-center">
          <div className="position-absolute top-0 start-0 w-100 h-100 bg-black/80 backdrop-blur-md animate-in fade-in" onClick={() => setActiveVideo(null)}></div>
          <div className="position-relative z-1 w-100 max-w-5xl px-4 animate-in zoom-in-95 duration-300 =">
            <button 
              onClick={() => setActiveVideo(null)}
              className="position-absolute -top-12 right-4 text-white hover:text-primary transition bg-transparent border-0 d-flex align-items-center gap-2"
            >
               <span className="text-xs fw-bold text-uppercase tracking-widest">Close</span>
               <span className="material-symbols-outlined">close</span>
            </button>
            <div className="aspect-ratio-16-9 bg-dark rounded-2xl overflow-hidden shadow-2xl border border-white/10 d-flex align-items-center justify-content-center position-relative">
               <div className="position-absolute top-0 left-0 w-100 h-100 bg-cover bg-center opacity-50 blur-sm" style={{backgroundImage: `url('${activeVideo}')`}}></div>
               <img src={activeVideo} className="h-100 w-auto max-w-100 position-relative z-1 object-contain shadow-2xl" alt="Video Feed" />
               <div className="position-absolute bottom-6 left-6 z-1 bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 d-flex gap-3 align-items-center">
                 <span className="size-2 bg-red-500 rounded-full animate-pulse"></span>
                 <span className="text-white text-xs fw-black text-uppercase tracking-widest">Live Workshop Feed</span>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Concierge/Chat Modal */}
      {showConciergeModal && (
        <div className="position-fixed top-0 start-0 w-100 h-100 z-50 d-flex align-items-center justify-content-center">
          <div className="position-absolute w-100 h-100 bg-black/60 backdrop-blur-sm animate-in fade-in" onClick={() => setShowConciergeModal(false)}></div>
          <div className="position-relative z-1 bg-white rounded-3xl p-8 max-w-md w-100 mx-4 shadow-2xl animate-in zoom-in-95">
            <div className="d-flex align-items-center gap-4 mb-6">
              <div className="size-16 rounded-full bg-cover bg-center shadow-lg" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCxqdWC7ac3Vtvw-xcTdoXqQbIknQg-p4Dmhxucnn181g6ZVAh-SLZsWwkHkDhPVm3K-9UHk9AtxP3gpO2r1VU_cuNBKt6n0MGgTTA_c77-YrPlhFHITwMbSlWBVPZJGbiOHsgKW6xYc2AiiCYv6LKdjveCMAUsC6QM10r8MkMZ6O7ZslF2J7vcwnRonhcFDWYlpLJy79FAbVs3GdwD4Id5hKv-nTF6Mnn5UxeqB-Xo9nk_zkhZW_-DUbz1fyvT8je6xHdnqU-TRl3H')" }}></div>
              <div>
                <h4 className="fs-5 fw-black font-serif mb-0">Marco Sartori</h4>
                <p className="text-xs text-green-500 fw-bold d-flex align-items-center gap-1"><span className="size-2 rounded-full bg-green-500 d-inline-block"></span> Working on {order.orderId || orderId}</p>
              </div>
            </div>
            <textarea className="w-100 bg-gray-50 border border-gray-100 rounded-2xl p-4 mb-4 resize-none outline-none focus:border-primary transition fw-medium" rows="4" placeholder="Need to adjust your fitting or ask about progress?"></textarea>
            <div className="d-flex gap-3">
               <button onClick={() => setShowConciergeModal(false)} className="flex-grow-1 py-3 bg-dark text-white rounded-pill fw-black text-xs uppercase tracking-widest shadow-lg d-flex align-items-center justify-content-center gap-2 hover:bg-primary transition border-0">
                 <span className="material-symbols-outlined fs-5">send</span>
                 Direct Message
               </button>
               <button onClick={() => setShowConciergeModal(false)} className="py-3 px-4 rounded-pill bg-gray-50 text-dark fw-bold text-xs hover:bg-gray-100 border-0 transition text-uppercase tracking-widest">
                 Cancel
               </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default UserOrderTracking;
