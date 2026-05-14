import { Link, Outlet, useLocation } from 'react-router-dom';

const ArtisanLayout = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="d-flex vh-100 overflow-hidden bg-background-light font-display text-dark">
      {/* Sidebar Navigation */}
      <aside className="w-80 flex-shrink-0 bg-white border-end border-light-subtle border-stone-200 d-flex flex-column h-100 z-3 d-none d-md-flex shadow-sm">
        <div className="p-5 d-flex align-items-center gap-3">
          <div className="size-12 rounded-xl bg-primary d-flex align-items-center justify-content-center text-white shadow-lg shadow-primary/30">
            <span className="material-symbols-outlined fs-3">auto_fix</span>
          </div>
          <div>
            <h1 className="fs-4 fw-black lh-sm font-serif text-dark tracking-tighter">Artisan Soul</h1>
            <p className="text-[10px] text-primary fw-black text-uppercase tracking-[0.2em]">Master Workshop</p>
          </div>
        </div>
        
        <nav className="flex-grow-1 px-4 space-y-2 mt-4 overflow-y-auto custom-scrollbar">
          <Link to="/artisan" className={`d-flex align-items-center gap-4 px-3 py-3 rounded-xl transition duration-300 ${currentPath === '/artisan' ? 'bg-primary/10 text-primary border border-primary-10 font-bold' : 'text-stone-500 hover:bg-stone-50 hover:text-dark font-medium'}`}>
            <span className="material-symbols-outlined fs-5">dashboard</span>
            <span className="fs-6">Workshop Overview</span>
          </Link>
          
          <Link to="/artisan/assignments" className={`d-flex align-items-center gap-4 px-3 py-3 rounded-xl transition duration-300 ${currentPath === '/artisan/assignments' ? 'bg-primary/10 text-primary border border-primary-10 font-bold' : 'text-stone-500 hover:bg-stone-50 hover:text-dark font-medium'}`}>
            <span className="material-symbols-outlined fs-5">precision_manufacturing</span>
            <span className="fs-6">Task Queue</span>
          </Link>

          <Link to="/artisan/quality-check" className={`d-flex align-items-center gap-4 px-3 py-3 rounded-xl transition duration-300 ${currentPath.includes('quality-check') ? 'bg-primary/10 text-primary border border-primary-10 font-bold' : 'text-stone-500 hover:bg-stone-50 hover:text-dark font-medium'}`}>
            <span className="material-symbols-outlined fs-5">verified</span>
            <span className="fs-6">Quality Control</span>
          </Link>

          <Link to="/artisan/materials" className={`d-flex align-items-center gap-4 px-3 py-3 rounded-xl transition duration-300 ${currentPath === '/artisan/materials' ? 'bg-primary/10 text-primary border border-primary-10 font-bold' : 'text-stone-500 hover:bg-stone-50 hover:text-dark font-medium'}`}>
            <span className="material-symbols-outlined fs-5">inventory_2</span>
            <span className="fs-6">Material Logs</span>
          </Link>

          <Link to="/artisan/clock" className={`d-flex align-items-center gap-4 px-3 py-3 rounded-xl transition duration-300 ${currentPath === '/artisan/clock' ? 'bg-primary/10 text-primary border border-primary-10 font-bold' : 'text-stone-500 hover:bg-stone-50 hover:text-dark font-medium'}`}>
            <span className="material-symbols-outlined fs-5">timer</span>
            <span className="fs-6">Shift & Time</span>
          </Link>

          <Link to="/artisan/maintenance" className={`d-flex align-items-center gap-4 px-3 py-3 rounded-xl transition duration-300 ${currentPath === '/artisan/maintenance' ? 'bg-primary/10 text-primary border border-primary-10 font-bold' : 'text-stone-500 hover:bg-stone-50 hover:text-dark font-medium'}`}>
            <span className="material-symbols-outlined fs-5">build</span>
            <span className="fs-6">Equipment Care</span>
          </Link>

          <div className="pt-6 pb-2">
            <p className="text-[10px] fw-black text-stone-400 text-uppercase tracking-[0.3em] px-3 mb-3">Communication</p>
          </div>

          <Link to="/artisan/messages" className={`w-100 d-flex align-items-center gap-4 px-3 py-3 rounded-xl transition duration-300 border-0 bg-transparent font-medium ${currentPath === '/artisan/messages' ? 'bg-primary/10 text-primary border border-primary-10 font-bold' : 'text-stone-500 hover:bg-stone-50 hover:text-dark'}`}>
            <div className="position-relative">
              <span className="material-symbols-outlined fs-5">chat_bubble</span>
              <span className="position-absolute top-0 start-100 translate-middle p-1 bg-primary border border-white rounded-circle"></span>
            </div>
            <span className="fs-6 text-start">Client Messages</span>
          </Link>

          <Link to="/artisan/clips" className={`w-100 d-flex align-items-center gap-4 px-3 py-3 rounded-xl transition duration-300 border-0 bg-transparent font-medium ${currentPath === '/artisan/clips' ? 'bg-primary/10 text-primary border border-primary-10 font-bold' : 'text-stone-500 hover:bg-stone-50 hover:text-dark'}`}>
            <span className="material-symbols-outlined fs-5">video_library</span>
            <span className="fs-6 text-start">Workshop Clips</span>
          </Link>
        </nav>

        {/* Global Artisan Profile */}
        <div className="p-4 border-top border-light-subtle border-stone-100 mt-auto bg-stone-50/50">
          <div className="d-flex align-items-center gap-3 p-2 rounded-2xl bg-white border border-stone-200 shadow-sm transition hover:shadow-md cursor-pointer group">
            <div className="size-11 rounded-xl bg-center bg-cover border border-stone-200 shadow-inner" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDjuaGjPsGidJ5Eg0h-DAn10R9OKR0fqzHRfiHh6vdeS0reT-hGppowKM-tCnq6pfY2crrEGLu4aIqFBt5zDvI5Kvjd2cgL9nyHPsUarJPyuNhPDceJaIEOTn2dbcL3mZLrmMxvWgZA19wnRytmhpbzyYuDtIgobIOUOX5CPMziBUcZHsdtn6taGfkQqxThRLtX3U6DaBpTTsrzJfoRTGJ_w2txICrU9IBvF3vKJSD3s2k5DXJm11LTpJ1JUVHJA4hKOEqHdjdYd55B')" }}></div>
            <div className="flex-grow-1 min-w-0">
              <p className="fs-6 fw-black text-truncate text-dark mb-0">Marco Sartori</p>
              <p className="text-[11px] text-stone-500 fw-bold tracking-tight">Master Shoemaker</p>
            </div>
            <Link to="/login" className="text-stone-300 group-hover:text-red-500 transition-colors" title="Logout">
              <span className="material-symbols-outlined fs-5">logout</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow-1 overflow-y-auto w-100 custom-scrollbar bg-slate-50/30">
        <Outlet />
      </main>
    </div>
  );
};

export default ArtisanLayout;
