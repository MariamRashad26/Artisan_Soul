import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../utils/axiosInstance';

const AdminAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [revenue, setRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [revenueRes, ordersRes, productsRes] = await Promise.all([
          axios.get('/api/finance/revenue').catch(() => ({ data: [] })),
          axios.get('/api/orders').catch(() => ({ data: [] })),
          axios.get('/api/products').catch(() => ({ data: [] })),
        ]);

        const revTotal = (revenueRes.data || []).reduce((s, r) => s + (r.amount || 0), 0);
        setRevenue(revTotal);
        setTotalOrders((ordersRes.data || []).length);

        // Build category dispatch matrix from real products
        const products = productsRes.data || [];
        const categoryMap = {};
        products.forEach(p => {
          const cat = p.category || 'Other';
          categoryMap[cat] = (categoryMap[cat] || 0) + 1;
        });
        const total = products.length || 1;
        const breakdown = Object.entries(categoryMap).map(([label, count]) => ({
          label,
          count,
          pct: Math.round((count / total) * 100),
        })).sort((a, b) => b.count - a.count);
        setCategoryBreakdown(breakdown);
      } catch (err) {
        console.error('Analytics fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const kpis = [
    {
      label: 'Purchasing Revenue',
      value: loading ? '—' : `PKR ${revenue.toLocaleString()}`,
      icon: 'payments',
      detail: 'Total cumulative inflows',
      color: 'emerald',
    },
    {
      label: 'Total Orders',
      value: loading ? '—' : totalOrders.toString(),
      icon: 'assignment',
      detail: 'Registered in system',
      color: 'primary',
    },
    {
      label: 'Product Variants',
      value: loading ? '—' : categoryBreakdown.reduce((s, c) => s + c.count, 0).toString(),
      icon: 'inventory_2',
      detail: 'Across all categories',
      color: 'amber',
    },
  ];

  return (
    <div className="p-8 lg:p-12 animate-in fade-in duration-1000">
      {/* Header */}
      <section className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-6 mb-12">
        <div>
          <nav className="d-flex align-items-center gap-3 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700 mb-4">
            <Link to="/admin" className="hover:text-dark transition">Operations</Link>
            <span className="material-symbols-outlined fs-6 text-stone-200">chevron_right</span>
            <span className="text-primary">Analytics</span>
          </nav>
          <h1 className="display-4 fw-black font-serif text-dark tracking-tighter mb-0 lowercase">Asset.Analytics</h1>
        </div>
      </section>

      {/* Real-Time KPI Cards */}
      <div className="row g-6 mb-12">
        {kpis.map((kpi, i) => (
          <div key={i} className="col-md-4">
            <div className="glass-panel p-7 rounded-[2rem] border-stone-100 shadow-premium relative overflow-hidden group hover:-translate-y-1 transition-all duration-500">
              <div className="position-absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <span className="material-symbols-outlined display-3">{kpi.icon}</span>
              </div>
              <div className="relative z-1">
                <h4 className="text-[10px] fw-black text-stone-600 text-uppercase tracking-[0.3em] mb-4">{kpi.label}</h4>
                <p className="display-5 fw-black font-serif text-dark mb-1 tracking-tighter">{kpi.value}</p>
                <div className="d-flex align-items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-500 fs-6">trending_up</span>
                  <span className="text-[10px] fw-black text-uppercase tracking-widest text-stone-600">{kpi.detail}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Asset Dispatch Matrix */}
      <section className="glass-panel p-10 rounded-[3rem] border-stone-100 shadow-premium">
        <div className="d-flex align-items-center gap-4 mb-8">
          <div className="size-10 bg-dark rounded-2xl d-flex align-items-center justify-content-center text-white shadow-lg">
            <span className="material-symbols-outlined fs-5">category</span>
          </div>
          <div>
            <h3 className="text-[10px] fw-black text-uppercase tracking-[0.3em] text-dark mb-0">Asset.Dispatch.Matrix</h3>
            <p className="text-[10px] text-stone-500 fw-bold mb-0 mt-1">Category distribution across catalog</p>
          </div>
        </div>

        {loading ? (
          <p className="text-stone-500 fw-bold text-sm">Loading dispatch data...</p>
        ) : categoryBreakdown.length === 0 ? (
          <p className="text-stone-500 fw-bold text-sm">No product data available.</p>
        ) : (
          <div className="d-flex flex-column gap-6">
            {categoryBreakdown.map((cat, i) => (
              <div key={i} className="d-flex align-items-center gap-6">
                <div style={{ width: 160, flexShrink: 0 }}>
                  <span className="text-[10px] fw-black text-uppercase tracking-widest text-stone-700 d-block truncate">{cat.label}</span>
                  <span className="text-[9px] fw-bold text-stone-400">{cat.count} SKUs</span>
                </div>
                <div className="flex-grow-1 h-2.5 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-100 bg-gradient-to-r from-primary to-amber-600 rounded-full transition-all duration-1000"
                    style={{ width: `${cat.pct}%` }}
                  />
                </div>
                <span className="text-sm fw-black text-dark font-serif" style={{ width: 48, textAlign: 'right' }}>{cat.pct}%</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminAnalytics;
