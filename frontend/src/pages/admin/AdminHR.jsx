import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from '../../utils/axiosInstance';
import * as hrService from '../../services/hrService';

const AdminHR = () => {
  const [activeTab, setActiveTab] = useState('salaries'); // 'salaries', 'shifts', 'attendance'

  // Data states
  const [salaries, setSalaries] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Custom Toast State
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Delete Confirmation State
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null, type: '' });

  // Modals visibility states
  const [shiftModal, setShiftModal] = useState({ show: false, mode: 'add', data: null });
  const [salaryModal, setSalaryModal] = useState({ show: false, mode: 'add', data: null });
  const [attendanceModal, setAttendanceModal] = useState({ show: false, mode: 'add', data: null });

  // Form states
  const [shiftForm, setShiftForm] = useState({
    user_id: '',
    shift_date: '',
    shift_type: 'Morning',
    clock_in: '',
    clock_out: '',
    status: 'scheduled'
  });

  const [salaryForm, setSalaryForm] = useState({
    user_id: '',
    amount: '',
    month: '',
    status: 'Pending',
    payment_date: ''
  });

  const [attendanceForm, setAttendanceForm] = useState({
    user_id: '',
    date: '',
    check_in: '',
    check_out: '',
    status: 'Present'
  });

  const showToast = useCallback((message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  }, []);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      const [salariesData, shiftsData, attendanceData] = await Promise.all([
        hrService.getSalaries(),
        hrService.getShifts(),
        hrService.getAttendance(),
      ]);
      setSalaries(salariesData);
      setShifts(shiftsData);
      console.log('Shifts loaded', shiftsData);
      setAttendance(attendanceData);
    } catch (err) {
      console.error('Failed to load core HR data', err);
      showToast('Error loading core HR data.', 'error');
    }
    // Fetch users separately; failure shouldn't block other data
    try {
      const usersRes = await axios.get('/api/auth/users?role=artisan');
      setUsers(usersRes.data);
    } catch (err) {
      console.error('Failed to load artisan users', err);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    // Refetch data on tab change to keep UI up-to-date
    fetchAllData();
  }, [activeTab, fetchAllData]);

  // Auto-refresh shifts every 10 seconds when on Shifts tab
  useEffect(() => {
    if (activeTab !== 'shifts') return;
    const interval = setInterval(() => {
      fetchAllData();
    }, 10000);
    return () => clearInterval(interval);
  }, [activeTab, fetchAllData]);

  // Format date helper
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Format time helper
  const formatTime = (timeStr) => {
    if (!timeStr) return '--:--';
    return new Date(timeStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Search & Filter Logic — only show artisan-linked records, never admin accounts
  const filteredSalaries = salaries.filter(s => {
    const isArtisan = s.user_id?.role === 'artisan';
    const employeeName = s.user_id?.name || '';
    const matchesSearch = employeeName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || (s.status && s.status.toLowerCase() === statusFilter.toLowerCase());
    return isArtisan && matchesSearch && matchesStatus;
  });

  // Filter shifts to show only artisans and apply search/status filters
  const filteredShifts = shifts.filter(shift => {
    const isArtisan = shift.user_id?.role === 'artisan';
    const employeeName = shift.user_id?.name || '';
    const matchesSearch = employeeName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || (shift.status && shift.status.toLowerCase() === statusFilter.toLowerCase());
    return isArtisan && matchesSearch && matchesStatus;
  });
  console.log('Filtered shifts count:', filteredShifts.length);


  const filteredAttendance = attendance.filter(a => {
    const isArtisan = a.user_id?.role === 'artisan';
    const employeeName = a.user_id?.name || '';
    const matchesSearch = employeeName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || (a.status && a.status.toLowerCase() === statusFilter.toLowerCase());
    return isArtisan && matchesSearch && matchesStatus;
  });

  // Shifts CRUD Actions
  const handleOpenShiftModal = (mode, data = null) => {
    if (mode === 'edit' && data) {
      setShiftForm({
        user_id: data.user_id?._id || '',
        shift_date: data.shift_date ? new Date(data.shift_date).toISOString().split('T')[0] : '',
        shift_type: data.shift_type || 'Morning',
        clock_in: data.clock_in ? new Date(data.clock_in).toISOString().slice(0, 16) : '',
        clock_out: data.clock_out ? new Date(data.clock_out).toISOString().slice(0, 16) : '',
        status: data.status || 'scheduled'
      });
    } else {
      setShiftForm({
        user_id: users.find(u => u.role === 'artisan')?._id || users[0]?._id || '',
        shift_date: new Date().toISOString().split('T')[0],
        shift_type: 'Morning',
        clock_in: '',
        clock_out: '',
        status: 'scheduled'
      });
    }
    setShiftModal({ show: true, mode, data });
  };

  const handleSaveShift = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...shiftForm,
        clock_in: shiftForm.clock_in ? new Date(shiftForm.clock_in) : undefined,
        clock_out: shiftForm.clock_out ? new Date(shiftForm.clock_out) : undefined
      };

      if (shiftModal.mode === 'edit') {
        await hrService.updateShift(shiftModal.data._id, payload);
        showToast('Shift details updated successfully.');
      } else {
        await hrService.createShift(payload);
        showToast('Shift created and assigned successfully.');
      }
      fetchAllData();
      setShiftModal({ show: false, mode: 'add', data: null });
    } catch (err) {
      console.error(err);
      showToast('Failed to save shift.', 'error');
    }
  };

  // Salaries CRUD Actions
  const handleOpenSalaryModal = (mode, data = null) => {
    if (mode === 'edit' && data) {
      setSalaryForm({
        user_id: data.user_id?._id || '',
        amount: data.amount || '',
        month: data.month || '',
        status: data.status || 'Pending',
        payment_date: data.payment_date ? new Date(data.payment_date).toISOString().split('T')[0] : ''
      });
    } else {
      setSalaryForm({
        user_id: users.find(u => u.role === 'artisan')?._id || users[0]?._id || '',
        amount: '',
        month: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
        status: 'Pending',
        payment_date: ''
      });
    }
    setSalaryModal({ show: true, mode, data });
  };

  const handleSaveSalary = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...salaryForm,
        amount: Number(salaryForm.amount),
        payment_date: salaryForm.payment_date ? new Date(salaryForm.payment_date) : undefined
      };

      if (salaryModal.mode === 'edit') {
        await hrService.updateSalary(salaryModal.data._id, payload);
        showToast('Salary record updated successfully.');
      } else {
        await hrService.createSalary(payload);
        showToast('Salary payroll record issued.');
      }
      fetchAllData();
      setSalaryModal({ show: false, mode: 'add', data: null });
    } catch (err) {
      console.error(err);
      showToast('Failed to save salary.', 'error');
    }
  };

  // Attendance CRUD Actions
  const handleOpenAttendanceModal = (mode, data = null) => {
    if (mode === 'edit' && data) {
      setAttendanceForm({
        user_id: data.user_id?._id || '',
        date: data.date ? new Date(data.date).toISOString().split('T')[0] : '',
        check_in: data.check_in ? new Date(data.check_in).toISOString().slice(0, 16) : '',
        check_out: data.check_out ? new Date(data.check_out).toISOString().slice(0, 16) : '',
        status: data.status || 'Present'
      });
    } else {
      setAttendanceForm({
        user_id: users.find(u => u.role === 'artisan')?._id || users[0]?._id || '',
        date: new Date().toISOString().split('T')[0],
        check_in: new Date().toISOString().slice(0, 16),
        check_out: '',
        status: 'Present'
      });
    }
    setAttendanceModal({ show: true, mode, data });
  };

  const handleSaveAttendance = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...attendanceForm,
        check_in: attendanceForm.check_in ? new Date(attendanceForm.check_in) : undefined,
        check_out: attendanceForm.check_out ? new Date(attendanceForm.check_out) : undefined
      };

      if (attendanceModal.mode === 'edit') {
        await hrService.updateAttendance(attendanceModal.data._id, payload);
        showToast('Attendance record adjusted successfully.');
      } else {
        await hrService.createAttendance(payload);
        showToast('Attendance logged successfully.');
      }
      fetchAllData();
      setAttendanceModal({ show: false, mode: 'add', data: null });
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || 'Failed to save attendance.', 'error');
    }
  };

  // Delete Actions
  const triggerDelete = (id, type) => {
    setDeleteModal({ show: true, id, type });
  };

  const confirmDelete = async () => {
    const { id, type } = deleteModal;
    try {
      if (type === 'shift') {
        await hrService.deleteShift(id);
        showToast('Shift record deleted successfully.');
      } else if (type === 'salary') {
        await hrService.deleteSalary(id);
        showToast('Salary payroll record removed.');
      } else if (type === 'attendance') {
        await hrService.deleteAttendance(id);
        showToast('Attendance record removed.');
      }
      fetchAllData();
    } catch (err) {
      console.error(err);
      showToast('Failed to delete record.', 'error');
    } finally {
      setDeleteModal({ show: false, id: null, type: '' });
    }
  };

  return (
    <div className="p-8 lg:p-12 animate-in fade-in duration-1000">
      {/* Immersive Dashboard Header */}
      <section className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-6 mb-12">
        <div>
          <nav className="d-flex align-items-center gap-3 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700 mb-4">
            <Link to="/admin" className="hover:text-dark transition">Operations</Link>
            <span className="material-symbols-outlined fs-6 text-stone-200">chevron_right</span>
            <span className="text-primary">Human Resources</span>
          </nav>
          <h1 className="display-4 fw-black font-serif text-dark tracking-tighter mb-0 lowercase">Staff.Management</h1>
        </div>
        
        <div className="d-flex gap-4">
          {activeTab === 'salaries' && (
            <button onClick={() => handleOpenSalaryModal('add')} className="px-8 py-3.5 rounded-2xl bg-dark hover:bg-stone-800 text-white text-[10px] fw-black text-uppercase tracking-widest shadow-2xl hover:-translate-y-1 transition duration-500 d-flex align-items-center gap-3 border-0">
              <span className="material-symbols-outlined fs-5">payments</span>
              Issue Payroll
            </button>
          )}
          {activeTab === 'shifts' && (
            <button onClick={() => handleOpenShiftModal('add')} className="px-8 py-3.5 rounded-2xl bg-dark hover:bg-stone-800 text-white text-[10px] fw-black text-uppercase tracking-widest shadow-2xl hover:-translate-y-1 transition duration-500 d-flex align-items-center gap-3 border-0">
              <span className="material-symbols-outlined fs-5">schedule</span>
              Assign Shift
            </button>
          )}
          {activeTab === 'attendance' && (
            <button onClick={() => handleOpenAttendanceModal('add')} className="px-8 py-3.5 rounded-2xl bg-dark hover:bg-stone-800 text-white text-[10px] fw-black text-uppercase tracking-widest shadow-2xl hover:-translate-y-1 transition duration-500 d-flex align-items-center gap-3 border-0">
              <span className="material-symbols-outlined fs-5">assignment_ind</span>
              Log Attendance
            </button>
          )}
        </div>
      </section>

      {/* Tabs */}
      <div className="d-flex gap-4 mb-8 border-bottom border-stone-200 pb-4 flex-wrap">
        <button 
          onClick={() => { setActiveTab('salaries'); setStatusFilter('all'); }}
          className={`text-xs fw-black text-uppercase tracking-widest px-6 py-2.5 rounded-full transition-all duration-300 border-0 ${activeTab === 'salaries' ? 'bg-dark text-white shadow-md' : 'text-stone-500 hover:bg-stone-100'}`}
        >
          Salaries & Payroll
        </button>
        <button 
          onClick={() => { setActiveTab('shifts'); setStatusFilter('all'); }}
          className={`text-xs fw-black text-uppercase tracking-widest px-6 py-2.5 rounded-full transition-all duration-300 border-0 ${activeTab === 'shifts' ? 'bg-dark text-white shadow-md' : 'text-stone-500 hover:bg-stone-100'}`}
        >
          Shift Management
        </button>
        <button 
          onClick={() => { setActiveTab('attendance'); setStatusFilter('all'); }}
          className={`text-xs fw-black text-uppercase tracking-widest px-6 py-2.5 rounded-full transition-all duration-300 border-0 ${activeTab === 'attendance' ? 'bg-dark text-white shadow-md' : 'text-stone-500 hover:bg-stone-100'}`}
        >
          Attendance Logs
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="d-flex flex-column flex-md-row gap-4 mb-8">
        <div className="flex-grow-1 relative">
          <input 
            type="text" 
            placeholder="Search employees by name..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-100 px-5 py-3 rounded-2xl bg-white border border-stone-200 outline-none text-sm fw-medium focus:border-stone-800 transition shadow-sm"
          />
        </div>
        <div className="d-flex gap-3">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-5 py-3 rounded-2xl bg-white border border-stone-200 outline-none text-sm fw-medium focus:border-stone-800 transition appearance-none shadow-sm cursor-pointer"
          >
            <option value="all">All Statuses</option>
            {activeTab === 'salaries' && (
              <>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
              </>
            )}
            {activeTab === 'shifts' && (
              <>
                <option value="scheduled">Scheduled</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </>
            )}
            {activeTab === 'attendance' && (
              <>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="late">Late</option>
                <option value="completed">Completed</option>
              </>
            )}
          </select>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="glass-panel rounded-[3rem] border-stone-100 shadow-premium overflow-hidden bg-white">
        {loading ? (
          <div className="text-center py-20">
            <span className="material-symbols-outlined fs-1 text-stone-300 animate-spin-slow">sync</span>
            <p className="text-stone-400 text-xs fw-bold uppercase tracking-widest mt-4">Syncing employee records...</p>
          </div>
        ) : (
          <>
            {/* Tab: Salaries */}
            {activeTab === 'salaries' && (
              <div className="table-responsive">
                <table className="w-100 text-start align-middle">
                  <thead className="bg-stone-50/50">
                    <tr>
                      <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Employee</th>
                      <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Role</th>
                      <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Month</th>
                      <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Amount</th>
                      <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Payment Date</th>
                      <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Status</th>
                      <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700 text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-50">
                    {filteredSalaries.length > 0 ? (
                      filteredSalaries.map((sal, i) => (
                        <tr key={i} className="group hover:bg-stone-50/50 transition-all duration-500">
                          <td className="px-10 py-8">
                            <span className="text-sm fw-black text-dark tracking-tight d-block">{sal.user_id?.name || 'Unknown'}</span>
                            <span className="text-[9px] text-stone-400 fw-bold">{sal.user_id?.email || 'N/A'}</span>
                          </td>
                          <td className="px-10 py-8 text-xs fw-bold text-stone-600 text-capitalize">{sal.user_id?.role || 'Staff'}</td>
                          <td className="px-10 py-8 text-xs fw-bold text-stone-500">{sal.month}</td>
                          <td className="px-10 py-8 text-xs fw-black text-stone-700">${sal.amount.toLocaleString()}</td>
                          <td className="px-10 py-8 text-xs fw-bold text-stone-500">{formatDate(sal.payment_date)}</td>
                          <td className="px-10 py-8">
                            <span className={`text-[9px] fw-black text-uppercase tracking-widest px-3 py-1.5 rounded-pill ${
                              sal.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                            }`}>
                              {sal.status}
                            </span>
                          </td>
                          <td className="px-10 py-8 text-end">
                            <div className="d-flex justify-content-end gap-3">
                              <button onClick={() => handleOpenSalaryModal('edit', sal)} className="btn btn-sm btn-outline-dark rounded-xl px-3.5 py-1.5 text-[9px] fw-black text-uppercase tracking-widest transition">
                                Edit
                              </button>
                              <button onClick={() => triggerDelete(sal._id, 'salary')} className="btn btn-sm btn-outline-rose rounded-xl px-3.5 py-1.5 text-[9px] fw-black text-uppercase tracking-widest transition">
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center py-20 text-stone-400 text-sm fw-medium">No salary records found matching the criteria.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Tab: Shifts */}
            {activeTab === 'shifts' && (
              <div className="table-responsive">
                <table className="w-100 text-start align-middle">
                  <thead className="bg-stone-50/50">
                    <tr>
                      <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Staff Member</th>
                      <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Date</th>
                      <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Shift Type</th>
                      <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Timings</th>
                      <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Status</th>
                      <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700 text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-50">
                    {filteredShifts.length > 0 ? (
                      filteredShifts.map((shift, i) => (
                        <tr key={i} className="group hover:bg-stone-50/50 transition-all duration-500">
                          <td className="px-10 py-8">
                            <span className="text-sm fw-black text-dark tracking-tight d-block">{shift.user_id?.name || 'Unknown'}</span>
                            <span className="text-[9px] text-stone-400 fw-bold">{shift.user_id?.email || 'N/A'}</span>
                          </td>
                          <td className="px-10 py-8 text-xs fw-bold text-stone-600">{formatDate(shift.shift_date)}</td>
                          <td className="px-10 py-8 text-xs fw-black text-stone-700 text-capitalize">{shift.shift_type}</td>
                          <td className="px-10 py-8 text-xs fw-bold text-stone-500">
                            {formatTime(shift.clock_in)} - {formatTime(shift.clock_out)}
                          </td>
                          <td className="px-10 py-8">
                            <span className={`text-[9px] fw-black text-uppercase tracking-widest px-3 py-1.5 rounded-pill ${
                              shift.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                              shift.status === 'active' ? 'bg-amber-100 text-amber-700' :
                              'bg-stone-100 text-stone-600'
                            }`}>
                              {shift.status}
                            </span>
                          </td>
                          <td className="px-10 py-8 text-end">
                            <div className="d-flex justify-content-end gap-3">
                              <button onClick={() => handleOpenShiftModal('edit', shift)} className="btn btn-sm btn-outline-dark rounded-xl px-3.5 py-1.5 text-[9px] fw-black text-uppercase tracking-widest transition">
                                Edit
                              </button>
                              <button onClick={() => triggerDelete(shift._id, 'shift')} className="btn btn-sm btn-outline-rose rounded-xl px-3.5 py-1.5 text-[9px] fw-black text-uppercase tracking-widest transition">
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center py-20 text-stone-400 text-sm fw-medium">No shifts found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Tab: Attendance */}
            {activeTab === 'attendance' && (
              <div className="table-responsive">
                <table className="w-100 text-start align-middle">
                  <thead className="bg-stone-50/50">
                    <tr>
                      <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Artisan</th>
                      <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Date</th>
                      <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Check In</th>
                      <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Check Out</th>
                      <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Status</th>
                      <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700 text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-50">
                    {filteredAttendance.length > 0 ? (
                      filteredAttendance.map((att, i) => (
                        <tr key={i} className="group hover:bg-stone-50/50 transition-all duration-500">
                          <td className="px-10 py-8">
                            <span className="text-sm fw-black text-dark tracking-tight d-block">{att.user_id?.name || 'Unknown'}</span>
                            <span className="text-[9px] text-stone-400 fw-bold">{att.user_id?.email || 'N/A'}</span>
                          </td>
                          <td className="px-10 py-8 text-xs fw-bold text-stone-600">{formatDate(att.date)}</td>
                          <td className="px-10 py-8 text-xs fw-black text-stone-700">{formatTime(att.check_in)}</td>
                          <td className="px-10 py-8 text-xs fw-bold text-stone-500">{formatTime(att.check_out)}</td>
                          <td className="px-10 py-8">
                            <span className={`text-[9px] fw-black text-uppercase tracking-widest px-3 py-1.5 rounded-pill ${
                              att.status === 'Completed' ? 'bg-indigo-100 text-indigo-700' :
                              att.status === 'Present' ? 'bg-emerald-100 text-emerald-700' :
                              att.status === 'Late' ? 'bg-amber-100 text-amber-700' :
                              'bg-rose-100 text-rose-700'
                            }`}>
                              {att.status}
                            </span>
                          </td>
                          <td className="px-10 py-8 text-end">
                            <div className="d-flex justify-content-end gap-3">
                              <button onClick={() => handleOpenAttendanceModal('edit', att)} className="btn btn-sm btn-outline-dark rounded-xl px-3.5 py-1.5 text-[9px] fw-black text-uppercase tracking-widest transition">
                                Edit
                              </button>
                              <button onClick={() => triggerDelete(att._id, 'attendance')} className="btn btn-sm btn-outline-rose rounded-xl px-3.5 py-1.5 text-[9px] fw-black text-uppercase tracking-widest transition">
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center py-20 text-stone-400 text-sm fw-medium">No attendance records logged for selection.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      {/* ==================== MODALS ==================== */}

      {/* Add / Edit Shift Modal */}
      <Modal show={shiftModal.show} onHide={() => setShiftModal({ show: false, mode: 'add', data: null })} centered size="md" className="artisan-modal">
        <Form onSubmit={handleSaveShift}>
          <Modal.Header closeButton className="border-bottom border-stone-100 bg-stone-50">
            <Modal.Title className="fs-5 fw-black font-serif tracking-tight text-capitalize">{shiftModal.mode} Shift Assignment</Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-6">
            <Form.Group className="mb-4">
              <Form.Label className="text-[10px] fw-black text-stone-500 uppercase tracking-wider">Employee / Artisan</Form.Label>
              <Form.Select 
                value={shiftForm.user_id} 
                onChange={(e) => setShiftForm({ ...shiftForm, user_id: e.target.value })}
                required
                className="w-100 px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm"
              >
                <option value="">Select Employee...</option>
                {users.filter(u => u.role === 'artisan').map(u => (
                  <option key={u._id} value={u._id}>{u.name}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <div className="row g-4 mb-4">
              <div className="col-6">
                <Form.Group>
                  <Form.Label className="text-[10px] fw-black text-stone-500 uppercase tracking-wider">Shift Date</Form.Label>
                  <Form.Control 
                    type="date" 
                    value={shiftForm.shift_date} 
                    onChange={(e) => setShiftForm({ ...shiftForm, shift_date: e.target.value })}
                    required
                    className="w-100 px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm"
                  />
                </Form.Group>
              </div>
              <div className="col-6">
                <Form.Group>
                  <Form.Label className="text-[10px] fw-black text-stone-500 uppercase tracking-wider">Shift Type</Form.Label>
                  <Form.Select 
                    value={shiftForm.shift_type} 
                    onChange={(e) => setShiftForm({ ...shiftForm, shift_type: e.target.value })}
                    required
                    className="w-100 px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm"
                  >
                    <option value="Morning">Morning</option>
                    <option value="Evening">Evening</option>
                    <option value="Night">Night</option>
                  </Form.Select>
                </Form.Group>
              </div>
            </div>

            <div className="row g-4 mb-4">
              <div className="col-6">
                <Form.Group>
                  <Form.Label className="text-[10px] fw-black text-stone-500 uppercase tracking-wider">Clock In Time</Form.Label>
                  <Form.Control 
                    type="datetime-local" 
                    value={shiftForm.clock_in} 
                    onChange={(e) => setShiftForm({ ...shiftForm, clock_in: e.target.value })}
                    className="w-100 px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm"
                  />
                </Form.Group>
              </div>
              <div className="col-6">
                <Form.Group>
                  <Form.Label className="text-[10px] fw-black text-stone-500 uppercase tracking-wider">Clock Out Time</Form.Label>
                  <Form.Control 
                    type="datetime-local" 
                    value={shiftForm.clock_out} 
                    onChange={(e) => setShiftForm({ ...shiftForm, clock_out: e.target.value })}
                    className="w-100 px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm"
                  />
                </Form.Group>
              </div>
            </div>

            <Form.Group className="mb-2">
              <Form.Label className="text-[10px] fw-black text-stone-500 uppercase tracking-wider">Status</Form.Label>
              <Form.Select 
                value={shiftForm.status} 
                onChange={(e) => setShiftForm({ ...shiftForm, status: e.target.value })}
                required
                className="w-100 px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm"
              >
                <option value="scheduled">Scheduled</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="border-0 bg-stone-50/50">
            <Button variant="white" onClick={() => setShiftModal({ show: false, mode: 'add', data: null })} className="px-5 py-3 rounded-xl border border-stone-200 text-stone-500 text-xs fw-bold">Cancel</Button>
            <Button type="submit" variant="dark" className="px-6 py-3 rounded-xl bg-dark text-white text-xs fw-bold border-0">Save Shift</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Add / Edit Salary Modal */}
      <Modal show={salaryModal.show} onHide={() => setSalaryModal({ show: false, mode: 'add', data: null })} centered size="md" className="artisan-modal">
        <Form onSubmit={handleSaveSalary}>
          <Modal.Header closeButton className="border-bottom border-stone-100 bg-stone-50">
            <Modal.Title className="fs-5 fw-black font-serif tracking-tight text-capitalize">{salaryModal.mode} Payroll Record</Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-6">
            <Form.Group className="mb-4">
              <Form.Label className="text-[10px] fw-black text-stone-500 uppercase tracking-wider">Employee</Form.Label>
              <Form.Select 
                value={salaryForm.user_id} 
                onChange={(e) => setSalaryForm({ ...salaryForm, user_id: e.target.value })}
                required
                className="w-100 px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm"
              >
                <option value="">Select Employee...</option>
                {users.filter(u => u.role === 'artisan').map(u => (
                  <option key={u._id} value={u._id}>{u.name}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <div className="row g-4 mb-4">
              <div className="col-6">
                <Form.Group>
                  <Form.Label className="text-[10px] fw-black text-stone-500 uppercase tracking-wider">Salary Amount ($)</Form.Label>
                  <Form.Control 
                    type="number" 
                    required
                    value={salaryForm.amount} 
                    onChange={(e) => setSalaryForm({ ...salaryForm, amount: e.target.value })}
                    placeholder="e.g. 4500"
                    className="w-100 px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm"
                  />
                </Form.Group>
              </div>
              <div className="col-6">
                <Form.Group>
                  <Form.Label className="text-[10px] fw-black text-stone-500 uppercase tracking-wider">Target Month</Form.Label>
                  <Form.Control 
                    type="text" 
                    required
                    value={salaryForm.month} 
                    onChange={(e) => setSalaryForm({ ...salaryForm, month: e.target.value })}
                    placeholder="e.g. October 2026"
                    className="w-100 px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm"
                  />
                </Form.Group>
              </div>
            </div>

            <div className="row g-4 mb-2">
              <div className="col-6">
                <Form.Group>
                  <Form.Label className="text-[10px] fw-black text-stone-500 uppercase tracking-wider">Payment Status</Form.Label>
                  <Form.Select 
                    value={salaryForm.status} 
                    onChange={(e) => setSalaryForm({ ...salaryForm, status: e.target.value })}
                    required
                    className="w-100 px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm"
                  >
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="col-6">
                <Form.Group>
                  <Form.Label className="text-[10px] fw-black text-stone-500 uppercase tracking-wider">Payment Date</Form.Label>
                  <Form.Control 
                    type="date" 
                    value={salaryForm.payment_date} 
                    onChange={(e) => setSalaryForm({ ...salaryForm, payment_date: e.target.value })}
                    className="w-100 px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm"
                  />
                </Form.Group>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className="border-0 bg-stone-50/50">
            <Button variant="white" onClick={() => setSalaryModal({ show: false, mode: 'add', data: null })} className="px-5 py-3 rounded-xl border border-stone-200 text-stone-500 text-xs fw-bold">Cancel</Button>
            <Button type="submit" variant="dark" className="px-6 py-3 rounded-xl bg-dark text-white text-xs fw-bold border-0">Save Payroll</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Add / Edit Attendance Modal */}
      <Modal show={attendanceModal.show} onHide={() => setAttendanceModal({ show: false, mode: 'add', data: null })} centered size="md" className="artisan-modal">
        <Form onSubmit={handleSaveAttendance}>
          <Modal.Header closeButton className="border-bottom border-stone-100 bg-stone-50">
            <Modal.Title className="fs-5 fw-black font-serif tracking-tight text-capitalize">{attendanceModal.mode} Attendance Record</Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-6">
            <Form.Group className="mb-4">
              <Form.Label className="text-[10px] fw-black text-stone-500 uppercase tracking-wider">Artisan</Form.Label>
              <Form.Select 
                value={attendanceForm.user_id} 
                onChange={(e) => setAttendanceForm({ ...attendanceForm, user_id: e.target.value })}
                required
                className="w-100 px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm"
              >
                <option value="">Select Artisan...</option>
                {users.filter(u => u.role === 'artisan').map(u => (
                  <option key={u._id} value={u._id}>{u.name}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <div className="row g-4 mb-4">
              <div className="col-6">
                <Form.Group>
                  <Form.Label className="text-[10px] fw-black text-stone-500 uppercase tracking-wider">Date</Form.Label>
                  <Form.Control 
                    type="date" 
                    required
                    value={attendanceForm.date} 
                    onChange={(e) => setAttendanceForm({ ...attendanceForm, date: e.target.value })}
                    className="w-100 px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm"
                  />
                </Form.Group>
              </div>
              <div className="col-6">
                <Form.Group>
                  <Form.Label className="text-[10px] fw-black text-stone-500 uppercase tracking-wider">Status</Form.Label>
                  <Form.Select 
                    value={attendanceForm.status} 
                    onChange={(e) => setAttendanceForm({ ...attendanceForm, status: e.target.value })}
                    required
                    className="w-100 px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm"
                  >
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                    <option value="Late">Late</option>
                    <option value="Completed">Completed</option>
                  </Form.Select>
                </Form.Group>
              </div>
            </div>

            <div className="row g-4 mb-2">
              <div className="col-6">
                <Form.Group>
                  <Form.Label className="text-[10px] fw-black text-stone-500 uppercase tracking-wider">Check In Time</Form.Label>
                  <Form.Control 
                    type="datetime-local" 
                    value={attendanceForm.check_in} 
                    onChange={(e) => setAttendanceForm({ ...attendanceForm, check_in: e.target.value })}
                    className="w-100 px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm"
                  />
                </Form.Group>
              </div>
              <div className="col-6">
                <Form.Group>
                  <Form.Label className="text-[10px] fw-black text-stone-500 uppercase tracking-wider">Check Out Time</Form.Label>
                  <Form.Control 
                    type="datetime-local" 
                    value={attendanceForm.check_out} 
                    onChange={(e) => setAttendanceForm({ ...attendanceForm, check_out: e.target.value })}
                    className="w-100 px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm"
                  />
                </Form.Group>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className="border-0 bg-stone-50/50">
            <Button variant="white" onClick={() => setAttendanceModal({ show: false, mode: 'add', data: null })} className="px-5 py-3 rounded-xl border border-stone-200 text-stone-500 text-xs fw-bold">Cancel</Button>
            <Button type="submit" variant="dark" className="px-6 py-3 rounded-xl bg-dark text-white text-xs fw-bold border-0">Save Record</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="position-fixed top-0 start-0 w-100 h-100 z-50 d-flex align-items-center justify-content-center">
          <div className="position-absolute w-100 h-100 bg-black/60 backdrop-blur-sm animate-in fade-in" onClick={() => setDeleteModal({ show: false, id: null, type: '' })}></div>
          <div className="position-relative z-1 bg-white rounded-3xl p-8 max-w-sm w-100 mx-4 shadow-2xl animate-in zoom-in-95 text-center">
            <div className="size-16 bg-red-50 text-red-500 rounded-full d-flex align-items-center justify-content-center mx-auto mb-4">
              <span className="material-symbols-outlined fs-3">delete_forever</span>
            </div>
            <h3 className="font-serif fs-4 fw-black mb-2 text-capitalize">Remove {deleteModal.type}?</h3>
            <p className="text-stone-500 text-sm mb-6">Are you sure you want to permanently delete this {deleteModal.type} record? This action is irreversible.</p>
            <div className="d-flex gap-3">
              <button onClick={() => setDeleteModal({ show: false, id: null, type: '' })} className="flex-grow-1 py-3 bg-stone-50 text-stone-500 rounded-xl fw-black text-xs uppercase tracking-widest hover:bg-stone-100 transition border-0">Cancel</button>
              <button onClick={confirmDelete} className="flex-grow-1 py-3 bg-red-500 text-white rounded-xl fw-black text-xs uppercase tracking-widest shadow-lg hover:bg-red-600 transition border-0">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Custom styled Success/Error Toast Alerts */}
      {toast.show && (
        <div className="position-fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-500">
          <div className={`px-6 py-4 rounded-2xl shadow-2xl d-flex align-items-center gap-4 border ${
            toast.type === 'error' ? 'bg-rose-950/90 text-rose-100 border-rose-800' : 'bg-dark text-white border-white/10'
          }`}>
            <div className={`size-10 rounded-full d-flex align-items-center justify-content-center ${
              toast.type === 'error' ? 'bg-rose-500/20 text-rose-400' : 'bg-primary/20 text-primary'
            }`}>
              <span className="material-symbols-outlined fs-5">{toast.type === 'error' ? 'error' : 'verified'}</span>
            </div>
            <div>
              <h5 className="fs-6 fw-bold mb-1">{toast.type === 'error' ? 'Action Failed' : 'Action Success'}</h5>
              <p className={`text-xs mb-0 ${toast.type === 'error' ? 'text-rose-200/70' : 'text-white/60'}`}>{toast.message}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHR;
