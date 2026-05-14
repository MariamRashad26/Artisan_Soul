import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AdminHR = () => {
  const [activeTab, setActiveTab] = useState('salaries');

  const [salaries, setSalaries] = useState([]);
  const [shifts, setShifts] = useState([]);

  useEffect(() => {
    const fetchHRData = async () => {
      try {
        const [salaryRes, shiftRes] = await Promise.all([
          axios.get('/api/hr/salaries'),
          axios.get('/api/hr/shifts')
        ]);
        
        setSalaries(salaryRes.data.map(s => ({
          id: s.employee_id?._id?.substring(0, 8) || 'EMP-001',
          name: s.employee_id?.name || 'Unknown',
          role: s.employee_id?.role || 'Staff',
          base: s.base_salary || 0,
          bonus: s.bonuses || 0,
          net: (s.base_salary || 0) + (s.bonuses || 0) - (s.deductions || 0)
        })));

        setShifts(shiftRes.data.map(sh => ({
          id: sh._id?.substring(0, 8) || 'SH-001',
          staff: sh.artisan_id?.name || 'Unknown',
          date: sh.shift_date ? new Date(sh.shift_date).toLocaleDateString() : 'N/A',
          station: sh.status === 'completed' ? 'QA Station 1' : 'Assembly Line A',
          status: sh.status === 'completed' ? 'Completed' : sh.status === 'active' ? 'In Progress' : 'Scheduled'
        })));
      } catch (err) {
        console.error('Failed to fetch HR data', err);
      }
    };
    fetchHRData();
  }, []);

  return (
    <div className="p-8 lg:p-12 animate-in fade-in duration-1000">
      <section className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-6 mb-12">
        <div>
          <nav className="d-flex align-items-center gap-3 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700 mb-4">
            <Link to="/admin" className="hover:text-dark transition">Operations</Link>
            <span className="material-symbols-outlined fs-6 text-stone-200">chevron_right</span>
            <span className="text-primary">Human Resources</span>
          </nav>
          <h1 className="display-4 fw-black font-serif text-dark tracking-tighter mb-0 lowercase">Staff.Management</h1>
        </div>
        
        <div className="d-flex gap-4">
          <button className="px-8 py-3.5 rounded-2xl bg-dark text-white text-[10px] fw-black text-uppercase tracking-widest shadow-2xl hover:-translate-y-1 transition duration-500 d-flex align-items-center gap-3">
            <span className="material-symbols-outlined fs-5">person_add</span>
            Recruit Staff
          </button>
        </div>
      </section>

      {/* Tabs */}
      <div className="d-flex gap-4 mb-8 border-bottom border-stone-200 pb-4">
        <button 
          onClick={() => setActiveTab('salaries')}
          className={`text-xs fw-black text-uppercase tracking-widest px-6 py-2 rounded-full transition-all duration-300 ${activeTab === 'salaries' ? 'bg-dark text-white shadow-md' : 'text-stone-500 hover:bg-stone-100'}`}
        >
          Salaries & Payroll
        </button>
        <button 
          onClick={() => setActiveTab('shifts')}
          className={`text-xs fw-black text-uppercase tracking-widest px-6 py-2 rounded-full transition-all duration-300 ${activeTab === 'shifts' ? 'bg-dark text-white shadow-md' : 'text-stone-500 hover:bg-stone-100'}`}
        >
          Shift Management
        </button>
      </div>

      <div className="glass-panel rounded-[3rem] border-stone-100 shadow-premium overflow-hidden">
        {activeTab === 'salaries' && (
          <div className="table-responsive">
            <table className="w-100 text-start align-middle">
              <thead className="bg-stone-50/50">
                <tr>
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Employee</th>
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Role & Department</th>
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Base Salary</th>
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Bonus/Deductions</th>
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700 text-end">Net Pay</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {salaries.map((emp, i) => (
                  <tr key={i} className="group hover:bg-stone-50/50 transition-all duration-500">
                    <td className="px-10 py-8">
                       <span className="text-sm fw-black text-dark tracking-tight d-block">{emp.name}</span>
                       <span className="text-[10px] text-stone-400 fw-bold">{emp.id}</span>
                    </td>
                    <td className="px-10 py-8 text-xs fw-bold text-stone-600">{emp.role}</td>
                    <td className="px-10 py-8 text-xs fw-bold text-stone-600">${emp.base.toLocaleString()}</td>
                    <td className="px-10 py-8 text-xs fw-bold text-emerald-600">+${emp.bonus.toLocaleString()}</td>
                    <td className="px-10 py-8 text-end text-sm fw-black text-dark">${emp.net.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'shifts' && (
          <div className="table-responsive">
            <table className="w-100 text-start align-middle">
              <thead className="bg-stone-50/50">
                <tr>
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Shift ID</th>
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Staff Member</th>
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Date & Timing</th>
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Station</th>
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700 text-end">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {shifts.map((shift, i) => (
                  <tr key={i} className="group hover:bg-stone-50/50 transition-all duration-500">
                    <td className="px-10 py-8 text-xs fw-bold text-primary">{shift.id}</td>
                    <td className="px-10 py-8 text-sm fw-black text-dark">{shift.staff}</td>
                    <td className="px-10 py-8 text-xs fw-bold text-stone-500">{shift.date}</td>
                    <td className="px-10 py-8 text-xs fw-bold text-stone-500">{shift.station}</td>
                    <td className="px-10 py-8 text-end">
                       <span className={`text-[9px] fw-black text-uppercase tracking-widest px-3 py-1.5 rounded-pill ${shift.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : shift.status === 'In Progress' ? 'bg-amber-100 text-amber-700' : 'bg-stone-100 text-stone-500'}`}>
                          {shift.status}
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

export default AdminHR;
