import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const ArtisanAssignedOrders = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get('/api/orders');
        const activeOrders = data
          .filter(order => order.phase !== 'Finished')
          .map(order => ({
            id: order.orderId || order.order_id || '#AS-0000',
            patron: order.patron || 'Unknown Patron',
            model: order.model || 'Workshop Special',
            phase: order.phase || 'Design Prep',
            progress: order.progress || 0,
            deadline: order.deadline || 'Unscheduled',
            status: order.status || 'normal'
          }))
          .reverse();
        setAllOrders(activeOrders);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching workshop assignments:', error);
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const totalPages = Math.ceil(allOrders.length / itemsPerPage);
  const currentOrders = allOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };
  return (
    <div className="min-vh-100 bg-background-light font-display text-dark lg:pb-20">
      {/* Sticky Premium Header */}
      <header className="bg-white/80 backdrop-blur-xl border-bottom border-stone-200 px-6 lg:px-12 py-6 sticky-top z-40 shadow-sm animate-in slide-in-from-top duration-700">
        <div className="max-w-7xl mx-auto d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-6">
          <div className="d-flex align-items-center gap-5">
            <Link to="/artisan" className="size-12 rounded-xl bg-stone-50 border border-stone-200 d-flex align-items-center justify-content-center text-stone-400 hover:text-dark hover:bg-white hover:border-dark transition duration-500 shadow-sm group">
              <span className="material-symbols-outlined fs-4 group-hover:-translate-x-1 transition-transform">arrow_back</span>
            </Link>
            <div>
              <div className="d-flex align-items-center gap-3 text-primary mb-1">
                <span className="material-symbols-outlined fs-6">assignment</span>
                <span className="text-[10px] fw-black text-uppercase tracking-[0.3em]">Master Workshop Ledger</span>
              </div>
              <h1 className="display-6 fw-black font-serif text-dark tracking-tighter mb-0 lowercase">Assigned.Orders</h1>
            </div>
          </div>
          
          <div className="d-flex gap-3">
             <button className="px-6 py-3.5 rounded-2xl border border-stone-200 text-stone-600 fw-black text-xs text-uppercase tracking-widest hover:bg-stone-50 transition duration-500 shadow-sm d-flex align-items-center gap-3">
                <span className="material-symbols-outlined fs-5 animate-spin-slow">sync</span>
                Sync Workshop
             </button>
             <Link to="/artisan" className="px-8 py-3.5 rounded-2xl bg-dark text-white fw-black text-xs text-uppercase tracking-widest shadow-xl hover:-translate-y-1 transition duration-500 d-flex align-items-center gap-3">
                Overview
                <span className="material-symbols-outlined fs-5">dashboard</span>
             </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-10 animate-in fade-in slide-in-from-bottom duration-1000">
        {/* Statistics Banner */}
        <section className="row g-4 mb-10">
          {[
            { label: 'Active Tasks', value: allOrders.length < 10 ? `0${allOrders.length}` : allOrders.length, detail: 'Current backlog', icon: 'manufacturing' },
            { label: 'Urgent Ops', value: allOrders.filter(o => o.status === 'urgent').length, detail: 'Requires priority', icon: 'workspace_premium' },
            { label: 'Completion rate', value: '92%', detail: 'Ahead of schedule', icon: 'speed' }
          ].map((stat, i) => (
            <div key={i} className="col-md-4">
              <div className="glass-panel p-6 rounded-[2rem] border-stone-100 shadow-premium flex-grow-1 group hover:-translate-y-1 transition-all duration-500">
                <div className="d-flex justify-content-between align-items-start h-100">
                  <div>
                    <h4 className="text-[10px] fw-black text-stone-400 text-uppercase tracking-[0.3em] mb-3">{stat.label}</h4>
                    <p className="display-5 fw-black font-serif text-dark mb-1 tracking-tighter">{stat.value}</p>
                    <p className="text-primary text-[10px] fw-black text-uppercase tracking-widest mb-0">{stat.detail}</p>
                  </div>
                  <div className="size-12 bg-stone-50 rounded-2xl d-flex align-items-center justify-content-center text-stone-300 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                    <span className="material-symbols-outlined">{stat.icon}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Orders Table Section */}
        <section className="glass-panel rounded-[3rem] border-stone-100 shadow-premium overflow-hidden mb-10">
          <div className="overflow-x-auto">
            <table className="w-100 text-start min-w-[900px]">
              <thead className="bg-stone-50/50">
                <tr>
                  <th className="px-8 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-400">Assignment ID</th>
                  <th className="px-8 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-400">Patron</th>
                  <th className="px-8 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-400">Design Model</th>
                  <th className="px-8 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-400">Current Phase</th>
                  <th className="px-8 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-400">Deadline</th>
                  <th className="px-8 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-400 text-end">Log</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {currentOrders.map((order, i) => (
                  <tr key={i} className="group hover:bg-stone-50 transition-colors duration-500 cursor-pointer">
                    <td className="px-8 py-8">
                       <span className="fs-6 fw-black text-primary tracking-tight">{order.id}</span>
                    </td>
                    <td className="px-8 py-8">
                      <div className="d-flex align-items-center gap-4">
                        <div className="size-10 rounded-full bg-stone-100 d-flex align-items-center justify-content-center text-[11px] fw-black text-stone-400 border border-stone-200 shadow-inner group-hover:bg-white transition-colors">
                          {order.patron.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="fs-6 fw-black text-dark tracking-tight">{order.patron}</span>
                      </div>
                    </td>
                    <td className="px-8 py-8">
                       <span className="fs-6 fw-bold text-stone-500 font-serif italic">{order.model}</span>
                    </td>
                    <td className="px-8 py-8">
                       <div className="space-y-2">
                          <div className="d-flex justify-content-between align-items-center mb-1">
                             <span className="text-[10px] fw-black text-primary text-uppercase tracking-widest">{order.phase}</span>
                             <span className="text-[10px] fw-black text-stone-400">{order.progress}%</span>
                          </div>
                          <div className="h-1 bg-stone-100 rounded-full overflow-hidden shadow-inner">
                             <div className="h-100 bg-primary rounded-full shadow-sm shadow-primary/40 transition-all duration-1000" style={{ width: `${order.progress}%` }}></div>
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-8">
                       <div className={`d-flex align-items-center gap-2 text-xs fw-black text-uppercase tracking-widest ${order.status === 'urgent' ? 'text-amber-600' : 'text-stone-400'}`}>
                          <span className="material-symbols-outlined fs-6">schedule</span>
                          {order.deadline}
                       </div>
                    </td>
                    <td className="px-8 py-8 text-end">
                       <Link to={`/artisan/production/${order.id.replace('#', '')}`} className="size-10 bg-white border border-stone-100 rounded-xl d-flex align-items-center justify-content-center text-stone-400 hover:text-primary hover:border-primary hover:shadow-xl hover:-translate-x-1 transition-all duration-500">
                          <span className="material-symbols-outlined">arrow_forward_ios</span>
                       </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Detailed Pagination */}
          <div className="px-8 py-6 bg-stone-50/30 d-flex justify-content-between align-items-center border-top border-stone-50">
             <p className="text-[11px] fw-black text-stone-400 text-uppercase tracking-widest mb-0">Page {currentPage < 10 ? `0${currentPage}` : currentPage} of {totalPages < 10 ? `0${totalPages}` : totalPages} <span className="mx-3 opacity-20">|</span> {allOrders.length} Assignment Records</p>
             <div className="d-flex gap-2">
                <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="size-9 rounded-lg border border-stone-200 d-flex align-items-center justify-content-center text-stone-400 bg-white hover:bg-stone-50 transition duration-500 disabled:opacity-30">
                  <span className="material-symbols-outlined fs-5">chevron_left</span>
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                   <button onClick={() => goToPage(p)} key={p} className={`size-9 rounded-lg d-flex align-items-center justify-content-center text-[11px] fw-black transition duration-500 ${p === currentPage ? 'bg-dark text-white shadow-xl' : 'text-stone-400 hover:bg-stone-100'}`}>
                      {p < 10 ? `0${p}` : p}
                   </button>
                ))}
                <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="size-9 rounded-lg border border-stone-200 d-flex align-items-center justify-content-center text-stone-400 bg-white hover:bg-stone-50 transition duration-500 disabled:opacity-30">
                  <span className="material-symbols-outlined fs-5">chevron_right</span>
                </button>
             </div>
          </div>
        </section>

        {/* Master Directive Block */}
        <section className="bg-stone-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
           <div className="position-absolute bottom-[-20%] right-[-10%] size-80 bg-primary/10 rounded-full blur-[100px] group-hover:scale-110 transition-transform duration-1000"></div>
           <div className="row g-8 align-items-center relative z-1">
             <div className="col-md-2 d-flex justify-content-center">
               <div className="size-24 rounded-full border-4 border-white/5 p-2 shadow-inner group-hover:border-primary/20 transition-all duration-1000">
                 <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200" alt="Master Artisan" className="w-100 h-100 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" />
               </div>
             </div>
             <div className="col-md-10">
               <h3 className="fs-4 fw-black font-serif tracking-tight mb-2 italic">"Craftsmanship is the language of the soul."</h3>
               <p className="text-white/40 fs-6 fw-medium leading-relaxed mb-0">Excellent pace, {user?.name || 'Marco'}. You've completed 12 pairs this month with a QA yield of 98.5%. The upcoming Heritage collection requires your specific expertise in hand-burnishing.</p>
             </div>
           </div>
        </section>
      </main>
    </div>
  );
};

export default ArtisanAssignedOrders;
