import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ArtisanMaintenance = () => {
  const [activeTab, setActiveTab] = useState('report');

  const [logs, setLogs] = useState([]);
  const [formData, setFormData] = useState({ machine: '', issue: '', urgency: 'low' });

  const fetchLogs = async () => {
    try {
      const { data } = await axios.get('/api/maintenance');
      setLogs(data.map(l => ({
        id: l._id.slice(-6).toUpperCase(),
        machine: l.machine,
        issue: l.issue,
        date: new Date(l.createdAt).toLocaleDateString(),
        status: l.status
      })));
    } catch(err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

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
                     <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700 text-end">Status</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-stone-50">
                  {logs.map((log, i) => (
                    <tr key={i} className="group hover:bg-stone-50/50 transition-all duration-500">
                       <td className="px-10 py-8 text-xs fw-bold text-stone-500">{log.id}</td>
                       <td className="px-10 py-8 text-sm fw-black text-dark">{log.machine}</td>
                       <td className="px-10 py-8 text-xs fw-bold text-rose-500">{log.issue}</td>
                       <td className="px-10 py-8 text-xs fw-bold text-stone-500">{log.date}</td>
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

export default ArtisanMaintenance;
