import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AdminProduction = () => {
  const [activeTab, setActiveTab] = useState('work_orders');

  const [workOrders, setWorkOrders] = useState([]);
  const [productionBatches, setProductionBatches] = useState([]);
  const [productionStages, setProductionStages] = useState([]);
  const [stageLogs, setStageLogs] = useState([]);
  const [maintenanceLogs] = useState([
    { id: 'MN-110', machine: 'Heavy Duty Stitcher B', date: '2026-04-10', issue: 'Tension Calibration', technician: 'Tech A', status: 'Resolved' },
    { id: 'MN-111', machine: 'Sole Press 02', date: '2026-04-17', issue: 'Hydraulic Fluid Low', technician: 'Tech C', status: 'Pending' },
  ]);

  useEffect(() => {
    const fetchProductionData = async () => {
      try {
        const [woRes, batchRes, stageRes, logRes] = await Promise.all([
          axios.get('/api/work-orders'),
          axios.get('/api/production/batches'),
          axios.get('/api/production/stages'),
          axios.get('/api/production/stages/log')
        ]);
        
        setWorkOrders(woRes.data.map(wo => ({
          id: wo._id.substring(0, 8),
          type: wo.order_id?.status === 'urgent' ? 'Custom' : 'Standard',
          product: wo.order_id?.model || 'Shoe',
          client: wo.assigned_to?.name || 'Unassigned',
          status: wo.status
        })));
        
        setProductionBatches(batchRes.data.map(b => ({
          id: b.batch_number || b._id.substring(0, 8),
          line: b.product_id?.name || 'Line A',
          qty: b.quantity,
          started: b.start_date ? new Date(b.start_date).toLocaleDateString() : 'N/A',
          targetCompletion: b.end_date ? new Date(b.end_date).toLocaleDateString() : 'N/A',
          status: b.status
        })));
        
        setProductionStages(stageRes.data.map(s => ({
          id: s._id.substring(0, 8),
          name: s.stage_name,
          duration: s.description || 'N/A',
          dept: 'Production'
        })));
        
        setStageLogs(logRes.data.map(l => ({
          logId: l._id.substring(0, 8),
          batch: l.batch_id?.batch_number || 'Unknown',
          stage: l.stage_id?.stage_name || 'Unknown',
          artisan: l.artisan_id?.name || 'Unknown',
          time: new Date(l.start_time).toLocaleTimeString(),
          status: l.status
        })));
      } catch (err) {
        console.error('Failed to fetch production data:', err);
      }
    };
    fetchProductionData();
  }, []);

  const tabs = [
    { id: 'work_orders', label: 'Work Orders' },
    { id: 'production_batches', label: 'Production Batches' },
    { id: 'production_stages', label: 'Stage Definitions' },
    { id: 'stage_logs', label: 'Stage Logs' },
    { id: 'maintenance_logs', label: 'Machine Maintenance' }
  ];

  return (
    <div className="p-8 lg:p-12 animate-in fade-in duration-1000">
      <section className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-6 mb-12">
        <div>
          <nav className="d-flex align-items-center gap-3 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700 mb-4">
            <Link to="/admin" className="hover:text-dark transition">Operations</Link>
            <span className="material-symbols-outlined fs-6 text-stone-200">chevron_right</span>
            <span className="text-primary">Manufacturing</span>
          </nav>
          <h1 className="display-4 fw-black font-serif text-dark tracking-tighter mb-0 lowercase">Factory.Floor</h1>
        </div>
        
        <div className="d-flex gap-4">
           <button className="px-8 py-3.5 rounded-2xl bg-dark text-white text-[10px] fw-black text-uppercase tracking-widest shadow-2xl hover:-translate-y-1 transition duration-500 d-flex align-items-center gap-3">
             <span className="material-symbols-outlined fs-5">precision_manufacturing</span>
             Initiate Batch
           </button>
        </div>
      </section>

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
        {activeTab === 'work_orders' && (
          <div className="table-responsive">
            <table className="w-100 text-start align-middle">
              <thead className="bg-stone-50/50">
                <tr>
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Order ID</th>
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Type</th>
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Product Line</th>
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Client / Target</th>
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700 text-end">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {workOrders.map((wo, i) => (
                  <tr key={i} className="group hover:bg-stone-50/50 transition-all duration-500">
                    <td className="px-10 py-8 text-xs fw-bold text-primary">{wo.id}</td>
                    <td className="px-10 py-8 text-xs fw-bold text-stone-500">{wo.type}</td>
                    <td className="px-10 py-8 text-sm fw-black text-dark">{wo.product}</td>
                    <td className="px-10 py-8 text-sm fw-bold text-stone-600">{wo.client}</td>
                    <td className="px-10 py-8 text-end">
                       <span className={`text-[9px] fw-black text-uppercase tracking-widest px-3 py-1.5 rounded-pill ${wo.status === 'In Production' ? 'bg-amber-100 text-amber-700' : 'bg-stone-100 text-stone-500'}`}>
                          {wo.status}
                       </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'production_batches' && (
          <div className="table-responsive">
            <table className="w-100 text-start align-middle">
              <thead className="bg-stone-50/50">
                <tr>
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Batch ID</th>
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Line</th>
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Target Qty</th>
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Timeline</th>
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700 text-end">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {productionBatches.map((batch, i) => (
                  <tr key={i} className="group hover:bg-stone-50/50 transition-all duration-500">
                    <td className="px-10 py-8 text-xs fw-bold text-primary">{batch.id}</td>
                    <td className="px-10 py-8 text-sm fw-black text-dark">{batch.line}</td>
                    <td className="px-10 py-8 text-sm fw-bold text-stone-600">{batch.qty} Pairs</td>
                    <td className="px-10 py-8 text-xs fw-bold text-stone-500">{batch.started} → {batch.targetCompletion}</td>
                    <td className="px-10 py-8 text-end">
                       <span className={`text-[9px] fw-black text-uppercase tracking-widest px-3 py-1.5 rounded-pill ${batch.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-primary/10 text-primary border border-primary/20'}`}>
                          {batch.status}
                       </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'production_stages' && (
          <div className="table-responsive">
            <table className="w-100 text-start align-middle">
              <thead className="bg-stone-50/50">
                <tr>
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Stage ID</th>
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Stage Name</th>
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Avg Duration</th>
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700 text-end">Department</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {productionStages.map((stg, i) => (
                  <tr key={i} className="group hover:bg-stone-50/50 transition-all duration-500">
                    <td className="px-10 py-8 text-xs fw-bold text-stone-500">{stg.id}</td>
                    <td className="px-10 py-8 text-sm fw-black text-dark">{stg.name}</td>
                    <td className="px-10 py-8 text-xs fw-bold text-stone-500">{stg.duration} / pair</td>
                    <td className="px-10 py-8 text-end text-sm fw-bold text-stone-600">{stg.dept}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'stage_logs' && (
          <div className="table-responsive">
            <table className="w-100 text-start align-middle">
              <thead className="bg-stone-50/50">
                <tr>
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Log ID</th>
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Batch</th>
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Stage</th>
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Artisan</th>
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700 text-end">Status & Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {stageLogs.map((log, i) => (
                  <tr key={i} className="group hover:bg-stone-50/50 transition-all duration-500">
                    <td className="px-10 py-8 text-xs fw-bold text-stone-500">{log.logId}</td>
                    <td className="px-10 py-8 text-xs fw-bold text-primary">{log.batch}</td>
                    <td className="px-10 py-8 text-sm fw-black text-dark">{log.stage}</td>
                    <td className="px-10 py-8 text-sm fw-bold text-stone-600">{log.artisan}</td>
                    <td className="px-10 py-8 text-end">
                       <span className="text-xs fw-bold text-stone-500 d-block mb-1">{log.time}</span>
                       <span className={`text-[9px] fw-black text-uppercase tracking-widest px-3 py-1 rounded-pill ${log.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                          {log.status}
                       </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {activeTab === 'maintenance_logs' && (
          <div className="table-responsive">
            <table className="w-100 text-start align-middle">
              <thead className="bg-stone-50/50">
                <tr>
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Entry ID</th>
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Machine</th>
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Issue Logged</th>
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Technician</th>
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700 text-end">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {maintenanceLogs.map((log, i) => (
                  <tr key={i} className="group hover:bg-stone-50/50 transition-all duration-500">
                    <td className="px-10 py-8 text-xs fw-bold text-stone-500">{log.id}</td>
                    <td className="px-10 py-8 text-sm fw-black text-dark">{log.machine}</td>
                    <td className="px-10 py-8 text-sm fw-bold text-rose-500">{log.issue}</td>
                    <td className="px-10 py-8 text-sm fw-bold text-stone-600">{log.technician} {log.date}</td>
                    <td className="px-10 py-8 text-end">
                       <span className={`text-[9px] fw-black text-uppercase tracking-widest px-3 py-1.5 rounded-pill ${log.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                          {log.status}
                       </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminProduction;
