import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../utils/axiosInstance';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const AdminQuality = () => {
  const { token, user } = useAuth();
  const { showToast, showConfirm } = useToast();
  const [reports, setReports] = useState([]);
  const [pendingQC, setPendingQC] = useState([]); // orders awaiting admin review
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [inspectors, setInspectors] = useState([]);

  const fetchReports = async () => {
    try {
      const { data } = await axios.get('/api/qc');
      setReports(data.map(r => ({
        _id: r._id,
        id: r._id?.substring(0, 8).toUpperCase() || 'QR-001',
        batch: r.batch_id?.orderId || r.batch_id?.batch_number || 'Unknown Batch',
        inspector: r.inspector_id?.name || 'Unknown',
        date: r.report_date ? new Date(r.report_date).toLocaleDateString() : new Date(r.createdAt || Date.now()).toLocaleDateString(),
        issues: r.defects_found || 0,
        status: r.status === 'passed' || r.status === 'Passed' ? 'Passed' : r.status === 'failed' || r.status === 'Failed' ? 'Failed' : r.status
      })));
    } catch (err) {
      console.error('Failed to fetch QC reports', err);
    }
  };

  const fetchDependencies = async () => {
    try {
      const [ordersRes, usersRes] = await Promise.all([
        axios.get('/api/orders'),
        axios.get('/api/auth/users')
      ]);
      const allOrders = ordersRes.data || [];
      setOrders(allOrders);
      // Orders that artisan passed to Quality Control
      setPendingQC(allOrders.filter(o =>
        o.status === 'Quality Check' || o.phase === 'Quality Control'
      ));
      setInspectors((usersRes.data || []).filter(u => u.role === 'admin' || u.role === 'artisan'));
    } catch (err) {
      console.error('Failed to fetch QC dependencies', err);
    }
  };

  useEffect(() => {
    fetchReports();
    fetchDependencies();
  }, []);

  const handleToggleStatus = async (report) => {
    try {
      const nextStatus = report.status === 'Passed' ? 'Failed' : 'Passed';
      await axios.put(`/api/qc/${report._id}`, { status: nextStatus });
      fetchReports();
      showToast(`Report status updated to: ${nextStatus}`, 'info');
    } catch (err) {
      console.error('Failed to update report status', err);
      showToast('Failed to update report status.', 'error');
    }
  };

  const handleDelete = async (id) => {
    showConfirm(
      'Are you sure you want to remove this quality inspection report?',
      async () => {
        try {
          await axios.delete(`/api/qc/${id}`);
          fetchReports();
          showToast('Inspection report removed.', 'success');
        } catch (err) {
          console.error('Failed to delete report', err);
          showToast('Failed to delete report.', 'error');
        }
      }
    );
  };

  const handleCreateReport = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/qc', {
        batch_id: e.target.batch_id.value,
        inspector_id: e.target.inspector_id.value,
        status: e.target.status.value,
        defects_found: e.target.defects_found.value,
        comments: e.target.comments.value
      });
      setIsModalOpen(false);
      fetchReports();
      showToast('Quality inspection report submitted.', 'success');
    } catch (err) {
      console.error('Failed to create QC report', err);
      showToast('Failed to create QC report.', 'error');
    }
  };

  return (
    <div className="p-8 lg:p-12 animate-in fade-in duration-1000">
      <section className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-6 mb-12">
        <div>
          <nav className="d-flex align-items-center gap-3 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700 mb-4">
            <Link to="/admin" className="hover:text-dark transition">Operations</Link>
            <span className="material-symbols-outlined fs-6 text-stone-200">chevron_right</span>
            <span className="text-primary">Quality Assurance</span>
          </nav>
          <h1 className="display-4 fw-black font-serif text-dark tracking-tighter mb-0 lowercase">Control.Reports</h1>
        </div>
        
        <div className="d-flex gap-4">
           <button onClick={() => setIsModalOpen(true)} className="px-8 py-3.5 rounded-2xl bg-dark text-white text-[10px] fw-black text-uppercase tracking-widest shadow-2xl hover:-translate-y-1 transition duration-500 d-flex align-items-center gap-3">
             <span className="material-symbols-outlined fs-5">fact_check</span>
             New Inspection
           </button>
        </div>
      </section>



      {/* ── Orders Awaiting QC Inspection ─────────────────── */}
      {pendingQC.length > 0 && (
        <div style={{
          background: 'linear-gradient(135deg, #fffbeb, #fef3c7)',
          border: '1px solid #fcd34d',
          borderRadius: 24,
          padding: '24px 32px',
          marginBottom: 32,
        }}>
          <div className="d-flex align-items-center gap-3 mb-4">
            <span className="material-symbols-outlined" style={{ color: '#d97706', fontSize: 28 }}>workspace_premium</span>
            <div>
              <h3 style={{ fontWeight: 900, fontSize: '1rem', color: '#92400e', marginBottom: 2 }}>
                {pendingQC.length} Order{pendingQC.length > 1 ? 's' : ''} Awaiting QC Inspection
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#b45309', marginBottom: 0 }}>
                Artisan has completed production and passed these orders to Quality Control.
              </p>
            </div>
          </div>
          <div className="d-flex flex-column gap-3">
            {pendingQC.map(order => (
              <div key={order._id} style={{
                background: '#fff',
                borderRadius: 16,
                padding: '16px 20px',
                border: '1px solid #fde68a',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap',
              }}>
                <div className="d-flex align-items-center gap-4">
                  <div style={{ width: 44, height: 44, background: '#fef3c7', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="material-symbols-outlined" style={{ color: '#d97706', fontSize: 22 }}>inventory_2</span>
                  </div>
                  <div>
                    <p style={{ fontWeight: 900, fontSize: '0.95rem', color: '#1c1917', marginBottom: 2 }}>
                      {order.orderId || order._id}
                    </p>
                    <p style={{ fontSize: '0.78rem', color: '#78716c', marginBottom: 0 }}>
                      {order.model || 'Bespoke Order'} · {order.patron || 'Customer'} · <strong style={{ color: '#d97706' }}>{order.phase}</strong>
                    </p>
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    style={{
                      background: '#d97706', color: '#fff', border: 'none',
                      borderRadius: 50, padding: '7px 18px',
                      fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.08em',
                      textTransform: 'uppercase', cursor: 'pointer',
                    }}
                  >
                    Log Inspection
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="glass-panel rounded-[3rem] border-stone-100 shadow-premium overflow-hidden">
        <div className="table-responsive">
          <table className="w-100 text-start align-middle">
            <thead className="bg-stone-50/50">
              <tr>
                <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Report ID</th>
                <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Target Batch</th>
                <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Lead Inspector</th>
                <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Defects Found</th>
                <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Outcome</th>
                <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700 text-end">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {reports.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-10 py-16 text-center">
                    <div className="d-flex flex-column align-items-center gap-3 text-stone-400">
                      <span className="material-symbols-outlined fs-1 text-stone-200">verified</span>
                      <p className="fw-black text-stone-500 mb-1">No quality reports yet</p>
                      <p className="text-xs text-stone-400 mb-0">Click <strong>New Inspection</strong> above to log the first quality check report.</p>
                    </div>
                  </td>
                </tr>
              )}
              {reports.map((report, i) => (
                <tr key={i} className="group hover:bg-stone-50/50 transition-all duration-500">
                  <td className="px-10 py-8 text-xs fw-bold text-stone-500">{report.id} <br/> <span className="text-[9px]">{report.date}</span></td>
                  <td className="px-10 py-8 text-sm fw-black text-dark">{report.batch}</td>
                  <td className="px-10 py-8 text-sm fw-bold text-stone-600">{report.inspector}</td>
                  <td className="px-10 py-8 text-sm fw-bold">
                     <span className={report.issues > 0 ? 'text-rose-500' : 'text-stone-400'}>{report.issues} Issues</span>
                  </td>
                  <td className="px-10 py-8">
                     <button 
                       onClick={() => handleToggleStatus(report)}
                       title="Click to toggle status"
                       className={`text-[9px] fw-black text-uppercase tracking-widest px-3 py-1.5 rounded-pill border-0 transition hover:scale-105 ${report.status === 'Passed' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}
                     >
                        {report.status}
                     </button>
                  </td>
                  <td className="px-10 py-8 text-end">
                     <button 
                       onClick={() => handleDelete(report._id)} 
                       className="btn btn-sm btn-outline-rose rounded-xl px-3 py-1.5 text-[9px] fw-black text-uppercase tracking-widest transition"
                     >
                        Delete
                     </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Inspection Modal */}
      {isModalOpen && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark/50 backdrop-blur-sm z-[100] d-flex align-items-center justify-content-center p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-[600px] w-100 max-h-[90vh] overflow-y-auto custom-scrollbar border border-stone-100 animate-in zoom-in-95 duration-200">
            <div className="sticky-top bg-stone-50/90 backdrop-blur-md px-8 py-6 border-bottom border-stone-100 d-flex justify-content-between align-items-center z-10">
              <div className="d-flex align-items-center gap-3">
                 <span className="material-symbols-outlined text-dark fs-4">fact_check</span>
                 <h3 className="fs-5 fw-black font-serif text-dark mb-0 tracking-tight lowercase">New.Inspection</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-600 hover:text-dark transition">
                <span className="material-symbols-outlined fs-5">close</span>
              </button>
            </div>
            
            <form onSubmit={handleCreateReport} className="p-8 space-y-6">
              <div className="row g-4">
                <div className="col-12 col-md-6">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Target Batch / Order</label>
                  <select name="batch_id" required className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition">
                    <option value="">Select Order</option>
                    {orders.map(o => (
                      <option key={o._id} value={o._id}>{o.orderId || o._id} - {o.model} ({o.patron})</option>
                    ))}
                  </select>
                </div>
                
                <div className="col-12 col-md-6">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Lead Inspector</label>
                  <select name="inspector_id" required defaultValue={user?._id || ''} className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition">
                    <option value="">Select Inspector</option>
                    {inspectors.map(ins => (
                      <option key={ins._id} value={ins._id}>{ins.name} ({ins.role})</option>
                    ))}
                  </select>
                </div>
                
                <div className="col-12 col-md-6">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Outcome / Status</label>
                  <select name="status" required className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition">
                    <option value="Passed">Passed</option>
                    <option value="Failed">Failed</option>
                    <option value="Rework">Rework</option>
                  </select>
                </div>
                
                <div className="col-12 col-md-6">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Defects Found (Quantity/Details)</label>
                  <input name="defects_found" type="text" defaultValue="0" required className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" />
                </div>
                
                <div className="col-12">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Comments / Notes</label>
                  <textarea name="comments" className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" rows="3" placeholder="Additional details on the quality check..."></textarea>
                </div>
              </div>
              
              <div className="pt-6 border-top border-stone-100 d-flex justify-content-end gap-3 mt-8">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-xl border border-stone-200 text-[10px] fw-black text-uppercase tracking-widest text-stone-700 hover:bg-stone-50 transition">Discard</button>
                <button type="submit" className="px-6 py-2.5 rounded-xl bg-dark text-white text-[10px] fw-black text-uppercase tracking-widest hover:bg-stone-800 transition shadow-lg">Submit Report</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminQuality;
