import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AdminQuality = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const { data } = await axios.get('/api/qc');
        setReports(data.map(r => ({
          id: r._id?.substring(0, 8).toUpperCase() || 'QR-001',
          batch: r.batch_id?.batch_number || 'Unknown Batch',
          inspector: r.inspector_id?.name || 'Unknown',
          date: r.inspection_date ? new Date(r.inspection_date).toLocaleDateString() : 'N/A',
          issues: r.defects_found || 0,
          status: r.status === 'passed' ? 'Passed' : r.status === 'failed' ? 'Flagged for Rework' : r.status
        })));
      } catch (err) {
        console.error('Failed to fetch QC reports', err);
      }
    };
    fetchReports();
  }, []);

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
           <button className="px-8 py-3.5 rounded-2xl bg-dark text-white text-[10px] fw-black text-uppercase tracking-widest shadow-2xl hover:-translate-y-1 transition duration-500 d-flex align-items-center gap-3">
             <span className="material-symbols-outlined fs-5">fact_check</span>
             New Inspection
           </button>
        </div>
      </section>

      <div className="row g-6 mb-10">
        <div className="col-12 col-md-6">
          <div className="glass-panel p-6 rounded-3xl border-stone-100 shadow-sm relative overflow-hidden group border-l-4 border-l-emerald-500">
            <span className="text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-500 mb-2 d-block relative z-10">Pass Rate (Last 30 Days)</span>
            <h3 className="display-4 fw-black font-serif text-dark mb-0 relative z-10 tracking-tighter">98.5%</h3>
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="glass-panel p-6 rounded-3xl border-stone-100 shadow-sm relative overflow-hidden group border-l-4 border-l-rose-500">
            <span className="text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-500 mb-2 d-block relative z-10">Active Rework Flags</span>
            <h3 className="display-4 fw-black font-serif text-dark mb-0 relative z-10 tracking-tighter">1</h3>
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-[3rem] border-stone-100 shadow-premium overflow-hidden">
        <div className="table-responsive">
          <table className="w-100 text-start align-middle">
            <thead className="bg-stone-50/50">
              <tr>
                <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Report ID</th>
                <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Target Batch</th>
                <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Lead Inspector</th>
                <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Defects Found</th>
                <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700 text-end">Outcome</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {reports.map((report, i) => (
                <tr key={i} className="group hover:bg-stone-50/50 transition-all duration-500">
                  <td className="px-10 py-8 text-xs fw-bold text-stone-500">{report.id} <br/> <span className="text-[9px]">{report.date}</span></td>
                  <td className="px-10 py-8 text-sm fw-black text-dark">{report.batch}</td>
                  <td className="px-10 py-8 text-sm fw-bold text-stone-600">{report.inspector}</td>
                  <td className="px-10 py-8 text-sm fw-bold">
                     <span className={report.issues > 0 ? 'text-rose-500' : 'text-stone-400'}>{report.issues} Issues</span>
                  </td>
                  <td className="px-10 py-8 text-end">
                     <span className={`text-[9px] fw-black text-uppercase tracking-widest px-3 py-1.5 rounded-pill ${report.status === 'Passed' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                        {report.status}
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

export default AdminQuality;
