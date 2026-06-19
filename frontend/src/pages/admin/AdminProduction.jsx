import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../utils/axiosInstance';
import { useToast } from '../../context/ToastContext';

const AdminProduction = () => {
  const [activeTab, setActiveTab] = useState('work_orders');
  const { showToast, showConfirm } = useToast();
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [isStageModalOpen, setIsStageModalOpen] = useState(false);
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [isEditBatchModalOpen, setIsEditBatchModalOpen] = useState(false);
  const [isEditStageModalOpen, setIsEditStageModalOpen] = useState(false);
  const [isEditMaintenanceModalOpen, setIsEditMaintenanceModalOpen] = useState(false);

  const [workOrders, setWorkOrders] = useState([]);
  const [productionBatches, setProductionBatches] = useState([]);
  const [productionStages, setProductionStages] = useState([]);
  const [stageLogs, setStageLogs] = useState([]);
  const [maintenanceLogs, setMaintenanceLogs] = useState([]);
  const [products, setProducts] = useState([]);

  const [editingBatch, setEditingBatch] = useState(null);
  const [editingStage, setEditingStage] = useState(null);
  const [editingMaintenance, setEditingMaintenance] = useState(null);

  const fetchProductionData = async () => {
    try {
      const [woRes, batchRes, stageRes, logRes, maintenanceRes, productRes] = await Promise.all([
        axios.get('/api/work-orders'),
        axios.get('/api/production/batches'),
        axios.get('/api/production/stages'),
        axios.get('/api/production/stages/log'),
        axios.get('/api/maintenance'),
        axios.get('/api/products')
      ]);
      
      setWorkOrders(woRes.data.map(wo => ({
        id: wo._id.substring(0, 8),
        _id: wo._id,
        order_id: wo.order_id,       // full populated Order object
        assigned_to: wo.assigned_to, // full populated User object
        deadline: wo.deadline,
        status: wo.status
      })));
      
      setProductionBatches(batchRes.data.map(b => ({
        ...b,
        id: b.batch_number || b._id.substring(0, 8),
        line: b.product_id?.name || 'Line A',
        qty: b.quantity,
        started: b.start_date ? new Date(b.start_date).toLocaleDateString() : 'N/A',
        targetCompletion: b.end_date ? new Date(b.end_date).toLocaleDateString() : 'N/A',
        status: b.status
      })));
      
      setProductionStages(stageRes.data.map(s => ({
        ...s,
        id: s._id.substring(0, 8),
        name: s.stage_name,
        duration: s.description || 'N/A',
        dept: 'Production'
      })));
      
      setStageLogs(logRes.data.map(l => ({
        ...l,
        logId: l._id.substring(0, 8),
        batch: l.batch_id?.batch_number || 'Unknown',
        stage: l.stage_id?.stage_name || 'Unknown',
        artisan: l.artisan_id?.name || 'Unknown',
        time: new Date(l.start_time).toLocaleTimeString(),
        status: l.status
      })));

      setMaintenanceLogs(maintenanceRes.data.map(m => ({
        _id: m._id,
        id: m._id.substring(0, 8),
        machine: m.machine,
        issue: m.issue,
        urgency: m.urgency,
        technician: m.urgency ? `Urgency: ${m.urgency.toUpperCase()}` : 'Standard Care',
        date: m.createdAt ? new Date(m.createdAt).toLocaleDateString() : 'N/A',
        status: m.status
      })));

      setProducts(productRes.data);
    } catch (err) {
      console.error('Failed to fetch production data:', err);
    }
  };

  useEffect(() => {
    const load = async () => {
      await fetchProductionData();
    };
    load();
    // Poll every 30 seconds so artisan batch-status changes appear in real time
    const pollInterval = setInterval(fetchProductionData, 30000);
    return () => clearInterval(pollInterval);
  }, []);

  const handleInitiateBatch = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/production/batches', {
        batch_number: e.target.batch_number.value,
        product_id: e.target.product_id.value,
        work_order_id: e.target.work_order_id.value,
        quantity: Number(e.target.quantity.value),
        start_date: e.target.start_date.value,
        end_date: e.target.end_date.value,
        status: 'Pending'
      });
      setIsBatchModalOpen(false);
      fetchProductionData();
      showToast('Production batch initiated successfully.', 'success');
    } catch {
      showToast('Failed to initiate batch. Check all fields.', 'error');
    }
  };

  const handleCreateMaintenance = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/maintenance', {
        machine: e.target.machine.value,
        issue: e.target.issue.value,
        urgency: e.target.urgency.value,
        status: 'Pending'
      });
      setIsMaintenanceModalOpen(false);
      fetchProductionData();
      showToast('Maintenance log created.', 'success');
    } catch {
      showToast('Failed to log maintenance.', 'error');
    }
  };

  const handleEditMaintenance = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/maintenance/${editingMaintenance._id}`, {
        machine: e.target.machine.value,
        issue: e.target.issue.value,
        urgency: e.target.urgency.value,
        status: e.target.status.value
      });
      setIsEditMaintenanceModalOpen(false);
      setEditingMaintenance(null);
      fetchProductionData();
      showToast('Maintenance log updated.', 'success');
    } catch {
      showToast('Failed to update maintenance log.', 'error');
    }
  };

  const handleDeleteMaintenance = async (id) => {
    showConfirm('Delete this maintenance entry?', async () => {
      try {
        await axios.delete(`/api/maintenance/${id}`);
        fetchProductionData();
        showToast('Maintenance entry deleted.', 'success');
      } catch {
        showToast('Failed to delete maintenance log.', 'error');
      }
    });
  };

  const handleEditBatch = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/production/batches/${editingBatch._id}`, {
        batch_number: e.target.batch_number.value,
        quantity: Number(e.target.quantity.value),
        start_date: e.target.start_date.value,
        end_date: e.target.end_date.value,
        status: e.target.status.value
      });
      setIsEditBatchModalOpen(false);
      setEditingBatch(null);
      fetchProductionData();
      showToast('Production batch updated.', 'success');
    } catch {
      showToast('Failed to update batch.', 'error');
    }
  };

  const handleDeleteBatch = async (id) => {
    showConfirm('Are you sure you want to delete this production batch?', async () => {
      try {
        await axios.delete(`/api/production/batches/${id}`);
        fetchProductionData();
        showToast('Production batch deleted.', 'success');
      } catch {
        showToast('Failed to delete batch.', 'error');
      }
    });
  };

  const handleAddStage = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/production/stages', {
        stage_name: e.target.stage_name.value,
        description: e.target.description.value,
        sequence_number: Number(e.target.sequence_number.value)
      });
      setIsStageModalOpen(false);
      fetchProductionData();
      showToast('Stage definition added.', 'success');
    } catch {
      showToast('Failed to add stage.', 'error');
    }
  };

  const handleEditStage = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/production/stages/${editingStage._id}`, {
        stage_name: e.target.stage_name.value,
        description: e.target.description.value,
        sequence_number: Number(e.target.sequence_number.value)
      });
      setIsEditStageModalOpen(false);
      setEditingStage(null);
      fetchProductionData();
      showToast('Stage definition updated.', 'success');
    } catch {
      showToast('Failed to update stage.', 'error');
    }
  };

  const handleDeleteStage = async (id) => {
    showConfirm('Are you sure you want to delete this stage definition?', async () => {
      try {
        await axios.delete(`/api/production/stages/${id}`);
        fetchProductionData();
        showToast('Stage definition deleted.', 'success');
      } catch {
        showToast('Failed to delete stage.', 'error');
      }
    });
  };

  const handleDeleteStageLog = async (id) => {
    showConfirm('Are you sure you want to delete this stage log?', async () => {
      try {
        await axios.delete(`/api/production/stages/log/${id}`);
        fetchProductionData();
        showToast('Stage log deleted.', 'success');
      } catch {
        showToast('Failed to delete stage log.', 'error');
      }
    });
  };

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
           {activeTab === 'maintenance_logs' ? (
             <button onClick={() => setIsMaintenanceModalOpen(true)} className="px-8 py-3.5 rounded-2xl bg-dark text-white text-[10px] fw-black text-uppercase tracking-widest shadow-2xl hover:-translate-y-1 transition duration-500 d-flex align-items-center gap-3">
               <span className="material-symbols-outlined fs-5">build</span>
               Log Maintenance
             </button>
           ) : (
             <>
               <button onClick={() => setIsStageModalOpen(true)} className="px-8 py-3.5 rounded-2xl bg-white text-dark text-[10px] fw-black text-uppercase tracking-widest shadow-sm hover:shadow-md transition duration-500 d-flex align-items-center gap-3 border border-stone-200">
                 <span className="material-symbols-outlined fs-5">add_circle</span>
                 Add Stage
               </button>
               <button onClick={() => setIsBatchModalOpen(true)} className="px-8 py-3.5 rounded-2xl bg-dark text-white text-[10px] fw-black text-uppercase tracking-widest shadow-2xl hover:-translate-y-1 transition duration-500 d-flex align-items-center gap-3">
                 <span className="material-symbols-outlined fs-5">precision_manufacturing</span>
                 Initiate Batch
               </button>
             </>
           )}
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
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Order Ref</th>
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Patron / Model</th>
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Assigned Artisan</th>
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Deadline</th>
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Status</th>
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700 text-end">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {workOrders.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-10 py-16 text-center">
                      <div className="d-flex flex-column align-items-center gap-4 text-stone-400">
                        <span className="material-symbols-outlined fs-1 text-stone-200">inbox</span>
                        <div>
                          <p className="fw-black text-stone-500 mb-1">No work orders yet</p>
                          <p className="text-xs text-stone-400 mb-0">Work orders are created when an admin assigns an artisan to a customer order.</p>
                          <p className="text-xs text-stone-400 mb-0">Go to <strong>Admin → Orders</strong>, click an order, and assign an artisan.</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
                {workOrders.map((wo, i) => (
                  <tr key={i} className="group hover:bg-stone-50/50 transition-all duration-500">
                    <td className="px-10 py-8">
                      <span className="text-xs fw-black text-primary">{wo.order_id?.orderId || `#${wo.id}`}</span>
                    </td>
                    <td className="px-10 py-8">
                      <p className="text-sm fw-black text-dark mb-1">{wo.order_id?.patron || wo.client || 'Unknown Patron'}</p>
                      <p className="text-xs text-stone-500 fw-medium mb-0 font-serif italic">{wo.order_id?.model || wo.product || '—'}</p>
                    </td>
                    <td className="px-10 py-8">
                      {wo.assigned_to?.name ? (
                        <div className="d-flex align-items-center gap-3">
                          <div className="size-8 rounded-full bg-primary/10 text-primary d-flex align-items-center justify-content-center text-[10px] fw-black">
                            {wo.assigned_to.name.substring(0, 2).toUpperCase()}
                          </div>
                          <span className="text-sm fw-bold text-dark">{wo.assigned_to.name}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-stone-400 fw-bold">Unassigned</span>
                      )}
                    </td>
                    <td className="px-10 py-8 text-xs fw-bold text-stone-500">
                      {wo.deadline ? new Date(wo.deadline).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-10 py-8 text-end">
                      <span className={`text-[9px] fw-black text-uppercase tracking-widest px-3 py-1.5 rounded-pill ${wo.status === 'In Progress' ? 'bg-amber-100 text-amber-700' : wo.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-100 text-stone-500'}`}>
                        {wo.status}
                      </span>
                    </td>
                    <td className="px-10 py-8 text-end">
                      {wo.order_id?._id && (
                        <a href={`/admin/orders/${wo.order_id._id}`} className="p-2 rounded-xl bg-stone-100 hover:bg-dark hover:text-white transition text-stone-600 d-inline-flex align-items-center text-decoration-none">
                          <span className="material-symbols-outlined fs-6">open_in_new</span>
                        </a>
                      )}
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
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Status</th>
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700 text-end">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {productionBatches.map((batch, i) => (
                  <tr key={i} className="group hover:bg-stone-50/50 transition-all duration-500">
                    <td className="px-10 py-8 text-xs fw-bold text-primary">{batch.id}</td>
                    <td className="px-10 py-8 text-sm fw-black text-dark">{batch.line}</td>
                    <td className="px-10 py-8 text-sm fw-bold text-stone-600">{batch.qty} Pairs</td>
                    <td className="px-10 py-8 text-xs fw-bold text-stone-500">{batch.started} → {batch.targetCompletion}</td>
                    <td className="px-10 py-8">
                       <span className={`text-[9px] fw-black text-uppercase tracking-widest px-3 py-1.5 rounded-pill ${batch.status === 'In Progress' ? 'bg-emerald-100 text-emerald-700' : batch.status === 'Completed' ? 'bg-stone-100 text-stone-600 border border-stone-200' : 'bg-amber-100 text-amber-700'}`}>
                          {batch.status}
                       </span>
                    </td>
                    <td className="px-10 py-8 text-end">
                      <div className="d-flex justify-content-end gap-2">
                        <button onClick={() => { setEditingBatch(batch); setIsEditBatchModalOpen(true); }} className="p-2 rounded-xl bg-stone-100 hover:bg-dark hover:text-white transition text-stone-600 d-inline-flex align-items-center">
                          <span className="material-symbols-outlined fs-6">edit</span>
                        </button>
                        <button onClick={() => handleDeleteBatch(batch._id)} className="p-2 rounded-xl bg-rose-50 hover:bg-rose-500 hover:text-white transition text-rose-600 d-inline-flex align-items-center">
                          <span className="material-symbols-outlined fs-6">delete</span>
                        </button>
                      </div>
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
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Seq No.</th>
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Avg Duration</th>
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Department</th>
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700 text-end">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {productionStages.map((stg, i) => (
                  <tr key={i} className="group hover:bg-stone-50/50 transition-all duration-500">
                    <td className="px-10 py-8 text-xs fw-bold text-stone-500">{stg.id}</td>
                    <td className="px-10 py-8 text-sm fw-black text-dark">{stg.name}</td>
                    <td className="px-10 py-8 text-xs fw-bold text-dark">#{stg.sequence_number}</td>
                    <td className="px-10 py-8 text-xs fw-bold text-stone-500">{stg.duration}</td>
                    <td className="px-10 py-8 text-sm fw-bold text-stone-600">{stg.dept}</td>
                    <td className="px-10 py-8 text-end">
                      <div className="d-flex justify-content-end gap-2">
                        <button onClick={() => { setEditingStage(stg); setIsEditStageModalOpen(true); }} className="p-2 rounded-xl bg-stone-100 hover:bg-dark hover:text-white transition text-stone-600 d-inline-flex align-items-center">
                          <span className="material-symbols-outlined fs-6">edit</span>
                        </button>
                        <button onClick={() => handleDeleteStage(stg._id)} className="p-2 rounded-xl bg-rose-50 hover:bg-rose-500 hover:text-white transition text-rose-600 d-inline-flex align-items-center">
                          <span className="material-symbols-outlined fs-6">delete</span>
                        </button>
                      </div>
                    </td>
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
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Status & Time</th>
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700 text-end">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {stageLogs.map((log, i) => (
                  <tr key={i} className="group hover:bg-stone-50/50 transition-all duration-500">
                    <td className="px-10 py-8 text-xs fw-bold text-stone-500">{log.logId}</td>
                    <td className="px-10 py-8 text-xs fw-bold text-primary">{log.batch}</td>
                    <td className="px-10 py-8 text-sm fw-black text-dark">{log.stage}</td>
                    <td className="px-10 py-8 text-sm fw-bold text-stone-600">{log.artisan}</td>
                    <td className="px-10 py-8">
                       <span className="text-xs fw-bold text-stone-500 d-block mb-1">{log.time}</span>
                       <span className={`text-[9px] fw-black text-uppercase tracking-widest px-3 py-1 rounded-pill ${log.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                          {log.status}
                       </span>
                    </td>
                    <td className="px-10 py-8 text-end">
                      <button onClick={() => handleDeleteStageLog(log._id)} className="p-2 rounded-xl bg-rose-50 hover:bg-rose-500 hover:text-white transition text-rose-600 d-inline-flex align-items-center">
                        <span className="material-symbols-outlined fs-6">delete</span>
                      </button>
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
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Status</th>
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700 text-end">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {maintenanceLogs.map((log, i) => (
                  <tr key={i} className="group hover:bg-stone-50/50 transition-all duration-500">
                    <td className="px-10 py-8 text-xs fw-bold text-stone-500">{log.id}</td>
                    <td className="px-10 py-8 text-sm fw-black text-dark">{log.machine}</td>
                    <td className="px-10 py-8 text-sm fw-bold text-rose-500">{log.issue}</td>
                    <td className="px-10 py-8 text-sm fw-bold text-stone-600">{log.technician} {log.date}</td>
                    <td className="px-10 py-8">
                       <span className={`text-[9px] fw-black text-uppercase tracking-widest px-3 py-1.5 rounded-pill ${log.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                          {log.status}
                       </span>
                    </td>
                    <td className="px-10 py-8 text-end">
                      <div className="d-flex justify-content-end gap-2">
                        <button onClick={() => { setEditingMaintenance(log); setIsEditMaintenanceModalOpen(true); }} className="p-2 rounded-xl bg-stone-100 hover:bg-dark hover:text-white transition text-stone-600 d-inline-flex align-items-center">
                          <span className="material-symbols-outlined fs-6">edit</span>
                        </button>
                        <button onClick={() => handleDeleteMaintenance(log._id)} className="p-2 rounded-xl bg-rose-50 hover:bg-rose-500 hover:text-white transition text-rose-600 d-inline-flex align-items-center">
                          <span className="material-symbols-outlined fs-6">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Initiate Batch Modal */}
      {isBatchModalOpen && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark/50 backdrop-blur-sm z-[100] d-flex align-items-center justify-content-center p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-[700px] w-100 max-h-[90vh] overflow-y-auto custom-scrollbar border border-stone-100 animate-in zoom-in-95 duration-200">
            <div className="sticky-top bg-stone-50/90 backdrop-blur-md px-8 py-6 border-bottom border-stone-100 d-flex justify-content-between align-items-center z-10">
              <div className="d-flex align-items-center gap-3">
                 <span className="material-symbols-outlined text-dark fs-4">precision_manufacturing</span>
                 <h3 className="fs-5 fw-black font-serif text-dark mb-0 tracking-tight lowercase">Initiate.Batch</h3>
              </div>
              <button onClick={() => setIsBatchModalOpen(false)} className="text-stone-600 hover:text-dark transition">
                <span className="material-symbols-outlined fs-5">close</span>
              </button>
            </div>
            <form onSubmit={handleInitiateBatch} className="p-8 space-y-6">
              <div className="row g-4">
                <div className="col-12 col-md-6">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Batch Number</label>
                  <input name="batch_number" required className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" placeholder="BCH-001" />
                </div>
                <div className="col-12 col-md-6">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Product</label>
                  <select name="product_id" required className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition">
                    <option value="">Select a Product</option>
                    {products.map(prod => (
                      <option key={prod._id} value={prod._id}>{prod.name} (PKR {prod.price})</option>
                    ))}
                  </select>
                </div>
                <div className="col-12 col-md-6">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Work Order ID</label>
                  <select name="work_order_id" required className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition">
                    <option value="">Select a Work Order</option>
                    {workOrders.map(wo => (
                      <option key={wo._id} value={wo._id}>{wo.id} — {wo.order_id?.patron || 'Unknown'} ({wo.order_id?.model || 'N/A'})</option>
                    ))}
                  </select>
                </div>
                <div className="col-12 col-md-6">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Quantity</label>
                  <input name="quantity" type="number" required min="1" className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" placeholder="e.g. 50" />
                </div>
                <div className="col-12 col-md-6">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Start Date</label>
                  <input name="start_date" type="date" required className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" />
                </div>
                <div className="col-12 col-md-6">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Estimated Completion</label>
                  <input name="end_date" type="date" required className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" />
                </div>
              </div>
              <div className="pt-6 border-top border-stone-100 d-flex justify-content-end gap-3 mt-8">
                <button type="button" onClick={() => setIsBatchModalOpen(false)} className="px-6 py-2.5 rounded-xl border border-stone-200 text-[10px] fw-black text-uppercase tracking-widest text-stone-700 hover:bg-stone-50 transition">Discard</button>
                <button type="submit" className="px-6 py-2.5 rounded-xl bg-dark text-white text-[10px] fw-black text-uppercase tracking-widest hover:bg-stone-800 transition shadow-lg">Start Production</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Batch Modal */}
      {isEditBatchModalOpen && editingBatch && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark/50 backdrop-blur-sm z-[100] d-flex align-items-center justify-content-center p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-[700px] w-100 max-h-[90vh] overflow-y-auto custom-scrollbar border border-stone-100 animate-in zoom-in-95 duration-200">
            <div className="sticky-top bg-stone-50/90 backdrop-blur-md px-8 py-6 border-bottom border-stone-100 d-flex justify-content-between align-items-center z-10">
              <div className="d-flex align-items-center gap-3">
                 <span className="material-symbols-outlined text-dark fs-4">edit_note</span>
                 <h3 className="fs-5 fw-black font-serif text-dark mb-0 tracking-tight lowercase">Edit.Batch</h3>
              </div>
              <button onClick={() => { setIsEditBatchModalOpen(false); setEditingBatch(null); }} className="text-stone-600 hover:text-dark transition">
                <span className="material-symbols-outlined fs-5">close</span>
              </button>
            </div>
            <form onSubmit={handleEditBatch} className="p-8 space-y-6">
              <div className="row g-4">
                <div className="col-12 col-md-6">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Batch Number</label>
                  <input name="batch_number" required defaultValue={editingBatch.batch_number} className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" />
                </div>
                <div className="col-12 col-md-6">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Quantity</label>
                  <input name="quantity" type="number" required min="1" defaultValue={editingBatch.qty} className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" />
                </div>
                <div className="col-12 col-md-6">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Start Date</label>
                  <input name="start_date" type="date" required defaultValue={editingBatch.start_date ? editingBatch.start_date.substring(0, 10) : ''} className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" />
                </div>
                <div className="col-12 col-md-6">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Estimated Completion</label>
                  <input name="end_date" type="date" required defaultValue={editingBatch.end_date ? editingBatch.end_date.substring(0, 10) : ''} className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" />
                </div>
                <div className="col-12">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Status</label>
                  <select name="status" defaultValue={editingBatch.status} className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition">
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              <div className="pt-6 border-top border-stone-100 d-flex justify-content-end gap-3 mt-8">
                <button type="button" onClick={() => { setIsEditBatchModalOpen(false); setEditingBatch(null); }} className="px-6 py-2.5 rounded-xl border border-stone-200 text-[10px] fw-black text-uppercase tracking-widest text-stone-700 hover:bg-stone-50 transition">Discard</button>
                <button type="submit" className="px-6 py-2.5 rounded-xl bg-dark text-white text-[10px] fw-black text-uppercase tracking-widest hover:bg-stone-800 transition shadow-lg">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Stage Modal */}
      {isStageModalOpen && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark/50 backdrop-blur-sm z-[100] d-flex align-items-center justify-content-center p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-[500px] w-100 max-h-[90vh] overflow-y-auto custom-scrollbar border border-stone-100 animate-in zoom-in-95 duration-200">
            <div className="sticky-top bg-stone-50/90 backdrop-blur-md px-8 py-6 border-bottom border-stone-100 d-flex justify-content-between align-items-center z-10">
              <div className="d-flex align-items-center gap-3">
                 <span className="material-symbols-outlined text-dark fs-4">add_circle</span>
                 <h3 className="fs-5 fw-black font-serif text-dark mb-0 tracking-tight lowercase">Add.Stage</h3>
              </div>
              <button onClick={() => setIsStageModalOpen(false)} className="text-stone-600 hover:text-dark transition">
                <span className="material-symbols-outlined fs-5">close</span>
              </button>
            </div>
            <form onSubmit={handleAddStage} className="p-8 space-y-6">
              <div className="row g-4">
                <div className="col-12">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Stage Name</label>
                  <input name="stage_name" required className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" placeholder="e.g. Laser Cutting" />
                </div>
                <div className="col-12">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Description / Avg Duration</label>
                  <textarea name="description" required className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" rows="3" placeholder="e.g. 15 mins / pair"></textarea>
                </div>
                <div className="col-12">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Sequence Number</label>
                  <input name="sequence_number" type="number" required min="1" className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" placeholder="e.g. 1" />
                </div>
              </div>
              <div className="pt-6 border-top border-stone-100 d-flex justify-content-end gap-3 mt-8">
                <button type="button" onClick={() => setIsStageModalOpen(false)} className="px-6 py-2.5 rounded-xl border border-stone-200 text-[10px] fw-black text-uppercase tracking-widest text-stone-700 hover:bg-stone-50 transition">Discard</button>
                <button type="submit" className="px-6 py-2.5 rounded-xl bg-dark text-white text-[10px] fw-black text-uppercase tracking-widest hover:bg-stone-800 transition shadow-lg">Save Stage</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Stage Modal */}
      {isEditStageModalOpen && editingStage && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark/50 backdrop-blur-sm z-[100] d-flex align-items-center justify-content-center p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-[500px] w-100 max-h-[90vh] overflow-y-auto custom-scrollbar border border-stone-100 animate-in zoom-in-95 duration-200">
            <div className="sticky-top bg-stone-50/90 backdrop-blur-md px-8 py-6 border-bottom border-stone-100 d-flex justify-content-between align-items-center z-10">
              <div className="d-flex align-items-center gap-3">
                 <span className="material-symbols-outlined text-dark fs-4">edit_square</span>
                 <h3 className="fs-5 fw-black font-serif text-dark mb-0 tracking-tight lowercase">Edit.Stage</h3>
              </div>
              <button onClick={() => { setIsEditStageModalOpen(false); setEditingStage(null); }} className="text-stone-600 hover:text-dark transition">
                <span className="material-symbols-outlined fs-5">close</span>
              </button>
            </div>
            <form onSubmit={handleEditStage} className="p-8 space-y-6">
              <div className="row g-4">
                <div className="col-12">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Stage Name</label>
                  <input name="stage_name" required defaultValue={editingStage.stage_name} className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" />
                </div>
                <div className="col-12">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Description / Avg Duration</label>
                  <textarea name="description" required defaultValue={editingStage.description} className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" rows="3"></textarea>
                </div>
                <div className="col-12">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Sequence Number</label>
                  <input name="sequence_number" type="number" required min="1" defaultValue={editingStage.sequence_number} className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" />
                </div>
              </div>
              <div className="pt-6 border-top border-stone-100 d-flex justify-content-end gap-3 mt-8">
                <button type="button" onClick={() => { setIsEditStageModalOpen(false); setEditingStage(null); }} className="px-6 py-2.5 rounded-xl border border-stone-200 text-[10px] fw-black text-uppercase tracking-widest text-stone-700 hover:bg-stone-50 transition">Discard</button>
                <button type="submit" className="px-6 py-2.5 rounded-xl bg-dark text-white text-[10px] fw-black text-uppercase tracking-widest hover:bg-stone-800 transition shadow-lg">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Log Maintenance Modal */}
      {isMaintenanceModalOpen && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark/50 backdrop-blur-sm z-[100] d-flex align-items-center justify-content-center p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-[500px] w-100 max-h-[90vh] overflow-y-auto custom-scrollbar border border-stone-100 animate-in zoom-in-95 duration-200">
            <div className="sticky-top bg-stone-50/90 backdrop-blur-md px-8 py-6 border-bottom border-stone-100 d-flex justify-content-between align-items-center z-10">
              <div className="d-flex align-items-center gap-3">
                 <span className="material-symbols-outlined text-dark fs-4">build</span>
                 <h3 className="fs-5 fw-black font-serif text-dark mb-0 tracking-tight lowercase">Log.Maintenance</h3>
              </div>
              <button onClick={() => setIsMaintenanceModalOpen(false)} className="text-stone-600 hover:text-dark transition">
                <span className="material-symbols-outlined fs-5">close</span>
              </button>
            </div>
            <form onSubmit={handleCreateMaintenance} className="p-8 space-y-6">
              <div className="row g-4">
                <div className="col-12">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Machine Name</label>
                  <input name="machine" required className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" placeholder="e.g. Goodyear Stitcher 04" />
                </div>
                <div className="col-12">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Issue / Diagnosis</label>
                  <textarea name="issue" required className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" rows="3" placeholder="Describe the fault or maintenance check..."></textarea>
                </div>
                <div className="col-12">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Urgency Level</label>
                  <select name="urgency" className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition">
                    <option value="low">Low Urgency</option>
                    <option value="medium">Medium Urgency</option>
                    <option value="high">High Urgency</option>
                  </select>
                </div>
              </div>
              <div className="pt-6 border-top border-stone-100 d-flex justify-content-end gap-3 mt-8">
                <button type="button" onClick={() => setIsMaintenanceModalOpen(false)} className="px-6 py-2.5 rounded-xl border border-stone-200 text-[10px] fw-black text-uppercase tracking-widest text-stone-700 hover:bg-stone-50 transition">Discard</button>
                <button type="submit" className="px-6 py-2.5 rounded-xl bg-dark text-white text-[10px] fw-black text-uppercase tracking-widest hover:bg-stone-800 transition shadow-lg">Log Machine Event</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Maintenance Modal */}
      {isEditMaintenanceModalOpen && editingMaintenance && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark/50 backdrop-blur-sm z-[100] d-flex align-items-center justify-content-center p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-[500px] w-100 max-h-[90vh] overflow-y-auto custom-scrollbar border border-stone-100 animate-in zoom-in-95 duration-200">
            <div className="sticky-top bg-stone-50/90 backdrop-blur-md px-8 py-6 border-bottom border-stone-100 d-flex justify-content-between align-items-center z-10">
              <div className="d-flex align-items-center gap-3">
                 <span className="material-symbols-outlined text-dark fs-4">edit_square</span>
                 <h3 className="fs-5 fw-black font-serif text-dark mb-0 tracking-tight lowercase">Edit.Maintenance</h3>
              </div>
              <button onClick={() => { setIsEditMaintenanceModalOpen(false); setEditingMaintenance(null); }} className="text-stone-600 hover:text-dark transition">
                <span className="material-symbols-outlined fs-5">close</span>
              </button>
            </div>
            <form onSubmit={handleEditMaintenance} className="p-8 space-y-6">
              <div className="row g-4">
                <div className="col-12">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Machine Name</label>
                  <input name="machine" required defaultValue={editingMaintenance.machine} className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" />
                </div>
                <div className="col-12">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Issue / Diagnosis</label>
                  <textarea name="issue" required defaultValue={editingMaintenance.issue} className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" rows="3"></textarea>
                </div>
                <div className="col-12 col-md-6">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Urgency Level</label>
                  <select name="urgency" defaultValue={editingMaintenance.urgency} className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition">
                    <option value="low">Low Urgency</option>
                    <option value="medium">Medium Urgency</option>
                    <option value="high">High Urgency</option>
                  </select>
                </div>
                <div className="col-12 col-md-6">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Status</label>
                  <select name="status" defaultValue={editingMaintenance.status} className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition">
                    <option value="Pending">Pending</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
              </div>
              <div className="pt-6 border-top border-stone-100 d-flex justify-content-end gap-3 mt-8">
                <button type="button" onClick={() => { setIsEditMaintenanceModalOpen(false); setEditingMaintenance(null); }} className="px-6 py-2.5 rounded-xl border border-stone-200 text-[10px] fw-black text-uppercase tracking-widest text-stone-700 hover:bg-stone-50 transition">Discard</button>
                <button type="submit" className="px-6 py-2.5 rounded-xl bg-dark text-white text-[10px] fw-black text-uppercase tracking-widest hover:bg-stone-800 transition shadow-lg">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminProduction;
