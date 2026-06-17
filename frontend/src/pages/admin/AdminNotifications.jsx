import { useState, useEffect } from 'react';
import axios from '../../utils/axiosInstance';

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const { data } = await axios.get('/api/notifications');
      setNotifications(data);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await axios.put(`/api/notifications/${id}/read`);
      fetchNotifications();
    } catch (error) {
      console.error('Failed to mark as read', error);
    }
  };

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to clear all notifications?')) {
      try {
        await axios.delete('/api/notifications');
        fetchNotifications();
      } catch (error) {
        console.error('Failed to clear notifications', error);
      }
    }
  };

  // Helper to map DB type to icon and color
  const getTypeMeta = (type) => {
    switch(type) {
      case 'alert': return { icon: 'warning', color: 'rose-500' };
      case 'success': return { icon: 'check_circle', color: 'emerald-500' };
      case 'warning': return { icon: 'error', color: 'amber-500' };
      default: return { icon: 'info', color: 'primary' };
    }
  };

  return (
    <div className="p-8 lg:p-12 animate-in fade-in slide-in-from-bottom duration-1000">
      <div className="d-flex align-items-center justify-content-between mb-8">
        <div>
          <h2 className="display-6 fw-black font-serif text-dark tracking-tighter mb-1 lowercase">Notifications.</h2>
          <p className="text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-600 mb-0">System Alerts & Operations</p>
        </div>
        <button onClick={handleClearAll} className="px-6 py-2.5 rounded-xl bg-dark text-white text-[10px] fw-black text-uppercase tracking-widest hover:-translate-y-0.5 transition duration-500 shadow-lg">
          Clear All
        </button>
      </div>

      <div className="glass-panel p-8 rounded-[2.5rem] border-stone-100 shadow-premium">
        {notifications.length === 0 ? (
           <div className="text-center py-10">
              <span className="material-symbols-outlined fs-1 text-stone-200 mb-3">notifications_off</span>
              <h4 className="text-sm fw-black text-stone-400 text-uppercase tracking-widest">No Alerts</h4>
           </div>
        ) : (
          <div className="d-flex flex-column gap-4">
            {notifications.map((notif) => {
              const meta = getTypeMeta(notif.type);
              return (
                <div key={notif._id} className={`p-5 rounded-2xl border border-stone-100 hover:bg-stone-50 transition duration-300 d-flex gap-4 align-items-start ${notif.read ? 'opacity-50 grayscale-[0.5]' : ''}`}>
                  <div className={`size-12 rounded-xl bg-${meta.color === 'primary' ? 'primary/10' : meta.color.split('-')[0] + '/10'} d-flex align-items-center justify-content-center text-${meta.color} flex-shrink-0`}>
                    <span className="material-symbols-outlined">{meta.icon}</span>
                  </div>
                  <div className="flex-grow-1">
                    <h4 className="text-xs fw-black text-dark tracking-tight mb-1 text-uppercase">{notif.title}</h4>
                    <p className="text-stone-700 fs-6 fw-medium mb-2">{notif.message}</p>
                    <span className="text-[10px] fw-black text-uppercase tracking-widest text-stone-600">
                      {new Date(notif.createdAt).toLocaleString()}
                    </span>
                  </div>
                  {!notif.read && (
                    <button 
                      onClick={() => handleMarkRead(notif._id)}
                      className="btn btn-sm btn-outline-primary rounded-xl px-3 py-1.5 text-[9px] fw-black text-uppercase tracking-widest transition flex-shrink-0"
                    >
                      Mark Read
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNotifications;
