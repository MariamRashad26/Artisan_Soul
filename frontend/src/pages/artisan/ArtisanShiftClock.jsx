import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from '../../utils/axiosInstance';
import { useAuth } from '../../context/AuthContext';

const STAGES = ['Design Prep', 'Cutting', 'Lasting', 'Stitching', 'Finished'];

const formatElapsed = (startMs) => {
  const elapsed = Math.floor((Date.now() - startMs) / 1000);
  const h = String(Math.floor(elapsed / 3600)).padStart(2, '0');
  const m = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0');
  const s = String(elapsed % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
};

const ArtisanShiftClock = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const queryOrderId = searchParams.get('order_id') || '';
  const queryStage = searchParams.get('stage') || '';

  // --- Shift State ---
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [activeShiftId, setActiveShiftId] = useState(null);
  const [shiftStart, setShiftStart] = useState(null);
  const [shiftTimer, setShiftTimer] = useState('00:00:00');
  const shiftIntervalRef = useRef(null);

  // --- Stage Tracker State ---
  const [myOrders, setMyOrders] = useState([]);        // artisan's assigned orders
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [selectedStage, setSelectedStage] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [stageStart, setStageStart] = useState(null);
  const [stageTimer, setStageTimer] = useState('00:00:00');
  const stageIntervalRef = useRef(null);

  // --- History ---
  const [shifts, setShifts] = useState([]);
  const [stageLogs, setStageLogs] = useState([]);   // per-order time logs
  const [orderTimeSummary, setOrderTimeSummary] = useState({}); // orderId → total minutes

  const fetchData = useCallback(async () => {
    if (!user?._id) return;
    try {
      const [shiftRes, woRes] = await Promise.all([
        axios.get('/api/hr/shifts'),
        axios.get('/api/work-orders')
      ]);

      // Filter shifts for this artisan
      const myShifts = shiftRes.data
        .filter(s => (s.user_id?._id || s.user_id) === user._id)
        .sort((a, b) => new Date(b.shift_date) - new Date(a.shift_date));

      const active = myShifts.find(s => !s.clock_out);
      if (active) {
        setIsClockedIn(true);
        setActiveShiftId(active._id);
        const startMs = new Date(active.clock_in).getTime();
        setShiftStart(startMs);
        setShiftTimer(formatElapsed(startMs));
      } else {
        setIsClockedIn(false);
        setActiveShiftId(null);
        setShiftStart(null);
      }

      setShifts(myShifts.slice(0, 7).map(s => ({
        date: new Date(s.shift_date).toLocaleDateString(),
        clockIn: s.clock_in ? new Date(s.clock_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—',
        clockOut: s.clock_out ? new Date(s.clock_out).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Active',
        duration: s.total_hours ? `${s.total_hours.toFixed(1)}h` : 'Ongoing'
      })));

      // Build order list from work orders assigned to this artisan
      const currentUserId = user._id.toString();
      const currentUserName = (user.name || '').toLowerCase();
      const assignedWOs = (woRes.data || []).filter(wo => {
        if (!wo) return false;
        const woId = (wo.assigned_to?._id || wo.assigned_to || '').toString();
        const woName = (wo.assigned_to?.name || '').toLowerCase();
        return (currentUserId && woId === currentUserId) || (currentUserName && woName === currentUserName);
      });

      const loadedOrders = assignedWOs.map(wo => ({
        _id: wo.order_id?._id || wo.order_id,
        orderId: wo.order_id?.orderId || '—',
        model: wo.order_id?.model || 'Workshop Order',
        phase: wo.order_id?.phase || 'Design Prep',
        patron: wo.order_id?.patron || '—'
      })).filter(o => o._id);

      setMyOrders(loadedOrders);

      // Pre-select matching order and stage from URL parameters
      if (loadedOrders.length > 0) {
        const match = loadedOrders.find(o => 
          o._id?.toString() === queryOrderId || 
          o.orderId === queryOrderId || 
          o.orderId === `#${queryOrderId}` ||
          o.orderId?.replace('#', '') === queryOrderId
        );
        if (match) {
          setSelectedOrderId(match._id);
        }
        if (queryStage && STAGES.includes(queryStage)) {
          setSelectedStage(queryStage);
        }
      }

    } catch {
      console.error('Error fetching shift data');
    }
  }, [user, queryOrderId, queryStage]);

  // Load stage logs from localStorage (persisted per artisan)
  const loadStageLogs = useCallback(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(`stageLogs_${user?._id}`) || '[]');
      setStageLogs(stored);

      // Build order time summary
      const summary = {};
      stored.forEach(log => {
        if (!summary[log.orderId]) summary[log.orderId] = 0;
        summary[log.orderId] += log.durationMin || 0;
      });
      setOrderTimeSummary(summary);
    } catch { /* ignored */ }
  }, [user]);

  useEffect(() => {
    if (user) {
      const load = async () => {
        await fetchData();
        loadStageLogs();
      };
      load();
    }
  }, [user, fetchData, loadStageLogs]);

  // Live shift timer tick
  useEffect(() => {
    if (isClockedIn && shiftStart) {
      shiftIntervalRef.current = setInterval(() => {
        setShiftTimer(formatElapsed(shiftStart));
      }, 1000);
    }
    return () => clearInterval(shiftIntervalRef.current);
  }, [isClockedIn, shiftStart]);

  // Live stage timer tick
  useEffect(() => {
    if (isTracking && stageStart) {
      stageIntervalRef.current = setInterval(() => {
        setStageTimer(formatElapsed(stageStart));
      }, 1000);
    } else {
      clearInterval(stageIntervalRef.current);
    }
    return () => clearInterval(stageIntervalRef.current);
  }, [isTracking, stageStart]);

  const toggleClock = async () => {
    try {
      if (isClockedIn && activeShiftId) {
        await axios.put(`/api/hr/shifts/${activeShiftId}`, {
          clock_out: new Date(),
          status: 'completed'
        });
        // Auto-stop any active stage tracking
        if (isTracking) handleStopTracking(true);
      } else {
        await axios.post('/api/hr/shifts', {
          user_id: user._id,
          shift_date: new Date(),
          shift_type: 'Morning',
          clock_in: new Date(),
          status: 'active'
        });
      }
      await fetchData();
    } catch {
      console.error('Error updating shift');
      alert('Error updating shift');
    }
  };

  const handleStartTracking = () => {
    if (!selectedOrderId || !selectedStage) {
      alert('Select an order and a stage to start tracking.');
      return;
    }
    const now = Date.now();
    setIsTracking(true);
    setStageStart(now);
    setStageTimer('00:00:00');
  };

  const handleStopTracking = async (abandoned = false) => {
    clearInterval(stageIntervalRef.current);
    if (!abandoned && stageStart) {
      const durationMin = Math.max(1, Math.round((Date.now() - stageStart) / 60000));
      const order = myOrders.find(o => o._id === selectedOrderId);
      const newLog = {
        id: Date.now(),
        orderId: selectedOrderId,
        orderRef: order?.orderId || '—',
        model: order?.model || '—',
        stage: selectedStage,
        durationMin,
        durationDisplay: durationMin < 60 ? `${durationMin} min` : `${(durationMin / 60).toFixed(1)} hrs`,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      const updated = [newLog, ...stageLogs].slice(0, 20);
      setStageLogs(updated);
      localStorage.setItem(`stageLogs_${user?._id}`, JSON.stringify(updated));

      // Update order time summary
      setOrderTimeSummary(prev => ({
        ...prev,
        [selectedOrderId]: (prev[selectedOrderId] || 0) + durationMin
      }));

      // Synchronize with backend Order Logs
      try {
        const orderIdEncoded = encodeURIComponent(order?.orderId || '');
        if (orderIdEncoded) {
          const { data: orderData } = await axios.get(`/api/orders/${orderIdEncoded}`);
          const newOrderLog = {
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            log: `${user?.name || 'Artisan'} logged ${newLog.durationDisplay} on ${selectedStage} stage.`,
            user: true
          };
          const updatedLogs = [newOrderLog, ...(orderData.logs || [])];
          await axios.put(`/api/orders/${orderIdEncoded}`, { logs: updatedLogs });
        }
      } catch {
        console.error('Failed to sync stage log to order history');
      }
    }
    setIsTracking(false);
    setStageStart(null);
    setStageTimer('00:00:00');
    if (!abandoned) { setSelectedStage(''); }
  };

  return (
    <div className="min-vh-100 bg-background-light font-display text-dark lg:pb-20">
      <header className="bg-white/80 backdrop-blur-xl border-bottom border-stone-200 px-6 lg:px-12 py-6 sticky-top z-40 shadow-sm animate-in slide-in-from-top duration-700">
        <div className="max-w-7xl mx-auto d-flex align-items-center gap-5">
          <Link to="/artisan" className="size-12 rounded-xl bg-stone-50 border border-stone-200 d-flex align-items-center justify-content-center text-stone-400 hover:text-dark transition duration-500 shadow-sm group">
            <span className="material-symbols-outlined fs-4 group-hover:-translate-x-1 transition-transform">arrow_back</span>
          </Link>
          <div>
            <div className="d-flex align-items-center gap-3 text-primary mb-1">
              <span className="material-symbols-outlined fs-6">schedule</span>
              <span className="text-[10px] fw-black text-uppercase tracking-[0.3em]">Shift & Production Time</span>
            </div>
            <h1 className="display-6 fw-black font-serif text-dark tracking-tighter mb-0 lowercase">Shift.Station</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-10 animate-in fade-in slide-in-from-bottom duration-1000">

        {/* HOW IT WORKS banner */}
        <div className="mb-8 p-5 bg-stone-900 rounded-2xl text-white">
          <div className="row g-4">
          {[
            { icon: 'login', step: '1', title: 'Clock In', desc: 'Start your shift when you arrive at the workshop' },
            { icon: 'timer', step: '2', title: 'Track Each Stage', desc: 'Select your assigned order + stage → start timer → stop when done' },
            { icon: 'logout', step: '3', title: 'Clock Out', desc: 'End your shift — total hours are recorded automatically' }
          ].map((s, i) => (
            <div key={i} className="col-12 col-sm-4 d-flex align-items-start gap-3">
              <div className="size-10 bg-primary rounded-xl d-flex align-items-center justify-content-center text-white flex-shrink-0">
                <span className="material-symbols-outlined fs-6">{s.icon}</span>
              </div>
              <div>
                <p className="text-[9px] fw-black text-primary text-uppercase tracking-widest mb-1">Step {s.step}</p>
                <p className="text-sm fw-black text-white mb-0">{s.title}</p>
                <p className="text-[10px] text-white/50 mb-0">{s.desc}</p>
              </div>
            </div>
          ))}
          </div>
        </div>

        <div className="row g-6 mb-8">
          {/* SHIFT CLOCK */}
          <div className="col-12 col-lg-4">
            <div className={`glass-panel p-8 rounded-[2.5rem] shadow-premium text-center h-100 d-flex flex-column align-items-center justify-content-center transition-all duration-700 ${isClockedIn ? 'border-2 border-emerald-400 shadow-emerald-400/20' : 'border border-stone-100'}`}>
              <div className={`size-24 mx-auto rounded-full d-flex align-items-center justify-content-center mb-5 transition-colors duration-500 ${isClockedIn ? 'bg-emerald-100 text-emerald-600' : 'bg-stone-100 text-stone-400'}`}>
                <span className="material-symbols-outlined fs-1">person_pin_circle</span>
              </div>
              <p className="text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-400 mb-2">
                {isClockedIn ? 'Shift Active' : 'Off Shift'}
              </p>
              {isClockedIn && (
                <p className="display-6 fw-black font-mono text-emerald-600 mb-4 tracking-widest">{shiftTimer}</p>
              )}
              <button
                onClick={toggleClock}
                className={`w-100 py-4 rounded-2xl text-[11px] fw-black text-uppercase tracking-widest transition duration-500 ${isClockedIn ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-lg' : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg'}`}
              >
                {isClockedIn ? '⏹ Clock Out' : '▶ Clock In'}
              </button>
              {!isClockedIn && (
                <p className="text-[10px] text-stone-400 fw-bold mt-3 mb-0">You must clock in before tracking stages</p>
              )}
            </div>
          </div>

          {/* STAGE TRACKER */}
          <div className="col-12 col-lg-8">
            <div className={`glass-panel p-8 rounded-[2.5rem] shadow-premium h-100 transition-all duration-500 ${!isClockedIn ? 'opacity-40 pointer-events-none' : ''}`}>
              <h3 className="fs-5 fw-black text-dark mb-1">Stage Time Tracker</h3>
              <p className="text-[10px] text-stone-500 fw-bold mb-6 text-uppercase tracking-widest">
                Track exactly how long each production stage takes per order
              </p>

              <div className="row g-4 mb-5">
                <div className="col-12 col-md-6">
                  <label className="text-[10px] fw-black text-uppercase tracking-widest text-stone-500 mb-2 d-block">Assigned Order</label>
                  <select
                    value={selectedOrderId}
                    onChange={e => setSelectedOrderId(e.target.value)}
                    disabled={isTracking}
                    className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-bold text-dark outline-none appearance-none"
                  >
                    <option value="">Select your order...</option>
                    {myOrders.map(o => (
                      <option key={o._id} value={o._id}>
                        {o.orderId} — {o.model} ({o.patron})
                      </option>
                    ))}
                  </select>
                  {myOrders.length === 0 && (
                    <p className="text-[10px] text-amber-600 fw-bold mt-1 mb-0">No orders assigned yet. Ask admin to assign you.</p>
                  )}
                </div>
                <div className="col-12 col-md-6">
                  <label className="text-[10px] fw-black text-uppercase tracking-widest text-stone-500 mb-2 d-block">Production Stage</label>
                  <select
                    value={selectedStage}
                    onChange={e => setSelectedStage(e.target.value)}
                    disabled={isTracking}
                    className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-bold text-dark outline-none appearance-none"
                  >
                    <option value="">Select stage...</option>
                    {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {isTracking ? (
                <div className="p-6 bg-amber-50 border-2 border-amber-300 rounded-2xl d-flex align-items-center justify-content-between mb-4">
                  <div className="d-flex align-items-center gap-4">
                    <span className="size-3 bg-amber-500 rounded-full animate-pulse d-inline-block"></span>
                    <div>
                      <p className="fw-black text-amber-800 mb-0 text-sm">Tracking: {selectedStage}</p>
                      <p className="text-amber-600 text-xs fw-bold mb-0">Order: {myOrders.find(o => o._id === selectedOrderId)?.orderId}</p>
                    </div>
                  </div>
                  <p className="display-6 fw-black font-mono text-amber-700 mb-0">{stageTimer}</p>
                </div>
              ) : null}

              <div className="d-flex gap-3">
                {!isTracking ? (
                  <button
                    onClick={handleStartTracking}
                    className="flex-grow-1 py-3 rounded-xl bg-dark text-white fw-black text-[10px] text-uppercase tracking-widest d-flex align-items-center justify-content-center gap-2 hover:bg-stone-800 transition shadow-md"
                  >
                    <span className="material-symbols-outlined fs-6">play_arrow</span> Start Stage Timer
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => handleStopTracking(false)}
                      className="flex-grow-1 py-3 rounded-xl bg-emerald-600 text-white fw-black text-[10px] text-uppercase tracking-widest d-flex align-items-center justify-content-center gap-2 hover:bg-emerald-700 transition shadow-md"
                    >
                      <span className="material-symbols-outlined fs-6">check_circle</span> Finish & Log
                    </button>
                    <button
                      onClick={() => handleStopTracking(true)}
                      className="px-5 py-3 rounded-xl bg-rose-100 text-rose-600 fw-black text-[10px] text-uppercase tracking-widest hover:bg-rose-200 transition"
                    >
                      Abandon
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ORDER TIME SUMMARY */}
        {Object.keys(orderTimeSummary).length > 0 && (
          <section className="mb-8">
            <h4 className="text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-500 mb-4">⏱ Time Invested Per Order</h4>
            <div className="row g-4">
              {myOrders.filter(o => orderTimeSummary[o._id]).map(o => {
                const totalMin = orderTimeSummary[o._id] || 0;
                const display = totalMin < 60 ? `${totalMin} min` : `${(totalMin / 60).toFixed(1)} hrs`;
                return (
                  <div key={o._id} className="col-md-4">
                    <div className="glass-panel p-5 rounded-2xl shadow-sm border-stone-100 d-flex gap-4 align-items-center">
                      <div className="size-12 bg-primary/10 rounded-xl d-flex align-items-center justify-content-center text-primary">
                        <span className="material-symbols-outlined">hourglass_bottom</span>
                      </div>
                      <div>
                        <p className="fw-black text-dark mb-0 text-sm">{o.orderId}</p>
                        <p className="text-xs text-stone-500 mb-0 font-serif italic">{o.model}</p>
                        <p className="fw-black text-primary text-sm mb-0">{display} logged</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* HISTORY */}
        <div className="row g-6">
          <div className="col-12 col-md-6">
            <h4 className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-500 mb-4">Recent Shifts</h4>
            <div className="glass-panel p-4 rounded-3xl shadow-sm border-stone-100">
              {shifts.length === 0 ? (
                <p className="text-center text-xs fw-bold text-stone-400 py-4">No shifts recorded yet.</p>
              ) : shifts.map((s, i) => (
                <div key={i} className="p-4 bg-stone-50 rounded-2xl mb-2 d-flex justify-content-between align-items-center border border-stone-100">
                  <div>
                    <span className="text-sm fw-black text-dark d-block">{s.date}</span>
                    <span className="text-[10px] fw-bold text-stone-500">{s.clockIn} → {s.clockOut}</span>
                  </div>
                  <span className={`text-xs fw-black px-3 py-1 rounded-full ${s.clockOut === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-100 text-stone-600'}`}>
                    {s.duration}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="col-12 col-md-6">
            <h4 className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-500 mb-4">Stage Log History</h4>
            <div className="glass-panel p-4 rounded-3xl shadow-sm border-stone-100">
              {stageLogs.length === 0 ? (
                <p className="text-center text-xs fw-bold text-stone-400 py-4">No stage logs yet. Use the tracker above.</p>
              ) : stageLogs.slice(0, 8).map((log, i) => (
                <div key={i} className="p-4 bg-stone-50 rounded-2xl mb-2 d-flex justify-content-between align-items-center border border-stone-100">
                  <div>
                    <span className="text-sm fw-black text-dark d-block">{log.stage}</span>
                    <span className="text-[10px] fw-bold text-stone-500">{log.orderRef} · {log.date}</span>
                  </div>
                  <span className="text-xs fw-black text-primary bg-primary/10 px-3 py-1 rounded-full">{log.durationDisplay}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default ArtisanShiftClock;
