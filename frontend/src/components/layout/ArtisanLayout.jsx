import { useState, useEffect, useRef } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from '../../utils/axiosInstance';

const ArtisanLayout = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  // --- Persistent Check-In / Check-Out State ---
  const [attendanceRecord, setAttendanceRecord] = useState(null);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [elapsedTimer, setElapsedTimer] = useState('00:00:00');
  const timerRef = useRef(null);

  const formatElapsed = (startMs) => {
    const elapsed = Math.max(0, Math.floor((Date.now() - startMs) / 1000));
    const h = String(Math.floor(elapsed / 3600)).padStart(2, '0');
    const m = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0');
    const s = String(elapsed % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const fetchAttendance = async () => {
    if (!user?._id) return;
    try {
      const { data } = await axios.get('/api/hr/attendance');
      const activeRecord = data.find(r => {
        const userId = r.user_id?._id || r.user_id;
        return (
          userId?.toString() === user._id.toString() &&
          !r.check_out
        );
      });
      setAttendanceRecord(activeRecord || null);
    } catch (err) {
      console.error('Attendance fetch error', err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAttendance();
      window.addEventListener('attendanceChanged', fetchAttendance);
    }
    return () => {
      window.removeEventListener('attendanceChanged', fetchAttendance);
    };
  }, [user]);

  // Run timer when checked in
  useEffect(() => {
    clearInterval(timerRef.current);
    if (attendanceRecord?.check_in && !attendanceRecord?.check_out) {
      const startMs = new Date(attendanceRecord.check_in).getTime();
      timerRef.current = setInterval(() => {
        setElapsedTimer(formatElapsed(startMs));
      }, 1000);
    } else {
      setElapsedTimer('00:00:00');
    }
    return () => clearInterval(timerRef.current);
  }, [attendanceRecord]);

  const handleCheckIn = async () => {
    if (!user?._id) return;
    setAttendanceLoading(true);
    try {
      const { data } = await axios.post('/api/hr/attendance', {
        user_id: user._id,
        date: new Date(),
        check_in: new Date(),
        status: 'Present'
      });
      setAttendanceRecord(data);
      window.dispatchEvent(new Event('attendanceChanged'));
    } catch (err) {
      if (err.response?.status === 400) {
        // Already have a record today — re-fetch to show correct state
        await fetchAttendance();
      } else {
        alert(err.response?.data?.message || 'Check-in failed.');
      }
    } finally {
      setAttendanceLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (!attendanceRecord?._id) return;
    setAttendanceLoading(true);
    try {
      const { data } = await axios.put(`/api/hr/attendance/${attendanceRecord._id}`, {
        check_out: new Date(),
        status: 'Completed'
      });
      // Store record with check_out so sidebar shows "Shift Complete"
      setAttendanceRecord(data);
      window.dispatchEvent(new Event('attendanceChanged'));
    } catch (err) {
      alert('Check-out failed.');
    } finally {
      setAttendanceLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', icon: 'dashboard', path: '/artisan' },
    { label: 'Assignments', icon: 'assignment', path: '/artisan/assignments' },
    { label: 'Production Batches', icon: 'precision_manufacturing', path: '/artisan/batches' },
    { label: 'Quality Check', icon: 'verified_user', path: '/artisan/quality-check' },
    { label: 'Shift & Time', icon: 'schedule', path: '/artisan/clock' },
    { label: 'Materials', icon: 'category', path: '/artisan/materials' },
    { label: 'Maintenance', icon: 'build', path: '/artisan/maintenance' },
    { label: 'Workshop Clips', icon: 'videocam', path: '/artisan/clips' },
    { label: 'Messages', icon: 'chat', path: '/artisan/messages' },
  ];

  const isCheckedIn = !!attendanceRecord && !attendanceRecord.check_out;
  const isShiftCompleted = !!attendanceRecord && !!attendanceRecord.check_out;
  const checkInTime = attendanceRecord?.check_in
    ? new Date(attendanceRecord.check_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <div className="d-flex vh-100 overflow-hidden bg-background-light font-display text-dark">
      {/* Premium Dark Espresso Sidebar */}
      <aside className="w-80 flex-shrink-0 bg-dark d-none d-md-flex flex-column h-vh shadow-2xl z-50 position-relative" style={{ overflowY: 'auto' }}>
        <div className="position-absolute top-0 left-0 w-100 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>

        {/* Logo */}
        <div className="p-8 pb-4 flex-shrink-0">
          <Link to="/" className="d-flex align-items-center gap-4 group text-decoration-none">
            <div className="size-12 rounded-2xl bg-primary d-flex align-items-center justify-content-center text-white shadow-[0_0_20px_rgba(189,81,13,0.4)] group-hover:scale-105 transition duration-500">
              <span className="material-symbols-outlined fs-3">handyman</span>
            </div>
            <div>
              <h1 className="font-serif fs-4 fw-black text-white leading-none tracking-tighter mb-0 lowercase">Artisan.Soul</h1>
              <span className="text-[10px] fw-black text-uppercase tracking-[0.3em] text-primary-20">Workshop Portal</span>
            </div>
          </Link>
        </div>

        {/* ── Persistent Workshop Check-In Widget ── */}
        <div className="px-4 mb-4 flex-shrink-0">
          <div className={`rounded-2xl p-4 border transition-all duration-500 ${
            isCheckedIn 
              ? 'bg-emerald-900/40 border-emerald-500/40' 
              : isShiftCompleted 
                ? 'bg-stone-900/60 border-stone-700/50' 
                : 'bg-white/5 border-white/10'
          }`}>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div className="d-flex align-items-center gap-2">
                <span className={`size-2 rounded-full ${
                  isCheckedIn 
                    ? 'bg-emerald-400 animate-pulse' 
                    : isShiftCompleted 
                      ? 'bg-stone-500' 
                      : 'bg-stone-600'
                }`}></span>
                <span className="text-[10px] fw-black text-uppercase tracking-[0.25em] text-white/60">
                  Workshop
                </span>
              </div>
              <span className={`text-[9px] fw-black text-uppercase tracking-widest px-2 py-0.5 rounded-full ${
                isCheckedIn 
                  ? 'bg-emerald-500/20 text-emerald-400' 
                  : isShiftCompleted 
                    ? 'bg-stone-500/20 text-stone-400' 
                    : 'bg-white/5 text-white/30'
              }`}>
                {isCheckedIn ? 'Active' : isShiftCompleted ? 'Completed' : 'Off Shift'}
              </span>
            </div>

            {isCheckedIn && (
              <div className="mb-3">
                <p className="text-[22px] fw-black font-mono text-emerald-400 mb-0 tracking-widest">{elapsedTimer}</p>
                <p className="text-[9px] text-white/40 fw-bold mb-0">Since {checkInTime}</p>
              </div>
            )}

            {isShiftCompleted && !isCheckedIn && (
              <div className="mb-3">
                <p className="text-stone-400 text-xs fw-bold mb-0">Shift ended today.</p>
              </div>
            )}

            <button
              onClick={isCheckedIn ? handleCheckOut : handleCheckIn}
              disabled={attendanceLoading}
              className={`w-100 py-2.5 rounded-xl text-[10px] fw-black text-uppercase tracking-widest transition duration-500 border-0 d-flex align-items-center justify-content-center gap-2 ${
                isCheckedIn
                  ? 'bg-rose-500/20 hover:bg-rose-500 text-rose-400 hover:text-white'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              } ${attendanceLoading ? 'opacity-50' : ''}`}
            >
              {attendanceLoading ? (
                <span className="spinner-border spinner-border-sm" role="status"></span>
              ) : (
                <>
                  <span className="material-symbols-outlined fs-6">
                    {isCheckedIn ? 'logout' : 'login'}
                  </span>
                  {isCheckedIn ? 'Check Out' : 'Check In'}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-grow-1 px-4 space-y-1 pb-4">
          <div className="px-4 mb-3">
            <span className="text-[10px] fw-black text-uppercase tracking-[0.3em] text-white/30">Navigation</span>
          </div>
          {navItems.map((item) => {
            const isActive = currentPath === item.path || (item.path !== '/artisan' && currentPath.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`d-flex align-items-center justify-content-between px-5 py-3 rounded-2xl transition duration-500 group text-decoration-none ${isActive ? 'bg-primary text-white shadow-[0_4px_20px_rgba(189,81,13,0.3)]' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}
              >
                <div className="d-flex align-items-center gap-4">
                  <span className={`material-symbols-outlined fs-5 ${isActive ? 'text-white' : 'group-hover:text-primary transition-colors'}`}>{item.icon}</span>
                  <span className={`text-xs fw-black text-uppercase tracking-widest ${isActive ? 'text-white' : ''}`}>{item.label}</span>
                </div>
                {isActive && (
                  <div className="size-1.5 bg-white rounded-full shadow-[0_0_10px_white]"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Profile Footer */}
        <div className="p-6 border-top border-white/10 bg-black/20 backdrop-blur-sm flex-shrink-0">
          <div className="p-4 rounded-3xl border border-white/10 bg-white/5 d-flex align-items-center justify-content-between group hover:bg-white/10 transition duration-500 cursor-pointer">
            <div className="d-flex align-items-center gap-4">
              <div className="size-11 rounded-2xl bg-stone-800 overflow-hidden border-2 border-primary/50 shadow-sm d-flex align-items-center justify-content-center">
                <span className="material-symbols-outlined text-white/60">person</span>
              </div>
              <div className="d-flex flex-column">
                <span className="text-xs fw-black text-white tracking-tight">{user?.name || 'Artisan'}</span>
                <span className="text-[9px] fw-black text-uppercase tracking-widest text-primary">Master Craftsman</span>
              </div>
            </div>
            <button onClick={handleLogout} className="size-8 bg-transparent border-0 rounded-lg d-flex align-items-center justify-content-center text-white/30 hover:text-rose-500 hover:bg-white/5 transition duration-500">
              <span className="material-symbols-outlined fs-5">logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow-1 overflow-y-auto w-100 bg-background-light">
        <Outlet />
      </main>
    </div>
  );
};

export default ArtisanLayout;
