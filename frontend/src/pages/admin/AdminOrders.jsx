import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [artisans, setArtisans] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const [ordersRes, woRes] = await Promise.all([
          axiosInstance.get('/api/orders'),
          axiosInstance.get('/api/work-orders')
        ]);

        const wos = woRes.data || [];

        // Build order-id → artisan name map
        const orderArtisanMap = {};
        wos.forEach(wo => {
          const ordId = (wo.order_id?._id || wo.order_id || '').toString();
          if (ordId && wo.assigned_to?.name) orderArtisanMap[ordId] = wo.assigned_to.name;
        });

        // Extract unique artisan names for Complex Filters dropdown
        const uniqueArtisans = [...new Set(
          wos.filter(wo => wo.assigned_to?.name).map(wo => wo.assigned_to.name)
        )];
        setArtisans(uniqueArtisans);

        const mapped = ordersRes.data.map(o => ({
          id: o.orderId || o.order_id || '#AS-0000',
          _id: o._id,
          patron: o.patron || o.client_id || 'Unknown Patron',
          model: o.model || (o.items && o.items.length > 0 ? o.items[0] : null) || 'Custom Model',
          type: o.status === 'urgent' ? 'Bespoke' : 'Stock',
          stage: o.phase || (o.is_delivered ? 'Finished' : 'Design Prep'),
          progress: o.progress || (o.is_delivered ? 100 : 0),
          status: o.progress === 100 || o.is_delivered ? 'Completed' : 'Active',
          color: o.progress === 100 || o.is_delivered ? 'emerald-500' : 'primary',
          priority: o.status === 'urgent' ? 'VIP Expedited' : 'Regular',
          date: o.deadline || o.delivery_date || new Date().toISOString().split('T')[0],
          artisan: orderArtisanMap[o._id?.toString()] || 'Unassigned',
          originalOrder: o
        }));
        setOrders(mapped);
      } catch (error) {
        console.error('Failed to fetch orders', error);
      }
    };
    fetchOrders();
  }, []);

  // Dynamically derive filter options from real data
  const stageOptions = ['All Stages', ...new Set(orders.map(o => o.stage).filter(Boolean))];
  const typeOptions = ['All Types', ...new Set(orders.map(o => o.type).filter(Boolean))];
  const priorityOptions = ['All Priorities', ...new Set(orders.map(o => o.priority).filter(Boolean))];

  const filterConfig = [
    { key: 'stage', label: 'Pipeline Stage', options: stageOptions },
    { key: 'type', label: 'Entry Type', options: typeOptions },
    { key: 'priority', label: 'Priority', options: priorityOptions }
  ];

  const [filters, setFilters] = useState({ stage: 'All Stages', type: 'All Types', priority: 'All Priorities' });
  const [complexFilters, setComplexFilters] = useState({ dateRange: '', artisan: 'Any Artisan' });
  const [showComplex, setShowComplex] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const filteredOrders = orders.filter(o => {
    if (filters.stage !== 'All Stages' && o.stage !== filters.stage) return false;
    if (filters.type !== 'All Types' && o.type !== filters.type) return false;
    if (filters.priority !== 'All Priorities' && o.priority !== filters.priority) return false;
    if (complexFilters.dateRange && o.date !== complexFilters.dateRange) return false;
    if (complexFilters.artisan !== 'Any Artisan' && o.artisan !== complexFilters.artisan) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / itemsPerPage));
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleExport = () => {
    const headers = ['Registry ID', 'Patron', 'Model', 'Type', 'Stage', 'Progress (%)', 'Status', 'Priority'];
    const csvContent = [
      headers.join(','),
      ...filteredOrders.map(o => `${o.id},"${o.patron}","${o.model}",${o.type},${o.stage},${o.progress},${o.status},${o.priority}`)
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'order_registry.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleManualEntry = async (e) => {
    e.preventDefault();
    const newBackendOrder = {
      patron: e.target.patron.value,
      model: e.target.model.value,
      phase: 'Design Prep',
      status: e.target.priority.value === 'VIP Expedited' ? 'urgent' : 'normal',
      deadline: new Date().toISOString().split('T')[0],
      progress: 0
    };
    try {
      const { data } = await axiosInstance.post('/api/orders', newBackendOrder);
      const mapped = {
          id: data.orderId,
          patron: data.patron,
          model: data.model,
          type: data.status === 'urgent' ? 'Bespoke' : 'Stock',
          stage: data.phase,
          progress: data.progress,
          status: 'Active',
          color: 'primary',
          priority: data.status === 'urgent' ? 'VIP Expedited' : 'Regular',
          date: data.deadline,
          artisan: 'Marco Sartori',
          originalOrder: data
      };
      setOrders([mapped, ...orders]);
      setIsModalOpen(false);
      setCurrentPage(1);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-8 lg:p-12 animate-in fade-in duration-1000">
      {/* Registry Navigation & Title */}
      <section className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-6 mb-12">
        <div>
          <nav className="d-flex align-items-center gap-3 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700 mb-4">
            <Link to="/admin" className="hover:text-dark transition">Operations</Link>
            <span className="material-symbols-outlined fs-6 text-stone-200">chevron_right</span>
            <span className="text-primary">Order Registry</span>
          </nav>
          <h1 className="display-4 fw-black font-serif text-dark tracking-tighter mb-0 lowercase">Order.Registry</h1>
        </div>
        
        <div className="d-flex gap-3 flex-wrap">
          <button onClick={handleExport} className="px-8 py-3.5 rounded-2xl bg-white border border-stone-100 text-[10px] fw-black text-uppercase tracking-widest text-dark hover:bg-stone-50 transition duration-500 shadow-sm d-flex align-items-center gap-3">
            <span className="material-symbols-outlined fs-5">download</span>
            Export Ledger
          </button>
          <button onClick={() => setIsModalOpen(true)} className="px-8 py-3.5 rounded-2xl bg-dark text-white text-[10px] fw-black text-uppercase tracking-widest shadow-2xl hover:-translate-y-1 transition duration-500 d-flex align-items-center gap-3">
            <span className="material-symbols-outlined fs-5">add</span>
            New Manual Entry
          </button>
        </div>
      </section>

      {/* Boutique Filter Suite */}
      <section className="glass-panel p-4 rounded-[2.5rem] border-stone-100 shadow-premium d-flex flex-column flex-md-row align-items-md-center gap-4 mb-10">
        <div className="d-flex align-items-center gap-4 flex-grow-1 flex-wrap">
          {filterConfig.map((filter, i) => (
            <div key={i} className="d-flex flex-column gap-2 min-w-[160px]">
              <label className="text-[9px] fw-black text-uppercase tracking-[0.3em] text-stone-700 px-2">{filter.label}</label>
              <div className="position-relative group">
                <select 
                  value={filters[filter.key]} 
                  onChange={(e) => setFilters({ ...filters, [filter.key]: e.target.value })}
                  className="w-100 bg-stone-50/50 border-stone-100 rounded-xl px-4 py-2.5 text-xs fw-black text-dark appearance-none outline-none focus:bg-white focus:border-dark transition duration-500"
                >
                  {filter.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                <span className="material-symbols-outlined position-absolute right-3 top-50 translate-middle-y text-stone-700 fs-6 pointer-events-none group-focus-within:rotate-180 transition-transform">expand_more</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="border-start border-stone-100 pl-6 h-12 d-flex align-items-center">
          <button onClick={() => setShowComplex(!showComplex)} className={`px-6 py-2.5 rounded-xl border border-stone-100 text-[10px] fw-black text-uppercase tracking-widest transition duration-500 d-flex align-items-center gap-3 ${showComplex ? 'bg-stone-100 text-dark' : 'text-stone-600 hover:text-dark hover:border-dark'}`}>
            <span className="material-symbols-outlined fs-6">filter_list</span>
            Complex Filters
          </button>
        </div>
      </section>

      {showComplex && (
        <section className="bg-white p-6 rounded-[2rem] border border-stone-100 shadow-sm d-flex flex-wrap gap-6 mb-10 animate-in slide-in-from-top-4 duration-500">
          <div className="d-flex flex-column gap-2 min-w-[200px]">
             <label className="text-[9px] fw-black text-uppercase tracking-[0.3em] text-stone-700 px-2">Date Range</label>
             <input type="date" value={complexFilters.dateRange} onChange={e => setComplexFilters({...complexFilters, dateRange: e.target.value})} className="bg-stone-50/50 border border-stone-100 rounded-xl px-4 py-2 text-xs fw-medium text-dark outline-none focus:border-dark" />
          </div>
          <div className="d-flex flex-column gap-2 min-w-[200px]">
             <label className="text-[9px] fw-black text-uppercase tracking-[0.3em] text-stone-700 px-2">Assigned Artisan</label>
             <select value={complexFilters.artisan} onChange={e => setComplexFilters({...complexFilters, artisan: e.target.value})} className="bg-stone-50/50 border border-stone-100 rounded-xl px-4 py-2 text-xs fw-medium text-dark outline-none focus:border-dark">
               <option value="Any Artisan">Any Artisan</option>
               {artisans.map(a => (
                 <option key={a} value={a}>{a}</option>
               ))}
             </select>
          </div>
          <div className="d-flex align-items-end mb-1">
             <button onClick={() => {
                setFilters({ stage: 'All Stages', type: 'All Types', priority: 'All Priorities' });
                setComplexFilters({ dateRange: '', artisan: 'Any Artisan' });
                setCurrentPage(1);
             }} className="px-4 py-2 text-[10px] fw-black text-uppercase tracking-widest text-stone-600 hover:text-dark transition">Reset Filters</button>
          </div>
        </section>
      )}

      {/* Main Registry Ledger */}
      <section className="glass-panel rounded-[3rem] border-stone-100 shadow-premium overflow-hidden">
        <div className="table-responsive">
          <table className="w-100 text-start align-middle">
            <thead className="bg-stone-50/50">
              <tr>
                <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Registry ID</th>
                <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Patron Portfolio</th>
                <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Asset & Class</th>
                <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Crafting Journey</th>
                <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Lifecycle Status</th>
                <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700 text-end">Administrative Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {paginatedOrders.length > 0 ? paginatedOrders.map((row, i) => (
                <tr key={i} className="group hover:bg-stone-50/50 transition-colors duration-500 cursor-pointer">
                  <td className="px-10 py-8">
                    <span className="text-xs fw-black text-stone-600 tracking-tighter">{row.id}</span>
                  </td>
                  <td className="px-10 py-8">
                    <div className="d-flex align-items-center gap-4">
                      <div className="size-10 rounded-2xl bg-stone-100 border border-stone-200 d-flex align-items-center justify-content-center text-[10px] fw-black text-stone-600 shadow-sm">
                        {row.patron.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-sm fw-black text-dark tracking-tight">{row.patron}</span>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="d-flex flex-column gap-1">
                      <span className="text-sm fw-bold font-serif text-dark lowercase italic">{row.model}</span>
                      <span className={`text-[9px] fw-black text-uppercase tracking-widest px-2 py-0.5 rounded-lg w-fit ${row.type === 'Bespoke' ? 'bg-primary/10 text-primary' : 'bg-stone-100 text-stone-600'}`}>
                        {row.type}
                      </span>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="d-flex align-items-center gap-4">
                      <div className="h-1 lg:w-32 bg-stone-100 rounded-full overflow-hidden shadow-inner">
                        <div className={`h-100 rounded-full transition-all duration-1000 bg-${row.color === 'primary' ? 'primary' : row.color}`} style={{ width: `${row.progress}%` }}></div>
                      </div>
                      <span className="text-[10px] fw-black text-uppercase tracking-widest text-stone-600">{row.stage}</span>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="d-flex align-items-center gap-2">
                       <span className={`size-2 rounded-full bg-${row.color === 'primary' ? 'primary' : row.color} ${row.status === 'Active' ? 'animate-pulse' : ''}`}></span>
                       <span className={`text-[10px] fw-black text-uppercase tracking-widest text-${row.color === 'primary' ? 'primary' : row.color}`}>{row.status}</span>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-end">
                    <div className="d-flex justify-content-end gap-3 transition-all duration-500">
                      <Link to={`/admin/orders/${row.id.replace('#', '')}`} state={{ order: row }} className="px-5 py-2 rounded-xl bg-white border border-stone-100 shadow-sm text-[10px] fw-black text-uppercase tracking-widest text-stone-600 hover:text-dark hover:border-dark transition duration-500">
                        Inspect
                      </Link>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="px-10 py-12 text-center">
                    <p className="text-sm fw-medium text-stone-600 mb-0">No matching registry entries found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Registry Pagination */}
        <div className="px-10 py-6 border-top border-stone-50 bg-stone-50/30 d-flex align-items-center justify-content-between">
          <p className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-600 mb-0">Page {currentPage.toString().padStart(2, '0')} of {totalPages.toString().padStart(2, '0')} — Archive Capacity: {filteredOrders.length} Entries</p>
          {totalPages > 1 && (
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
          )}
        </div>
      </section>

      {/* Operational Metrics */}
      <section className="row g-8 mt-12">
        {[
          { icon: 'precision_manufacturing', label: 'Active Builds', value: orders.filter(o => o.status === 'Active').length.toString(), unit: 'Pairs', detail: 'Live in production' },
          { icon: 'account_balance_wallet', label: 'Order Valuation', value: `PKR ${orders.reduce((s, o) => s + (o.originalOrder?.price || 0), 0).toLocaleString()}`, unit: 'MTD', detail: 'Total active order value' }
        ].map((metric, i) => (
          <div key={i} className="col-md-6">
            <div className="glass-panel p-8 rounded-[2.5rem] border-stone-100 shadow-premium relative overflow-hidden group">
              <div className="position-absolute bottom-[-10%] right-[-5%] text-stone-600/5 group-hover:scale-110 transition-transform duration-700">
                <span className="material-symbols-outlined text-[120px]">{metric.icon}</span>
              </div>
              <div className="relative z-1 d-flex flex-column h-100">
                <h5 className="text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700 mb-8">{metric.label}</h5>
                <p className="display-4 fw-black font-serif text-dark tracking-tighter mb-1 lowercase">
                  {metric.value} <span className="fs-5 text-stone-700 tracking-normal font-sans italic">{metric.unit}</span>
                </p>
                <div className="d-flex align-items-center gap-2 mt-2">
                  <span className="material-symbols-outlined text-emerald-500 fs-6">trending_up</span>
                  <span className="text-[10px] fw-black text-uppercase tracking-widest text-emerald-600 font-display">{metric.detail}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Manual Entry Modal */}
      {isModalOpen && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark/50 backdrop-blur-sm z-[100] d-flex align-items-center justify-content-center p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-[600px] w-100 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="px-8 py-6 border-bottom border-stone-100 d-flex justify-content-between align-items-center bg-stone-50/50">
              <h3 className="fs-5 fw-black font-serif text-dark mb-0 tracking-tight lowercase">New.Entry</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-600 hover:text-dark transition">
                <span className="material-symbols-outlined fs-5">close</span>
              </button>
            </div>
            <form onSubmit={handleManualEntry} className="p-8 space-y-6">
              <div className="row g-4">
                <div className="col-12">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Patron Name</label>
                  <input name="patron" required className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" />
                </div>
                <div className="col-12">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Asset Model</label>
                  <input name="model" required className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" />
                </div>
                <div className="col-md-6">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Entry Type</label>
                  <select name="type" className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition">
                    <option value="Bespoke">Bespoke Custom</option>
                    <option value="Stock">Catalog Stock</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Priority Level</label>
                  <select name="priority" className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition">
                    <option value="Regular">Regular</option>
                    <option value="VIP Expedited">VIP Expedited</option>
                    <option value="Legacy Archive">Legacy Archive</option>
                  </select>
                </div>
              </div>
              <div className="pt-6 border-top border-stone-100 d-flex justify-content-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-xl border border-stone-200 text-[10px] fw-black text-uppercase tracking-widest text-stone-700 hover:bg-stone-50 transition">Cancel</button>
                <button type="submit" className="px-6 py-2.5 rounded-xl bg-dark text-white text-[10px] fw-black text-uppercase tracking-widest hover:bg-stone-800 transition shadow-lg">Commit Entry</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
