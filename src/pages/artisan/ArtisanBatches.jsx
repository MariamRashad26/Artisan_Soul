import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../utils/axiosInstance';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const ArtisanBatches = () => {
  const [batches, setBatches] = useState([]);
  const [stages, setStages] = useState([]);
  const [stageLogs, setStageLogs] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { showToast } = useToast();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [batchRes, stageRes, logRes] = await Promise.all([
        axios.get('/api/production/batches'),
        axios.get('/api/production/stages'),
        axios.get('/api/production/stages/log')
      ]);
      setBatches(batchRes.data);
      setStages(stageRes.data.sort((a, b) => a.sequence_number - b.sequence_number));
      setStageLogs(logRes.data);
    } catch (err) {
      console.error('Failed to load batch data:', err);
      showToast('Failed to load floor batch data.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update selectedBatch if the underlying list changes (to keep details up-to-date)
  useEffect(() => {
    if (selectedBatch) {
      const updated = batches.find(b => b._id === selectedBatch._id);
      if (updated) {
        setSelectedBatch(updated);
      }
    }
  }, [batches]);

  const handleUpdateStage = async (stageId, statusVal) => {
    if (!selectedBatch) return;
    try {
      // 1. Log the stage action
      await axios.post('/api/production/stages/log', {
        batch_id: selectedBatch._id,
        stage_id: stageId,
        artisan_id: user?._id,
        status: statusVal,
        start_time: new Date(),
        end_time: statusVal === 'Completed' ? new Date() : null
      });

      // 2. Automatically advance the batch status if starting/finishing
      let newBatchStatus = selectedBatch.status;
      if (statusVal === 'Started' && selectedBatch.status === 'Pending') {
        newBatchStatus = 'In Progress';
      }

      // Check if this is the final stage being completed
      const finalStage = stages[stages.length - 1];
      if (statusVal === 'Completed' && stageId === finalStage?._id) {
        newBatchStatus = 'Completed';
      }

      if (newBatchStatus !== selectedBatch.status) {
        await axios.put(`/api/production/batches/${selectedBatch._id}`, {
          status: newBatchStatus
        });
      }

      showToast(`Stage status marked as ${statusVal}`, 'success');
      await fetchData();
    } catch (err) {
      console.error('Failed to update stage:', err);
      showToast('Error updating production stage.', 'error');
    }
  };

  // Helper: Get stage logs for selected batch
  const getLogsForBatch = (batchId) => {
    return stageLogs.filter(log => log.batch_id?._id === batchId || log.batch_id === batchId);
  };

  // Helper: Get status of a stage for a batch ('Completed', 'Started', or 'Not Started')
  const getStageStatus = (batchId, stageId) => {
    const logs = getLogsForBatch(batchId).filter(log => log.stage_id?._id === stageId || log.stage_id === stageId);
    if (logs.some(l => l.status === 'Completed')) return 'Completed';
    if (logs.some(l => l.status === 'Started')) return 'Started';
    return 'Not Started';
  };

  return (
    <div className="min-vh-100 bg-background-light font-display text-dark lg:pb-20">
      <header className="bg-white/80 backdrop-blur-xl border-bottom border-stone-200 px-6 lg:px-12 py-6 sticky-top z-40 shadow-sm animate-in slide-in-from-top duration-700">
        <div className="max-w-7xl mx-auto d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-6">
          <div className="d-flex align-items-center gap-5">
            <Link to="/artisan" className="size-12 rounded-xl bg-stone-50 border border-stone-200 d-flex align-items-center justify-content-center text-stone-400 hover:text-dark hover:bg-white hover:border-dark transition duration-500 shadow-sm group">
              <span className="material-symbols-outlined fs-4 group-hover:-translate-x-1 transition-transform">arrow_back</span>
            </Link>
            <div>
              <div className="d-flex align-items-center gap-3 text-primary mb-1">
                <span className="material-symbols-outlined fs-6 animate-pulse">precision_manufacturing</span>
                <span className="text-[10px] fw-black text-uppercase tracking-[0.3em]">Factory Floor Operations</span>
              </div>
              <h1 className="display-6 fw-black font-serif text-dark tracking-tighter mb-0 lowercase">Production.Batches</h1>
            </div>
          </div>
          <div className="d-flex gap-3">
            <button onClick={fetchData} className="px-6 py-3.5 rounded-2xl border border-stone-200 text-stone-600 fw-black text-xs text-uppercase tracking-widest hover:bg-stone-50 transition duration-500 shadow-sm d-flex align-items-center gap-3 bg-transparent">
              <span className="material-symbols-outlined fs-5">sync</span>
              Sync Batches
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-10 animate-in fade-in slide-in-from-bottom duration-1000">
        <div className="row g-8">
          {/* Batches List */}
          <div className={selectedBatch ? 'col-lg-6' : 'col-lg-12'}>
            <section className="glass-panel rounded-[3rem] border-stone-100 shadow-premium overflow-hidden">
              <div className="p-8 border-bottom border-stone-100 bg-stone-50/50">
                <h3 className="fs-5 fw-black text-dark mb-1 font-serif tracking-tight lowercase">Active.Runs</h3>
                <p className="text-stone-500 text-xs fw-bold tracking-widest uppercase mb-0">Mass Production Pipelines</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-100 text-start min-w-[600px]">
                  <thead className="bg-stone-50/30">
                    <tr>
                      <th className="px-8 py-5 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-400">Batch ID</th>
                      <th className="px-8 py-5 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-400">Product</th>
                      <th className="px-8 py-5 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-400">Quantity</th>
                      <th className="px-8 py-5 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-400">Status</th>
                      <th className="px-8 py-5 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-400 text-end">Logs</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-50">
                    {loading ? (
                      <tr>
                        <td colSpan="5" className="px-8 py-12 text-center">
                          <div className="d-flex flex-column align-items-center gap-4 text-stone-400">
                            <span className="material-symbols-outlined fs-1 animate-spin">autorenew</span>
                            <span className="text-sm fw-bold">Loading active runs...</span>
                          </div>
                        </td>
                      </tr>
                    ) : batches.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-8 py-16 text-center">
                          <div className="d-flex flex-column align-items-center gap-4 text-stone-400">
                            <span className="material-symbols-outlined fs-1 text-stone-300">inbox</span>
                            <div>
                              <p className="fw-black text-stone-500 mb-1">No production batches found</p>
                              <p className="text-xs text-stone-400 mb-0">Admin must initiate a batch from the Admin Console.</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      batches.map((batch) => {
                        const isSelected = selectedBatch?._id === batch._id;
                        return (
                          <tr key={batch._id} onClick={() => setSelectedBatch(batch)} className={`group hover:bg-stone-50 transition-colors duration-300 cursor-pointer ${isSelected ? 'bg-primary/5' : ''}`}>
                            <td className="px-8 py-6">
                              <span className="fs-6 fw-black text-primary tracking-tight">{batch.batch_number}</span>
                            </td>
                            <td className="px-8 py-6">
                              <span className="fs-6 fw-black text-dark tracking-tight">{batch.product_id?.name || 'Standard Last'}</span>
                            </td>
                            <td className="px-8 py-6">
                              <span className="fs-6 fw-bold text-stone-500">{batch.quantity} Pairs</span>
                            </td>
                            <td className="px-8 py-6">
                              <span className={`text-[8px] fw-black text-uppercase tracking-widest px-3 py-1.5 rounded-full border border-white shadow-lg ${
                                batch.status === 'Completed' ? 'bg-emerald-500 text-white' :
                                batch.status === 'In Progress' ? 'bg-primary text-white' : 'bg-stone-200 text-stone-600'
                              }`}>
                                {batch.status}
                              </span>
                            </td>
                            <td className="px-8 py-6 text-end">
                              <span className="material-symbols-outlined text-stone-300 group-hover:text-primary transition">arrow_forward_ios</span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* Batch Stage details */}
          {selectedBatch && (
            <div className="col-lg-6">
              <section className="glass-panel rounded-[3rem] border-stone-100 shadow-premium p-8 animate-in fade-in slide-in-from-right-4 duration-500 relative overflow-hidden">
                <div className="position-absolute top-[-10%] right-[-10%] size-64 bg-primary/5 rounded-full blur-[80px]"></div>

                <div className="d-flex justify-content-between align-items-start mb-8 relative z-1">
                  <div>
                    <span className="text-primary text-[10px] fw-black text-uppercase tracking-[0.2em] mb-1 d-block">Run Specifications</span>
                    <h3 className="fs-4 fw-black text-dark font-serif tracking-tight lowercase">Batch.{selectedBatch.batch_number}</h3>
                  </div>
                  <button onClick={() => setSelectedBatch(null)} className="size-10 rounded-xl bg-stone-50 border border-stone-200 d-flex align-items-center justify-content-center text-stone-400 hover:text-dark hover:bg-white transition bg-transparent">
                    <span className="material-symbols-outlined fs-5">close</span>
                  </button>
                </div>

                <div className="row g-4 mb-8 relative z-1">
                  <div className="col-6">
                    <p className="text-[10px] text-stone-400 fw-black text-uppercase tracking-[0.2em] mb-1">Product Archetype</p>
                    <p className="fs-6 fw-black text-dark tracking-tight mb-0">{selectedBatch.product_id?.name || 'Standard Boot'}</p>
                  </div>
                  <div className="col-6">
                    <p className="text-[10px] text-stone-400 fw-black text-uppercase tracking-[0.2em] mb-1">Batch Value</p>
                    <p className="fs-6 fw-black text-dark tracking-tight mb-0">PKR {((selectedBatch.product_id?.price || 0) * selectedBatch.quantity).toLocaleString()}</p>
                  </div>
                </div>

                {/* Stage progression timeline */}
                <div className="relative z-1 mb-8">
                  <h4 className="text-[10px] fw-black text-stone-400 text-uppercase tracking-[0.3em] mb-6">Stage Progression</h4>
                  <div className="space-y-6">
                    {stages.map((stage) => {
                      const currentStatus = getStageStatus(selectedBatch._id, stage._id);
                      return (
                        <div key={stage._id} className="d-flex gap-4 align-items-start">
                          <div className="d-flex flex-column align-items-center">
                            <div className={`size-8 rounded-full d-flex align-items-center justify-content-center border-2 text-[11px] fw-black transition ${
                              currentStatus === 'Completed' ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20' :
                              currentStatus === 'Started' ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20 animate-pulse' :
                              'border-stone-200 text-stone-400 bg-white'
                            }`}>
                              {currentStatus === 'Completed' ? (
                                <span className="material-symbols-outlined text-[14px]">check</span>
                              ) : stage.sequence_number}
                            </div>
                            <div className="w-[2px] h-10 bg-stone-100 mt-2"></div>
                          </div>

                          <div className="flex-grow-1 min-w-0 pt-0.5">
                            <div className="d-flex justify-content-between align-items-center mb-1">
                              <h5 className="fs-6 fw-black text-dark mb-0 tracking-tight">{stage.stage_name}</h5>
                              <span className={`text-[8px] fw-black text-uppercase tracking-widest px-2 py-0.5 rounded ${
                                currentStatus === 'Completed' ? 'bg-emerald-50 text-emerald-700' :
                                currentStatus === 'Started' ? 'bg-amber-50 text-amber-700' : 'bg-stone-50 text-stone-400'
                              }`}>
                                {currentStatus}
                              </span>
                            </div>
                            <p className="text-stone-500 text-xs mb-3">{stage.description}</p>

                            <div className="d-flex gap-2">
                              {currentStatus === 'Not Started' && (
                                <button onClick={() => handleUpdateStage(stage._id, 'Started')} className="px-4 py-2 bg-primary text-white rounded-xl text-[9px] fw-black text-uppercase tracking-widest shadow-sm hover:shadow-md transition border-0">
                                  Start Phase
                                </button>
                              )}
                              {currentStatus === 'Started' && (
                                <button onClick={() => handleUpdateStage(stage._id, 'Completed')} className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-[9px] fw-black text-uppercase tracking-widest shadow-sm hover:shadow-md transition border-0">
                                  Mark Completed
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Direct Batch Status Control */}
                <div className="relative z-1 pt-6 border-top border-stone-100">
                  <h4 className="text-[10px] fw-black text-stone-400 text-uppercase tracking-[0.3em] mb-4">Update Batch Status</h4>
                  <div className="d-flex flex-wrap gap-3">
                    {['Pending', 'In Progress', 'Completed', 'Cancelled'].map(status => (
                      <button
                        key={status}
                        onClick={async () => {
                          try {
                            await axios.put(`/api/production/batches/${selectedBatch._id}`, { status });
                            showToast(`Batch status updated to: ${status}`, 'success');
                            await fetchData();
                          } catch (err) {
                            showToast('Failed to update batch status.', 'error');
                          }
                        }}
                        className={`px-4 py-2 rounded-xl text-[9px] fw-black text-uppercase tracking-widest border-0 transition shadow-sm hover:shadow-md ${
                          selectedBatch.status === status
                            ? status === 'Completed' ? 'bg-emerald-500 text-white'
                            : status === 'In Progress' ? 'bg-primary text-white'
                            : status === 'Cancelled' ? 'bg-rose-500 text-white'
                            : 'bg-stone-700 text-white'
                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                        }`}
                      >
                        {selectedBatch.status === status && '✓ '}{status}
                      </button>
                    ))}
                  </div>
                  <p className="text-[9px] text-stone-400 fw-bold mt-3 mb-0">Status changes sync immediately to Admin Production dashboard.</p>
                </div>
              </section>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ArtisanBatches;
