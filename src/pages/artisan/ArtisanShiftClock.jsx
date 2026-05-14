import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const ArtisanShiftClock = () => {
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [activeStage, setActiveStage] = useState(null);

  const [shifts, setShifts] = useState([]);
  const [stageLogs, setStageLogs] = useState([]);
  const [activeShiftId, setActiveShiftId] = useState(null);

  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [shiftRes, logRes] = await Promise.all([
          axios.get('/api/hr/shifts'),
          axios.get('/api/production/stages/log')
        ]);
        
        const userShifts = shiftRes.data.filter(s => s.user_id && s.user_id._id === user?._id).sort((a,b) => new Date(b.shift_date) - new Date(a.shift_date));
        
        const currentActive = userShifts.find(s => !s.clock_out);
        if (currentActive) {
          setIsClockedIn(true);
          setActiveShiftId(currentActive._id);
        }

        setShifts(userShifts.map(s => ({
          date: new Date(s.shift_date).toLocaleDateString(),
          shiftIn: s.clock_in ? new Date(s.clock_in).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'N/A',
          shiftOut: s.clock_out ? new Date(s.clock_out).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Active',
          duration: s.total_hours ? `${s.total_hours} hrs` : 'Ongoing',
          station: s.status || 'Workshop'
        })).slice(0, 5));
        
        setStageLogs(logRes.data.map(l => ({
          batch: l.batch_id?.orderId || l.batch_id?.batch_number || 'Unknown',
          stage: l.stage_id?.stage_name || 'Unknown',
          timeSpent: 'N/A', // Calculate from start/end time if needed
          date: new Date(l.start_time).toLocaleDateString()
        })).slice(0, 5));
        
      } catch (err) {
        console.error('Error fetching artisan data', err);
      }
    };
    if (user?._id) fetchData();
  }, [user]);

  const toggleClock = async () => {
    try {
      if (isClockedIn && activeShiftId) {
        await axios.put(`/api/hr/shifts/${activeShiftId}`, {
          clock_out: new Date(),
          status: 'Completed'
        });
        setIsClockedIn(false);
        setActiveShiftId(null);
      } else {
        const { data } = await axios.post('/api/hr/shifts', {
          user_id: user?._id || '664536761ab2093ce14e5a32',
          shift_date: new Date(),
          shift_type: 'Morning',
          clock_in: new Date()
        });
        setIsClockedIn(true);
        setActiveShiftId(data._id);
      }
      window.location.reload(); // Refresh to update lists easily
    } catch (err) {
      console.error(err);
      alert('Error updating shift status');
    }
  };

  return (
    <div className="p-8 lg:p-12 animate-in fade-in duration-1000">
      <section className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-6 mb-12">
        <div>
           <nav className="d-flex align-items-center gap-3 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700 mb-4">
              <Link to="/artisan" className="hover:text-dark transition">Workshop</Link>
              <span className="material-symbols-outlined fs-6 text-stone-200">chevron_right</span>
              <span className="text-primary">Time & Tracking</span>
           </nav>
           <h1 className="display-4 fw-black font-serif text-dark tracking-tighter mb-0 lowercase">Shift.Station</h1>
        </div>
      </section>

      <div className="row g-6 mb-10">
         <div className="col-12 col-lg-5">
            <div className={`glass-panel p-8 rounded-[3rem] border-stone-100 shadow-premium text-center transition-all duration-700 ${isClockedIn ? 'border-2 border-emerald-500 shadow-emerald-500/20' : ''}`}>
               <div className={`size-24 mx-auto rounded-full d-flex align-items-center justify-content-center mb-6 transition-colors duration-500 ${isClockedIn ? 'bg-emerald-100 text-emerald-600' : 'bg-stone-100 text-stone-400'}`}>
                  <span className="material-symbols-outlined fs-1">timer</span>
               </div>
               <h3 className="fs-4 fw-black text-dark mb-2 tracking-tight">Main Shift Clock</h3>
               <p className="text-xs fw-bold text-stone-500 mb-8">{isClockedIn ? 'You are currently ON shift.' : 'You are currently OFF shift.'}</p>
               
               <button onClick={toggleClock} className={`w-100 py-4 rounded-2xl text-[11px] fw-black text-uppercase tracking-widest transition duration-500 ${isClockedIn ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-lg' : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg'}`}>
                  {isClockedIn ? 'Clock Out of Shift' : 'Clock In to Shift'}
               </button>
            </div>
         </div>

         <div className="col-12 col-lg-7">
            <div className={`glass-panel p-8 rounded-[3rem] border-stone-100 shadow-premium h-100 transition-all duration-700 ${!isClockedIn ? 'opacity-50 grayscale pointer-events-none' : ''}`}>
               <h3 className="fs-5 fw-black text-dark mb-4 tracking-tight">Active Stage Tracker (Production Logs)</h3>
               <p className="text-xs fw-bold text-stone-500 mb-6">You must be clocked into your shift to track explicit production stages.</p>
               
               <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert("Stage log recorded successfully!"); setActiveStage(null); }}>
                  <div className="row g-3">
                     <div className="col-12 col-md-6">
                        <select required className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition appearance-none">
                           <option value="">Select Target Batch...</option>
                           <option value="BCH-OX-401">BCH-OX-401</option>
                           <option value="BCH-MS-402">BCH-MS-402</option>
                        </select>
                     </div>
                     <div className="col-12 col-md-6">
                        <select required className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition appearance-none">
                           <option value="">Select Stage...</option>
                           <option value="cutting">Material Cutting</option>
                           <option value="stitching">Upper Stitching</option>
                           <option value="lasting">Lasting & Soling</option>
                        </select>
                     </div>
                  </div>
                  
                  {activeStage ? (
                     <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 d-flex align-items-center justify-content-between animation-pulse">
                        <span className="text-xs fw-black text-amber-700 text-uppercase tracking-widest d-flex align-items-center gap-2">
                           <span className="material-symbols-outlined fs-5">hourglass_empty</span>
                           Timer Running...
                        </span>
                        <button type="button" onClick={() => setActiveStage(null)} className="px-4 py-2 bg-rose-500 text-white rounded-lg text-[9px] fw-black tracking-widest text-uppercase">Stop & Abandon</button>
                     </div>
                  ) : (
                     <button type="button" onClick={() => setActiveStage(true)} className="w-100 py-3 rounded-xl bg-dark text-white text-[10px] fw-black text-uppercase tracking-widest hover:bg-stone-800 transition shadow-sm d-flex justify-content-center align-items-center gap-2">
                        <span className="material-symbols-outlined fs-6">play_arrow</span> start tracking stage
                     </button>
                  )}

                  {activeStage && (
                     <button type="submit" className="w-100 mt-3 py-3 rounded-xl bg-emerald-600 text-white text-[10px] fw-black text-uppercase tracking-widest hover:bg-emerald-700 transition shadow-lg d-flex justify-content-center align-items-center gap-2">
                        <span className="material-symbols-outlined fs-6">check_circle</span> Finish Stage & Submit Log
                     </button>
                  )}
               </form>
            </div>
         </div>
      </div>

      <div className="row g-6">
         <div className="col-12 col-md-6">
            <h4 className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-500 mb-4 px-4">Recent Shifts</h4>
            <div className="glass-panel p-4 rounded-3xl border-stone-100 shadow-sm">
               {shifts.map((s, i) => (
                  <div key={i} className="p-4 bg-stone-50 rounded-2xl mb-2 d-flex justify-content-between align-items-center border border-stone-100">
                     <div>
                        <span className="text-sm fw-black text-dark d-block">{s.date}</span>
                        <span className="text-[10px] fw-bold text-stone-500">{s.station}</span>
                     </div>
                     <div className="text-end">
                        <span className="text-xs fw-bold text-primary d-block">{s.shiftIn} - {s.shiftOut}</span>
                        <span className="text-[10px] fw-black text-stone-400 text-uppercase tracking-widest bg-white px-2 py-1 rounded shadow-sm">Total: {s.duration}</span>
                     </div>
                  </div>
               ))}
            </div>
         </div>
         <div className="col-12 col-md-6">
            <h4 className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-500 mb-4 px-4">Recent Stage Logs</h4>
            <div className="glass-panel p-4 rounded-3xl border-stone-100 shadow-sm">
               {stageLogs.map((log, i) => (
                  <div key={i} className="p-4 bg-stone-50 rounded-2xl mb-2 d-flex justify-content-between align-items-center border border-stone-100">
                     <div>
                        <span className="text-sm fw-black text-dark d-block">{log.stage}</span>
                        <span className="text-[10px] fw-bold text-stone-500">Batch: {log.batch}</span>
                     </div>
                     <div className="text-end">
                        <span className="text-xs fw-bold text-rose-500 d-block">{log.timeSpent}</span>
                        <span className="text-[9px] fw-black text-stone-400 text-uppercase">{log.date}</span>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default ArtisanShiftClock;
