import React, { useState, useEffect } from 'react';
import { Modal, Button as BsButton } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const ArtisanDashboard = () => {
  const [showNotification, setShowNotification] = useState(true);
  const [showFloorModal, setShowFloorModal] = useState(false);
  const [showInventoryToast, setShowInventoryToast] = useState(false);
  
  const navigate = useNavigate();

  const [activeTask, setActiveTask] = useState({ id: '#AS-8821', type: 'Oxford' });
  const [queue, setQueue] = useState([]);
  const [productionStage, setProductionStage] = useState(0); // 0 to 4

  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get('/api/orders');
        const formatted = data.map(o => ({
          _id: o._id,
          id: o.orderId,
          type: o.model,
          stage: o.phase,
          img: o.img || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdr4fpidJdHaFOf3MVvqNfIEbStEsHTVkZIrtruS5izzEplVrtIFxfO_pXaTZqcJLDmf-CqLFxuII9ZhLArnv6cacGyuRBKO8J7cOHPhp6XvKinI0c1LZvPmzUt1hJpsxjXQ3hg8GDfNbeGliMdKre7X6pKd75oVW5l6OaAr1CXR13Q1NqqGfauAjF2ppSByHiPg4TJQZ3j5O_0E-6vmhUsJXr-GdSKTzLfw7FpCfu8zyKlhnoHUkCEjSxqe3juIvb13tY3pgOX5GX'
        }));
        setQueue(formatted);
        if (formatted.length > 0 && !activeTask.id) {
          setActiveTask(formatted[0]);
          setProductionStage(getStageIndex(formatted[0].stage));
        }
      } catch (err) {
        console.error('Failed to fetch orders', err);
      }
    };
    fetchOrders();
  }, []);

  const stages = ['Design Prep', 'Cutting', 'Lasting', 'Stitching', 'Finished'];
  const getStageIndex = (stage) => Math.max(0, stages.indexOf(stage));

  const updateStage = async (newIdx) => {
    if (!activeTask._id) return;
    const newStage = stages[newIdx];
    try {
      await axios.put(`/api/orders/${activeTask._id}`, { phase: newStage });
      setProductionStage(newIdx);
      setQueue(prev => prev.map(q => q._id === activeTask._id ? { ...q, stage: newStage } : q));
    } catch (err) {
      console.error('Failed to update stage', err);
    }
  };

  const handleClose = () => setShowNotification(false);

  const handleDecline = () => {
    // In a real app, notify the backend the artisan declined it.
    setShowNotification(false);
  };

  const handleAccept = () => {
    setShowNotification(false);
    setActiveTask({ id: '#AS-9421', type: 'Heritage Oxford' });
    navigate('/artisan/production/AS-9421');
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
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCITHHo8wDixlcnhF_JcmbCp-3HVMey47V5pkIGOLRPZY614_JBvAMEixVgvnoMj_ooNXJJZdDt35aq-8D9zOkdbW0o2UrItPyQr_XhEdC6EbwjBQQNIh2SdotIrBGp79dbWJFd5ykaBALWJR917EDAxInsOmXtLOKKSOtQRDG-zGIHO2R86xSxPquPUOB0Y8pw47JDEt4WkTvqdxWQjysdzzZrzDrYkmaB1LHdfrdKNr2U02MjA7Lv4mtno_4b87A1aXgAZ4Vj7I-1" 
                  alt="Heritage Oxford" 
                  className="w-100 h-100 object-fit-cover"
                />
              </div>
            </div>
            <div className="col-md-7">
              <div className="mb-3 d-flex align-items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-primary-10 text-primary text-[10px] fw-black text-uppercase tracking-[0.2em]">Priority Order</span>
                <span className="text-stone-400 text-xs fw-bold tracking-tight">RECEIVED 2M AGO</span>
              </div>
              <h2 className="fs-3 fw-black font-serif text-dark mb-3">#AS-9421 Heritage Oxford</h2>
              <div className="mb-5">
                <p className="fs-6 text-stone-600 mb-2">Bespoke request for <span className="text-dark fw-bold">Eleanor Maura</span></p>
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-100">
                  <p className="text-stone-500 italic small mb-0 d-flex gap-2">
                    <span className="material-symbols-outlined fs-6 text-primary">format_quote</span>
                    "Requesting deep chestnut tan patina with custom initials on the inner heel. Ensure the last follows the high-arch measurement provided."
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

      <Modal show={showFloorModal} onHide={() => setShowFloorModal(false)} centered className="artisan-modal">
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fs-5 fw-black font-serif tracking-tight">Configure Floor Layout</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <p className="text-stone-500 text-sm">Select active modules for your current workstation.</p>
          <div className="d-flex flex-column gap-3">
             <label className="d-flex align-items-center gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200 cursor-pointer">
                <input type="checkbox" defaultChecked className="form-check-input mt-0" />
                <span className="text-dark fw-bold text-sm">Buffing & Polishing Station</span>
             </label>
             <label className="d-flex align-items-center gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200 cursor-pointer">
                <input type="checkbox" defaultChecked className="form-check-input mt-0" />
                <span className="text-dark fw-bold text-sm">Precision Stitching Laser</span>
             </label>
          </div>
          <BsButton className="w-100 bg-dark py-3 mt-4 border-0 rounded-xl fw-bold" onClick={() => setShowFloorModal(false)}>Save Configuration</BsButton>
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
          <div className="d-flex gap-3">
            <button onClick={() => setShowFloorModal(true)} className="d-flex align-items-center gap-2 px-4 py-3 bg-white border border-stone-200 rounded-xl fs-6 fw-bold text-stone-600 hover:bg-stone-50 transition shadow-sm">
              <span className="material-symbols-outlined fs-5">tune</span>
              Configure Floor
            </button>
            <button onClick={() => navigate('/artisan/clips')} className="d-flex align-items-center gap-2 px-4 py-3 bg-primary text-white rounded-xl fs-6 fw-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition hover:-translate-y-1">
              <span className="material-symbols-outlined fs-5">upload</span>
              Post Workshop Clip
            </button>
          </div>
        </div>

        {/* Global Key Metrics */}
        <div className="row g-4 mb-8">
          <div className="col-md-3">
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
          <div className="col-md-3">
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
          <div className="col-md-3">
            <div className="glass-panel p-4 rounded-2xl border-stone-100 shadow-premium group cursor-pointer hover:border-emerald-500/30 transition-colors">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="size-10 bg-emerald-500/10 rounded-xl d-flex align-items-center justify-content-center text-emerald-600">
                  <span className="material-symbols-outlined fs-5">verified</span>
                </div>
                <span className="text-emerald-500 text-[10px] fw-black tracking-widest">OPTIMAL</span>
              </div>
              <p className="text-stone-400 text-[10px] fw-black text-uppercase tracking-[0.2em] mb-1">QC Pass Rate</p>
              <h4 className="fs-3 fw-black text-dark mb-0">99.2 <span className="fs-6 text-stone-300">%</span></h4>
            </div>
          </div>
          <div className="col-md-3">
            <div className="glass-panel p-4 rounded-2xl border-stone-100 shadow-premium group cursor-pointer hover:border-blue-500/30 transition-colors">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="size-10 bg-blue-500/10 rounded-xl d-flex align-items-center justify-content-center text-blue-600">
                  <span className="material-symbols-outlined fs-5">inventory_2</span>
                </div>
                <span className="text-blue-500 text-[10px] fw-black tracking-widest">SUFFICIENT</span>
              </div>
              <p className="text-stone-400 text-[10px] fw-black text-uppercase tracking-[0.2em] mb-1">Material Health</p>
              <h4 className="fs-3 fw-black text-dark mb-0">86 <span className="fs-6 text-stone-300">%</span></h4>
            </div>
          </div>
        </div>
      </header>

      <div className="row g-5">
        {/* Main Production Focus */}
        <div className="col-lg-8">
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
                  <div className="aspect-ratio-4-5 rounded-3xl bg-center bg-cover shadow-premium border border-stone-200 overflow-hidden group position-relative" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCdr4fpidJdHaFOf3MVvqNfIEbStEsHTVkZIrtruS5izzEplVrtIFxfO_pXaTZqcJLDmf-CqLFxuII9ZhLArnv6cacGyuRBKO8J7cOHPhp6XvKinI0c1LZvPmzUt1hJpsxjXQ3hg8GDfNbeGliMdKre7X6pKd75oVW5l6OaAr1CXR13Q1NqqGfauAjF2ppSByHiPg4TJQZ3j5O_0E-6vmhUsJXr-GdSKTzLfw7FpCfu8zyKlhnoHUkCEjSxqe3juIvb13tY3pgOX5GX')" }}>
                    <div className="position-absolute inset-0 bg-primary/20 bg-blend-soft-light opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                  </div>
                </div>
                <div className="col-md-7 space-y-8">
                  <div className="row g-4">
                    <div className="col-6">
                      <p className="text-[10px] text-stone-400 fw-black text-uppercase tracking-[0.2em] mb-1">Client Profile</p>
                      <p className="fs-5 fw-black text-dark tracking-tight">Jonathan Reeves</p>
                      <span className="text-xs text-stone-500 fw-bold bg-stone-50 px-3 py-1 rounded-full border border-stone-100">Gold Collector</span>
                    </div>
                    <div className="col-6">
                      <p className="text-[10px] text-stone-400 fw-black text-uppercase tracking-[0.2em] mb-1">Production window</p>
                      <p className="fs-5 fw-black text-primary tracking-tight">3 Days Remaining</p>
                      <span className="text-xs text-stone-500 fw-bold">DUE OCT 24, 2026</span>
                    </div>
                  </div>

                  <div className="p-5 bg-amber-50/50 rounded-2xl border border-amber-100/50">
                    <div className="d-flex align-items-center gap-2 mb-2">
                       <span className="material-symbols-outlined text-amber-600 fs-5">warning</span>
                       <span className="text-[10px] fw-black text-amber-700 text-uppercase tracking-[0.2em]">Workshop Directives</span>
                    </div>
                    <p className="fs-6 text-stone-700 italic fw-medium leading-relaxed mb-0">
                      "Ensure the wingtip broguing detail on the toe cap is extra deep using the heritage punch tool. Use the client's custom wooden last #442."
                    </p>
                  </div>

                  <div className="d-flex gap-4">
                    <Link to="/artisan/production/AS-8812" className="btn btn-dark flex-grow-1 py-4 reset-btn rounded-2xl fw-black text-xs text-uppercase tracking-widest shadow-xl hover:-translate-y-1 transition duration-500 d-flex align-items-center justify-content-center">
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
                  <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] fw-black tracking-widest">STAGE: {stages[productionStage]} ({(productionStage/4)*100}%)</div>
                </div>
                
                <div className="position-relative px-4 py-8">
                  <div className="position-absolute top-1/2 left-4 right-4 h-[2px] bg-stone-100 -translate-y-1/2"></div>
                  <div className="position-absolute top-1/2 left-4 w-2/3 h-[3px] bg-primary -translate-y-1/2 transition-all duration-1000 shadow-sm shadow-primary/50"></div>
                  
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
                  <button onClick={() => updateStage(Math.max(0, productionStage - 1))} className="btn btn-white flex-grow-1 py-4 rounded-2xl fw-black text-xs text-uppercase tracking-widest text-stone-500 border-stone-200 hover:bg-stone-50 shadow-sm">
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

          {/* New: Workshop Analytics & Insights */}
          <section className="bg-stone-900 rounded-[2.5rem] p-8 text-white shadow-2xl border border-stone-800">
             <div className="d-flex justify-content-between align-items-center mb-8">
                <div>
                   <h3 className="fs-5 fw-black font-serif mb-1">Workshop Yield Analysis</h3>
                   <p className="text-white/40 text-xs fw-bold tracking-widest uppercase mb-0">Rolling 7-Day Performance</p>
                </div>
                <div className="d-flex gap-2">
                   <div className="size-2 bg-emerald-500 rounded-full animate-pulse"></div>
                   <span className="text-[10px] fw-black text-emerald-500 tracking-widest uppercase">Live Feedback</span>
                </div>
             </div>
             <div className="row g-4 mb-4">
                {[
                  { label: 'Leather Utilization', value: '94.2%', color: 'border-primary' },
                  { label: 'Energy Efficiency', value: 'A++', color: 'border-emerald-500' },
                  { label: 'Artisan Morale', value: 'High', color: 'border-blue-400' }
                ].map((stat, i) => (
                  <div key={i} className="col-md-4">
                     <div className={`p-5 rounded-2xl border-start border-4 bg-white/5 backdrop-blur-md`}>
                        <p className="text-white/40 text-[10px] fw-black tracking-widest uppercase mb-2">{stat.label}</p>
                        <h4 className="fs-4 fw-black mb-0 tracking-tight">{stat.value}</h4>
                     </div>
                  </div>
                ))}
             </div>
          </section>
        </div>

        {/* Sidebar: Queue & Materials */}
        <div className="col-lg-4 space-y-8">
          {/* Material Specs - Premium Dark Mode Wrapper */}
          <section className="bg-stone-900 rounded-[2rem] shadow-2xl p-6 border border-stone-800 relative overflow-hidden">
            <div className="position-absolute top-[-10%] right-[-10%] size-40 bg-primary/20 rounded-full blur-[60px]"></div>
            <h3 className="text-[10px] fw-black text-stone-400 text-uppercase tracking-[0.4em] mb-6 d-flex align-items-center gap-3 relative z-1">
              <span className="material-symbols-outlined fs-5">inventory_2</span>
              Technical BOM
            </h3>
            <div className="space-y-4 relative z-1">
              {[
                { label: 'Upper', detail: 'Cognac Calfskin', state: 'Verified' },
                { label: 'Thread', detail: 'Waxed Linen B3', state: 'Verified' },
                { label: 'Sole', detail: 'Oak Bark Tanned', state: 'Verified' },
                { label: 'Lining', detail: 'Vachetta Natural', state: 'Stocking' }
              ].map((m, i) => (
                <div key={i} className="d-flex justify-content-between align-items-center p-3 rounded-xl hover:bg-white/5 transition border border-transparent hover:border-white/10 group">
                  <div>
                    <p className="text-white text-xs fw-black tracking-tighter mb-0 group-hover:text-primary transition">{m.label}</p>
                    <p className="text-white/40 text-[11px] fw-medium mb-0">{m.detail}</p>
                  </div>
                  <span className={`material-symbols-outlined shadow-sm ${m.state === 'Verified' ? 'text-emerald-500' : 'text-amber-500'} fs-5`}>
                    {m.state === 'Verified' ? 'check_circle' : 'pending'}
                  </span>
                </div>
              ))}
            </div>
            <button onClick={() => { setShowInventoryToast(true); setTimeout(() => setShowInventoryToast(false), 3000); }} className="w-100 mt-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/60 fs-6 fw-black transition text-uppercase tracking-widest text-[10px]">
              Inventory Request
            </button>
          </section>

          {/* Refined Workshop Queue */}
          <section className="bg-white rounded-[2rem] shadow-premium border border-stone-100 p-6">
            <div className="d-flex justify-content-between align-items-center mb-6">
              <h3 className="text-[10px] fw-black text-stone-400 text-uppercase tracking-[0.4em] d-flex align-items-center gap-3">
                <span className="material-symbols-outlined fs-5">view_carousel</span>
                Priority Queue
              </h3>
              <span className="badge bg-stone-100 text-stone-500 border-0 fs-6 px-3 py-2 rounded-xl fw-black">08</span>
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
            </div>
            <Link to="/artisan/assignments" className="w-100 mt-6 py-3 bg-stone-50 rounded-2xl text-stone-500 hover:text-stone-800 fs-6 fw-black d-flex align-items-center justify-content-center gap-2 transition border border-transparent hover:border-stone-200 text-uppercase tracking-widest text-[10px] text-decoration-none">
              Access Complete Queue (12)
              <span className="material-symbols-outlined fs-5">arrow_right_alt</span>
            </Link>
          </section>

          {/* Workshop Health Stats */}
          <div className="p-8 bg-gradient-to-br from-primary to-amber-700 rounded-[2rem] text-white shadow-xl position-relative overflow-hidden group">
             <div className="position-absolute bottom-[-10%] right-[-10%] size-32 bg-white/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700"></div>
             <h4 className="fs-5 fw-black font-serif tracking-tight mb-2">Station Health</h4>
             <p className="text-white/60 text-xs fw-bold tracking-widest uppercase mb-6">Optimal Production</p>
             <div className="space-y-4">
                <div className="d-flex justify-content-between align-items-center">
                   <span className="text-[10px] fw-black text-white/50 tracking-widest uppercase">Machine Sync</span>
                   <span className="text-[10px] fw-black tracking-widest uppercase text-emerald-400">Stable</span>
                </div>
                <div className="w-100 h-1 bg-white/10 rounded-full overflow-hidden">
                   <div className="h-100 bg-white/40 w-full animate-in slide-in-from-left duration-1000"></div>
                </div>
                <Link to="/artisan/bench-diagnostics" className="d-block w-100 mt-4 text-center text-white text-[10px] fw-black text-decoration-none bg-white/10 py-2 rounded-lg hover:bg-white/20 transition tracking-widest uppercase">Bench Diagnostics</Link>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtisanDashboard;
