import { useState, useEffect } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const UserOrderTracking = () => {
  const { id } = useParams();
  const orderId = id || 'AS-88219';

  const { user } = useAuth();
  const { showToast, showConfirm } = useToast();
  const [searchParams] = useSearchParams();
  const autoOpenChat = searchParams.get('chat') === 'true';

  const [activeVideo, setActiveVideo] = useState(null);
  const [showConciergeModal, setShowConciergeModal] = useState(false);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [assignedArtisan, setAssignedArtisan] = useState(null);

  useEffect(() => {
    if (autoOpenChat) {
      setShowConciergeModal(true);
    }
  }, [autoOpenChat]);

  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');

  const fetchChatMessages = async (orderDbId) => {
    if (!orderDbId) return;
    try {
      const { data } = await axiosInstance.get(`/api/chat?thread_id=${orderDbId}`);
      setChatMessages(data);
    } catch (err) {
      console.error('Failed to fetch chat messages', err);
    }
  };

  useEffect(() => {
    if (showConciergeModal && order?._id) {
      fetchChatMessages(order._id);
      const interval = setInterval(() => fetchChatMessages(order._id), 5000);
      return () => clearInterval(interval);
    }
  }, [showConciergeModal, order]);

  const handleSendChatMessage = async (e) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || !user?._id || !order?._id) return;
    try {
      await axiosInstance.post('/api/chat', {
        sender_id: user._id,
        content: chatInput,
        thread_id: order._id,
        order_id: order._id
      });
      setChatInput('');
      fetchChatMessages(order._id);
    } catch (err) {
      console.error('Failed to send chat message', err);
    }
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await axiosInstance.get(`/api/orders/${orderId}`);
        setOrder(data);
      } catch (err) {
        console.error('Failed to fetch order', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  useEffect(() => {
    const fetchAssignedArtisan = async () => {
      try {
        if (!order) return;
        const { data: woData } = await axiosInstance.get('/api/work-orders');
        const activeWO = woData.find(wo => 
          (wo.order_id?._id === order._id || wo.order_id === order._id) && 
          wo.assigned_to
        );
        if (activeWO) {
          setAssignedArtisan(activeWO.assigned_to);
        }
      } catch (err) {
        console.error('Failed to fetch assigned artisan', err);
      }
    };
    fetchAssignedArtisan();
  }, [order]);

  const handleCancelCommission = () => {
    if (!order?._id) return;
    showConfirm(
      'Are you sure you want to cancel this commission? This action cannot be undone.',
      async () => {
        try {
          await axiosInstance.put(`/api/orders/${order._id}`, { status: 'Cancelled' });
          setOrder(prev => ({ ...prev, status: 'Cancelled' }));
          showToast('Commission cancelled successfully.', 'success');
          setShowSettingsDropdown(false);
        } catch {
          showToast('Failed to cancel commission. Please try again.', 'error');
        }
      }
    );
  };

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

  const stages = ['Design Prep', 'Cutting', 'Lasting', 'Stitching', 'Quality Control', 'Finished'];
  const icons = ['draw', 'content_cut', 'layers', 'straighten', 'verified', 'local_shipping'];
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
                      <div className="size-10 rounded-full bg-cover bg-center shadow-sm" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80')" }}></div>
                      <div>
                        <h5 className="fs-6 fw-black text-dark mb-0">{assignedArtisan ? assignedArtisan.name : 'Atelier Concierge'}</h5>
                        <p className="text-[10px] text-secondary opacity-60 fw-bold text-uppercase tracking-widest mb-0">{assignedArtisan ? 'Assigned Master Artisan' : 'Master Artisan'}</p>
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
                  <button onClick={() => setShowConciergeModal(true)} className="flex-grow-1 py-3 bg-white text-dark rounded-pill fw-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition shadow-lg border-0">Chat with {assignedArtisan ? assignedArtisan.name : 'Concierge'}</button>
                  <button onClick={() => setShowSettingsDropdown(!showSettingsDropdown)} className="size-12 bg-white/10 rounded-full d-flex align-items-center justify-content-center hover:bg-white/20 transition border-0">
                    <span className="material-symbols-outlined text-white">more_horiz</span>
                  </button>
                  
                  {showSettingsDropdown && (
                    <div className="position-absolute top-100 end-0 mt-2 w-64 bg-white/90 backdrop-blur-xl border border-gray-100 shadow-2xl rounded-2xl p-2 z-50 animate-in slide-in-from-top-4 fade-in duration-300 text-dark">
                      <div className="w-100 h-px bg-gray-100 my-1"></div>
                      <button 
                        onClick={handleCancelCommission}
                        className="w-100 d-flex align-items-center gap-3 p-3 rounded-xl hover:bg-red-50 text-red-500 transition border-0 bg-transparent text-start text-sm fw-medium"
                      >
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
        <div className="position-fixed top-0 start-0 w-100 h-100 z-50 d-flex align-items-center justify-content-center p-4">
          <div className="position-absolute w-100 h-100 bg-black/60 backdrop-blur-sm animate-in fade-in" onClick={() => setShowConciergeModal(false)}></div>
          <div className="position-relative z-1 bg-white rounded-[2rem] w-100 max-w-lg shadow-2xl animate-in zoom-in-95 d-flex flex-column" style={{ height: '550px' }}>
            <div className="p-6 border-bottom border-stone-100 bg-stone-50 rounded-t-[2rem] d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center gap-4">
                <div className="size-12 rounded-full bg-cover bg-center shadow-md" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80')" }}></div>
                <div>
                  <h4 className="fs-5 fw-black font-serif mb-0 text-dark">{assignedArtisan ? assignedArtisan.name : 'Atelier Concierge'}</h4>
                  <p className="text-[10px] text-green-500 fw-bold tracking-wider mb-0 uppercase d-flex align-items-center gap-1">
                    <span className="size-1.5 rounded-full bg-green-500 d-inline-block animate-ping"></span> 
                    Active Bench Comm
                  </p>
                </div>
              </div>
              <button onClick={() => setShowConciergeModal(false)} className="size-8 rounded-full bg-stone-100 hover:bg-stone-200 transition border-0 d-flex align-items-center justify-content-center text-stone-600">
                <span className="material-symbols-outlined fs-5">close</span>
              </button>
            </div>
            
            <div className="flex-grow-1 p-6 overflow-y-auto custom-scrollbar bg-stone-50/50 space-y-4" style={{ display: 'flex', flexDirection: 'column-reverse' }}>
              <div className="space-y-4">
                {chatMessages.map((msg, idx) => {
                  const isUser = msg.sender_id?._id === user?._id || msg.sender_id === user?._id || msg.sender_id?.role === 'user';
                  return (
                    <div key={idx} className={`d-flex ${isUser ? 'justify-content-end' : 'justify-content-start'}`}>
                      <div className={`p-4 rounded-2xl max-w-[80%] shadow-sm ${isUser ? 'bg-primary text-white rounded-tr-none' : 'bg-white border border-stone-100 text-dark rounded-tl-none'}`}>
                        <p className="text-sm mb-1 leading-relaxed">{msg.content}</p>
                        <span className={`text-[8px] fw-bold ${isUser ? 'text-white/60' : 'text-stone-400'}`}>
                          {new Date(msg.timestamp || msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })}
                {chatMessages.length === 0 && (
                  <div className="text-center text-stone-400 py-10 text-xs fw-bold">
                    No conversation history. Send a message to start!
                  </div>
                )}
              </div>
            </div>

            <form onSubmit={handleSendChatMessage} className="p-4 bg-white border-top border-stone-100 rounded-b-[2rem]">
              <div className="d-flex align-items-center gap-2 p-2 border border-stone-200 rounded-xl bg-stone-50">
                <input 
                  type="text" 
                  value={chatInput} 
                  onChange={(e) => setChatInput(e.target.value)} 
                  placeholder="Ask about details or modifications..." 
                  className="flex-grow-1 bg-transparent border-0 outline-none text-sm text-dark px-2"
                />
                <button type="submit" disabled={!chatInput.trim()} className="size-9 rounded-lg bg-primary text-white border-0 hover:scale-105 transition-all d-flex align-items-center justify-content-center disabled:opacity-50 disabled:hover:scale-100">
                  <span className="material-symbols-outlined fs-5">send</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default UserOrderTracking;
