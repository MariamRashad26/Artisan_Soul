import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';

const ArtisanProductionUpdate = () => {
  const { id } = useParams();
  const orderId = id ? `#AS-${id}` : '#AS-9421';
  const navigate = useNavigate();
  
  const [orderData, setOrderData] = useState(null);
  const [productionStage, setProductionStage] = useState(0); 

  const [logText, setLogText] = useState('');
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(`/api/orders/${encodeURIComponent(orderId)}`);
        setOrderData(data);
        const stages = ['Design Prep', 'Cutting', 'Lasting', 'Stitching', 'Finished'];
        const index = stages.indexOf(data.phase);
        if (index !== -1) setProductionStage(index);
        if (data.logs) setLogs(data.logs);
      } catch (error) {
        console.error("Failed to fetch order", error);
      }
    };
    fetchOrder();
  }, [orderId]);

  const handleStageUpdate = async (stageIndex) => {
    const stages = ['Design Prep', 'Cutting', 'Lasting', 'Stitching', 'Finished'];
    const progresses = [10, 30, 60, 85, 100];
    try {
      const { data } = await axios.put(`/api/orders/${encodeURIComponent(orderId)}`, {
        phase: stages[stageIndex],
        progress: progresses[stageIndex]
      });
      setProductionStage(stageIndex);
      setOrderData(data);
      if (stageIndex === 4) {
         const autoLog = { time: 'System', log: 'Order officially marked as Finished.', user: false };
         const newLogs = [autoLog, ...logs];
         setLogs(newLogs);
         await axios.put(`/api/orders/${encodeURIComponent(orderId)}`, { logs: newLogs });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const [showTechModal, setShowTechModal] = useState(false);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [activeMedia, setActiveMedia] = useState(null); // { type: 'video'|'image', url: '...' }
  const [showUploadModal, setShowUploadModal] = useState(false);

  const handleLogUpdate = async () => {
    if (!logText.trim()) return;
    const newLog = { time: 'Just now', log: logText, user: true };
    const updatedLogs = [newLog, ...logs];
    setLogs(updatedLogs);
    setLogText('');
    try {
      await axios.put(`/api/orders/${encodeURIComponent(orderId)}`, { logs: updatedLogs });
    } catch(err) {
      console.error(err);
    }
  };

  return (
    <div className="min-vh-100 bg-background-light font-display text-dark lg:pb-20">
      {/* Sticky Premium Header */}
      <header className="bg-white/80 backdrop-blur-xl border-bottom border-stone-200 px-6 lg:px-12 py-6 sticky-top z-40 shadow-sm animate-in slide-in-from-top duration-700">
        <div className="max-w-7xl mx-auto d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-6">
          <div className="d-flex align-items-center gap-5">
            <Link to="/artisan/assignments" className="size-12 rounded-xl bg-stone-50 border border-stone-200 d-flex align-items-center justify-content-center text-stone-400 hover:text-dark hover:bg-white hover:border-dark transition duration-500 shadow-sm group">
              <span className="material-symbols-outlined fs-4 group-hover:-translate-x-1 transition-transform">arrow_back</span>
            </Link>
            <div>
              <div className="d-flex align-items-center gap-3 text-primary mb-1">
                <span className="material-symbols-outlined fs-6 animate-pulse">precision_manufacturing</span>
                <span className="text-[10px] fw-black text-uppercase tracking-[0.3em]">Live Bench Assignment</span>
              </div>
              <h1 className="display-6 fw-black font-serif text-dark tracking-tighter mb-0 lowercase">Order.#{orderId}</h1>
            </div>
          </div>
          
          <div className="d-flex gap-3">
             <button onClick={() => setShowTechModal(true)} className="px-6 py-3.5 rounded-2xl border border-stone-200 text-stone-600 fw-black text-xs text-uppercase tracking-widest hover:bg-stone-50 transition duration-500 shadow-sm">
                Technical Pack
             </button>
             <Link to={`/artisan/quality-check/${orderId}`} className="px-8 py-3.5 rounded-2xl bg-primary text-white fw-black text-xs text-uppercase tracking-widest shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition duration-500 d-flex align-items-center gap-3 text-decoration-none">
                Complete Stage
                <span className="material-symbols-outlined fs-5">verified</span>
             </Link>
          </div>
        </div>
      </header>

      {/* Modals */}
      <Modal show={showTechModal} onHide={() => setShowTechModal(false)} centered size="lg" className="artisan-modal">
         <Modal.Header closeButton className="border-bottom border-stone-100 bg-stone-50">
            <Modal.Title className="fs-5 fw-black font-serif tracking-tight">Technical Specifications</Modal.Title>
         </Modal.Header>
         <Modal.Body className="p-0">
             <img src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80" alt="Tech Pack" className="w-100 h-auto" />
             <div className="p-6 bg-white">
                <h4 className="fs-6 fw-black mb-2">Order {orderId} - {orderData ? orderData.model : 'Sovereign Wingtip'}</h4>
                <p className="text-sm text-stone-500 mb-0">Measurement profile 442-B. Ensure 3mm seam allowance on lateral flanks.</p>
             </div>
         </Modal.Body>
      </Modal>

      <Modal show={showMediaModal} onHide={() => setShowMediaModal(false)} centered size="xl" className="artisan-modal bg-dark/95">
         <Modal.Body className="p-0 bg-transparent text-center relative">
            <button onClick={() => setShowMediaModal(false)} className="position-absolute top-4 right-4 z-50 size-10 bg-black/50 text-white rounded-full d-flex align-items-center justify-content-center hover:bg-black transition">
               <span className="material-symbols-outlined">close</span>
            </button>
            {activeMedia && activeMedia.type === 'video' && (
              <div className="aspect-video bg-black rounded-[2rem] overflow-hidden relative">
                 <div className="w-100 h-100 bg-cover bg-center opacity-70" style={{ backgroundImage: `url('${activeMedia.url}')` }}></div>
                 <div className="position-absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-20 bg-white/20 backdrop-blur-md rounded-full d-flex justify-content-center align-items-center text-white cursor-pointer hover:bg-white/30 transition shadow-2xl">
                    <span className="material-symbols-outlined fs-1 ps-1">play_arrow</span>
                 </div>
              </div>
            )}
            {activeMedia && activeMedia.type === 'image' && (
              <img src={activeMedia.url} alt="Frame" className="img-fluid rounded-[2rem] max-h-[85vh] object-contain shadow-2xl mx-auto" />
            )}
         </Modal.Body>
      </Modal>

      <Modal show={showUploadModal} onHide={() => setShowUploadModal(false)} centered className="artisan-modal">
         <Modal.Header closeButton className="border-0">
            <Modal.Title className="fs-5 fw-black font-serif tracking-tight">Capture / Upload Frame</Modal.Title>
         </Modal.Header>
         <Modal.Body className="p-5 text-center">
            <div className="size-20 bg-primary/10 text-primary rounded-full d-flex align-items-center justify-content-center mx-auto mb-4">
               <span className="material-symbols-outlined fs-1">add_a_photo</span>
            </div>
            <h4 className="fs-6 fw-bold text-dark mb-2">Upload or capture evidence</h4>
            <p className="text-stone-400 text-xs mb-4">JPEG, PNG max 15MB.</p>
            <Button variant="dark" className="w-100 py-3 rounded-xl fw-bold text-xs tracking-widest uppercase" onClick={() => setShowUploadModal(false)}>Access Camera</Button>
         </Modal.Body>
      </Modal>

      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-10 animate-in fade-in slide-in-from-bottom duration-1000">
        <div className="row g-5">
          {/* Left Side: Technical Info & Journey */}
          <div className="col-lg-7 space-y-10">
            {/* Journey Status Card */}
            <section className="glass-panel p-8 rounded-[2.5rem] border-stone-100 shadow-premium relative overflow-hidden">
              <div className="position-absolute top-[-10%] right-[-10%] size-64 bg-primary/5 rounded-full blur-3xl"></div>
              
              <div className="d-flex justify-content-between align-items-start mb-10 relative z-1">
                <div>
                  <h3 className="text-[10px] fw-black text-stone-400 text-uppercase tracking-[0.4em] mb-4">Master Timeline</h3>
                  <h4 className="fs-4 fw-black font-serif text-dark tracking-tight">{orderData ? orderData.phase : 'Loading'} Stage</h4>
                  <p className="text-stone-500 fw-bold text-xs tracking-tight mt-1">ESTIMATED COMPLETION: TODAY, 6:00 PM</p>
                </div>
                <div className="size-16 bg-primary-10 rounded-2xl d-flex align-items-center justify-content-center text-primary shadow-inner">
                  <span className="material-symbols-outlined fs-1">straighten</span>
                </div>
              </div>

              {/* Vertical Stepper with Details */}
              <div className="space-y-10 relative z-1">
                <div className="position-absolute left-6 top-4 bottom-4 w-[2px] bg-stone-100"></div>
                
                {[
                  { stage: 'Design Prep', icon: 'draw', detail: 'Review technical specifications and patron custom requests.' },
                  { stage: 'Cutting', icon: 'content_cut', detail: 'Pattern extraction and leather clicking. Ensure grain alignment.' },
                  { stage: 'Lasting', icon: 'hardware', detail: 'Molding the upper over the bespoke wooden last.' },
                  { stage: 'Stitching', icon: 'straighten', detail: 'Hand-sewing welt and outsole with waxed linen thread.' },
                  { stage: 'Finished', icon: 'workspace_premium', detail: 'Final burnishing, quality control, and boxing.' }
                ].map((step, idx) => {
                  let sStatus = 'pending';
                  if (idx < productionStage) sStatus = 'done';
                  if (idx === productionStage) sStatus = 'active';
                  return (
                  <div key={idx} onClick={() => handleStageUpdate(idx)} className={`d-flex gap-8 transition-all duration-700 cursor-pointer group ${sStatus === 'pending' ? 'opacity-30 grayscale hover:opacity-100 hover:grayscale-0' : ''}`}>
                    <div className={`size-12 rounded-full d-flex align-items-center justify-content-center border-4 border-white shadow-sm z-1 transition-all duration-500 ${
                      sStatus === 'done' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 
                      sStatus === 'active' ? 'bg-white border-primary text-primary scale-125 shadow-xl' :
                      'bg-stone-50 text-stone-200 border-stone-100'
                    }`}>
                      <span className="material-symbols-outlined fs-5">{sStatus === 'done' ? 'check' : step.icon}</span>
                    </div>
                    <div className="flex-grow-1 pt-1">
                      <div className="d-flex justify-content-between align-items-start mb-2 group-hover:text-primary transition-colors">
                        <h5 className={`fs-5 fw-black tracking-tight ${sStatus === 'active' ? 'text-primary' : 'text-dark'}`}>{step.stage}</h5>
                        <span className="text-[10px] fw-black text-stone-400 text-uppercase tracking-widest">{sStatus === 'active' ? 'In Progress' : sStatus === 'done' ? 'Completed' : 'Pending'}</span>
                      </div>
                      {step.detail && <p className="text-stone-500 fs-6 fw-medium leading-relaxed mb-0">{step.detail}</p>}
                    </div>
                  </div>
                )})}
              </div>
            </section>

            {/* Directive Section */}
            <section className="bg-stone-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
              <div className="position-absolute bottom-[-20%] right-[-10%] size-80 bg-primary/10 rounded-full blur-[100px] group-hover:scale-110 transition-transform duration-1000"></div>
              <div className="d-flex align-items-center gap-4 mb-8">
                <span className="material-symbols-outlined text-amber-500 fs-2 bg-white/5 p-3 rounded-2xl shadow-inner">warning</span>
                <div>
                   <h4 className="fs-5 fw-black font-serif tracking-tight mb-1">Critical Directives</h4>
                   <p className="text-white/40 text-[10px] fw-black tracking-[0.3em] text-uppercase mb-0">Atelier Standards No. 42</p>
                </div>
              </div>
              <p className="fs-5 text-stone-300 italic fw-medium leading-relaxed mb-8 border-start border-primary/40 ps-6">
                "Apply the deep chestnut patina with hand-buffing focus on the wingtip perforations. The client specifically requested the #442 wooden last to maintain the high-arch silhouette."
              </p>
              <div className="row g-4">
                <div className="col-6">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10 shadow-sm">
                    <p className="text-white/40 text-[10px] fw-black tracking-widest uppercase mb-2">Punch Tool</p>
                    <p className="text-white fs-6 fw-black mb-0 font-serif">Heritage Perforator B-2</p>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10 shadow-sm">
                    <p className="text-white/40 text-[10px] fw-black tracking-widest uppercase mb-2">Patina Base</p>
                    <p className="text-white fs-6 fw-black mb-0 font-serif">Saphir Medium Tobacco</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Side: Media & Logging */}
          <div className="col-lg-5 space-y-10">
            {/* Live Media Feed */}
            <section className="bg-white rounded-[2.5rem] border border-stone-100 shadow-premium p-8 h-100 lg:h-auto overflow-hidden group">
              <div className="d-flex justify-content-between align-items-center mb-8">
                <h3 className="text-[10px] fw-black text-stone-400 text-uppercase tracking-[0.4em]">Workshop Feed</h3>
                <button className="px-4 py-2 bg-primary/10 text-primary rounded-xl text-[10px] fw-black tracking-widest uppercase hover:bg-primary hover:text-white transition duration-500 border border-primary-10">
                  NEW CLIP
                </button>
              </div>

              <div className="row g-4">
                <div className="col-12">
                   <div onClick={() => { setActiveMedia({ type: 'video', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6EE4QSMPsq8b_7lPcBzi9J_C1LNFfPediAEKW-M1m97fjW-1AyUF3xWg7lXMDqXCKKfgQOUvjVyjow6rLDbtpJb8sp6FSF6ao7TBf0ZVn8Vs52SGAoQSTXUfG5FLFV-Yb-gto0jTzSSYY6pQo_qxvHA8s6v3vOV8JmuIAmr_2K0o12qgPooHDn3pJk0aLVNcMlY6Etm40KyJ_3iwWMuHPT7Ai4KbszIdJ1ycSi_62xZA3nvvek1OfPyBDQ9JwMuEKsWep4kwfkktm' }); setShowMediaModal(true); }} className="aspect-ratio-16-9 bg-stone-100 rounded-3xl overflow-hidden shadow-inner border border-stone-200 position-relative group-media cursor-pointer group cursor-pointer">
                      <div className="w-100 h-100 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB6EE4QSMPsq8b_7lPcBzi9J_C1LNFfPediAEKW-M1m97fjW-1AyUF3xWg7lXMDqXCKKfgQOUvjVyjow6rLDbtpJb8sp6FSF6ao7TBf0ZVn8Vs52SGAoQSTXUfG5FLFV-Yb-gto0jTzSSYY6pQo_qxvHA8s6v3vOV8JmuIAmr_2K0o12qgPooHDn3pJk0aLVNcMlY6Etm40KyJ_3iwWMuHPT7Ai4KbszIdJ1ycSi_62xZA3nvvek1OfPyBDQ9JwMuEKsWep4kwfkktm')" }}></div>
                      <div className="position-absolute inset-0 bg-dark/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500 d-flex align-items-center justify-content-center">
                        <span className="material-symbols-outlined text-white fs-1 drop-shadow-xl">play_circle</span>
                      </div>
                      <div className="position-absolute top-4 left-4 bg-primary/80 backdrop-blur-md text-white text-[9px] fw-black px-3 py-1.5 rounded-pill tracking-widest uppercase">
                        Current Milestone Update
                      </div>
                   </div>
                </div>
                <div className="col-6">
                  <div onClick={() => { setActiveMedia({ type: 'image', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAp12wq3ElcQLQlml6zCxpRl-NzQQnwl4R1mMdaZ7y69r7PZVt9vCpMug8GBU_hv_PlCjHxLMk2BXnMTDariY9E1b9USZSo6AMdrYK-XW002tW7WzTsd_oAji-G5hZP3BSaJQEbVoPZlg9QQO33JGRtGOXCM8csO3sqqXoqkKsBh0ILT8ZlGXQL7vdermQ3DImXCaNGHbGpxRd4AdEwzIxOO1KLmmWO05V4WhLhFA-CIuvHBLNF5ORUDwIVnckjlBBECrURaARm3iwU' }); setShowMediaModal(true); }} className="aspect-ratio-square bg-stone-100 rounded-2xl overflow-hidden shadow-inner border border-stone-100 group cursor-pointer">
                    <div className="w-100 h-100 bg-cover bg-center group-hover:scale-110 transition-transform duration-1000" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAp12wq3ElcQLQlml6zCxpRl-NzQQnwl4R1mMdaZ7y69r7PZVt9vCpMug8GBU_hv_PlCjHxLMk2BXnMTDariY9E1b9USZSo6AMdrYK-XW002tW7WzTsd_oAji-G5hZP3BSaJQEbVoPZlg9QQO33JGRtGOXCM8csO3sqqXoqkKsBh0ILT8ZlGXQL7vdermQ3DImXCaNGHbGpxRd4AdEwzIxOO1KLmmWO05V4WhLhFA-CIuvHBLNF5ORUDwIVnckjlBBECrURaARm3iwU')" }}></div>
                  </div>
                </div>
                <div className="col-6">
                  <div onClick={() => setShowUploadModal(true)} className="aspect-ratio-square bg-stone-50 rounded-2xl border-2 border-dashed border-stone-200 d-flex flex-column align-items-center justify-content-center text-stone-300 gap-2 hover:border-primary hover:text-primary hover:bg-white transition duration-500 cursor-pointer group">
                    <span className="material-symbols-outlined fs-2 group-hover:scale-110 transition-transform">add_a_photo</span>
                    <span className="text-[10px] fw-black tracking-widest uppercase">Add Frame</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Artisanal Log Entries */}
            <section className="bg-white rounded-[2.5rem] border border-stone-100 shadow-premium p-8 group">
              <h3 className="text-[10px] fw-black text-stone-400 text-uppercase tracking-[0.4em] mb-8">Craftsmanship Narrative</h3>
              
              <div className="space-y-6 mb-10 overflow-y-auto max-h-[300px] custom-scrollbar pr-4">
                {logs.map((entry, i) => (
                  <div key={i} className="animate-in fade-in slide-in-from-right duration-500">
                    <div className="d-flex align-items-center gap-2 mb-2">
                       <span className="text-[10px] fw-black text-stone-300 tracking-widest uppercase">{entry.time}</span>
                       {i === 0 && <span className="size-1.5 bg-primary rounded-full animate-pulse shadow-sm shadow-primary"></span>}
                    </div>
                    <div className={`p-5 rounded-3xl ${i === 0 ? 'bg-stone-50 border border-stone-200 rounded-tl-none font-medium' : 'bg-stone-200/50 text-stone-500 rounded-tr-none'} font-display fs-6 leading-relaxed`}>
                      {entry.log}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-8 border-top border-stone-100 space-y-4">
                 <textarea value={logText} onChange={(e) => setLogText(e.target.value)} className="w-100 bg-stone-50 border border-stone-200 rounded-3xl p-5 fs-6 fw-medium outline-none focus:ring-4 focus:ring-primary/10 transition-all duration-500 resize-none h-32 lowercase font-serif italic" placeholder="record.craft.note..."></textarea>
                 <button onClick={handleLogUpdate} className="w-100 btn btn-dark py-4 reset-btn rounded-2xl fw-black text-xs text-uppercase tracking-[0.3em] shadow-xl hover:-translate-y-1 transition duration-500 d-flex justify-content-center align-items-center gap-3">
                   Log Update
                   <span className="material-symbols-outlined fs-5">history_edu</span>
                 </button>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ArtisanProductionUpdate;
