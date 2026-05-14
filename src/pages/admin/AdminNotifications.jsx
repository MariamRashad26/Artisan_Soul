import { useState } from 'react';

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'Order', message: 'New Bespoke Request from James Sterling (#8841)', time: '10 minutes ago', icon: 'shopping_bag', color: 'primary', isRead: false },
    { id: 2, type: 'Quality', message: 'QA Yield Rate dropped below 98% in Workshop B', time: '1 hour ago', icon: 'warning', color: 'rose-500', isRead: false },
    { id: 3, type: 'System', message: 'Monthly revenue report has been generated successfully', time: '3 hours ago', icon: 'analytics', color: 'emerald-500', isRead: false },
    { id: 4, type: 'Artisan', message: 'Lorenzo Giamatti has requested additional materials', time: '1 day ago', icon: 'engineering', color: 'amber-500', isRead: true }
  ]);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  return (
    <div className="p-8 lg:p-12 animate-in fade-in slide-in-from-bottom duration-1000">
      <div className="d-flex align-items-center justify-content-between mb-8">
        <div>
          <h2 className="display-6 fw-black font-serif text-dark tracking-tighter mb-1 lowercase">Notifications.</h2>
          <p className="text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-600 mb-0">System Alerts & Operations</p>
        </div>
        <button onClick={markAllRead} className="px-6 py-2.5 rounded-xl bg-dark text-white text-[10px] fw-black text-uppercase tracking-widest hover:-translate-y-0.5 transition duration-500 shadow-lg">
          Mark All Read
        </button>
      </div>

      <div className="glass-panel p-8 rounded-[2.5rem] border-stone-100 shadow-premium">
        <div className="d-flex flex-column gap-4">
          {notifications.map((notif) => (
            <div key={notif.id} className={`p-5 rounded-2xl border border-stone-100 hover:bg-stone-50 transition duration-300 d-flex gap-4 align-items-start ${notif.isRead ? 'opacity-50 grayscale-[0.5]' : ''}`}>
              <div className={`size-12 rounded-xl bg-${notif.color === 'primary' ? 'primary/10' : notif.color.split('-')[0] + '/10'} d-flex align-items-center justify-content-center text-${notif.color} flex-shrink-0`}>
                <span className="material-symbols-outlined">{notif.icon}</span>
              </div>
              <div>
                <h4 className="text-xs fw-black text-dark tracking-tight mb-1">{notif.type} Alert</h4>
                <p className="text-stone-700 fs-6 fw-medium mb-2">{notif.message}</p>
                <span className="text-[10px] fw-black text-uppercase tracking-widest text-stone-600">{notif.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminNotifications;
