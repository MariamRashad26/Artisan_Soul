import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const AdminAssignArtisan = () => {
  const { id } = useParams();
  const orderId = id || 'AS-9421';
  const navigate = useNavigate();
  const [selectedArtisan, setSelectedArtisan] = useState(null);

  const [artisans, setArtisans] = useState([]);
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [{ data: usersData }, { data: oData }] = await Promise.all([
          axios.get('/api/auth/users'),
          axios.get(`/api/orders/${orderId}`)
        ]);
        const artisanUsers = usersData.filter(u => u.role === 'artisan').map(a => ({
          name: a.name,
          role: 'Master Artisan',
          tasks: 'Pending',
          rating: '98%',
          img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
          status: 'Online'
        }));
        setArtisans(artisanUsers);
        setOrderData(oData);
      } catch (error) {
        console.error('Failed to fetch data', error);
      }
    };
    fetchData();
  }, [orderId]);

  const handleConfirm = async () => {
    if (selectedArtisan && orderData) {
      try {
        await axios.put(`/api/orders/${orderData._id}`, { artisan: selectedArtisan });
        alert(`Deployment Authority Granted.\n\nArtisan: ${selectedArtisan}\nAsset ID: #${orderId}`);
        navigate(`/admin/orders`);
      } catch (error) {
        console.error(error);
        alert('Failed to assign artisan');
      }
    }
  };

  return (
    <div className="p-8 lg:p-12 animate-in fade-in slide-in-from-bottom duration-1000">
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
           <footer className="d-flex align-items-center justify-content-end gap-4 pt-10 border-top border-stone-100">
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
        </div>
      </div>
    </div>
  );
};

export default AdminAssignArtisan;
