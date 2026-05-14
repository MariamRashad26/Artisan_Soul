import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AdminFinance = () => {
  const [revenues, setRevenues] = useState([]);

  useEffect(() => {
    const fetchFinanceData = async () => {
      try {
        const { data } = await axios.get('/api/finance/revenue');
        setRevenues(data.map(r => ({
          id: r._id?.substring(0, 8).toUpperCase() || 'INV-001',
          date: new Date(r.transaction_date).toLocaleDateString(),
          source: r.description || `Order ${r.order_id || 'Direct'}`,
          amount: r.amount || 0,
          method: 'System Transfer', // Assuming for now
          status: 'Cleared'
        })));
      } catch (err) {
        console.error('Failed to fetch finance data', err);
      }
    };
    fetchFinanceData();
  }, []);

  const totalRevenue = revenues.reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="p-8 lg:p-12 animate-in fade-in duration-1000">
      <section className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-6 mb-12">
        <div>
          <nav className="d-flex align-items-center gap-3 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700 mb-4">
            <Link to="/admin" className="hover:text-dark transition">Operations</Link>
            <span className="material-symbols-outlined fs-6 text-stone-200">chevron_right</span>
            <span className="text-primary">Financials</span>
          </nav>
          <h1 className="display-4 fw-black font-serif text-dark tracking-tighter mb-0 lowercase">Ledger.Revenues</h1>
        </div>
        
        <div className="d-flex gap-4">
           <button className="px-8 py-3.5 rounded-2xl bg-dark text-white text-[10px] fw-black text-uppercase tracking-widest shadow-2xl hover:-translate-y-1 transition duration-500 d-flex align-items-center gap-3">
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
            <h3 className="display-5 fw-black font-serif text-dark mb-0 relative z-10 tracking-tighter">${totalRevenue.toLocaleString()}</h3>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="glass-panel p-6 rounded-3xl border-stone-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 transition duration-700 group-hover:bg-primary/10"></div>
            <span className="text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-500 mb-2 d-block relative z-10">Pending Transfers</span>
            <h3 className="display-5 fw-black font-serif text-dark mb-0 relative z-10 tracking-tighter">$8,500</h3>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="glass-panel p-6 rounded-3xl border-stone-100 shadow-sm relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -mr-16 -mt-16 transition duration-700 group-hover:bg-blue-100"></div>
            <span className="text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-500 mb-2 d-block relative z-10">Processed Transactions</span>
            <h3 className="display-5 fw-black font-serif text-dark mb-0 relative z-10 tracking-tighter">{revenues.length}</h3>
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-[3rem] border-stone-100 shadow-premium overflow-hidden">
        <div className="table-responsive">
          <table className="w-100 text-start align-middle">
            <thead className="bg-stone-50/50">
              <tr>
                <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Invoice ID</th>
                <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Date Issued</th>
                <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Revenue Source</th>
                <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Payment Method</th>
                <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700 text-end">Amount & Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {revenues.map((rev, i) => (
                <tr key={i} className="group hover:bg-stone-50/50 transition-all duration-500">
                  <td className="px-10 py-8 text-xs fw-bold text-stone-500">{rev.id}</td>
                  <td className="px-10 py-8 text-sm fw-bold text-stone-600">{rev.date}</td>
                  <td className="px-10 py-8 text-sm fw-black text-dark">{rev.source}</td>
                  <td className="px-10 py-8 text-xs fw-bold text-stone-600">{rev.method}</td>
                  <td className="px-10 py-8 text-end">
                     <span className="text-sm fw-black text-dark d-block mb-1">${rev.amount.toLocaleString()}</span>
                     <span className={`text-[9px] fw-black text-uppercase tracking-widest px-3 py-1 rounded-pill ${rev.status === 'Cleared' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {rev.status}
                     </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminFinance;
