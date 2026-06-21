
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axiosInstance';
import { useAuth } from '../context/AuthContext';

const Craftsmanship = () => {
  const { user } = useAuth();
  const [clips, setClips] = useState([]);
  const [currentClip, setCurrentClip] = useState(null);
  const [loading, setLoading] = useState(true);


  const getYouTubeEmbedUrl = (url) => {
    if (!url) return '';
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = match && match[2].length === 11 ? match[2] : null;
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0` : url;
  };

  useEffect(() => {
    const fetchClips = async () => {
      try {
        const { data } = await axios.get('/api/clips');
        const liveClips = data.filter(c => c.status === 'Live');
        
        setClips(liveClips);
        
        if (liveClips.length > 0) {
          setCurrentClip(prev => prev || liveClips[0]);
        }
      } catch (error) {
        console.error("Error fetching clips:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClips();
  }, []);

  const handleClipSelect = (clip) => {
    setCurrentClip(clip);
  };

  return (
    // FIX 1: Remove vh-100 + overflow-hidden which trapped content. Use min-vh-100 so content can scroll naturally.
    <div className="d-flex flex-column flex-md-row min-vh-100 bg-background-light font-display text-dark">
      
      {/* Sidebar — Desktop only */}
      <aside className="w-64 flex-shrink-0 border-end border-light-subtle border-primary/10 bg-white d-none d-md-flex flex-column" style={{ width: '256px' }}>
        <div className="p-4 d-flex flex-column h-100">
          <Link to="/" className="d-flex align-items-center gap-3 mb-5 hover:opacity-80 transition-opacity text-decoration-none">
            <div className="bg-primary h-10 w-10 rounded-3 d-flex align-items-center justify-content-center text-white flex-shrink-0">
              <span className="material-symbols-outlined">diamond</span>
            </div>
            <div>
              <h1 className="text-dark fw-bold fs-5 lh-sm mb-0">Artisan Soul</h1>
              <p className="text-primary fs-6 text-muted fw-medium text-uppercase tracking-wider mb-0">Maison Atelier</p>
            </div>
          </Link>
          
          <nav className="flex-grow-1 space-y-2">
            <Link to="/user/tracker" className="d-flex align-items-center gap-3 px-3 py-2 text-secondary hover:bg-light rounded-3 transition group text-decoration-none">
              <span className="material-symbols-outlined group-hover:text-primary transition">dashboard</span>
              <span className="fs-6 fw-medium">Dashboard</span>
            </Link>
            <Link to="/craftsmanship" className="d-flex align-items-center gap-3 px-3 py-2 bg-primary/10 text-primary rounded-3 transition text-decoration-none">
              <span className="material-symbols-outlined">play_circle</span>
              <span className="fs-6 fw-medium">Live Craft</span>
            </Link>
            <Link to="/user/history" className="d-flex align-items-center gap-3 px-3 py-2 text-secondary hover:bg-light rounded-3 transition group text-decoration-none">
              <span className="material-symbols-outlined group-hover:text-primary transition">inventory_2</span>
              <span className="fs-6 fw-medium">My Orders</span>
            </Link>
          </nav>
          <div className="mt-auto p-3 bg-primary/5 rounded-4 border border-light-subtle border-primary/10">
            <div className="d-flex align-items-center gap-3">
              <div className="h-10 w-10 rounded-circle bg-stone-850 d-flex align-items-center justify-content-center text-dark border border-primary/20 shadow-sm text-uppercase fw-bold text-[12px] flex-shrink-0">
                {user?.name ? user.name.substring(0, 2) : 'US'}
              </div>
              <div className="overflow-hidden">
                <p className="fs-6 text-muted fw-bold text-dark mb-0 text-truncate">{user?.name || 'Client'}</p>
                <p className="text-[10px] text-secondary text-uppercase mb-0">Atelier Patron</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow-1 overflow-y-auto w-100">
        {/* Header — FIX 2: Added mobile back link and wrapped breadcrumb to prevent overflow */}
        <header className="sticky-top top-0 z-1 bg-background-light/80 backdrop-blur-md border-bottom border-light-subtle border-primary/5">
          {/* Mobile top bar */}
          <div className="d-flex d-md-none align-items-center gap-3 px-4 py-3">
            <Link to="/" className="size-10 rounded-xl bg-white border border-stone-100 shadow-sm d-flex align-items-center justify-content-center text-stone-500 hover:text-dark transition flex-shrink-0">
              <span className="material-symbols-outlined fs-5">arrow_back</span>
            </Link>
            <div>
              <p className="text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-500 mb-0">Live Experience</p>
              <p className="fs-6 fw-black text-dark mb-0 tracking-tight">The Artisan Workshop</p>
            </div>
            <div className="ms-auto d-flex align-items-center gap-2 bg-white px-3 py-1 rounded-pill border border-stone-100 shadow-sm flex-shrink-0">
              <span className="h-2 w-2 bg-green-500 rounded-circle animate-pulse d-block"></span>
              <span className="text-[10px] fw-black text-dark text-uppercase tracking-widest">LIVE</span>
            </div>
          </div>
          {/* Desktop breadcrumb */}
          <div className="d-none d-md-flex align-items-center justify-content-between px-4 py-3">
            <div className="d-flex align-items-center gap-2 fs-6 text-secondary flex-wrap">
              <span>Live Experience</span>
              <span className="material-symbols-outlined fs-6 text-muted">chevron_right</span>
              <span className="text-primary fw-medium tracking-tight">The Artisan Workshop</span>
            </div>
            <div className="d-flex align-items-center gap-3 flex-shrink-0">
              <div className="d-flex align-items-center gap-2 bg-white px-3 py-1.5 rounded-circle border border-light-subtle border-primary/10 shadow-sm">
                <span className="h-2 w-2 bg-green-500 rounded-circle animate-pulse"></span>
                <span className="fs-6 text-muted fw-bold text-dark text-uppercase tracking-widest">LIVE</span>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto p-4">
          {/* Main Video Player */}
          <section className="mb-8">
            <div className="position-relative group aspect-video rounded-4 overflow-hidden bg-black shadow-2xl ring-1 ring-primary/20">
              {currentClip ? (
                currentClip.isYouTube ? (
                  <iframe 
                    className="w-100 h-100"
                    src={getYouTubeEmbedUrl(currentClip.video_url)}
                    title={currentClip.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video 
                    src={currentClip.video_url} 
                    autoPlay 
                    controls 
                    className="w-100 h-100 object-cover"
                  />
                )
              ) : (
                <div className="w-100 h-100 d-flex align-items-center justify-content-center text-white flex-column">
                  <span className="material-symbols-outlined fs-1 mb-3">videocam_off</span>
                  <p>No Live Clips Available</p>
                </div>
              )}
            </div>

            {/* FIX 3: Clip info — wrap flex row so title and badge stack on mobile */}
            {currentClip && (
              <div className="bg-white p-4 p-md-5 rounded-3xl mt-4 border border-light-subtle">
                <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start gap-3">
                  <div className="flex-grow-1">
                    <h2 className="fs-4 fs-md-3 fw-bold tracking-tight mb-2">{currentClip.title}</h2>
                    <p className="text-stone-600 mb-0">{currentClip.tag} • {currentClip.duration}</p>
                  </div>
                  <span className="badge bg-success text-white px-3 py-2 flex-shrink-0">LIVE NOW</span>
                </div>
              </div>
            )}
          </section>

          {/* All Live Clips Grid */}
          <section className="pb-8">
            <h3 className="fs-5 fw-black text-dark mb-4">All Live Workshop Clips</h3>
            
            {loading ? (
              <p className="text-center py-8">Loading live clips...</p>
            ) : (
              /* FIX 4: Added col-sm-6 for small tablets (540px+) */
              <div className="row g-4">
                {clips.map((clip) => (
                  <div 
                    key={clip._id} 
                    className="col-12 col-sm-6 col-lg-4"
                    onClick={() => handleClipSelect(clip)}
                  >
                    <div className={`rounded-3xl overflow-hidden cursor-pointer border-2 transition-all hover:shadow-xl ${currentClip?._id === clip._id ? 'border-primary shadow-xl' : 'border-transparent'}`}>
                      <div className="aspect-video position-relative">
                        <img 
                          src={clip.thumbnail_url || clip.video_url} 
                          className="w-100 h-100 object-cover" 
                          alt={clip.title} 
                        />
                        <div className="position-absolute top-0 end-0 m-2 bg-black/70 text-white text-[10px] px-2 py-1 rounded tracking-widest">
                          LIVE
                        </div>
                      </div>
                      <div className="p-4 bg-white">
                        <p className="fw-bold text-sm mb-1 line-clamp-2">{clip.title}</p>
                        <p className="text-xs text-stone-500 mb-0">{clip.tag}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {clips.length === 0 && !loading && (
              <div className="text-center py-12 text-stone-400">
                <span className="material-symbols-outlined display-4 d-block mb-3">videocam_off</span>
                <p>No live clips available at the moment</p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default Craftsmanship;
