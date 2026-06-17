import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../utils/axiosInstance';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState({
    fiscalRevenue: 0,
    activePipeline: 0,
    bespokeRequests: 0,
    orderRegistryBase: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [ordersRes, revenueRes, bespokeRes] = await Promise.all([
          axios.get('/api/orders'),
          axios.get('/api/finance/revenue').catch(() => ({ data: [] })),
          axios.get('/api/bespoke-designs').catch(() => ({ data: [] })),
        ]);

        const allOrders = ordersRes.data || [];
        const revenues = revenueRes.data || [];
        const bespokes = bespokeRes.data || [];

        const totalRevenue = revenues.reduce((sum, r) => sum + (r.amount || 0), 0);
        const activePipeline = allOrders.filter(o => o.phase !== 'Finished').length;

        setKpis({
          fiscalRevenue: totalRevenue,
          activePipeline,
          bespokeRequests: bespokes.length,
          orderRegistryBase: allOrders.length,
        });

        const formattedOrders = allOrders.map(order => ({
          id: order.orderId || order._id.substring(0, 8),
          name: order.patron || 'Unknown',
          model: order.model || 'Standard',
          status: order.phase || 'Pending',
          price: order.price ? `PKR ${order.price.toLocaleString()}` : 'N/A',
          color: order.status === 'urgent' ? 'amber-600' : 'primary',
        })).slice(0, 6);

        setOrders(formattedOrders);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const kpiCards = [
    {
      label: 'Fiscal Revenue',
      value: `PKR ${kpis.fiscalRevenue.toLocaleString()}`,
      detail: 'Cumulative period revenue',
      icon: 'payments',
      trend: 'up',
    },
    {
      label: 'Active Pipeline',
      value: kpis.activePipeline.toString(),
      detail: 'Orders in production',
      icon: 'manufacturing',
      trend: 'up',
    },
    {
      label: 'Bespoke Requests',
      value: kpis.bespokeRequests.toString(),
      detail: 'Custom design submissions',
      icon: 'draw',
      trend: 'stable',
    },
    {
      label: 'Order Registry Base',
      value: kpis.orderRegistryBase.toString(),
      detail: 'Total registered orders',
      icon: 'assignment',
      trend: 'up',
    },
  ];

  return (
    <div className="p-8 lg:p-12 animate-in fade-in slide-in-from-bottom duration-1000">
      {/* Executive KPI Grid */}
      <section className="row g-6 mb-12">
        {kpiCards.map((stat, i) => (
          <div key={i} className="col-md-6 col-lg-3">
            <div className="glass-panel p-7 rounded-[2rem] border-stone-100 shadow-premium group hover:-translate-y-1 transition-all duration-500 relative overflow-hidden">
              <div className="position-absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <span className="material-symbols-outlined display-3">{stat.icon}</span>
              </div>
              <div className="relative z-1">
                <h4 className="text-[10px] fw-black text-stone-600 text-uppercase tracking-[0.3em] mb-4">{stat.label}</h4>
                <p className="display-5 fw-black font-serif text-dark mb-1 tracking-tighter">{loading ? '—' : stat.value}</p>
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

      {/* Order Registry */}
      <div className="row g-8 mb-12">
        <div className="col-12">
          <section className="glass-panel rounded-[2.5rem] border-stone-100 shadow-premium overflow-hidden d-flex flex-column">
            <div className="px-8 py-7 border-bottom border-stone-50 d-flex justify-content-between align-items-center bg-stone-50/30">
              <div>
                <h3 className="fs-4 fw-black font-serif text-dark tracking-tighter mb-1 lowercase">Order.Registry</h3>
                <p className="text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-600 mb-0">Active fulfillment pipeline</p>
              </div>
              <Link to="/admin/orders" className="px-6 py-2.5 rounded-xl bg-dark text-white text-[10px] fw-black text-uppercase tracking-widest hover:-translate-y-0.5 transition duration-500 shadow-lg text-decoration-none">
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
                    <tr><td colSpan="5" className="px-8 py-10 text-center text-stone-500 text-sm fw-medium">Loading registry...</td></tr>
                  ) : orders.length === 0 ? (
                    <tr><td colSpan="5" className="px-8 py-10 text-center text-stone-500 text-sm fw-medium">No orders in registry.</td></tr>
                  ) : orders.map((order, i) => (
                    <tr key={i} className="group hover:bg-stone-50 transition-colors duration-500 cursor-pointer">
                      <td className="px-8 py-6 fw-black text-stone-600 fs-6 tracking-tight">{order.id}</td>
                      <td className="px-8 py-6">
                        <div className="d-flex align-items-center gap-3">
                          <div className="size-8 rounded-full bg-stone-100 text-[10px] fw-black text-stone-600 d-flex align-items-center justify-content-center border border-stone-200">
                            {order.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                          </div>
                          <span className="fw-black text-dark fs-6 tracking-tight">{order.name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="fs-6 fw-bold text-stone-700 font-serif italic">{order.model}</span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="d-flex align-items-center gap-2">
                          <span className={`size-2 rounded-full bg-primary`}></span>
                          <span className="text-[10px] fw-black text-uppercase tracking-widest text-primary">{order.status}</span>
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
      </div>

      {/* Quick Actions */}
      <section className="row g-6">
        {[
          { label: 'Manage Orders', icon: 'shopping_bag', path: '/admin/orders', desc: 'View and manage all active orders' },
          { label: 'Artisan Collective', icon: 'engineering', path: '/admin/artisans', desc: 'Monitor artisan workloads' },
          { label: 'Custom Designs', icon: 'draw', path: '/admin/designs', desc: 'Review bespoke design submissions' },
          { label: 'Finance Ledger', icon: 'account_balance', path: '/admin/finance', desc: 'View revenue and purchase data' },
        ].map((action, i) => (
          <div key={i} className="col-md-6 col-lg-3">
            <Link to={action.path} className="glass-panel p-6 rounded-[2rem] border-stone-100 shadow-premium group hover:-translate-y-1 transition-all duration-500 d-flex flex-column gap-4 text-decoration-none h-100">
              <div className="size-12 bg-dark/5 rounded-2xl d-flex align-items-center justify-content-center group-hover:bg-primary group-hover:text-white transition-all duration-500 text-stone-600">
                <span className="material-symbols-outlined fs-4">{action.icon}</span>
              </div>
              <div>
                <h4 className="fs-6 fw-black text-dark tracking-tight mb-1">{action.label}</h4>
                <p className="text-[10px] fw-bold text-stone-500 mb-0 leading-relaxed">{action.desc}</p>
              </div>
            </Link>
          </div>
        ))}
      </section>
    </div>
  );
};

export default AdminDashboard;
