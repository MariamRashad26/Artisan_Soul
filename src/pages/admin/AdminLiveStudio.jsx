import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AdminLiveStudio = () => {
  const [clips, setClips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClips = async () => {
      try {
        const response = await axios.get('/api/clips');
        const formattedClips = response.data.map(c => ({
          id: c._id.substring(0, 8).toUpperCase(),
          order: c.order_id?.orderId || '#AS-UNKNOWN',
          artisan: c.artisan_id?.name || 'Unknown Artisan',
          duration: c.duration || 'LIVE',
          status: c.status,
          thumbnail: c.thumbnail_url || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
          video: c.video_url || 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
        }));
        setClips(formattedClips);
      } catch (error) {
        console.error("Error fetching clips:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchClips();
  }, []);

  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);

  return (
    <div className="p-8 lg:p-12 animate-in fade-in duration-1000">
      <section className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-6 mb-12">
        <div>
          <nav className="d-flex align-items-center gap-3 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700 mb-4">
            <Link to="/admin" className="hover:text-dark transition">Operations</Link>
            <span className="material-symbols-outlined fs-6 text-stone-200">chevron_right</span>
            <span className="text-primary">Live Studio Control</span>
          </nav>
          <h1 className="display-4 fw-black font-serif text-dark tracking-tighter mb-0 lowercase">Workshop.Mosaic</h1>
        </div>
        
        <div className="d-flex gap-4">
          <button onClick={() => setIsMaintenanceModalOpen(true)} className="px-8 py-3.5 rounded-2xl bg-white border border-stone-100 text-[10px] fw-black text-uppercase tracking-widest text-dark hover:bg-stone-50 transition duration-500 shadow-sm d-flex align-items-center gap-3">
            <span className="material-symbols-outlined fs-5">videocam_off</span>
            Studio Maintenance
          </button>
          <button onClick={() => setIsBroadcastModalOpen(true)} className="px-8 py-3.5 rounded-2xl bg-dark text-white text-[10px] fw-black text-uppercase tracking-widest shadow-2xl hover:-translate-y-1 transition duration-500 d-flex align-items-center gap-3">
            <span className="material-symbols-outlined fs-5">streaming</span>
            Central Broadcast
          </button>
        </div>
      </section>

      <div className="row g-8 mb-12">
        {clips.map((clip, i) => (
          <div key={i} className="col-lg-3 col-md-6">
            <div className="glass-panel rounded-[2.5rem] border-stone-100 shadow-premium overflow-hidden group hover:border-dark transition-all duration-700">
               <div className="aspect-video relative overflow-hidden bg-stone-900 border-bottom border-stone-100 group-hover:scale-105 transition-all duration-1000">
                  {clip.video.includes('youtube') ? (
                     <iframe src={`${clip.video}?autoplay=1&mute=1&controls=0&loop=1&playlist=${clip.video.split('/').pop()}&vq=hd1080`} className="w-100 h-100 object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none border-0" allow="autoplay; encrypted-media"></iframe>
                  ) : (
                     <video src={clip.video} autoPlay muted loop playsInline poster={clip.thumbnail} className="w-100 h-100 object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-1000"></video>
                  )}
                  <div className="absolute inset-0 d-flex align-items-center justify-content-center pointer-events-none">
                     <div className="size-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 d-flex align-items-center justify-content-center text-white transition duration-500 shadow-lg">
                        <span className="material-symbols-outlined fs-3 animate-pulse">live_tv</span>
                     </div>
                  </div>
                  <div className="absolute bottom-4 right-4 px-2 py-1 bg-dark/80 backdrop-blur-md rounded-lg text-[8px] fw-black text-white tracking-widest">
                     {clip.duration}
                  </div>
               </div>
               <div className="p-6">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                     <span className="text-[10px] fw-black text-stone-700 tracking-tighter">{clip.id}</span>
                     <span className={`text-[8px] fw-black text-uppercase tracking-widest px-2 py-0.5 rounded-full ${clip.status === 'Live' ? 'bg-emerald-500/10 text-emerald-600' : clip.status === 'Pending Review' ? 'bg-amber-500/10 text-amber-600' : 'bg-primary/10 text-primary'}`}>
                        {clip.status}
                     </span>
                  </div>
                  <h4 className="text-sm fw-black text-dark tracking-tight mb-1">Asset: {clip.order}</h4>
                  <p className="text-[10px] fw-black text-uppercase tracking-widest text-stone-600 mb-0">Artisan: {clip.artisan}</p>
               </div>
            </div>
          </div>
        ))}
      </div>

      <section className="glass-panel p-10 rounded-[3rem] border-stone-100 shadow-premium">
         <div className="d-flex align-items-center gap-4 mb-8">
            <div className="size-10 bg-primary rounded-xl d-flex align-items-center justify-content-center text-white shadow-lg shadow-primary/20">
               <span className="material-symbols-outlined fs-5">analytics</span>
            </div>
            <h3 className="text-[10px] fw-black text-uppercase tracking-[0.3em] text-dark shadow-sm px-4 py-2 bg-stone-50 rounded-full border border-stone-100">Audience.Engagement</h3>
         </div>
         <div className="row g-8">
            <div className="col-md-7">
               <div className="h-48 bg-stone-50/50 rounded-[2rem] border border-stone-100 p-8 d-flex flex-column justify-content-end">
                  <div className="d-flex align-items-end gap-1 flex-grow-1 mb-4">
                     {[23, 45, 67, 34, 56, 89, 45, 67, 92, 45, 78, 65, 87, 34, 56, 98, 45, 67, 82, 55].map((v, i) => (
                       <div key={i} className="flex-grow-1 bg-gradient-to-t from-primary/40 to-primary rounded-sm hover:opacity-80 transition-opacity cursor-pointer shadow-sm" style={{ height: `${v}%` }}></div>
                     ))}
                  </div>
                  <div className="d-flex justify-content-between text-[8px] fw-black text-uppercase tracking-widest text-stone-700">
                     <span>Last 24 Hours Engagement Trajectory</span>
                     <span>Concurrent Viewers: 142</span>
                  </div>
               </div>
            </div>
            <div className="col-md-5">
               <div className="p-8 h-100 bg-stone-950 rounded-[2rem] shadow-2xl text-white relative overflow-hidden">
                  <div className="position-absolute top-[-20%] right-[-10%] text-white/5">
                     <span className="material-symbols-outlined text-[150px]">hub</span>
                  </div>
                  <div className="relative z-1">
                     <span className="text-[9px] fw-black text-uppercase tracking-widest text-stone-700 mb-4 d-block">Network Distribution</span>
                     <div className="space-y-4">
                        {[
                          { label: 'Asset Intelligence Feed', val: '84' },
                          { label: 'Artisan Soul Mosaic', val: '65' },
                          { label: 'External Legacy API', val: '12' }
                        ].map((net, i) => (
                          <div key={i}>
                             <div className="d-flex justify-content-between text-[9px] fw-black tracking-widest text-stone-600 mb-1">
                                <span>{net.label}</span>
                                <span>{net.val}%</span>
                             </div>
                             <div className="h-0.5 bg-stone-800 rounded-full overflow-hidden">
                                <div className="h-100 bg-white" style={{ width: `${net.val}%` }}></div>
                             </div>
                          </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Broadcast Modal */}
      {isBroadcastModalOpen && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark/50 backdrop-blur-sm z-[100] d-flex align-items-center justify-content-center p-4">
          <div className="bg-stone-950 text-white rounded-[2.5rem] shadow-2xl max-w-[600px] w-100 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="px-8 py-6 border-bottom border-white/10 d-flex justify-content-between align-items-center bg-white/5">
              <h3 className="fs-5 fw-black font-serif mb-0 tracking-tight lowercase d-flex align-items-center gap-3">
                 <span className="size-3 rounded-full bg-rose-500 animate-pulse"></span>
                 Broadcast.Status
              </h3>
              <button onClick={() => setIsBroadcastModalOpen(false)} className="text-stone-600 hover:text-white transition">
                <span className="material-symbols-outlined fs-5">close</span>
              </button>
            </div>
            <div className="p-8">
               <p className="text-sm text-stone-600 mb-6 font-medium">Configure network feeds for active workbench cameras. Broadcast targets prioritize VIP clients following bespoke entries in real-time.</p>
               <div className="row g-4 mb-8">
                  <div className="col-6">
                     <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <span className="text-[10px] text-stone-700 uppercase tracking-widest d-block mb-1">Active Streams</span>
                        <span className="text-xl fw-black">2/4</span>
                     </div>
                  </div>
                  <div className="col-6">
                     <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <span className="text-[10px] text-stone-700 uppercase tracking-widest d-block mb-1">Data Rate</span>
                        <span className="text-xl fw-black">12.5 Mbps</span>
                     </div>
                  </div>
               </div>
               <div className="d-flex justify-content-end">
                  <button className="px-6 py-3 rounded-xl bg-primary text-white text-[10px] fw-black text-uppercase tracking-widest shadow-lg hover:opacity-90 transition d-flex gap-2 align-items-center">
                     <span className="material-symbols-outlined fs-6">cell_tower</span>
                     Initialize Global Sync
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Maintenance Modal */}
      {isMaintenanceModalOpen && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark/50 backdrop-blur-sm z-[100] d-flex align-items-center justify-content-center p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-[500px] w-100 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="px-8 py-6 border-bottom border-stone-100 d-flex justify-content-between align-items-center bg-stone-50/50">
              <h3 className="fs-5 fw-black font-serif text-dark mb-0 tracking-tight lowercase">Studio.Maintenance</h3>
              <button onClick={() => setIsMaintenanceModalOpen(false)} className="text-stone-600 hover:text-dark transition">
                <span className="material-symbols-outlined fs-5">close</span>
              </button>
            </div>
            <div className="p-8">
               <p className="text-sm fw-medium text-stone-700 mb-6">Temporarily suspend all non-essential video endpoints for routine backend calibration and lens cleaning.</p>
               <div className="d-flex align-items-center justify-content-between p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl mb-8">
                  <div className="d-flex gap-3 align-items-center">
                     <span className="material-symbols-outlined text-amber-500 fs-4">warning</span>
                     <div>
                        <span className="d-block text-xs fw-black text-amber-600 uppercase tracking-widest">Visibility Outage</span>
                        <span className="text-[10px] fw-medium text-amber-600/70">Estimated duration: ~15 mins</span>
                     </div>
                  </div>
               </div>
               <div className="d-flex justify-content-end gap-3">
                  <button onClick={() => setIsMaintenanceModalOpen(false)} className="px-6 py-2.5 rounded-xl border border-stone-200 text-[10px] fw-black text-uppercase tracking-widest text-stone-700 hover:bg-stone-50 transition">Cancel</button>
                  <button className="px-6 py-2.5 rounded-xl bg-dark text-white text-[10px] fw-black text-uppercase tracking-widest hover:bg-stone-800 transition shadow-lg">Confirm Blackout</button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLiveStudio;
