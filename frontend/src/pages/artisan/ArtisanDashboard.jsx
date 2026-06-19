import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Button as BsButton } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../utils/axiosInstance';
import { useAuth } from '../../context/AuthContext';

const STAGES = ['Design Prep', 'Cutting', 'Lasting', 'Stitching', 'Finished'];

const ArtisanDashboard = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [showInventoryToast, setShowInventoryToast] = useState(false);
  
  const navigate = useNavigate();

  const [activeTask, setActiveTask] = useState({ id: '', type: '', _id: '' });
  const [queue, setQueue] = useState([]);
  const [productionStage, setProductionStage] = useState(0); // 0 to 4
  const [pendingAssignment, setPendingAssignment] = useState(null);

  const { user } = useAuth();

  const getStageIndex = useCallback((stage) => Math.max(0, STAGES.indexOf(stage)), []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const [ordersRes, woRes] = await Promise.all([
          axios.get('/api/orders'),
          axios.get('/api/work-orders')
        ]);

        // Find work orders for this specific artisan
        const artisanWOs = woRes.data.filter(wo => {
          const woAssignedId = (wo.assigned_to?._id || wo.assigned_to || '').toString();
          const currentUserId = (user?._id || '').toString();
          const woAssignedName = (wo.assigned_to?.name || '').trim().toLowerCase();
          const currentUserName = (user?.name || '').trim().toLowerCase();
          return (woAssignedId && currentUserId && woAssignedId === currentUserId) || 
                 (woAssignedName && currentUserName && woAssignedName === currentUserName);
        });

        const assignedOrderIds = artisanWOs.map(wo => (wo.order_id?._id || wo.order_id || '').toString());
          
        const activeOrders = ordersRes.data.filter(order => {
          if (order.phase === 'Finished') return false;
          const orderIdStr = (order._id || '').toString();
          const orderArtisan = (order.artisan || '').trim().toLowerCase();
          const orderPatron = (order.patron || '').trim().toLowerCase();
          const currentUserName = (user?.name || '').trim().toLowerCase();
          
          return assignedOrderIds.includes(orderIdStr) || 
                 (orderArtisan && currentUserName && orderArtisan === currentUserName) || 
                 (orderPatron && currentUserName && orderPatron === currentUserName);
        });

        const formatted = activeOrders.map(o => ({
          _id: o._id,
          id: o.orderId || o.order_id,
          type: o.model,
          stage: o.phase,
          img: o.img || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdr4fpidJdHaFOf3MVvqNfIEbStEsHTVkZIrtruS5izzEplVrtIFxfO_pXaTZqcJLDmf-CqLFxuII9ZhLArnv6cacGyuRBKO8J7cOHPhp6XvKinI0c1LZvPmzUt1hJpsxjXQ3hg8GDfNbeGliMdKre7X6pKd75oVW5l6OaAr1CXR13Q1NqqGfauAjF2ppSByHiPg4TJQZ3j5O_0E-6vmhUsJXr-GdSKTzLfw7FpCfu8zyKlhnoHUkCEjSxqe3juIvb13tY3pgOX5GX',
          patron: o.patron,
          instructions: o.instructions || 'Standard bespoke assembly.'
        }));

        setQueue(formatted);

        // Check if there's a dynamic pending assignment
        const pendingWO = artisanWOs.find(wo => wo.status === 'Pending');
        if (pendingWO) {
          const correspondingOrder = ordersRes.data.find(o => o._id === (pendingWO.order_id?._id || pendingWO.order_id));
          if (correspondingOrder) {
            setPendingAssignment({
              woId: pendingWO._id,
              orderId: correspondingOrder.orderId,
              model: correspondingOrder.model,
              patron: correspondingOrder.patron,
              img: correspondingOrder.img || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdr4fpidJdHaFOf3MVvqNfIEbStEsHTVkZIrtruS5izzEplVrtIFxfO_pXaTZqcJLDmf-CqLFxuII9ZhLArnv6cacGyuRBKO8J7cOHPhp6XvKinI0c1LZvPmzUt1hJpsxjXQ3hg8GDfNbeGliMdKre7X6pKd75oVW5l6OaAr1CXR13Q1NqqGfauAjF2ppSByHiPg4TJQZ3j5O_0E-6vmhUsJXr-GdSKTzLfw7FpCfu8zyKlhnoHUkCEjSxqe3juIvb13tY3pgOX5GX',
              instructions: pendingWO.instructions || 'Custom patina requested.'
            });
            setShowNotification(true);
          }
        }

        if (formatted.length > 0) {
          setActiveTask(formatted[0]);
          setProductionStage(getStageIndex(formatted[0].stage));
        }
      } catch (err) {
        console.error('Failed to fetch orders', err);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user, getStageIndex]);

  const updateStage = async (newIdx) => {
    if (!activeTask._id) return;
    const newStage = STAGES[newIdx];
    try {
      await axios.put(`/api/orders/${activeTask.id}`, { phase: newStage, progress: Math.floor((newIdx / 4) * 100) });
      setProductionStage(newIdx);
      setQueue(prev => prev.map(q => q._id === activeTask._id ? { ...q, stage: newStage } : q));
    } catch (err) {
      console.error('Failed to update stage', err);
    }
  };

  const handleClose = () => setShowNotification(false);

  const handleDecline = () => {
    setShowNotification(false);
  };

  const handleAccept = async () => {
    setShowNotification(false);
    if (pendingAssignment) {
      try {
        await axios.put(`/api/work-orders/${pendingAssignment.woId}`, { status: 'In Progress' });
        navigate(`/artisan/production/${pendingAssignment.orderId.replace('#', '')}`);
      } catch (err) {
        console.error('Failed to accept work order', err);
      }
    }
  };

  const handleQueueClick = (item) => {
    setActiveTask(item);
    setProductionStage(getStageIndex(item.stage));
  };

  return (
    <div className="p-4 p-lg-5 pb-12 animate-in fade-in duration-1000">
      {/* New Task Notification Modal */}
      <Modal show={showNotification} onHide={handleClose} centered size="lg" className="artisan-notification-modal">
        <Modal.Header closeButton className="border-bottom border-primary-10 bg-primary-5">
          <Modal.Title className="d-flex align-items-center gap-3">
            <span className="material-symbols-outlined text-primary fs-3">campaign</span>
            <span className="fw-black tracking-tighter">New Assignment</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-5 p-md-5">
          <div className="row g-5 align-items-center">
            <div className="col-md-5">
              <div className="rounded-2xl overflow-hidden border border-primary-20 shadow-premium" style={{ aspectRatio: '1/1' }}>
                <img 
                  src={pendingAssignment?.img || "https://lh3.googleusercontent.com/aida-public/AB6AXuCdr4fpidJdHaFOf3MVvqNfIEbStEsHTVkZIrtruS5izzEplVrtIFxfO_pXaTZqcJLDmf-CqLFxuII9ZhLArnv6cacGyuRBKO8J7cOHPhp6XvKinI0c1LZvPmzUt1hJpsxjXQ3hg8GDfNbeGliMdKre7X6pKd75oVW5l6OaAr1CXR13Q1NqqGfauAjF2ppSByHiPg4TJQZ3j5O_0E-6vmhUsJXr-GdSKTzLfw7FpCfu8zyKlhnoHUkCEjSxqe3juIvb13tY3pgOX5GX"} 
                  alt={pendingAssignment?.model || "Oxford"} 
                  className="w-100 h-100 object-fit-cover"
                />
              </div>
            </div>
            <div className="col-md-7">
              <div className="mb-3 d-flex align-items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-primary-10 text-primary text-[10px] fw-black text-uppercase tracking-[0.2em]">Priority Order</span>
                <span className="text-stone-400 text-xs fw-bold tracking-tight">RECEIVED JUST NOW</span>
              </div>
              <h2 className="fs-3 fw-black font-serif text-dark mb-3">#{pendingAssignment?.orderId} {pendingAssignment?.model}</h2>
              <div className="mb-5">
                <p className="fs-6 text-stone-600 mb-2">Bespoke request for <span className="text-dark fw-bold">{pendingAssignment?.patron || 'Patron'}</span></p>
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-100">
                  <p className="text-stone-500 italic small mb-0 d-flex gap-2">
                    <span className="material-symbols-outlined fs-6 text-primary">format_quote</span>
                    {pendingAssignment?.instructions}
                  </p>
                </div>
              </div>
              <div className="d-flex gap-3">
                <BsButton variant="outline-stone" className="flex-grow-1 py-3 fw-bold rounded-xl border-stone-200 text-stone-600" onClick={handleDecline}>Decline</BsButton>
                <BsButton className="bg-primary border-0 flex-grow-1 py-3 fw-bold rounded-xl shadow-lg shadow-primary/20" onClick={handleAccept}>Accept & Start</BsButton>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {showInventoryToast && (
        <div className="position-fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom duration-500">
           <div className="bg-dark text-white px-6 py-4 rounded-2xl shadow-2xl d-flex align-items-center gap-4 border border-stone-800">
              <span className="material-symbols-outlined text-emerald-500">check_circle</span>
              <div>
                 <p className="fs-6 fw-bold mb-0">Inventory Request Sent</p>
                 <p className="text-white/60 text-[10px] mb-0 tracking-widest uppercase">Stockroom will confirm shortly.</p>
              </div>
              <button onClick={() => setShowInventoryToast(false)} className="text-white/40 hover:text-white ms-4"><span className="material-symbols-outlined fs-5">close</span></button>
           </div>
        </div>
      )}

      {/* Workshop Header & Stats */}
      <header className="mb-10">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-4 mb-8">
          <div>
            <h2 className="display-6 fw-black tracking-tighter mb-1 text-dark font-serif lowercase">Workshop.overview</h2>
            <p className="text-stone-500 fw-bold text-xs text-uppercase tracking-[0.3em]">Master Artisan: {user?.name || 'Artisan'} • {new Date().toLocaleDateString()}</p>
          </div>
          <div className="d-flex gap-3 align-items-center flex-wrap">
            <button onClick={() => navigate('/artisan/clips')} className="d-flex align-items-center gap-2 px-4 py-3 bg-primary text-white rounded-xl fs-6 fw-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition hover:-translate-y-1">
              <span className="material-symbols-outlined fs-5">upload</span>
              Post Workshop Clip
            </button>
          </div>
        </div>

        {/* Global Key Metrics */}
        <div className="row g-4 mb-8">
          <div className="col-md-6">
            <div className="glass-panel p-4 rounded-2xl border-stone-100 shadow-premium group cursor-pointer hover:border-primary/30 transition-colors">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="size-10 bg-primary/10 rounded-xl d-flex align-items-center justify-content-center text-primary">
                  <span className="material-symbols-outlined fs-5">precision_manufacturing</span>
                </div>
                <span className="text-emerald-500 text-[10px] fw-black tracking-widest">+12% vs LW</span>
              </div>
              <p className="text-stone-400 text-[10px] fw-black text-uppercase tracking-[0.2em] mb-1">Active Builds</p>
              <h4 className="fs-3 fw-black text-dark mb-0">{queue.length} <span className="fs-6 text-stone-300">Total</span></h4>
            </div>
          </div>
          <div className="col-md-6">
            <div className="glass-panel p-4 rounded-2xl border-stone-100 shadow-premium group cursor-pointer hover:border-amber-500/30 transition-colors">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="size-10 bg-amber-500/10 rounded-xl d-flex align-items-center justify-content-center text-amber-600">
                  <span className="material-symbols-outlined fs-5">timer</span>
                </div>
                <span className="text-amber-500 text-[10px] fw-black tracking-widest">CRITICAL</span>
              </div>
              <p className="text-stone-400 text-[10px] fw-black text-uppercase tracking-[0.2em] mb-1">Avg. Cycle Time</p>
              <h4 className="fs-3 fw-black text-dark mb-0">12.4 <span className="fs-6 text-stone-300">Days</span></h4>
            </div>
          </div>
        </div>
      </header>

      <div className="row g-5">
        {/* Main Production Focus */}
        <div className="col-lg-8">
          {activeTask.id ? (
            <section className="bg-white rounded-[2.5rem] shadow-premium border border-stone-100 overflow-hidden mb-8">
              <div className="p-6 border-bottom border-stone-100 bg-stone-50/30 d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-4">
                  <span className="px-3 py-1 bg-primary text-white text-[10px] fw-black text-uppercase tracking-widest rounded-lg shadow-lg shadow-primary/20">LIVE PRODUCTION</span>
                  <h3 className="fs-5 fw-black font-serif text-dark tracking-tight mb-0">Current Task: Custom {activeTask.type}</h3>
                </div>
                <div className="px-4 py-2 bg-white rounded-xl border border-stone-200 text-stone-500 text-xs fw-black shadow-sm">
                  ORDER {activeTask.id}
                </div>
              </div>
              
              <div className="p-8">
                <div className="row g-5 align-items-center mb-10">
                  <div className="col-md-5">
                    <div className="aspect-ratio-4-5 rounded-3xl bg-center bg-cover shadow-premium border border-stone-200 overflow-hidden group position-relative" style={{ backgroundImage: `url('${activeTask.img}')` }}>
                      <div className="position-absolute inset-0 bg-primary/20 bg-blend-soft-light opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                    </div>
                  </div>
                  <div className="col-md-7 space-y-8">
                    <div className="row g-4">
                      <div className="col-6">
                        <p className="text-[10px] text-stone-400 fw-black text-uppercase tracking-[0.2em] mb-1">Patron Profile</p>
                        <p className="fs-5 fw-black text-dark tracking-tight">{activeTask.patron || 'Jonathan Reeves'}</p>
                        <span className="text-xs text-stone-500 fw-bold bg-stone-50 px-3 py-1 rounded-full border border-stone-100">patron</span>
                      </div>
                      <div className="col-6">
                        <p className="text-[10px] text-stone-400 fw-black text-uppercase tracking-[0.2em] mb-1">Production status</p>
                        <p className="fs-5 fw-black text-primary tracking-tight">{activeTask.stage}</p>
                      </div>
                    </div>

                    <div className="p-5 bg-amber-50/50 rounded-2xl border border-amber-100/50">
                      <div className="d-flex align-items-center gap-2 mb-2">
                         <span className="material-symbols-outlined text-amber-600 fs-5">warning</span>
                         <span className="text-[10px] fw-black text-amber-700 text-uppercase tracking-[0.2em]">Workshop Directives</span>
                      </div>
                      <p className="fs-6 text-stone-700 italic fw-medium leading-relaxed mb-0">
                        {activeTask.instructions || "Double-stitched welt, burnished toe caps. Ensure high grain alignment precision."}
                      </p>
                    </div>

                    <div className="d-flex gap-4">
                      <Link to={`/artisan/production/${activeTask.id.replace('#', '')}`} className="btn btn-dark flex-grow-1 py-4 reset-btn rounded-2xl fw-black text-xs text-uppercase tracking-widest shadow-xl hover:-translate-y-1 transition duration-500 d-flex align-items-center justify-content-center text-decoration-none text-white">
                        Open Technical Pack
                      </Link>
                      <Link to="/artisan/messages" className="btn btn-white size-14 rounded-2xl border border-stone-200 d-flex align-items-center justify-content-center text-stone-400 hover:text-primary transition duration-500 relative group">
                        <span className="material-symbols-outlined">chat</span>
                        <span className="position-absolute top-0 right-0 size-2 bg-rose-500 rounded-full translate-x-1 -translate-y-1 border border-white"></span>
                        <div className="position-absolute bottom-100 mb-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-dark text-white text-[10px] fw-bold px-2 py-1 rounded shadow-lg pointer-events-none">Message Patron</div>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Progress Stepper */}
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-6">
                    <h4 className="text-[10px] fw-black text-stone-400 text-uppercase tracking-[0.3em]">Lifecycle Progression</h4>
                    <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] fw-black tracking-widest">STAGE: {STAGES[productionStage]} ({(productionStage/4)*100}%)</div>
                  </div>
                  
                  <div className="position-relative px-4 py-8">
                    <div className="position-absolute top-1/2 left-4 right-4 h-[2px] bg-stone-100 -translate-y-1/2"></div>
                    <div className="position-absolute top-1/2 left-4 h-[3px] bg-primary -translate-y-1/2 transition-all duration-1000 shadow-sm shadow-primary/50" style={{ width: `${(productionStage / 4) * 100}%` }}></div>
                    
                    <div className="position-relative d-flex justify-content-between">
                      {[
                        { name: 'Design Prep', icon: 'draw' },
                        { name: 'Cutting', icon: 'content_cut' },
                        { name: 'Lasting', icon: 'layers' },
                        { name: 'Stitching', icon: 'straighten' },
                        { name: 'Finished', icon: 'check_circle' }
                      ].map((step, idx) => {
                        let sStatus = 'pending';
                        if (idx < productionStage) sStatus = 'done';
                        if (idx === productionStage) sStatus = 'active';
                        return (
                        <div key={idx} className="d-flex flex-column align-items-center group">
                          <div className={`size-12 rounded-full d-flex align-items-center justify-content-center border-4 border-white z-1 transition-all duration-500 ${
                            sStatus === 'done' ? 'bg-primary text-white shadow-lg shadow-primary/30' :
                            sStatus === 'active' ? 'bg-white border-primary text-primary scale-125 shadow-xl' :
                            'bg-stone-100 text-stone-300'
                          }`}>
                            <span className="material-symbols-outlined fs-5">
                              {sStatus === 'done' ? 'check' : step.icon}
                            </span>
                          </div>
                          <span className={`mt-3 text-[9px] fw-black text-uppercase tracking-[0.2em] transform transition ${sStatus === 'active' ? 'text-primary' : 'text-stone-400'}`}>
                            {step.name}
                          </span>
                        </div>
                      )})}
                    </div>
                  </div>

                  <div className="mt-10 pt-8 border-top border-stone-100 d-flex flex-column flex-md-row gap-3">
                    <button onClick={() => updateStage(Math.max(0, productionStage - 1))} className="btn btn-white flex-grow-1 py-4 rounded-2xl fw-black text-xs text-uppercase tracking-widest text-stone-500 border-stone-200 hover:bg-stone-50 shadow-sm border border-stone-200">
                      Revert Stage
                    </button>
                    <button onClick={() => updateStage(Math.min(4, productionStage + 1))} className="btn btn-primary flex-grow-1 py-4 rounded-2xl fw-black text-xs text-uppercase tracking-widest shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition duration-500 d-flex justify-content-center align-items-center gap-3">
                      Advance Stage
                      <span className="material-symbols-outlined fs-5">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>
          ) : (
            <div className="p-8 text-center glass-panel rounded-[2.5rem] text-stone-400 border border-stone-100 mb-8 font-medium">
              No active tasks checked out at this station. Select a priority queue item to begin work.
            </div>
          )}
        </div>

        {/* Sidebar: Queue & Materials */}
        <div className="col-lg-4 space-y-8">
          {/* Refined Workshop Queue */}
          <section className="bg-white rounded-[2rem] shadow-premium border border-stone-100 p-6">
            <div className="d-flex justify-content-between align-items-center mb-6">
              <h3 className="text-[10px] fw-black text-stone-400 text-uppercase tracking-[0.4em] d-flex align-items-center gap-3">
                <span className="material-symbols-outlined fs-5">view_carousel</span>
                Priority Queue
              </h3>
              <span className="badge bg-stone-100 text-stone-500 border-0 fs-6 px-3 py-2 rounded-xl fw-black">{queue.length}</span>
            </div>
            
            <div className="space-y-4">
              {queue.map((item, idx) => {
                const isActive = activeTask.id === item.id;
                return (
                <div key={idx} onClick={() => handleQueueClick(item)} className={`p-3 rounded-2xl border transition duration-500 d-flex gap-4 align-items-center group cursor-pointer ${isActive ? 'bg-primary/10 border-primary/20 shadow-md ring-2 ring-primary/5' : 'bg-white border-stone-100 hover:bg-stone-50 shadow-sm'}`}>
                  <div className="size-16 rounded-xl bg-center bg-cover border border-stone-200 shadow-inner group-hover:scale-105 transition-transform" style={{ backgroundImage: `url('${item.img}')` }}></div>
                  <div className="flex-grow-1 min-w-0">
                    <p className={`fs-6 fw-black text-truncate mb-0 ${isActive ? 'text-primary' : 'text-dark'}`}>{item.id} {item.type}</p>
                    <p className={`text-[10px] fw-black text-uppercase tracking-widest mt-1 ${isActive ? 'text-primary' : 'text-stone-400'}`}>
                      {isActive ? 'IN PRODUCTION' : `Wait: ${item.stage}`}
                    </p>
                  </div>
                  {isActive ? (
                    <span className="material-symbols-outlined text-primary fs-3 animate-pulse">play_circle</span>
                  ) : (
                    <span className="material-symbols-outlined text-stone-300 group-hover:text-primary transition shadow-none">pause_circle</span>
                  )}
                </div>
              )})}
              {queue.length === 0 && (
                <div className="p-4 text-center text-stone-400 text-sm fw-bold">Queue is currently clear.</div>
              )}
            </div>
            <Link to="/artisan/assignments" className="w-100 mt-6 py-3 bg-stone-50 rounded-2xl text-stone-500 hover:text-stone-800 fs-6 fw-black d-flex align-items-center justify-content-center gap-2 transition border border-transparent hover:border-stone-200 text-uppercase tracking-widest text-[10px] text-decoration-none">
              Access Complete Queue ({queue.length})
              <span className="material-symbols-outlined fs-5">arrow_right_alt</span>
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ArtisanDashboard;
