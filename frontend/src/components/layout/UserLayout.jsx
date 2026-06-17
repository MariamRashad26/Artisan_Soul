import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const UserLayout = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', icon: 'dashboard', path: '/user/tracker' },
    { label: 'Browse Shoes', icon: 'grid_view', path: '/catalog' },
    { label: 'Custom Designer', icon: 'edit_note', path: '/custom-designer' },
    { label: 'My Orders', icon: 'package_2', path: '/user/history' },
    { label: 'My Designs', icon: 'auto_awesome', path: '/user/designs' },
    { label: 'Video Requests', icon: 'videocam', path: '/craftsmanship' },
  ];

  return (
    <div className="d-flex vh-100 overflow-hidden bg-background-light font-display text-dark">
      {/* Premium Dark Espresso Sidebar */}
      <aside className="w-80 flex-shrink-0 bg-dark d-none d-md-flex flex-column h-vh shadow-2xl z-50 position-relative">
        <div className="position-absolute top-0 left-0 w-100 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
        <div className="p-8 pb-10">
          <Link to="/" className="d-flex align-items-center gap-4 group text-decoration-none">
            <div className="size-12 rounded-2xl bg-primary d-flex align-items-center justify-content-center text-white shadow-[0_0_20px_rgba(189,81,13,0.4)] group-hover:scale-105 transition duration-500">
              <span className="material-symbols-outlined fs-3">shopping</span>
            </div>
            <div>
              <h1 className="font-serif fs-4 fw-black text-white leading-none tracking-tighter mb-0 lowercase">Artisan.Soul</h1>
              <span className="text-[10px] fw-black text-uppercase tracking-[0.3em] text-primary-20">Private Atelier</span>
            </div>
          </Link>
        </div>

        <nav className="flex-grow-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          <div className="px-4 mb-4">
            <span className="text-[10px] fw-black text-uppercase tracking-[0.3em] text-white/30">Client Experience</span>
          </div>
          {navItems.map((item) => {
            const isActive = currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path) && item.path !== '/catalog' && item.path !== '/craftsmanship' && item.path !== '/custom-designer');
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
        <div className="px-5 mb-6">
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10 shadow-inner">
            <p className="text-[10px] text-primary fw-black text-uppercase tracking-widest mb-2">Design Storage</p>
            <div className="w-100 bg-black/40 h-1.5 rounded-full overflow-hidden mb-2">
              <div className="bg-primary h-100 w-3/4 shadow-[0_0_10px_rgba(189,81,13,0.5)]"></div>
            </div>
            <p className="text-[9px] fw-black text-white/40 tracking-widest text-uppercase uppercase mb-0">12 of 20 slots used</p>
          </div>
        </div>
        <div className="p-6 mt-auto border-top border-white/10 bg-black/20 backdrop-blur-sm">
          <div className="p-4 rounded-3xl border border-white/10 bg-white/5 d-flex align-items-center justify-content-between group hover:bg-white/10 transition duration-500 cursor-pointer">
            <div className="d-flex align-items-center gap-4">
              <div className="size-11 rounded-2xl bg-stone-800 d-flex align-items-center justify-content-center text-white fw-bold border-2 border-primary/50 shadow-sm text-uppercase">
                {user?.name ? user.name.substring(0, 2) : 'US'}
              </div>
              <div className="d-flex flex-column">
                <span className="text-xs fw-black text-white tracking-tight">{user?.name || 'Client'}</span>
                <span className="text-[9px] fw-black text-uppercase tracking-widest text-primary">Atelier Patron</span>
              </div>
            </div>
            <button onClick={handleLogout} className="size-8 bg-transparent border-0 rounded-lg d-flex align-items-center justify-content-center text-white/30 hover:text-rose-500 hover:bg-white/5 transition duration-500">
              <span className="material-symbols-outlined fs-5">logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow-1 overflow-y-auto w-100 bg-background-light ">
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;
