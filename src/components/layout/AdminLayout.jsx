import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from '../../utils/axiosInstance';

const AdminLayout = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  // Poll for unread notification count
  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const { data } = await axios.get('/api/notifications');
        const count = data.filter(n => !n.read).length;
        setUnreadCount(count);
      } catch (err) {
        // silent
      }
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', icon: 'dashboard', path: '/admin' },
    { label: 'Messages', icon: 'chat', path: '/admin/messages' },
    { label: 'Orders', icon: 'shopping_bag', path: '/admin/orders' },
    { label: 'Artisans', icon: 'engineering', path: '/admin/artisans' },
    { label: 'Suppliers', icon: 'local_shipping', path: '/admin/suppliers' },
    { label: 'Human Resources', icon: 'badge', path: '/admin/hr' },
    { label: 'Inventory', icon: 'inventory', path: '/admin/inventory' },
    { label: 'Production', icon: 'factory', path: '/admin/production' },
    { label: 'Custom Designs', icon: 'draw', path: '/admin/designs' },
    { label: 'Catalog', icon: 'inventory_2', path: '/admin/catalog' },
    { label: 'Customers', icon: 'group', path: '/admin/customers' },
    { label: 'Quality Control', icon: 'fact_check', path: '/admin/quality' },
    { label: 'Finance', icon: 'account_balance', path: '/admin/finance' },
    { label: 'Live Studio', icon: 'videocam', path: '/admin/video' },
    { label: 'Analytics', icon: 'query_stats', path: '/admin/analytics' },
  ];

  return (
    <div className="min-vh-100 flex overflow-hidden bg-background-light font-display text-dark">
      {/* Premium Dark Espresso Sidebar */}
      <aside className="w-80 flex-shrink-0 bg-dark d-none d-lg-flex flex-column h-vh shadow-2xl z-50 position-relative">
        <div className="position-absolute top-0 left-0 w-100 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
        <div className="p-8 pb-10">
          <Link to="/" className="d-flex align-items-center gap-4 group text-decoration-none">
            <div className="size-12 bg-primary rounded-2xl d-flex align-items-center justify-content-center text-white shadow-[0_0_20px_rgba(189,81,13,0.4)] group-hover:scale-105 transition duration-500">
              <span className="material-symbols-outlined fs-3">diamond</span>
            </div>
            <div>
              <h1 className="font-serif fs-4 fw-black text-white leading-none tracking-tighter mb-0 lowercase">Artisan.Soul</h1>
              <span className="text-[10px] fw-black text-uppercase tracking-[0.3em] text-primary-20">Command Center</span>
            </div>
          </Link>
        </div>
        
        <nav className="flex-grow-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          <div className="px-4 mb-4">
            <span className="text-[10px] fw-black text-uppercase tracking-[0.3em] text-white/30">Main Operations</span>
          </div>
          {navItems.map((item) => {
            const isActive = currentPath === item.path || (item.path !== '/admin' && currentPath.startsWith(item.path));
            return (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`d-flex align-items-center justify-content-between px-5 py-3.5 rounded-2xl transition duration-500 group text-decoration-none ${isActive ? 'bg-primary text-white shadow-[0_4px_20px_rgba(189,81,13,0.3)]' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}
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

        <div className="p-6 mt-auto border-top border-white/10 bg-black/20 backdrop-blur-sm">
          <div className="p-4 rounded-3xl border border-white/10 bg-white/5 d-flex align-items-center justify-content-between group hover:bg-white/10 transition duration-500 cursor-pointer">
            <div className="d-flex align-items-center gap-4">
               <div className="size-11 rounded-2xl bg-stone-800 overflow-hidden border-2 border-primary/50 shadow-sm grayscale-0">
                 <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200" alt="Admin" className="w-100 h-100 object-cover" />
               </div>
               <div className="d-flex flex-column">
                 <span className="text-xs fw-black text-white tracking-tight">{user?.name || 'Antonio Rossi'}</span>
                 <span className="text-[9px] fw-black text-uppercase tracking-widest text-primary">Head Curator</span>
               </div>
            </div>
            <button onClick={handleLogout} className="size-8 bg-transparent border-0 rounded-lg d-flex align-items-center justify-content-center text-white/30 hover:text-rose-500 hover:bg-white/5 transition duration-500">
              <span className="material-symbols-outlined fs-5">logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <main className="flex-grow-1 overflow-y-auto w-100 bg-background-light relative">
        {/* Consistent Light Header */}
        <header className="sticky-top top-0 z-40 bg-white/80 backdrop-blur-xl border-bottom border-stone-200 px-8 py-5 h-20 d-flex align-items-center justify-content-between shadow-sm">
          <div className="d-flex align-items-center gap-8">
            <h2 className="display-6 fw-black font-serif text-dark tracking-tighter mb-0 lowercase">Overview.</h2>
          </div>

          <div className="d-flex align-items-center gap-4">
            <div className="d-flex gap-2">
              <Link to="/admin/notifications" className="size-11 rounded-2xl border border-stone-200 bg-white d-flex align-items-center justify-content-center text-stone-500 hover:bg-stone-50 hover:text-dark transition duration-500 text-decoration-none shadow-sm position-relative">
                <span className="material-symbols-outlined fs-5">notifications</span>
                {unreadCount > 0 && (
                  <span className="position-absolute d-flex align-items-center justify-content-center bg-danger text-white fw-black rounded-full shadow-lg animate-pulse" style={{ top: '-5px', right: '-5px', width: '20px', height: '20px', fontSize: '10px', lineHeight: 1 }}>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>
              <Link to="/admin/settings" className="size-11 rounded-2xl border border-stone-200 bg-white d-flex align-items-center justify-content-center text-stone-500 hover:bg-stone-50 hover:text-dark transition duration-500 text-decoration-none shadow-sm">
                <span className="material-symbols-outlined fs-5">settings</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Workspace Content */}
        <div className="animate-in fade-in duration-1000">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
