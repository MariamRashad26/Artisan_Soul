import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const SavedDesigns = () => {
  const [activeFilter, setActiveFilter] = useState('Collection');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showShareToast, setShowShareToast] = useState(false);
  const [designs, setDesigns] = useState([]);
  const { user } = useAuth();
  const { showToast } = useToast();

  const fetchDesigns = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get('/api/bespoke-designs');
      setDesigns(data);
    } catch (err) {
      console.error('Failed to fetch designs', err);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      await fetchDesigns();
    };
    load();
  }, [user, fetchDesigns]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).catch(() => {});
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 3000);
  };

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      try {
        await axiosInstance.delete(`/api/bespoke-designs/${itemToDelete._id}`);
        fetchDesigns();
        showToast('Design deleted from your lexicon.', 'success');
      } catch (err) {
        console.error('Failed to delete design', err);
        showToast('Failed to delete design. Please try again.', 'error');
      }
    }
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const filteredItems = designs.filter(i => {
    const cat = i.category || 'Drafts';
    if (activeFilter === 'Collection') return cat === 'Collection' || cat === 'Bespoke';
    if (activeFilter === 'Drafts') return cat === 'Drafts' || cat === 'Draft';
    if (activeFilter === 'In Production') return cat === 'In Production' || cat === 'Production';
    return true;
  });

  return (
    <div className="min-vh-100 bg-white font-display text-dark animate-in fade-in duration-700 pb-20">
      {/* Immersive Header Section */}
      <section className="bg-dark text-white py-20 px-4 md:px-10 position-relative overflow-hidden mb-12">
        <div className="position-absolute top-[-20%] right-[-10%] size-96 bg-primary rounded-full blur-[120px] opacity-20"></div>
        <div className="max-w-7xl mx-auto position-relative z-1">
          <div className="d-flex align-items-center gap-3 text-primary text-xs fw-black text-uppercase tracking-[0.3em] mb-4">
            <span className="material-symbols-outlined fs-5">draw</span>
            Design Archive & Portfolio
          </div>
          <h1 className="display-4 fw-black font-serif tracking-tight mb-4">Your Custom Lexicon</h1>
          <p className="fs-4 text-white/60 mb-0 font-display">Refine and commission your unique footwear concepts from the <span className="text-white italic">Artisan Soul</span> library.</p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 md:px-10">
        <div className="d-flex align-items-center justify-content-between mb-12 flex-wrap gap-6">
          <div className="d-flex bg-gray-50 p-1 rounded-pill border border-gray-100">
            {['Collection', 'Drafts', 'In Production'].map(f => (
              <button 
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-6 py-2 rounded-pill fw-black text-xs uppercase tracking-widest transition ${activeFilter === f ? 'bg-white shadow-sm text-dark' : 'text-secondary opacity-40 hover:opacity-100'}`}
              >
                {f}
              </button>
            ))}
          </div>
          <Link to="/custom-designer" className="bg-primary text-white px-8 py-3 rounded-pill fw-black text-xs uppercase tracking-widest shadow-lg hover:scale-105 transition decoration-none">Start New Design</Link>
        </div>

        <div className="row g-5">
          {filteredItems.map((item, idx) => (
            <div key={idx} className="col-md-6 col-lg-4 col-xl-3">
              <div className="glass-panel group rounded-2xl border-gray-100 overflow-hidden shadow-premium hover:shadow-2xl transition-all duration-500">
                <div className="aspect-ratio-4-3 bg-gray-50 flex align-items-center justify-content-center p-8 position-relative overflow-hidden">
                  <div className="position-absolute top-0 start-0 w-100 h-100 bg-gradient-to-br from-primary-5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  <img src={item.img} className="w-100 h-100 object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-700 relative z-1" alt="" />
                  
                  <div className="position-absolute top-4 left-4 z-1">
                    <span className={`px-3 py-1 rounded-full text-[10px] fw-black uppercase tracking-widest border ${
                      item.status === 'Ready' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-gray-100 text-gray-400 border-gray-200'
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  <div className="position-absolute bottom-4 right-4 z-1 d-flex gap-2 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                    <button onClick={() => handleDeleteClick(item)} className="size-10 bg-white/80 backdrop-blur-md rounded-full d-flex align-items-center justify-content-center text-red-500 shadow-lg hover:bg-white transition">
                      <span className="material-symbols-outlined fs-5">delete</span>
                    </button>
                    <button onClick={handleShare} className="size-10 bg-white/80 backdrop-blur-md rounded-full d-flex align-items-center justify-content-center text-dark shadow-lg hover:bg-white transition">
                      <span className="material-symbols-outlined fs-5">share</span>
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h4 className="fs-5 fw-black font-serif tracking-tight mb-0 group-hover:text-primary transition">{item.name}</h4>
                    <span className="fs-6 fw-black text-dark font-serif">
                      {item.price && !item.price.toString().startsWith('PKR') ? `${item.price} PKR` : item.price}
                    </span>
                  </div>
                  <p className="text-secondary opacity-40 text-xs fw-bold tracking-widest uppercase mb-6">{item.material}</p>
                  
                  <div className="d-flex gap-3">
                    <Link to="/custom-designer" className="flex-grow-1 py-2.5 bg-gray-50 text-dark border border-gray-100 rounded-pill fw-black text-[10px] uppercase tracking-widest text-center hover:bg-primary hover:text-white transition decoration-none">Edit Draft</Link>
                    <Link to="/checkout" className="flex-grow-1 py-2.5 bg-dark text-white rounded-pill fw-black text-[10px] uppercase tracking-widest text-center hover:bg-primary transition shadow-lg decoration-none">Commission</Link>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Empty Canvas Card */}
          <div className="col-md-6 col-lg-4 col-xl-3">
            <Link to="/custom-designer" className="h-100 d-flex flex-column align-items-center justify-content-center border-2 border-dashed border-gray-200 rounded-2xl p-8 bg-gray-50 hover:bg-white hover:border-primary transition-all duration-500 decoration-none group">
              <div className="size-16 bg-white rounded-full d-flex align-items-center justify-content-center shadow-premium mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-primary fs-1">add</span>
              </div>
              <h4 className="fs-4 fw-black font-serif tracking-tight text-dark mb-2">New Canvas</h4>
              <p className="text-secondary opacity-40 text-center text-sm fw-medium px-4">Begin a new artisanal journey from scratch.</p>
            </Link>
          </div>
        </div>

        {/* Collection Stats — real counts from designs array */}
        <div className="mt-20 pt-16 border-top border-gray-100 flex flex-wrap gap-12 justify-center pb-12">
          <div className="text-center px-8">
            <div className="display-5 fw-black font-serif text-dark mb-1">{designs.length}</div>
            <div className="text-xs fw-black text-primary tracking-[0.2em] uppercase">Total Concepts Created</div>
          </div>
          <div className="text-center px-8 border-x border-gray-100">
            <div className="display-5 fw-black font-serif text-dark mb-1">{designs.filter(d => d.status === 'Commissioned' || d.category === 'In Production').length}</div>
            <div className="text-xs fw-black text-primary tracking-[0.2em] uppercase">Masterpieces Commissioned</div>
          </div>
          <div className="text-center px-8">
            <div className="display-5 fw-black font-serif text-dark mb-1">{designs.filter(d => d.status === 'Ready').length}</div>
            <div className="text-xs fw-black text-primary tracking-[0.2em] uppercase">Ready to Commission</div>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="position-fixed top-0 start-0 w-100 h-100 z-50 d-flex align-items-center justify-content-center">
          <div className="position-absolute w-100 h-100 bg-black/60 backdrop-blur-sm animate-in fade-in" onClick={() => setShowDeleteModal(false)}></div>
          <div className="position-relative z-1 bg-white rounded-3xl p-8 max-w-sm w-100 mx-4 shadow-2xl animate-in zoom-in-95 text-center">
            <div className="size-16 bg-red-50 text-red-500 rounded-full d-flex align-items-center justify-content-center mx-auto mb-4">
              <span className="material-symbols-outlined fs-3">delete_forever</span>
            </div>
            <h3 className="font-serif fs-4 fw-black mb-2">Delete Design?</h3>
            <p className="text-secondary text-sm mb-6">Are you sure you want to delete <span className="fw-bold text-dark">{itemToDelete?.name}</span>? This concept will be permanently erased from your lexicon.</p>
            <div className="d-flex gap-3">
              <button onClick={() => setShowDeleteModal(false)} className="flex-grow-1 py-3 bg-gray-50 text-dark rounded-pill fw-black text-xs uppercase tracking-widest hover:bg-gray-100 transition">Cancel</button>
              <button onClick={confirmDelete} className="flex-grow-1 py-3 bg-red-500 text-white rounded-pill fw-black text-xs uppercase tracking-widest shadow-lg hover:bg-red-600 transition">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Share Toast */}
      {showShareToast && (
        <div className="position-fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-500">
          <div className="bg-dark text-white px-6 py-4 rounded-2xl shadow-2xl d-flex align-items-center gap-4 border border-white/10">
            <div className="size-10 bg-primary/20 text-primary rounded-full d-flex align-items-center justify-content-center">
              <span className="material-symbols-outlined fs-5">link</span>
            </div>
            <div>
              <h5 className="fs-6 fw-bold mb-1">Link Copied</h5>
              <p className="text-white/60 text-xs mb-0">Design link copied to your clipboard.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedDesigns;
