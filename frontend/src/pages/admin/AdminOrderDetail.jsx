import { useState, useEffect } from 'react';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { useToast } from '../../context/ToastContext';

const AdminOrderDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast, showConfirm } = useToast();

  const fallbackOrder = {
    id: `#AS-${id || '9421'}`, patron: 'Eleanor Maura', model: 'Oxford No. 4', type: 'Bespoke',
    stage: 'Stitching', progress: 65, status: 'Active', priority: 'VIP Expedited', artisan: 'Lorenzo Giamatti', color: 'primary'
  };

  const [order, setOrder] = useState(location.state?.order || fallbackOrder);
  const [activePipeline, setActivePipeline] = useState(null);

  useEffect(() => {
    const fetchActivePipeline = async () => {
      try {
        const { data } = await axiosInstance.get('/api/orders');
        const active = data.filter(o => o.phase !== 'Finished').length;
        setActivePipeline(active);
      } catch (_) {}
    };
    fetchActivePipeline();
  }, []);

  const handlePushRequest = () => {
    showToast(`Expedited priority request dispatched to ${order.artisan} for Asset ${order.id}.`, 'info');
  };

  const handleTerminate = () => {
    showConfirm(
      `Are you certain you wish to terminate the lifecycle for Asset ${order.id}? This action is irreversible.`,
      async () => {
        try {
          const orderMongoId = order.originalOrder?._id || order.id.replace('#', '');
          await axiosInstance.delete(`/api/orders/${orderMongoId}`);
          showToast('Cycle terminated. Asset moved to legacy archive.', 'success');
          setTimeout(() => navigate('/admin/orders'), 1500);
        } catch (error) {
          console.error('Failed to terminate order', error);
          showToast('Error terminating order. Please try again.', 'error');
        }
      }
    );
  };

  const orderValuation = order.originalOrder?.price
    ? `PKR ${order.originalOrder.price.toLocaleString()}`
    : order.price || 'N/A';

  return (
    <div className="p-8 lg:p-12 animate-in fade-in duration-1000">
      {/* Header */}
      <section className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-6 mb-12">
        <div className="d-flex align-items-center gap-6">
          <Link to="/admin/orders" className="size-12 rounded-2xl border border-stone-100 d-flex align-items-center justify-content-center text-stone-700 hover:text-dark hover:border-dark transition-all duration-500">
            <span className="material-symbols-outlined fs-5">arrow_back</span>
          </Link>
          <div>
            <nav className="d-flex align-items-center gap-3 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700 mb-2">
              <Link to="/admin" className="hover:text-dark transition">Operations</Link>
              <span className="material-symbols-outlined fs-6 text-stone-200">chevron_right</span>
              <Link to="/admin/orders" className="hover:text-dark transition">Registry</Link>
              <span className="material-symbols-outlined fs-6 text-stone-200">chevron_right</span>
              <span className="text-primary">Asset Intelligence</span>
            </nav>
            <h1 className="display-4 fw-black font-serif text-dark tracking-tighter mb-0 lowercase">Asset.{order.id}</h1>
          </div>
        </div>

        <div className="d-flex gap-4">
          <button className="px-8 py-3.5 rounded-2xl bg-white border border-stone-100 text-[10px] fw-black text-uppercase tracking-widest text-dark hover:bg-stone-50 transition duration-500 shadow-sm d-flex align-items-center gap-3">
            <span className="material-symbols-outlined fs-5">print</span>
            Production Dossier
          </button>
        </div>
      </section>

      {/* Real-time Stat Cards */}
      <div className="row g-6 mb-12">
        <div className="col-md-6">
          <div className="glass-panel p-7 rounded-[2rem] border-stone-100 shadow-premium relative overflow-hidden">
            <div className="position-absolute top-0 right-0 p-4 opacity-5">
              <span className="material-symbols-outlined display-3">precision_manufacturing</span>
            </div>
            <div className="relative z-1">
              <h4 className="text-[10px] fw-black text-stone-600 text-uppercase tracking-[0.3em] mb-4">Active Builds</h4>
              <p className="display-5 fw-black font-serif text-dark mb-1 tracking-tighter">
                {activePipeline !== null ? activePipeline : '—'}
              </p>
              <div className="d-flex align-items-center gap-2">
                <span className="material-symbols-outlined text-emerald-500 fs-6">trending_up</span>
                <span className="text-[10px] fw-black text-uppercase tracking-widest text-stone-600">Orders in production</span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="glass-panel p-7 rounded-[2rem] border-stone-100 shadow-premium relative overflow-hidden">
            <div className="position-absolute top-0 right-0 p-4 opacity-5">
              <span className="material-symbols-outlined display-3">account_balance_wallet</span>
            </div>
            <div className="relative z-1">
              <h4 className="text-[10px] fw-black text-stone-600 text-uppercase tracking-[0.3em] mb-4">Order Valuation</h4>
              <p className="display-5 fw-black font-serif text-dark mb-1 tracking-tighter">{orderValuation}</p>
              <div className="d-flex align-items-center gap-2">
                <span className="material-symbols-outlined text-primary fs-6">payments</span>
                <span className="text-[10px] fw-black text-uppercase tracking-widest text-stone-600">This asset value</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-12">
        {/* Customer Profile */}
        <div className="col-lg-8">
          <section className="glass-panel p-8 rounded-[2.5rem] border-stone-100 shadow-premium relative overflow-hidden group">
            <div className="position-absolute top-[-5%] right-[-5%] text-stone-600/5 group-hover:scale-110 transition-transform duration-700">
              <span className="material-symbols-outlined text-[120px]">person</span>
            </div>
            <div className="relative z-1">
              <h3 className="text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700 mb-8">Patron.Profile</h3>
              <div className="d-flex align-items-center gap-6 mb-8">
                <div className="size-16 rounded-[1.5rem] bg-stone-950 d-flex align-items-center justify-content-center text-white text-lg fw-black shadow-2xl">
                  {order.patron.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="text-xl fw-black text-dark tracking-tight mb-1">{order.patron}</h4>
                  <span className="text-[10px] fw-black text-uppercase tracking-widest text-primary">{order.priority}</span>
                </div>
              </div>
              <div className="row g-4">
                <div className="col-md-6">
                  <div className="d-flex flex-column">
                    <span className="text-[9px] fw-black text-uppercase text-stone-700 tracking-widest mb-1">Model Specification</span>
                    <span className="text-sm fw-bold text-dark font-serif italic">{order.model}</span>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex flex-column">
                    <span className="text-[9px] fw-black text-uppercase text-stone-700 tracking-widest mb-1">Order Type</span>
                    <span className="text-sm fw-bold text-dark">{order.type}</span>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex flex-column">
                    <span className="text-[9px] fw-black text-uppercase text-stone-700 tracking-widest mb-1">Current Stage</span>
                    <span className="text-sm fw-bold text-dark">{order.stage}</span>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex flex-column">
                    <span className="text-[9px] fw-black text-uppercase text-stone-700 tracking-widest mb-1">Progress</span>
                    <div>
                      <div className="d-flex justify-content-between mb-1">
                        <span className="text-[10px] fw-black text-dark">{order.progress}%</span>
                      </div>
                      <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                        <div className="h-100 bg-primary rounded-full" style={{ width: `${order.progress}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Admin Authority */}
        <div className="col-lg-4">
          <section className="glass-panel p-8 rounded-[2.5rem] border-stone-100 shadow-premium">
            <h3 className="text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700 mb-8">Admin.Authority</h3>
            <div className="space-y-4">
              <Link
                to={`/admin/assign-artisan/${order.id.replace('#', '')}`}
                className="d-flex align-items-center justify-content-between w-100 p-5 rounded-2xl bg-dark text-white hover:bg-stone-800 transition duration-500 shadow-xl group text-decoration-none"
              >
                <div className="d-flex align-items-center gap-4">
                  <span className="material-symbols-outlined fs-5">psychology</span>
                  <span className="text-[10px] fw-black text-uppercase tracking-widest">
                    Master: {order.artisan ? order.artisan.split(' ')[0] : 'Unassigned'}
                  </span>
                </div>
                <span className="material-symbols-outlined fs-6 group-hover:translate-x-1 transition-transform">chevron_right</span>
              </Link>
              <button
                onClick={handlePushRequest}
                className="d-flex align-items-center justify-content-between w-100 p-5 rounded-2xl bg-white border border-stone-100 text-dark hover:bg-stone-50 transition duration-500 shadow-sm group"
              >
                <div className="d-flex align-items-center gap-4">
                  <span className="material-symbols-outlined fs-5 text-stone-600">notifications</span>
                  <span className="text-[10px] fw-black text-uppercase tracking-widest">Push Request</span>
                </div>
                <span className="material-symbols-outlined fs-6 group-hover:translate-x-1 transition-transform">chevron_right</span>
              </button>
              <button
                onClick={handleTerminate}
                className="d-flex align-items-center justify-content-between w-100 p-5 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-100 transition duration-500 overflow-hidden group"
              >
                <div className="d-flex align-items-center gap-4 relative z-1">
                  <span className="material-symbols-outlined fs-5">block</span>
                  <span className="text-[10px] fw-black text-uppercase tracking-widest">Terminate Cycle</span>
                </div>
                <span className="material-symbols-outlined fs-6 relative z-1 group-hover:translate-x-1 transition-transform">close</span>
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetail;
