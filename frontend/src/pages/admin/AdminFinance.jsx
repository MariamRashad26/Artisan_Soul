import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../utils/axiosInstance';
import { useToast } from '../../context/ToastContext';

const AdminFinance = () => {
  const [activeTab, setActiveTab] = useState('revenues');
  const { showToast, showConfirm } = useToast();
  const [revenues, setRevenues] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [rawMaterials, setRawMaterials] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  // Modal States
  const [isRevenueModalOpen, setIsRevenueModalOpen] = useState(false);
  const [isEditRevenueModalOpen, setIsEditRevenueModalOpen] = useState(false);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [isEditPurchaseModalOpen, setIsEditPurchaseModalOpen] = useState(false);

  // Edit Targets
  const [editingRevenue, setEditingRevenue] = useState(null);
  const [editingPurchase, setEditingPurchase] = useState(null);

  const fetchFinanceData = async () => {
    try {
      const [revRes, purRes, matRes, supRes] = await Promise.all([
        axios.get('/api/finance/revenue'),
        axios.get('/api/finance/purchases'),
        axios.get('/api/raw-materials'),
        axios.get('/api/suppliers')
      ]);

      setRevenues(revRes.data.map(r => ({
        _id: r._id,
        id: r._id?.substring(0, 8).toUpperCase() || 'INV-001',
        date: r.date ? new Date(r.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        source_type: r.source_type || 'Other',
        source: r.description || `Order #${r.source_id?.substring(0, 8) || 'Direct'}`,
        amount: r.amount || 0
      })));

      setPurchases(purRes.data.map(p => ({
        _id: p._id,
        id: p._id?.substring(0, 8).toUpperCase() || 'PO-001',
        date: p.purchase_date ? new Date(p.purchase_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        raw_material_id: p.raw_material_id?._id || p.raw_material_id,
        materialName: p.raw_material_id?.name || 'Material',
        supplier_id: p.supplier_id?._id || p.supplier_id,
        supplierName: p.supplier_id?.name || 'Supplier',
        quantity: p.quantity || 0,
        amount: p.total_cost || 0,
        status: p.status || 'Pending'
      })));

      setRawMaterials(matRes.data || []);
      setSuppliers(supRes.data || []);

    } catch (err) {
      console.error('Failed to fetch finance data', err);
    }
  };

  useEffect(() => {
    fetchFinanceData();
  }, []);

  // CRUD handlers for Revenue
  const handleAddRevenue = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/finance/revenue', {
        source_type: e.target.source_type.value,
        amount: Number(e.target.amount.value),
        date: e.target.date.value,
        description: e.target.description.value
      });
      setIsRevenueModalOpen(false);
      fetchFinanceData();
      showToast('Revenue transaction logged.', 'success');
    } catch (err) {
      showToast('Failed to log revenue.', 'error');
    }
  };

  const handleEditRevenueSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/finance/revenue/${editingRevenue._id}`, {
        source_type: e.target.source_type.value,
        amount: Number(e.target.amount.value),
        date: e.target.date.value,
        description: e.target.description.value
      });
      setIsEditRevenueModalOpen(false);
      setEditingRevenue(null);
      fetchFinanceData();
      showToast('Revenue record updated.', 'success');
    } catch (err) {
      showToast('Failed to update revenue.', 'error');
    }
  };

  const handleDeleteRevenue = async (id) => {
    showConfirm(
      'Are you sure you want to delete this revenue transaction?',
      async () => {
        try {
          await axios.delete(`/api/finance/revenue/${id}`);
          fetchFinanceData();
          showToast('Revenue record deleted.', 'success');
        } catch (err) {
          showToast('Failed to delete revenue record.', 'error');
        }
      }
    );
  };

  // CRUD handlers for Purchases
  const handleAddPurchase = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/finance/purchases', {
        raw_material_id: e.target.raw_material_id.value,
        supplier_id: e.target.supplier_id.value,
        quantity: Number(e.target.quantity.value),
        total_cost: Number(e.target.total_cost.value),
        status: e.target.status.value,
        purchase_date: e.target.purchase_date.value
      });
      setIsPurchaseModalOpen(false);
      fetchFinanceData();
      showToast('Purchase order logged.', 'success');
    } catch (err) {
      showToast('Failed to log purchase.', 'error');
    }
  };

  const handleEditPurchaseSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/finance/purchases/${editingPurchase._id}`, {
        raw_material_id: e.target.raw_material_id.value,
        supplier_id: e.target.supplier_id.value,
        quantity: Number(e.target.quantity.value),
        total_cost: Number(e.target.total_cost.value),
        status: e.target.status.value,
        purchase_date: e.target.purchase_date.value
      });
      setIsEditPurchaseModalOpen(false);
      setEditingPurchase(null);
      fetchFinanceData();
      showToast('Purchase order updated.', 'success');
    } catch (err) {
      showToast('Failed to update purchase.', 'error');
    }
  };

  const handleDeletePurchase = async (id) => {
    showConfirm(
      'Are you sure you want to delete this purchase order?',
      async () => {
        try {
          await axios.delete(`/api/finance/purchases/${id}`);
          fetchFinanceData();
          showToast('Purchase order deleted.', 'success');
        } catch (err) {
          showToast('Failed to delete purchase order.', 'error');
        }
      }
    );
  };

  const totalRevenue = revenues.reduce((sum, r) => sum + r.amount, 0);
  const totalExpense = purchases.reduce((sum, p) => sum + p.amount, 0);
  const netProfit = totalRevenue - totalExpense;

  const tabs = [
    { id: 'revenues', label: 'Cash Inflows (Revenues)' },
    { id: 'expenses', label: 'Cash Outflows (Purchases)' }
  ];

  return (
    <div className="p-8 lg:p-12 animate-in fade-in duration-1000">
      <section className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-6 mb-12">
        <div>
          <nav className="d-flex align-items-center gap-3 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700 mb-4">
            <Link to="/admin" className="hover:text-dark transition">Operations</Link>
            <span className="material-symbols-outlined fs-6 text-stone-200">chevron_right</span>
            <span className="text-primary">Financials</span>
          </nav>
          <h1 className="display-4 fw-black font-serif text-dark tracking-tighter mb-0 lowercase">Ledger.Financials</h1>
        </div>
        
        <div className="d-flex gap-4">
           {activeTab === 'revenues' ? (
             <button onClick={() => setIsRevenueModalOpen(true)} className="px-8 py-3.5 rounded-2xl bg-dark text-white text-[10px] fw-black text-uppercase tracking-widest shadow-2xl hover:-translate-y-1 transition duration-500 d-flex align-items-center gap-3">
               <span className="material-symbols-outlined fs-5">payments</span>
               Log Revenue
             </button>
           ) : (
             <button onClick={() => setIsPurchaseModalOpen(true)} className="px-8 py-3.5 rounded-2xl bg-dark text-white text-[10px] fw-black text-uppercase tracking-widest shadow-2xl hover:-translate-y-1 transition duration-500 d-flex align-items-center gap-3">
               <span className="material-symbols-outlined fs-5">shopping_cart</span>
               Log Purchase
             </button>
           )}
           <button onClick={() => window.print()} className="px-8 py-3.5 rounded-2xl bg-white border border-stone-100 text-[10px] fw-black text-uppercase tracking-widest text-dark hover:bg-stone-50 transition duration-500 shadow-sm d-flex align-items-center gap-3">
             <span className="material-symbols-outlined fs-5">download</span>
             Export Report
           </button>
        </div>
      </section>

      {/* KPI Cards */}
      <div className="row g-6 mb-10">
        <div className="col-12 col-md-4">
          <div className="glass-panel p-6 rounded-3xl border-stone-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl -mr-16 -mt-16 transition duration-700 group-hover:bg-emerald-100"></div>
            <span className="text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-500 mb-2 d-block relative z-10">Total Period Revenue</span>
            <h3 className="display-5 fw-black font-serif text-dark mb-0 relative z-10 tracking-tighter">PKR {totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="glass-panel p-6 rounded-3xl border-stone-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-full blur-3xl -mr-16 -mt-16 transition duration-700 group-hover:bg-rose-100"></div>
            <span className="text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-500 mb-2 d-block relative z-10">Total Purchases Cost</span>
            <h3 className="display-5 fw-black font-serif text-dark mb-0 relative z-10 tracking-tighter">PKR {totalExpense.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="glass-panel p-6 rounded-3xl border-stone-100 shadow-sm relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -mr-16 -mt-16 transition duration-700 group-hover:bg-blue-100"></div>
            <span className="text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-500 mb-2 d-block relative z-10">Net Operating Income</span>
            <h3 className={`display-5 fw-black font-serif mb-0 relative z-10 tracking-tighter ${netProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              PKR {netProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h3>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="d-flex flex-wrap gap-4 mb-8 border-bottom border-stone-200 pb-4">
        {tabs.map((tab) => (
           <button 
             key={tab.id}
             onClick={() => setActiveTab(tab.id)}
             className={`text-xs fw-black text-uppercase tracking-widest px-6 py-2 rounded-full transition-all duration-300 ${activeTab === tab.id ? 'bg-dark text-white shadow-md' : 'text-stone-500 hover:bg-stone-100'}`}
           >
             {tab.label}
           </button>
        ))}
      </div>

      <div className="glass-panel rounded-[3rem] border-stone-100 shadow-premium overflow-hidden">
        {activeTab === 'revenues' && (
          <div className="table-responsive">
            <table className="w-100 text-start align-middle">
              <thead className="bg-stone-50/50">
                <tr>
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Invoice ID</th>
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Date Issued</th>
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Revenue Source</th>
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Type</th>
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700 text-end">Amount</th>
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700 text-end">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {revenues.map((rev, i) => (
                  <tr key={i} className="group hover:bg-stone-50/50 transition-all duration-500">
                    <td className="px-10 py-8 text-xs fw-bold text-stone-500">{rev.id}</td>
                    <td className="px-10 py-8 text-sm fw-bold text-stone-600">{new Date(rev.date).toLocaleDateString()}</td>
                    <td className="px-10 py-8 text-sm fw-black text-dark">{rev.source}</td>
                    <td className="px-10 py-8 text-xs fw-bold text-stone-600">
                       <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 rounded-full text-[9px] fw-black uppercase tracking-widest">{rev.source_type}</span>
                    </td>
                    <td className="px-10 py-8 text-end">
                       <span className="text-sm fw-black text-emerald-600">PKR {rev.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </td>
                    <td className="px-10 py-8 text-end">
                      <div className="d-flex justify-content-end gap-2">
                        <button onClick={() => { setEditingRevenue(rev); setIsEditRevenueModalOpen(true); }} className="p-2 rounded-xl bg-stone-100 hover:bg-dark hover:text-white transition text-stone-600 d-inline-flex align-items-center">
                          <span className="material-symbols-outlined fs-6">edit</span>
                        </button>
                        <button onClick={() => handleDeleteRevenue(rev._id)} className="p-2 rounded-xl bg-rose-50 hover:bg-rose-500 hover:text-white transition text-rose-600 d-inline-flex align-items-center">
                          <span className="material-symbols-outlined fs-6">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {revenues.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-10 py-8 text-center text-stone-400 text-sm fw-bold">No revenue records found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'expenses' && (
          <div className="table-responsive">
            <table className="w-100 text-start align-middle">
              <thead className="bg-stone-50/50">
                <tr>
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">PO Number</th>
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Date Logged</th>
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Material Purchase</th>
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Supplier Name</th>
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Quantity</th>
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700 text-end">Amount & Status</th>
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700 text-end">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {purchases.map((exp, i) => (
                  <tr key={i} className="group hover:bg-stone-50/50 transition-all duration-500">
                    <td className="px-10 py-8 text-xs fw-bold text-stone-500">{exp.id}</td>
                    <td className="px-10 py-8 text-sm fw-bold text-stone-600">{new Date(exp.date).toLocaleDateString()}</td>
                    <td className="px-10 py-8 text-sm fw-black text-dark">{exp.materialName}</td>
                    <td className="px-10 py-8 text-sm fw-bold text-stone-600">{exp.supplierName}</td>
                    <td className="px-10 py-8 text-xs fw-bold text-stone-600">{exp.quantity} units</td>
                    <td className="px-10 py-8 text-end">
                       <span className="text-sm fw-black text-rose-600 d-block mb-1">-PKR {exp.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                       <span className={`text-[9px] fw-black text-uppercase tracking-widest px-3 py-1 rounded-pill ${exp.status === 'Completed' || exp.status === 'Received' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                          {exp.status}
                       </span>
                    </td>
                    <td className="px-10 py-8 text-end">
                      <div className="d-flex justify-content-end gap-2">
                        <button onClick={() => { setEditingPurchase(exp); setIsEditPurchaseModalOpen(true); }} className="p-2 rounded-xl bg-stone-100 hover:bg-dark hover:text-white transition text-stone-600 d-inline-flex align-items-center">
                          <span className="material-symbols-outlined fs-6">edit</span>
                        </button>
                        <button onClick={() => handleDeletePurchase(exp._id)} className="p-2 rounded-xl bg-rose-50 hover:bg-rose-500 hover:text-white transition text-rose-600 d-inline-flex align-items-center">
                          <span className="material-symbols-outlined fs-6">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {purchases.length === 0 && (
                  <tr>
                    <td colSpan="7" className="px-10 py-8 text-center text-stone-400 text-sm fw-bold">No expense records found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Log Revenue Modal */}
      {isRevenueModalOpen && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark/50 backdrop-blur-sm z-[100] d-flex align-items-center justify-content-center p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-[500px] w-100 max-h-[90vh] overflow-y-auto custom-scrollbar border border-stone-100 animate-in zoom-in-95 duration-200">
            <div className="sticky-top bg-stone-50/90 backdrop-blur-md px-8 py-6 border-bottom border-stone-100 d-flex justify-content-between align-items-center z-10">
              <div className="d-flex align-items-center gap-3">
                 <span className="material-symbols-outlined text-dark fs-4">payments</span>
                 <h3 className="fs-5 fw-black font-serif text-dark mb-0 tracking-tight lowercase">Log.Revenue</h3>
              </div>
              <button onClick={() => setIsRevenueModalOpen(false)} className="text-stone-600 hover:text-dark transition">
                <span className="material-symbols-outlined fs-5">close</span>
              </button>
            </div>
            <form onSubmit={handleAddRevenue} className="p-8 space-y-6">
              <div className="row g-4">
                <div className="col-12">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Source Type</label>
                  <select name="source_type" className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition">
                    <option value="Direct Sale">Direct Sale</option>
                    <option value="Order">Order Fulfill</option>
                    <option value="Other">Other Miscellaneous</option>
                  </select>
                </div>
                <div className="col-12">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Amount (PKR)</label>
                  <input name="amount" type="number" required min="1" step="0.01" className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" placeholder="e.g. 500.00" />
                </div>
                <div className="col-12">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Transaction Date</label>
                  <input name="date" type="date" required defaultValue={new Date().toISOString().split('T')[0]} className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" />
                </div>
                <div className="col-12">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Description</label>
                  <textarea name="description" required className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" rows="3" placeholder="Description of the transaction..."></textarea>
                </div>
              </div>
              <div className="pt-6 border-top border-stone-100 d-flex justify-content-end gap-3 mt-8">
                <button type="button" onClick={() => setIsRevenueModalOpen(false)} className="px-6 py-2.5 rounded-xl border border-stone-200 text-[10px] fw-black text-uppercase tracking-widest text-stone-700 hover:bg-stone-50 transition">Discard</button>
                <button type="submit" className="px-6 py-2.5 rounded-xl bg-dark text-white text-[10px] fw-black text-uppercase tracking-widest hover:bg-stone-800 transition shadow-lg">Log Inflow</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Revenue Modal */}
      {isEditRevenueModalOpen && editingRevenue && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark/50 backdrop-blur-sm z-[100] d-flex align-items-center justify-content-center p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-[500px] w-100 max-h-[90vh] overflow-y-auto custom-scrollbar border border-stone-100 animate-in zoom-in-95 duration-200">
            <div className="sticky-top bg-stone-50/90 backdrop-blur-md px-8 py-6 border-bottom border-stone-100 d-flex justify-content-between align-items-center z-10">
              <div className="d-flex align-items-center gap-3">
                 <span className="material-symbols-outlined text-dark fs-4">edit_note</span>
                 <h3 className="fs-5 fw-black font-serif text-dark mb-0 tracking-tight lowercase">Edit.Revenue</h3>
              </div>
              <button onClick={() => { setIsEditRevenueModalOpen(false); setEditingRevenue(null); }} className="text-stone-600 hover:text-dark transition">
                <span className="material-symbols-outlined fs-5">close</span>
              </button>
            </div>
            <form onSubmit={handleEditRevenueSubmit} className="p-8 space-y-6">
              <div className="row g-4">
                <div className="col-12">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Source Type</label>
                  <select name="source_type" defaultValue={editingRevenue.source_type} className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition">
                    <option value="Direct Sale">Direct Sale</option>
                    <option value="Order">Order Fulfill</option>
                    <option value="Other">Other Miscellaneous</option>
                  </select>
                </div>
                <div className="col-12">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Amount (PKR)</label>
                  <input name="amount" type="number" required min="1" step="0.01" defaultValue={editingRevenue.amount} className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" />
                </div>
                <div className="col-12">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Transaction Date</label>
                  <input name="date" type="date" required defaultValue={editingRevenue.date} className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" />
                </div>
                <div className="col-12">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Description</label>
                  <textarea name="description" required defaultValue={editingRevenue.source} className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" rows="3"></textarea>
                </div>
              </div>
              <div className="pt-6 border-top border-stone-100 d-flex justify-content-end gap-3 mt-8">
                <button type="button" onClick={() => { setIsEditRevenueModalOpen(false); setEditingRevenue(null); }} className="px-6 py-2.5 rounded-xl border border-stone-200 text-[10px] fw-black text-uppercase tracking-widest text-stone-700 hover:bg-stone-50 transition">Discard</button>
                <button type="submit" className="px-6 py-2.5 rounded-xl bg-dark text-white text-[10px] fw-black text-uppercase tracking-widest hover:bg-stone-800 transition shadow-lg">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Log Purchase Modal */}
      {isPurchaseModalOpen && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark/50 backdrop-blur-sm z-[100] d-flex align-items-center justify-content-center p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-[500px] w-100 max-h-[90vh] overflow-y-auto custom-scrollbar border border-stone-100 animate-in zoom-in-95 duration-200">
            <div className="sticky-top bg-stone-50/90 backdrop-blur-md px-8 py-6 border-bottom border-stone-100 d-flex justify-content-between align-items-center z-10">
              <div className="d-flex align-items-center gap-3">
                 <span className="material-symbols-outlined text-dark fs-4">shopping_cart</span>
                 <h3 className="fs-5 fw-black font-serif text-dark mb-0 tracking-tight lowercase">Log.Purchase</h3>
              </div>
              <button onClick={() => setIsPurchaseModalOpen(false)} className="text-stone-600 hover:text-dark transition">
                <span className="material-symbols-outlined fs-5">close</span>
              </button>
            </div>
            <form onSubmit={handleAddPurchase} className="p-8 space-y-6">
              <div className="row g-4">
                <div className="col-12">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Raw Material</label>
                  <select name="raw_material_id" required className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition">
                    <option value="">Select Raw Material</option>
                    {rawMaterials.map(m => (
                      <option key={m._id} value={m._id}>{m.name} (Stock: {m.stock_quantity} {m.unit})</option>
                    ))}
                  </select>
                </div>
                <div className="col-12">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Supplier</label>
                  <select name="supplier_id" required className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition">
                    <option value="">Select Supplier</option>
                    {suppliers.map(s => (
                      <option key={s._id} value={s._id}>{s.name} ({s.contactPerson})</option>
                    ))}
                  </select>
                </div>
                <div className="col-12 col-md-6">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Quantity</label>
                  <input name="quantity" type="number" required min="1" className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" placeholder="e.g. 100" />
                </div>
                <div className="col-12 col-md-6">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Total Cost (PKR)</label>
                  <input name="total_cost" type="number" required min="1" step="0.01" className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" placeholder="e.g. 1450.00" />
                </div>
                <div className="col-12 col-md-6">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Transaction Date</label>
                  <input name="purchase_date" type="date" required defaultValue={new Date().toISOString().split('T')[0]} className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" />
                </div>
                <div className="col-12 col-md-6">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Status</label>
                  <select name="status" className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition">
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              <div className="pt-6 border-top border-stone-100 d-flex justify-content-end gap-3 mt-8">
                <button type="button" onClick={() => setIsPurchaseModalOpen(false)} className="px-6 py-2.5 rounded-xl border border-stone-200 text-[10px] fw-black text-uppercase tracking-widest text-stone-700 hover:bg-stone-50 transition">Discard</button>
                <button type="submit" className="px-6 py-2.5 rounded-xl bg-dark text-white text-[10px] fw-black text-uppercase tracking-widest hover:bg-stone-800 transition shadow-lg">Log Purchase</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Purchase Modal */}
      {isEditPurchaseModalOpen && editingPurchase && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark/50 backdrop-blur-sm z-[100] d-flex align-items-center justify-content-center p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-[500px] w-100 max-h-[90vh] overflow-y-auto custom-scrollbar border border-stone-100 animate-in zoom-in-95 duration-200">
            <div className="sticky-top bg-stone-50/90 backdrop-blur-md px-8 py-6 border-bottom border-stone-100 d-flex justify-content-between align-items-center z-10">
              <div className="d-flex align-items-center gap-3">
                 <span className="material-symbols-outlined text-dark fs-4">edit_note</span>
                 <h3 className="fs-5 fw-black font-serif text-dark mb-0 tracking-tight lowercase">Edit.Purchase</h3>
              </div>
              <button onClick={() => { setIsEditPurchaseModalOpen(false); setEditingPurchase(null); }} className="text-stone-600 hover:text-dark transition">
                <span className="material-symbols-outlined fs-5">close</span>
              </button>
            </div>
            <form onSubmit={handleEditPurchaseSubmit} className="p-8 space-y-6">
              <div className="row g-4">
                <div className="col-12">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Raw Material</label>
                  <select name="raw_material_id" required defaultValue={editingPurchase.raw_material_id} className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition">
                    {rawMaterials.map(m => (
                      <option key={m._id} value={m._id}>{m.name} (Stock: {m.stock_quantity} {m.unit})</option>
                    ))}
                  </select>
                </div>
                <div className="col-12">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Supplier</label>
                  <select name="supplier_id" required defaultValue={editingPurchase.supplier_id} className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition">
                    {suppliers.map(s => (
                      <option key={s._id} value={s._id}>{s.name} ({s.contactPerson})</option>
                    ))}
                  </select>
                </div>
                <div className="col-12 col-md-6">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Quantity</label>
                  <input name="quantity" type="number" required min="1" defaultValue={editingPurchase.quantity} className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" />
                </div>
                <div className="col-12 col-md-6">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Total Cost (PKR)</label>
                  <input name="total_cost" type="number" required min="1" step="0.01" defaultValue={editingPurchase.amount} className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" />
                </div>
                <div className="col-12 col-md-6">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Transaction Date</label>
                  <input name="purchase_date" type="date" required defaultValue={editingPurchase.date} className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" />
                </div>
                <div className="col-12 col-md-6">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Status</label>
                  <select name="status" defaultValue={editingPurchase.status} className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition">
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              <div className="pt-6 border-top border-stone-100 d-flex justify-content-end gap-3 mt-8">
                <button type="button" onClick={() => { setIsEditPurchaseModalOpen(false); setEditingPurchase(null); }} className="px-6 py-2.5 rounded-xl border border-stone-200 text-[10px] fw-black text-uppercase tracking-widest text-stone-700 hover:bg-stone-50 transition">Discard</button>
                <button type="submit" className="px-6 py-2.5 rounded-xl bg-dark text-white text-[10px] fw-black text-uppercase tracking-widest hover:bg-stone-800 transition shadow-lg">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFinance;
