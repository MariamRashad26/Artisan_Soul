import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from '../../utils/axiosInstance';

const AdminAssignArtisan = () => {
  const { id } = useParams();
  const orderId = id || 'AS-9421';
  const navigate = useNavigate();
  const [selectedArtisan, setSelectedArtisan] = useState(null);
  const [assignmentSuccess, setAssignmentSuccess] = useState(false);

  const [artisans, setArtisans] = useState([]);
  const [orderData, setOrderData] = useState(null);
  const [workOrders, setWorkOrders] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      let orderRes = null;
      try {
        orderRes = await axios.get(`/api/orders/${orderId}`);
      } catch (err) {
        console.warn('Failed to fetch order details, relying on fallback:', err);
      }

      const promises = [
        axios.get('/api/auth/users'),
        axios.get('/api/work-orders')
      ];
      
      const [usersRes, woRes] = await Promise.all(promises);
      
      const artisanUsers = usersRes.data.filter(u => u.role === 'artisan').map(a => ({
        _id: a._id,
        name: a.name,
        role: 'Master Artisan',
        tasks: 'Pending',
        rating: '98%',
        img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
        status: 'Online'
      }));
      setArtisans(artisanUsers);
      
      if (orderRes && orderRes.data) {
        setOrderData(orderRes.data);
      } else {
        // Fallback for mock/dummy orders if any
        setOrderData({
          _id: orderId,
          orderId: orderId.startsWith('#') ? orderId : `#${orderId}`,
          patron: 'Eleanor Maura',
          model: 'Oxford No. 4 Bespoke',
          deadline: new Date(Date.now() + 7*24*60*60*1000).toISOString()
        });
      }
      
      // Filter work orders for this order
      const targetDbId = orderRes?.data?._id || orderId;
      const relevantWOs = woRes.data.filter(wo => {
        const woOrderIdStr = (wo.order_id?._id || wo.order_id || '').toString();
        const searchDbIdStr = (targetDbId || '').toString();
        const searchCustomIdStr = orderId.toString();
        return woOrderIdStr === searchDbIdStr || woOrderIdStr === searchCustomIdStr || woOrderIdStr.replace('#', '') === searchCustomIdStr.replace('#', '');
      });
      setWorkOrders(relevantWOs);
    } catch (error) {
      console.error('Failed to fetch data', error);
    }
  }, [orderId]);

  useEffect(() => {
    const load = async () => {
      await fetchData();
    };
    load();
  }, [fetchData]);

  const handleConfirm = async () => {
    const artisanObj = artisans.find(a => a.name === selectedArtisan);
    if (artisanObj && orderData) {
      try {
        // Create the WorkOrder document linking Order → Artisan
        await axios.post(`/api/work-orders`, { 
          order_id: orderData._id,
          assigned_to: artisanObj._id,
          deadline: orderData.deadline || new Date(Date.now() + 7*24*60*60*1000),
          instructions: 'Standard bespoke assembly.'
        });
        
        // Update the Order with artisan name, artisan_id, and kick off production phase
        await axios.put(`/api/orders/${orderData._id}`, {
          artisan: selectedArtisan,
          artisan_id: artisanObj._id,
          phase: 'Design Prep',
          progress: 10
        });
        
        setAssignmentSuccess(true);
        fetchData();
      } catch (error) {
        console.error(error);
        alert('Failed to assign artisan. Please try again.');
      }
    } else {
      alert('Please select an artisan and ensure order data is loaded.');
    }
  };

  const handleRevokeAssignment = async (woId) => {
    if (window.confirm('Revoke this assignment?')) {
      try {
        await axios.delete(`/api/work-orders/${woId}`);
        fetchData();
      } catch (error) {
        console.error('Failed to revoke', error);
      }
    }
  };

  return (
    <div className="p-8 lg:p-12 animate-in fade-in slide-in-from-bottom duration-1000">
      {/* Success Banner */}
      {assignmentSuccess && (
        <div className="mb-8 p-5 bg-emerald-50 border border-emerald-200 rounded-2xl d-flex align-items-center justify-content-between animate-in slide-in-from-top duration-500">
          <div className="d-flex align-items-center gap-4">
            <div className="size-10 bg-emerald-500 rounded-full d-flex align-items-center justify-content-center text-white shadow-md">
              <span className="material-symbols-outlined fs-5">check</span>
            </div>
            <div>
              <p className="fw-black text-emerald-800 mb-0 text-sm">Deployment Authorized Successfully</p>
              <p className="text-emerald-600 text-xs mb-0">Artisan <strong>{selectedArtisan}</strong> has been assigned. The order now appears on their production floor.</p>
            </div>
          </div>
          <button onClick={() => setAssignmentSuccess(false)} className="text-emerald-500 hover:text-emerald-700 border-0 bg-transparent">
            <span className="material-symbols-outlined fs-5">close</span>
          </button>
        </div>
      )}
      {/* Cinematic Header */}
      <section className="d-flex align-items-center justify-content-between mb-12">
        <div className="d-flex align-items-center gap-6">
          <Link to="/admin/orders" className="size-12 rounded-2xl border border-stone-100 d-flex align-items-center justify-content-center text-stone-700 hover:text-dark hover:border-dark transition-all duration-500">
            <span className="material-symbols-outlined fs-5">arrow_back</span>
          </Link>
          <div>
            <nav className="d-flex align-items-center gap-3 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700 mb-2">
              <Link to="/admin" className="hover:text-dark transition">Operations</Link>
              <span className="material-symbols-outlined fs-6 text-stone-200">chevron_right</span>
              <span className="text-primary">Artisan Selection</span>
            </nav>
            <h1 className="display-5 fw-black font-serif text-dark tracking-tighter mb-0 lowercase">Deployment.Authority</h1>
          </div>
        </div>
      </section>

      <div className="row g-12">
        {/* Order Intelligence Panel */}
        <div className="col-lg-4">
           <section className="glass-panel p-8 rounded-[2.5rem] border-stone-100 shadow-premium sticky-top h-fit" style={{ top: '6rem' }}>
              <div className="d-flex align-items-center gap-3 mb-10">
                 <div className="size-8 bg-stone-950 rounded-lg d-flex align-items-center justify-content-center text-white shadow-lg">
                    <span className="material-symbols-outlined fs-6">analytics</span>
                 </div>
                 <h3 className="fs-5 fw-black font-serif text-dark tracking-tighter mb-0 lowercase">Order.Briefing</h3>
              </div>

              <div className="space-y-6">
                 {[
                    { label: 'Asset Identifier', value: `#${orderId}` },
                    { label: 'Patron', value: orderData?.patron || 'Eleanor Maura' },
                    { label: 'Model Class', value: orderData?.model || 'Oxford No. 4 Bespoke' },
                    { label: 'Primary Material', value: 'Premium Tan Calfskin' },
                    { label: 'Deadline Alpha', value: orderData?.deadline ? new Date(orderData.deadline).toLocaleDateString() : 'Oct 24, 2026', highlight: true }
                 ].map((item, i) => (
                    <div key={i} className="d-flex justify-content-between align-items-end border-bottom border-stone-50 pb-4">
                       <span className="text-[10px] fw-black text-uppercase tracking-widest text-stone-700">{item.label}</span>
                       <span className={`text-sm fw-black tracking-tight ${item.highlight ? 'text-primary' : 'text-dark'}`}>{item.value}</span>
                    </div>
                 ))}
              </div>

              <div className="mt-10 p-6 bg-stone-50/50 rounded-2xl border border-stone-100 relative overflow-hidden group">
                 <div className="position-absolute top-0 right-0 p-3 text-stone-200 opacity-20 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined fs-3">history_edu</span>
                 </div>
                 <p className="text-[11px] fw-black text-stone-600 text-uppercase tracking-widest mb-3">Patron Directives</p>
                 <p className="text-xs fw-medium text-dark lh-lg mb-0 opacity-80">
                    "Double-stitched welt, burnished toe caps. Require artisan with high grain alignment precision."
                 </p>
              </div>
           </section>
        </div>

        {/* Artisan Selection Suite */}
        <div className="col-lg-8">
           <section className="mb-10 d-flex flex-column flex-md-row justify-content-between align-items-center gap-6">
              <h3 className="display-6 fw-black font-serif text-dark tracking-tighter mb-0 lowercase">Artizan.Collective</h3>
              <div className="position-relative w-100 w-md-72 group">
                 <span className="material-symbols-outlined position-absolute left-4 top-50 translate-middle-y text-stone-700 fs-5 group-focus-within:text-dark transition-colors">search</span>
                 <input className="w-100 pl-12 pr-6 py-3 bg-white border border-stone-100 rounded-2xl text-xs fw-black text-dark focus:border-dark transition-all duration-500 shadow-sm" placeholder="Filter by expertise..." type="text" />
              </div>
           </section>

           <div className="row g-6 mb-12">
              {artisans.map((artisan, i) => (
                 <div key={i} className="col-md-6">
                    <div 
                       onClick={() => setSelectedArtisan(artisan.name)}
                       className={`glass-panel p-6 rounded-[2rem] border-2 transition-all duration-500 cursor-pointer group relative overflow-hidden h-100 ${selectedArtisan === artisan.name ? 'border-primary shadow-2xl bg-white translate-y-[-4px]' : 'border-white hover:border-stone-100 hover:shadow-xl'}`}
                    >
                       <div className="d-flex align-items-center gap-5">
                          <div className="position-relative">
                             <div className="size-20 rounded-[1.5rem] bg-stone-100 overflow-hidden border-2 border-white shadow-lg grayscale group-hover:grayscale-0 transition-all duration-700">
                                <img src={artisan.img} alt={artisan.name} className="w-100 h-100 object-cover" />
                             </div>
                             <div className={`position-absolute bottom-[-4px] right-[-4px] size-4 rounded-full border-4 border-white shadow-sm ${artisan.status === 'Online' ? 'bg-emerald-500' : artisan.status === 'Idle' ? 'bg-amber-500' : 'bg-primary'}`}></div>
                          </div>
                          <div>
                             <h4 className="text-sm fw-black text-dark tracking-tight mb-1">{artisan.name}</h4>
                             <span className="text-[9px] fw-black text-uppercase tracking-widest text-primary mb-3 d-block">{artisan.role}</span>
                             <div className="d-flex align-items-center gap-4">
                                <div className="d-flex align-items-center gap-1.5">
                                   <span className="material-symbols-outlined text-stone-700 fs-6">inventory_2</span>
                                   <span className="text-[10px] fw-black text-stone-600">{artisan.tasks}</span>
                                </div>
                                <div className="d-flex align-items-center gap-1.5">
                                   <span className="material-symbols-outlined text-amber-500 fs-6">star</span>
                                   <span className="text-[10px] fw-black text-stone-600">{artisan.rating}</span>
                                </div>
                             </div>
                          </div>
                          {selectedArtisan === artisan.name && (
                             <div className="ms-auto animate-in zoom-in duration-500">
                                <div className="size-8 rounded-full bg-primary d-flex align-items-center justify-content-center text-white shadow-lg">
                                   <span className="material-symbols-outlined fs-5">check</span>
                                </div>
                             </div>
                          )}
                       </div>
                    </div>
                 </div>
              ))}
           </div>

           {/* Deployment Controls */}
           <footer className="d-flex align-items-center justify-content-end gap-4 pt-10 border-top border-stone-100 mb-12">
              <button onClick={() => navigate(-1)} className="px-8 py-4 rounded-2xl bg-white border border-stone-100 text-[10px] fw-black text-uppercase tracking-widest text-stone-600 hover:text-dark hover:border-dark transition-all duration-500">
                 Abort Selection
              </button>
              <button 
                 disabled={!selectedArtisan} 
                 onClick={handleConfirm} 
                 className={`px-12 py-4 rounded-2xl text-[10px] fw-black text-uppercase tracking-widest transition-all duration-500 d-flex align-items-center gap-3 ${selectedArtisan ? 'bg-dark text-white shadow-2xl hover:-translate-y-1' : 'bg-stone-50 text-stone-200 cursor-not-allowed'}`}
              >
                 <span className="material-symbols-outlined fs-5">how_to_reg</span>
                 Authorize Deployment
              </button>
           </footer>

           {/* Active Assignments Log */}
           <section>
              <h3 className="display-6 fw-black font-serif text-dark tracking-tighter mb-6 lowercase">Active.Deployments</h3>
              <div className="glass-panel rounded-[2rem] border-stone-100 shadow-sm overflow-hidden">
                 {workOrders.length === 0 ? (
                    <div className="p-8 text-center text-stone-400 text-sm fw-bold">No active assignments for this order.</div>
                 ) : (
                    <div className="table-responsive">
                       <table className="w-100 text-start align-middle">
                          <thead className="bg-stone-50/50 border-bottom border-stone-100">
                             <tr>
                                <th className="px-8 py-5 text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-500">Order Ref</th>
                                <th className="px-8 py-5 text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-500">Artisan</th>
                                <th className="px-8 py-5 text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-500">Status</th>
                                <th className="px-8 py-5 text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-500 text-end">Actions</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-stone-50">
                             {workOrders.map((wo) => (
                                <tr key={wo._id} className="hover:bg-stone-50/50 transition">
                                   <td className="px-8 py-6 text-xs fw-bold text-dark">{wo.order_id?.order_number || orderId}</td>
                                   <td className="px-8 py-6 text-xs fw-bold text-primary">{wo.assigned_to?.name || 'Unknown'}</td>
                                   <td className="px-8 py-6">
                                      <span className={`text-[9px] fw-black text-uppercase tracking-widest px-3 py-1.5 rounded-pill ${wo.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                         {wo.status || 'Pending'}
                                      </span>
                                   </td>
                                   <td className="px-8 py-6 text-end">
                                      <button 
                                         onClick={() => handleRevokeAssignment(wo._id)}
                                         className="btn btn-sm btn-outline-rose rounded-xl px-3 py-1.5 text-[9px] fw-black text-uppercase tracking-widest transition"
                                      >
                                         Revoke
                                      </button>
                                   </td>
                                </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                 )}
              </div>
           </section>
        </div>
      </div>
    </div>
  );
};

export default AdminAssignArtisan;
