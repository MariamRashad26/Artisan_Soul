import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Month');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data } = await axios.get('/api/orders');
        // Map backend orders to dashboard format
        const formattedOrders = data.map(order => ({
          id: order.orderId || order._id.substring(0, 8),
          name: order.patron || 'Unknown',
          model: order.model || 'Standard',
          status: order.phase || 'Pending',
          price: '$' + (Math.floor(Math.random() * 500) + 500), // Placeholder until price is in order
          color: order.status === 'urgent' ? 'amber-600' : 'primary'
        })).slice(0, 5); // Show latest 5
        
        setOrders(formattedOrders);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  return (
    <div className="p-8 lg:p-12 animate-in fade-in slide-in-from-bottom duration-1000">
      {/* Executive KPI Grid */}
      <section className="row g-6 mb-12">
        {[
          { label: 'Fiscal Revenue', value: '$124,500', detail: '+12.5% vs Last Period', icon: 'payments', trend: 'up' },
          { label: 'Active Pipeline', value: '42', detail: 'Orders in Production', icon: 'manufacturing', trend: 'up' },
          { label: 'Bespoke Requests', value: '18', detail: 'Awaiting Master Review', icon: 'draw', trend: 'stable' },
          { label: 'QA Yield Rate', value: '98.5%', detail: 'Master Artisan Grade', icon: 'workspace_premium', trend: 'up' }
        ].map((stat, i) => (
          <div key={i} className="col-md-6 col-lg-3">
            <div className="glass-panel p-7 rounded-[2rem] border-stone-100 shadow-premium group hover:-translate-y-1 transition-all duration-500 relative overflow-hidden">
              <div className="position-absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <span className="material-symbols-outlined display-3">{stat.icon}</span>
              </div>
              <div className="relative z-1">
                <h4 className="text-[10px] fw-black text-stone-600 text-uppercase tracking-[0.3em] mb-4">{stat.label}</h4>
                <p className="display-5 fw-black font-serif text-dark mb-1 tracking-tighter">{stat.value}</p>
                <div className="d-flex align-items-center gap-2">
                   <div className={`size-5 rounded-full d-flex align-items-center justify-content-center text-[10px] fw-black ${stat.trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-stone-50 text-stone-600'}`}>
                      <span className="material-symbols-outlined fs-6">{stat.trend === 'up' ? 'trending_up' : 'trending_flat'}</span>
                   </div>
                   <span className="text-[10px] fw-black text-uppercase tracking-widest text-stone-600">{stat.detail}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Primary Insights & Operations */}
      <div className="row g-8 mb-12">
        <div className="col-lg-8">
           {/* Boutique Order Registry */}
           <section className="glass-panel rounded-[2.5rem] border-stone-100 shadow-premium overflow-hidden h-100 d-flex flex-column">
              <div className="px-8 py-7 border-bottom border-stone-50 d-flex justify-content-between align-items-center bg-stone-50/30">
                 <div>
                    <h3 className="fs-4 fw-black font-serif text-dark tracking-tighter mb-1 lowercase">Order.Registry</h3>
                    <p className="text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-600 mb-0">Active Fulfillment pipeline</p>
                 </div>
                 <Link to="/admin/orders" className="px-6 py-2.5 rounded-xl bg-dark text-white text-[10px] fw-black text-uppercase tracking-widest hover:-translate-y-0.5 transition duration-500 shadow-lg">
                    Manage All
                 </Link>
              </div>
              <div className="table-responsive flex-grow-1">
                 <table className="w-100 text-start align-middle">
                    <thead className="bg-stone-50/50">
                       <tr>
                          <th className="px-8 py-5 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-600">Registry ID</th>
                          <th className="px-8 py-5 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-600">Patron</th>
                          <th className="px-8 py-5 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-600">Design Model</th>
                          <th className="px-8 py-5 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-600">Status</th>
                          <th className="px-8 py-5 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-600 text-end">Valuation</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-50">
                       {loading ? (
                         <tr><td colSpan="5" className="px-8 py-6 text-center text-stone-500">Loading orders...</td></tr>
                       ) : orders.map((order, i) => (
                          <tr key={i} className="group hover:bg-stone-50 transition-colors duration-500 cursor-pointer">
                             <td className="px-8 py-6 fw-black text-stone-600 fs-6 tracking-tight">{order.id}</td>
                             <td className="px-8 py-6">
                                <div className="d-flex align-items-center gap-3">
                                   <div className="size-8 rounded-full bg-stone-100 text-[10px] fw-black text-stone-600 d-flex align-items-center justify-content-center border border-stone-200">
                                      {order.name.split(' ').map(n => n[0]).join('')}
                                   </div>
                                   <span className="fw-black text-dark fs-6 tracking-tight">{order.name}</span>
                                </div>
                             </td>
                             <td className="px-8 py-6">
                                <span className="fs-6 fw-bold text-stone-700 font-serif italic">{order.model}</span>
                             </td>
                             <td className="px-8 py-6">
                                <div className="d-flex align-items-center gap-2">
                                   <span className={`size-2 rounded-full bg-${order.color === 'primary' ? 'primary' : order.color.split('-')[0] + '-500'}`}></span>
                                   <span className={`text-[10px] fw-black text-uppercase tracking-widest text-${order.color}`}>
                                      {order.status}
                                   </span>
                                </div>
                             </td>
                             <td className="px-8 py-6 text-end fw-black text-dark font-serif fs-5 tracking-tighter">{order.price}</td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </section>
        </div>

        <div className="col-lg-4">
           <div className="d-flex flex-column gap-8 h-100">
              {/* Artisan Collective Status */}
              <section className="glass-panel p-8 rounded-[2.5rem] border-stone-100 shadow-premium flex-grow-1">
                 <h3 className="fs-4 fw-black font-serif text-dark tracking-tighter mb-6 lowercase">Artizan.Collective</h3>
                 <div className="space-y-6">
                    {[
                       { name: 'Lorenzo Giamatti', tasks: 8, capacity: 85, img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200' },
                       { name: 'Marco Sartori', tasks: 4, capacity: 40, img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200' },
                       { name: 'Sofia Bellucci', tasks: 12, capacity: 95, img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200' }
                    ].map((artisan, i) => (
                       <div key={i} className="group cursor-pointer">
                          <div className="d-flex align-items-center justify-content-between mb-2">
                             <div className="d-flex align-items-center gap-3">
                                <div className="size-9 rounded-xl overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
                                   <img src={artisan.img} alt={artisan.name} className="w-100 h-100 object-cover" />
                                </div>
                                <span className="text-xs fw-black text-dark tracking-tight">{artisan.name}</span>
                             </div>
                             <span className="text-[10px] fw-black text-stone-600">{artisan.tasks} Tasks</span>
                          </div>
                          <div className="h-1 bg-stone-100 rounded-full overflow-hidden shadow-inner">
                             <div 
                                className={`h-100 rounded-full transition-all duration-1000 ${artisan.capacity > 90 ? 'bg-rose-500' : 'bg-primary'}`} 
                                style={{ width: `${artisan.capacity}%` }}
                             ></div>
                          </div>
                       </div>
                    ))}
                 </div>
              </section>

              {/* Live Studio Command */}
              <section className="bg-dark rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
                 <div className="position-absolute bottom-[-20%] right-[-10%] size-60 bg-primary/20 rounded-full blur-[80px] group-hover:scale-110 transition-transform duration-1000"></div>
                 <div className="relative z-1">
                    <div className="d-flex align-items-center gap-3 mb-4">
                       <span className="material-symbols-outlined text-primary fs-3">videocam</span>
                       <span className="text-[10px] fw-black text-uppercase tracking-[0.3em] text-white/40">Live Virtual Studio</span>
                    </div>
                    <h3 className="fs-3 fw-black font-serif tracking-tighter mb-2 lowercase italic">Atelier.Stream</h3>
                    <p className="text-white/40 text-xs fw-medium leading-relaxed mb-6">3 Global patrons awaiting live craftsmanship validation.</p>
                    <Link to="/admin/video" className="w-100 py-4 rounded-2xl bg-white text-dark text-xs fw-black text-uppercase tracking-widest hover:bg-stone-100 transition duration-500 shadow-xl d-flex align-items-center justify-content-center gap-3 text-decoration-none">
                       Enter Studio
                       <span className="material-symbols-outlined fs-5">arrow_forward</span>
                    </Link>
                 </div>
              </section>
           </div>
        </div>
      </div>

      {/* Popular Designs Section */}
      <section className="glass-panel p-8 rounded-[3rem] border-stone-100 shadow-premium overflow-hidden">
         <div className="d-flex justify-content-between align-items-center mb-10">
            <div>
               <h3 className="fs-4 fw-black font-serif text-dark tracking-tighter mb-1 lowercase">Global.Trends</h3>
               <p className="text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-600 mb-0">Monthly design performance</p>
            </div>
            <div className="d-flex gap-2">
               {['Month', 'Quarter', 'Year'].map(t => (
                  <button 
                     key={t} 
                     onClick={() => setSelectedPeriod(t)}
                     className={`px-5 py-2 rounded-xl text-[10px] fw-black text-uppercase tracking-widest transition duration-500 ${selectedPeriod === t ? 'bg-dark text-white' : 'text-stone-600 hover:bg-stone-50'}`}
                  >
                     {t}
                  </button>
               ))}
            </div>
         </div>
         <div className="row g-6">
             {[
               { name: 'Heritage Oxford', orders: selectedPeriod === 'Month' ? 124 : selectedPeriod === 'Quarter' ? 342 : 1240, growth: selectedPeriod === 'Year' ? '+25%' : '+12%', img: '/img/heritage_oxford.png' },
               { name: 'Artisan Brogue', orders: selectedPeriod === 'Month' ? 98 : selectedPeriod === 'Quarter' ? 285 : 980, growth: selectedPeriod === 'Year' ? '+15%' : '+5%', img: '/img/artisan_brogue.png' },
               { name: 'Monk Strap Elite', orders: selectedPeriod === 'Month' ? 85 : selectedPeriod === 'Quarter' ? 240 : 850, growth: selectedPeriod === 'Year' ? '+35%' : '+22%', img: '/img/monk_strap_elite.png' }
            ].map((design, i) => (
               <div key={i} className="col-md-4">
                  <div className="d-flex align-items-center gap-6 group hover:translate-x-2 transition-transform duration-500">
                     <div className="size-20 rounded-2xl overflow-hidden border border-stone-100 shadow-lg group-hover:scale-110 transition-transform duration-700">
                        <img src={design.img} alt={design.name} className="w-100 h-100 object-cover" />
                     </div>
                     <div>
                        <h4 className="fs-6 fw-black text-dark tracking-tight mb-1">{design.name}</h4>
                        <p className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-600 mb-1">{design.orders} monthly orders</p>
                        <span className="text-[10px] fw-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-lg">{design.growth}</span>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
