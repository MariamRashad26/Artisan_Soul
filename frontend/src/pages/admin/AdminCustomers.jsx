import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../utils/axiosInstance';
import { useToast } from '../../context/ToastContext';

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast, showConfirm } = useToast();

  const fetchCustomers = async () => {
    try {
      const [{ data: usersData }, { data: ordersData }] = await Promise.all([
        axios.get('/api/auth/users'),
        axios.get('/api/orders')
      ]);
      
      const patrons = usersData.filter(u => u.role === 'user').map(user => {
        const userOrders = ordersData.filter(o => 
          o.user === user._id || 
          o.user?._id === user._id || 
          o.user_id === user._id || 
          (o.patron && user.name && o.patron.trim().toLowerCase() === user.name.trim().toLowerCase())
        );
        const totalSpend = userOrders.reduce((sum, o) => sum + (o.price || o.amount || 0), 0);
        return {
          id: user._id,
          name: user.name,
          email: user.email,
          tier: totalSpend > 5000 ? 'Imperial' : totalSpend > 1000 ? 'Legacy' : 'Artisan',
          spend: totalSpend.toLocaleString(),
          orders: userOrders.length,
          lastActive: new Date(user.updatedAt || user.createdAt).toLocaleDateString()
        };
      });
      setCustomers(patrons);
    } catch (error) {
      console.error('Error fetching customers', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDeleteCustomer = async (customerId) => {
    showConfirm(
      'Are you sure you want to delete this customer?',
      async () => {
        try {
          await axios.delete(`/api/auth/users/${customerId}`);
          fetchCustomers();
          setManageCustomer(null);
          showToast('Customer profile removed.', 'success');
        } catch (err) {
          console.error('Failed to delete customer', err);
          showToast('Failed to delete customer.', 'error');
        }
      }
    );
  };

  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [manageCustomer, setManageCustomer] = useState(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const totalPages = Math.max(1, Math.ceil(customers.length / itemsPerPage));
  const paginatedCustomers = customers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleDispatchExport = () => {
    const csv = ['ID,Name,Tier,Spend,Orders,LastActive,Email'];
    customers.forEach(c => csv.push(`${c.id},"${c.name}",${c.tier},"${c.spend}",${c.orders},${c.lastActive},${c.email}`));
    const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'patron_registry_dispatch.csv';
    a.click();
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const newUser = {
        name: e.target.name.value,
        email: e.target.email.value,
        password: 'password123', // Default password
        role: 'user'
      };
      await axios.post('/api/auth/register', newUser);
      fetchCustomers();
      setIsRegisterModalOpen(false);
      showToast(`${newUser.name} registered as a new patron.`, 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to register customer.', 'error');
    }
  };

  return (
    <div className="p-8 lg:p-12 animate-in fade-in duration-1000">
      <section className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-6 mb-12">
        <div>
          <nav className="d-flex align-items-center gap-3 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700 mb-4">
            <Link to="/admin" className="hover:text-dark transition">Operations</Link>
            <span className="material-symbols-outlined fs-6 text-stone-200">chevron_right</span>
            <span className="text-primary">Patron Portfolio</span>
          </nav>
          <h1 className="display-4 fw-black font-serif text-dark tracking-tighter mb-0 lowercase">Patron.Registry</h1>
        </div>
        
        <div className="d-flex gap-4">
          <button onClick={handleDispatchExport} className="px-8 py-3.5 rounded-2xl bg-white border border-stone-100 text-[10px] fw-black text-uppercase tracking-widest text-dark hover:bg-stone-50 transition duration-500 shadow-sm d-flex align-items-center gap-3">
            <span className="material-symbols-outlined fs-5">mail</span>
            Global Dispatch
          </button>
          <button onClick={() => setIsRegisterModalOpen(true)} className="px-8 py-3.5 rounded-2xl bg-dark text-white text-[10px] fw-black text-uppercase tracking-widest shadow-2xl hover:-translate-y-1 transition duration-500 d-flex align-items-center gap-3">
            <span className="material-symbols-outlined fs-5">person_add</span>
            Register New Patron
          </button>
        </div>
      </section>

      <div className="row g-8 mb-8">
        {paginatedCustomers.map((customer, i) => (
          <div key={i} className="col-lg-6">
            <div className="glass-panel p-8 rounded-[3rem] border-stone-100 shadow-premium group hover:border-dark transition-all duration-700">
               <div className="d-flex align-items-center justify-content-between mb-8">
                  <div className="d-flex align-items-center gap-6">
                     <div className="size-16 rounded-[1.5rem] bg-stone-950 text-white d-flex align-items-center justify-content-center text-xl fw-black shadow-2xl">
                        {customer.name.split(' ').map(n => n[0]).join('')}
                     </div>
                     <div>
                        <h3 className="text-xl fw-black text-dark tracking-tight mb-1">{customer.name}</h3>
                        <div className="d-flex align-items-center gap-3">
                           <span className={`text-[9px] fw-black text-uppercase tracking-widest px-2 py-0.5 rounded-lg ${customer.tier === 'Imperial' ? 'bg-amber-500/10 text-amber-600' : 'bg-primary/10 text-primary'}`}>
                              {customer.tier} Tier
                           </span>
                           <span className="text-[10px] fw-black text-stone-700 tracking-tighter">{(customer.id || '').toString().slice(-6).toUpperCase()}</span>
                        </div>
                     </div>
                  </div>
                  <div className="text-end">
                     <span className="text-[9px] fw-black text-uppercase tracking-widest text-stone-700 d-block mb-1">Portfolio Value</span>
                     <span className="text-lg fw-black text-dark font-display">{customer.spend} <span className="text-xs text-stone-700 uppercase">PKR</span></span>
                  </div>
               </div>

               <div className="row g-6 py-6 border-top border-stone-50">
                  <div className="col-4">
                     <span className="text-[9px] fw-black text-uppercase tracking-widest text-stone-700 d-block mb-1">Total Orders</span>
                     <span className="text-sm fw-black text-dark tracking-tight">{customer.orders}</span>
                  </div>
                  <div className="col-4 border-start border-stone-50 pl-6">
                     <span className="text-[9px] fw-black text-uppercase tracking-widest text-stone-700 d-block mb-1">Last Interaction</span>
                     <span className="text-sm fw-black text-dark tracking-tight">{customer.lastActive}</span>
                  </div>
                  <div className="col-4 text-end">
                     <button onClick={() => setManageCustomer(customer)} className="px-5 py-2 rounded-xl border border-stone-100 text-[9px] fw-black text-uppercase tracking-widest text-primary hover:bg-primary hover:text-white hover:border-primary transition duration-300">Manage View</button>
                  </div>
               </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="d-flex align-items-center justify-content-between px-8 py-6 mb-12 glass-panel rounded-[2rem] border-stone-100 shadow-sm">
           <p className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-600 mb-0">Page {currentPage.toString().padStart(2, '0')} of {totalPages.toString().padStart(2, '0')} — Active Portfolio: {customers.length} Patrons</p>
           <div className="d-flex align-items-center gap-4">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="size-10 rounded-2xl border border-stone-100 bg-white d-flex align-items-center justify-content-center text-stone-200 hover:text-dark hover:border-dark transition duration-500 disabled:opacity-30 disabled:hover:border-stone-100 disabled:hover:text-stone-200 cursor-pointer disabled:cursor-default"
              >
                <span className="material-symbols-outlined fs-5">chevron_left</span>
              </button>
              <div className="d-flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button 
                      key={p} 
                      onClick={() => setCurrentPage(p)}
                      className={`size-10 rounded-2xl text-[10px] fw-black transition duration-500 ${p === currentPage ? 'bg-dark text-white shadow-xl shadow-stone-200 cursor-default' : 'text-stone-600 hover:bg-white hover:text-dark hover:border-stone-100'}`}
                    >
                      {p}
                    </button>
                ))}
              </div>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="size-10 rounded-2xl border border-stone-100 bg-white d-flex align-items-center justify-content-center text-stone-600 hover:text-dark hover:border-dark transition duration-500 disabled:opacity-30 disabled:hover:border-stone-100 disabled:hover:text-stone-600 cursor-pointer disabled:cursor-default"
              >
                <span className="material-symbols-outlined fs-5">chevron_right</span>
              </button>
           </div>
        </div>
      )}



      {/* Register Patron Modal */}
      {isRegisterModalOpen && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark/50 backdrop-blur-sm z-[100] d-flex align-items-center justify-content-center p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-[500px] w-100 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="px-8 py-6 border-bottom border-stone-100 d-flex justify-content-between align-items-center bg-stone-50/50">
              <h3 className="fs-5 fw-black font-serif text-dark mb-0 tracking-tight lowercase">Register.Patron</h3>
              <button onClick={() => setIsRegisterModalOpen(false)} className="text-stone-600 hover:text-dark transition">
                <span className="material-symbols-outlined fs-5">close</span>
              </button>
            </div>
            <form onSubmit={handleRegister} className="p-8 space-y-6">
              <div className="row g-4">
                <div className="col-12">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Full Name</label>
                  <input name="name" required className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" />
                </div>
                <div className="col-12">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Contact Email</label>
                  <input name="email" type="email" required className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" />
                </div>
                <div className="col-12">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Designated Tier</label>
                  <select name="tier" className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition">
                    <option value="Imperial">Imperial</option>
                    <option value="Legacy">Legacy</option>
                    <option value="Artisan">Artisan</option>
                  </select>
                </div>
              </div>
              <div className="pt-6 border-top border-stone-100 d-flex justify-content-end gap-3 mt-8">
                <button type="button" onClick={() => setIsRegisterModalOpen(false)} className="px-6 py-2.5 rounded-xl border border-stone-200 text-[10px] fw-black text-uppercase tracking-widest text-stone-700 hover:bg-stone-50 transition">Discard</button>
                <button type="submit" className="px-6 py-2.5 rounded-xl bg-dark text-white text-[10px] fw-black text-uppercase tracking-widest hover:bg-stone-800 transition shadow-lg">Confirm Registration</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manage View Modal */}
      {manageCustomer && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark/50 backdrop-blur-sm z-[100] d-flex align-items-center justify-content-center p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-[500px] w-100 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="px-8 py-6 border-bottom border-stone-100 d-flex justify-content-between align-items-center bg-stone-50/50">
              <h3 className="fs-5 fw-black font-serif text-dark mb-0 tracking-tight lowercase">Patron.Profile</h3>
              <button onClick={() => setManageCustomer(null)} className="text-stone-600 hover:text-dark transition">
                <span className="material-symbols-outlined fs-5">close</span>
              </button>
            </div>
            <div className="p-8">
               <div className="d-flex align-items-center gap-4 mb-6">
                  <div className="size-16 rounded-[1.5rem] bg-stone-950 text-white d-flex align-items-center justify-content-center text-xl fw-black shadow-2xl">
                     {manageCustomer.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                     <h4 className="text-lg fw-black text-dark mb-1 tracking-tight">{manageCustomer.name}</h4>
                     <span className="text-xs fw-medium text-stone-700">{manageCustomer.email}</span>
                  </div>
               </div>
               <div className="d-flex flex-column gap-3 mb-8">
                  <div className="p-4 bg-stone-50 rounded-xl border border-stone-100 d-flex justify-content-between align-items-center">
                     <span className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-600">Status Tier</span>
                     <span className="text-xs fw-black text-dark">{manageCustomer.tier}</span>
                  </div>
                  <div className="p-4 bg-stone-50 rounded-xl border border-stone-100 d-flex justify-content-between align-items-center">
                     <span className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-600">Total Expenditure</span>
                     <span className="text-xs fw-black text-dark">{manageCustomer.spend} PKR</span>
                  </div>
               </div>
               <div className="d-flex justify-content-end gap-3">
                  <button onClick={() => setManageCustomer(null)} className="px-6 py-2.5 rounded-xl border border-stone-200 text-[10px] fw-black text-uppercase tracking-widest text-stone-700 hover:text-rose-500 hover:border-rose-200 transition">Suspend Profile</button>
                  <button onClick={() => handleDeleteCustomer(manageCustomer.id)} className="px-6 py-2.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white transition">Delete Customer</button>
                  <button onClick={() => setManageCustomer(null)} className="px-6 py-2.5 rounded-xl bg-dark text-white text-[10px] fw-black text-uppercase tracking-widest hover:bg-stone-800 transition shadow-lg">Save Adjustments</button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomers;
