import { useState } from 'react';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminOrderDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const fallbackOrder = { 
     id: `#AS-${id || '9421'}`, patron: 'Eleanor Maura', model: 'Oxford No. 4', type: 'Bespoke', 
     stage: 'Stitching', progress: 65, status: 'Active', priority: 'VIP Expedited', artisan: 'Lorenzo Giamatti', color: 'primary' 
  };
  
  const [order, setOrder] = useState(location.state?.order || fallbackOrder);

  const handlePushRequest = () => {
     alert(`Expedited priority request dispatched to master artisan ${order.artisan} for Asset ${order.id}.`);
  };

  const handleTerminate = async () => {
     if (window.confirm(`Are you certain you wish to terminate the lifecycle for Asset ${order.id}? This action is irreversible.`)) {
         try {
             // Extract raw Mongo ID if available, otherwise just use orderId
             const orderMongoId = order.originalOrder?._id || order.id.replace('#', '');
             await axios.delete(`/api/orders/${orderMongoId}`);
             alert("Cycle Terminated. Asset has been moved to the legacy archive.");
             navigate('/admin/orders');
         } catch (error) {
             console.error('Failed to terminate order', error);
             alert('Error terminating order. Please check console.');
         }
     }
  };

  return (
    <div className="p-8 lg:p-12 animate-in fade-in duration-1000">
      {/* Cinematic Header & Breadcrumb */}
      <section className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-6 mb-12">
        <div className="d-flex align-items-center gap-6">
          <Link to="/admin/orders" className="size-12 rounded-2xl border border-stone-100 d-flex align-items-center justify-content-center text-stone-700 hover:text-dark hover:border-dark transition-all duration-500">
            <span className="material-symbols-outlined fs-5">arrow_back</span>
          </Link>
          <div>
            <nav className="d-flex align-items-center gap-3 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700 mb-2">
              <Link to="/admin" className="hover:text-dark transition">Operations</Link>
              <span className="material-symbols-outlined fs-6 text-stone-200">chevron_right</span>
              <Link to="/admin/orders" className="hover:text-dark transition">Registry</Link>
              <span className="material-symbols-outlined fs-6 text-stone-200">chevron_right</span>
              <span className="text-primary">Asset Intelligence</span>
            </nav>
            <h1 className="display-4 fw-black font-serif text-dark tracking-tighter mb-0 lowercase">Asset.{order.id}</h1>
          </div>
        </div>
        
        <div className="d-flex gap-4">
          <button className="px-8 py-3.5 rounded-2xl bg-white border border-stone-100 text-[10px] fw-black text-uppercase tracking-widest text-dark hover:bg-stone-50 transition duration-500 shadow-sm d-flex align-items-center gap-3">
            <span className="material-symbols-outlined fs-5">print</span>
            Production Dossier
          </button>
          <button className="px-8 py-3.5 rounded-2xl bg-dark text-white text-[10px] fw-black text-uppercase tracking-widest shadow-2xl hover:-translate-y-1 transition duration-500 d-flex align-items-center gap-3">
            <span className="material-symbols-outlined fs-5">update</span>
            Modify Trajectory
          </button>
        </div>
      </section>

      <div className="row g-12">
        {/* Intelligence Dossier */}
        <div className="col-lg-8">
           <div className="space-y-10">
              {/* Profile & Technical Specs */}
              <div className="row g-8">
                 <div className="col-md-6">
                    <section className="glass-panel p-8 rounded-[2.5rem] border-stone-100 shadow-premium h-100 relative overflow-hidden group">
                       <div className="position-absolute top-[-5%] right-[-5%] text-stone-600/5 group-hover:scale-110 transition-transform duration-700">
                          <span className="material-symbols-outlined text-[120px]">person</span>
                       </div>
                       <div className="relative z-1">
                          <h3 className="text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700 mb-8">Patron.Profile</h3>
                          <div className="d-flex align-items-center gap-6 mb-8">
                             <div className="size-16 rounded-[1.5rem] bg-stone-950 d-flex align-items-center justify-content-center text-white text-lg fw-black shadow-2xl">
                               {order.patron.split(' ').map(n => n[0]).join('')}
                             </div>
                             <div>
                                <h4 className="text-xl fw-black text-dark tracking-tight mb-1">{order.patron}</h4>
                                <span className="text-[10px] fw-black text-uppercase tracking-widest text-primary">{order.priority}</span>
                             </div>
                          </div>
                          <div className="space-y-4">
                             <div className="d-flex flex-column">
                                <span className="text-[9px] fw-black text-uppercase text-stone-700 tracking-widest mb-1">Secure Channel</span>
                                <span className="text-sm fw-bold text-dark font-display">{order.patron.split(' ')[0].toLowerCase()}@bespoke.ly</span>
                             </div>
                             <div className="d-flex flex-column">
                                <span className="text-[9px] fw-black text-uppercase text-stone-700 tracking-widest mb-1">Geographic Origin</span>
                                <span className="text-sm fw-bold text-dark font-display">Lahore, Punjab</span>
                             </div>
                          </div>
                       </div>
                    </section>
                 </div>
                 <div className="col-md-6">
                    <section className="glass-panel p-8 rounded-[2.5rem] border-stone-100 shadow-premium h-100">
                       <h3 className="text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700 mb-8">Technical.Class</h3>
                       <div className="space-y-6">
                          {[
                             { label: 'Model Spec', value: order.model, type: 'font-serif lowercase italic' },
                             { label: 'Asset Type', value: order.type, type: 'font-display fw-black' },
                             { label: 'Dimension', value: 'US 10.5 D / UK 9.5', type: 'font-display' },
                             { label: 'Welt Method', value: 'Goodyear Artisan', type: 'font-display' }
                          ].map((spec, i) => (
                             <div key={i} className="d-flex justify-content-between align-items-end border-bottom border-stone-50 pb-3">
                                <span className="text-[10px] fw-black text-uppercase tracking-widest text-stone-700">{spec.label}</span>
                                <span className={`text-sm fw-black text-dark tracking-tight ${spec.type}`}>{spec.value}</span>
                             </div>
                          ))}
                       </div>
                    </section>
                 </div>
              </div>

              {/* Directives & Visual Assets */}
              <section className="glass-panel p-10 rounded-[3rem] border-stone-100 shadow-premium">
                 <div className="d-flex align-items-center gap-4 mb-8">
                    <div className="size-10 bg-amber-500 rounded-xl d-flex align-items-center justify-content-center text-white shadow-lg shadow-amber-500/20">
                       <span className="material-symbols-outlined fs-5">history_edu</span>
                    </div>
                    <h3 className="text-[10px] fw-black text-uppercase tracking-[0.3em] text-dark shadow-sm px-4 py-2 bg-stone-50 rounded-full border border-stone-100">Artisanal.Directives</h3>
                 </div>
                 <p className="display-6 fw-black font-serif text-dark tracking-tighter mb-8 lowercase lh-tight italic">
                    "Double-stitched welt with hand-burnished toe caps. Prioritize grain alignment across the quarters."
                 </p>
                 <div className="row g-4">
                    {[1, 2, 3].map(i => (
                       <div key={i} className="col-4">
                          <div className="aspect-video rounded-2xl bg-stone-100 border border-stone-200 overflow-hidden relative group">
                             <div className="absolute inset-0 bg-dark/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 d-flex align-items-center justify-content-center">
                                <span className="material-symbols-outlined text-white fs-4">zoom_in</span>
                             </div>
                             <img src={`https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80`} className="w-100 h-100 object-cover" alt="Asset" />
                          </div>
                       </div>
                    ))}
                 </div>
              </section>
           </div>
        </div>

        {/* Trajectory & Controls */}
        <div className="col-lg-4">
           <div className="space-y-10">
              {/* Dynamic Trajectory */}
              <section className="glass-panel p-8 rounded-[2.5rem] border-stone-100 shadow-premium">
                 <div className="d-flex align-items-center justify-content-between mb-10">
                    <h3 className="text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Life.Trajectory</h3>
                    <span className="text-[10px] fw-black text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">Ahead of Target</span>
                 </div>

                 <div className="space-y-12 relative before:absolute before:left-[11px] before:top-4 before:bottom-4 before:w-[2px] before:bg-stone-50">
                    {[
                       { stage: 'Blueprint Validation', time: 'Oct 10, 2:40 PM', status: 'verified', active: false },
                       { stage: 'Asset Procurement', time: 'Oct 12, 9:15 AM', status: 'verified', active: false },
                       { stage: 'Artisan Synthesis', time: 'In Progress', status: 'processing', active: true, progress: 65 },
                       { stage: 'Holistic Assembly', time: 'Pending Authority', status: 'pending', active: false }
                    ].map((step, i) => (
                       <div key={i} className={`relative pl-10 ${step.active ? 'opacity-100' : 'opacity-40'}`}>
                          <div className={`position-absolute left-0 top-1 size-6 rounded-full border-4 border-white shadow-md d-flex align-items-center justify-content-center ${step.status === 'verified' ? 'bg-primary' : step.status === 'processing' ? 'bg-amber-500 animate-pulse' : 'bg-stone-200'}`}>
                             {step.status === 'verified' && <span className="material-symbols-outlined text-white text-[12px] fw-black">check</span>}
                          </div>
                          <div className="d-flex flex-column">
                             <span className={`text-[11px] fw-black tracking-tight ${step.active ? 'text-dark' : 'text-stone-600'}`}>{step.stage}</span>
                             <span className="text-[9px] fw-black text-uppercase text-stone-700 tracking-widest mt-1">{step.time}</span>
                             {step.active && (
                                 <div className="mt-4 p-4 bg-stone-50 rounded-2xl border border-stone-100">
                                    <div className="d-flex justify-content-between text-[9px] fw-black text-stone-600 mb-2">
                                       <span>THROUGHPUT</span>
                                       <span>{order.progress}%</span>
                                    </div>
                                    <div className="h-1 bg-stone-200 rounded-full overflow-hidden">
                                       <div className={`h-100 bg-${order.color} rounded-full transition-all duration-1000`} style={{ width: `${order.progress}%` }}></div>
                                    </div>
                                 </div>
                             )}
                          </div>
                       </div>
                    ))}
                 </div>
              </section>

              {/* Deployment Authority */}
              <section className="glass-panel p-8 rounded-[2.5rem] border-stone-100 shadow-premium">
                 <h3 className="text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700 mb-8">Admin.Authority</h3>
                 <div className="space-y-4">
                    <Link to={`/admin/assign-artisan/${order.id.replace('#', '')}`} className="d-flex align-items-center justify-content-between w-100 p-5 rounded-2xl bg-dark text-white hover:bg-stone-800 transition duration-500 shadow-xl group text-decoration-none">
                       <div className="d-flex align-items-center gap-4">
                          <span className="material-symbols-outlined fs-5">psychology</span>
                          <span className="text-[10px] fw-black text-uppercase tracking-widest">Master: {order.artisan.split(' ')[0]}</span>
                       </div>
                       <span className="material-symbols-outlined fs-6 group-hover:translate-x-1 transition-transform">chevron_right</span>
                    </Link>
                    <button onClick={handlePushRequest} className="d-flex align-items-center justify-content-between w-100 p-5 rounded-2xl bg-white border border-stone-100 text-dark hover:bg-stone-50 transition duration-500 shadow-sm group">
                       <div className="d-flex align-items-center gap-4">
                          <span className="material-symbols-outlined fs-5 text-stone-600">notifications</span>
                          <span className="text-[10px] fw-black text-uppercase tracking-widest">Push Request</span>
                       </div>
                       <span className="material-symbols-outlined fs-6 group-hover:translate-x-1 transition-transform">chevron_right</span>
                    </button>
                    <button onClick={handleTerminate} className="d-flex align-items-center justify-content-between w-100 p-5 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-100 transition duration-500 overflow-hidden group">
                       <div className="d-flex align-items-center gap-4 relative z-1">
                          <span className="material-symbols-outlined fs-5">block</span>
                          <span className="text-[10px] fw-black text-uppercase tracking-widest">Terminate Cycle</span>
                       </div>
                       <span className="material-symbols-outlined fs-6 relative z-1 group-hover:translate-x-1 transition-transform">close</span>
                    </button>
                 </div>
              </section>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetail;
