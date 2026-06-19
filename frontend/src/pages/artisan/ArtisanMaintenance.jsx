import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../utils/axiosInstance';

const ArtisanMaintenance = () => {
  const [activeTab, setActiveTab] = useState('report');

  const [logs, setLogs] = useState([]);
  const [formData, setFormData] = useState({ machine: '', issue: '', urgency: 'low' });
  const [editingLog, setEditingLog] = useState(null);

  const fetchLogs = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/maintenance');
      setLogs(data.map(l => ({
        id: l._id.slice(-6).toUpperCase(),
        _id: l._id,
        machine: l.machine,
        issue: l.issue,
        urgency: l.urgency || 'low',
        date: new Date(l.createdAt).toLocaleDateString(),
        status: l.status
      })));
    } catch(err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    const load = async () => { await fetchLogs(); };
    load();
  }, [fetchLogs]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/maintenance', formData);
      setActiveTab('history');
      setFormData({ machine: '', issue: '', urgency: 'low' });
      fetchLogs();
    } catch(err) {
      console.error(err);
      alert('Failed to log issue');
    }
  };

  const handleToggleStatus = async (log) => {
    try {
      const newStatus = log.status === 'Resolved' ? 'Pending' : 'Resolved';
      await axios.put(`/api/maintenance/${log._id}`, { status: newStatus });
      fetchLogs();
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/maintenance/${editingLog._id}`, {
        machine: editingLog.machine,
        issue: editingLog.issue,
        urgency: editingLog.urgency,
        status: editingLog.status
      });
      setEditingLog(null);
      fetchLogs();
    } catch (err) {
      console.error(err);
      alert('Failed to update log');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this maintenance record?')) {
      try {
        await axios.delete(`/api/maintenance/${id}`);
        fetchLogs();
      } catch (err) {
        console.error(err);
        alert('Failed to delete log');
      }
    }
  };

  return (
    <div className="p-8 lg:p-12 animate-in fade-in duration-1000">
      <section className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-6 mb-12">
        <div>
           <nav className="d-flex align-items-center gap-3 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700 mb-4">
              <Link to="/artisan" className="hover:text-dark transition">Workshop</Link>
              <span className="material-symbols-outlined fs-6 text-stone-200">chevron_right</span>
              <span className="text-primary">Equipment Care</span>
           </nav>
           <h1 className="display-4 fw-black font-serif text-dark tracking-tighter mb-0 lowercase">Machine.Maintenance</h1>
        </div>
      </section>

      <div className="d-flex flex-wrap gap-4 mb-8 border-bottom border-stone-200 pb-4">
        <button 
          onClick={() => setActiveTab('report')}
          className={`text-xs fw-black text-uppercase tracking-widest px-6 py-2 rounded-full transition-all duration-300 ${activeTab === 'report' ? 'bg-primary text-white shadow-md' : 'text-stone-500 hover:bg-stone-100'}`}
        >
          Report Equipment Issue
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`text-xs fw-black text-uppercase tracking-widest px-6 py-2 rounded-full transition-all duration-300 ${activeTab === 'history' ? 'bg-primary text-white shadow-md' : 'text-stone-500 hover:bg-stone-100'}`}
        >
          My Station Logs
        </button>
      </div>

      <div className="glass-panel rounded-[3rem] border-stone-100 shadow-sm overflow-hidden">
        {activeTab === 'report' && (
          <div className="p-8 lg:p-12 max-w-[800px]">
            <h3 className="fs-5 fw-black font-serif text-dark mb-6 tracking-tight lowercase">Log Machinery Breakdown</h3>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="row g-4">
                 <div className="col-12 col-md-6">
                    <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Machine / Equipment Name</label>
                    <select required value={formData.machine} onChange={e => setFormData({...formData, machine: e.target.value})} className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition appearance-none">
                       <option value="">Select Equipment...</option>
                       <option value="stitcher_b">Heavy Duty Stitcher B</option>
                       <option value="sole_press_02">Sole Press 02</option>
                       <option value="skiving_mach">Leather Skiving Machine</option>
                       <option value="hand_tools">Hand Tools Missing/Broken</option>
                    </select>
                 </div>
                 <div className="col-12 col-md-6">
                    <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Urgency Level</label>
                    <select required value={formData.urgency} onChange={e => setFormData({...formData, urgency: e.target.value})} className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition appearance-none">
                       <option value="low">Low (Routine Check needed)</option>
                       <option value="medium">Medium (Impaired Functionality)</option>
                       <option value="high">High (Machine is Dead / Safety Risk)</option>
                    </select>
                 </div>
                 <div className="col-12">
                    <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Detailed Issue Description</label>
                    <textarea required value={formData.issue} onChange={e => setFormData({...formData, issue: e.target.value})} rows="4" placeholder="Describe the sounds, smells, or visual cues of the breakdown..." className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition resize-none"></textarea>
                 </div>
              </div>
              <div className="pt-6 mt-4 border-top border-stone-100 d-flex justify-content-end">
                <button type="submit" className="px-8 py-3.5 rounded-2xl bg-rose-500 text-white text-[10px] fw-black text-uppercase tracking-widest hover:shadow-lg hover:shadow-rose-500/30 hover:-translate-y-1 transition duration-500">
                  Submit Maintenance Request
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="table-responsive">
            <table className="w-100 text-start align-middle">
               <thead className="bg-stone-50/50">
                  <tr>
                     <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Ticket ID</th>
                     <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Machine</th>
                     <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Issue Logged</th>
                     <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Date Filed</th>
                     <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Status</th>
                     <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700 text-end">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-stone-50">
                  {logs.map((log, i) => (
                    <tr key={i} className="group hover:bg-stone-50/50 transition-all duration-500">
                       <td className="px-10 py-8 text-xs fw-bold text-stone-500">{log.id}</td>
                       <td className="px-10 py-8 text-sm fw-black text-dark">{log.machine}</td>
                       <td className="px-10 py-8 text-xs fw-bold text-rose-500">{log.issue}</td>
                       <td className="px-10 py-8 text-xs fw-bold text-stone-500">{log.date}</td>
                       <td className="px-10 py-8">
                          <button 
                            onClick={() => handleToggleStatus(log)}
                            title="Click to toggle status"
                            className={`text-[9px] fw-black text-uppercase tracking-widest px-3 py-1.5 rounded-pill border-0 transition hover:scale-105 ${log.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}
                          >
                             {log.status}
                          </button>
                       </td>
                       <td className="px-10 py-8 text-end">
                          <div className="d-flex justify-content-end align-items-center gap-3">
                             <button 
                               onClick={() => setEditingLog(log)} 
                               className="btn btn-sm btn-outline-dark rounded-xl px-3 py-1.5 text-[9px] fw-black text-uppercase tracking-widest transition"
                             >
                                Edit
                             </button>
                             <button 
                               onClick={() => handleDelete(log._id)} 
                               className="btn btn-sm btn-outline-rose rounded-xl px-3 py-1.5 text-[9px] fw-black text-uppercase tracking-widest transition"
                             >
                                Delete
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

      {/* Edit Maintenance Log Modal */}
      {editingLog && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark/50 backdrop-blur-sm z-[100] d-flex align-items-center justify-content-center p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-[500px] w-100 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="px-8 py-6 border-bottom border-stone-100 d-flex justify-content-between align-items-center bg-stone-50/50">
              <h3 className="fs-5 fw-black font-serif text-dark mb-0 tracking-tight lowercase">Edit.Maintenance</h3>
              <button onClick={() => setEditingLog(null)} className="btn-close shadow-none border-0 bg-transparent text-stone-600 hover:text-dark transition">
                <span className="material-symbols-outlined fs-5">close</span>
              </button>
            </div>
            <form onSubmit={handleUpdate} className="p-8 space-y-6">
              <div className="row g-4">
                <div className="col-12 col-md-6">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Machine / Equipment Name</label>
                  <select required value={editingLog.machine} onChange={e => setEditingLog({...editingLog, machine: e.target.value})} className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition appearance-none">
                     <option value="stitcher_b">Heavy Duty Stitcher B</option>
                     <option value="sole_press_02">Sole Press 02</option>
                     <option value="skiving_mach">Leather Skiving Machine</option>
                     <option value="hand_tools">Hand Tools Missing/Broken</option>
                  </select>
                </div>
                <div className="col-12 col-md-6">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Urgency Level</label>
                  <select required value={editingLog.urgency} onChange={e => setEditingLog({...editingLog, urgency: e.target.value})} className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition appearance-none">
                     <option value="low">Low (Routine Check)</option>
                     <option value="medium">Medium (Impaired)</option>
                     <option value="high">High (Dead / Risk)</option>
                  </select>
                </div>
                <div className="col-12">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Detailed Issue Description</label>
                  <textarea required value={editingLog.issue} onChange={e => setEditingLog({...editingLog, issue: e.target.value})} rows="4" className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition resize-none"></textarea>
                </div>
              </div>
              <div className="pt-6 border-top border-stone-100 d-flex justify-content-end gap-3 mt-8">
                <button type="button" onClick={() => setEditingLog(null)} className="px-6 py-2.5 rounded-xl border border-stone-200 text-[10px] fw-black text-uppercase tracking-widest text-stone-700 hover:bg-stone-50 transition">Discard</button>
                <button type="submit" className="px-6 py-2.5 rounded-xl bg-dark text-white text-[10px] fw-black text-uppercase tracking-widest hover:bg-stone-800 transition shadow-lg">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtisanMaintenance;
