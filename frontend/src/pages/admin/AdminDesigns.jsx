import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../utils/axiosInstance';
import { useToast } from '../../context/ToastContext';

const AdminDesigns = () => {
  const [designs, setDesigns] = useState([]);
  const { showToast, showConfirm } = useToast();

  const fetchDesigns = async () => {
    try {
      const { data } = await axios.get('/api/bespoke-designs');
      setDesigns(data.map(d => ({
        _id: d._id,
        id: d._id.substring(0, 8).toUpperCase(),
        name: d.name,
        patron: d.user ? (d.user.name || d.user) : 'Bespoke Guest',
        date: new Date(d.createdAt).toLocaleDateString(),
        image: d.img || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
        complexity: d.price > 800 ? 'Ultra' : d.price > 500 ? 'High' : 'Medium',
        status: d.status || 'Draft',
        material: d.material || 'Premium Suede',
        price: d.price
      })));
    } catch (err) {
      console.error('Failed to fetch designs', err);
    }
  };

  useEffect(() => {
    fetchDesigns();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await axios.put(`/api/bespoke-designs/${id}`, { status, category: 'In Production' });
      showToast(`Design marked as: ${status}`, 'success');
      fetchDesigns();
    } catch (err) {
      console.error('Failed to update status', err);
      showToast('Failed to update design status.', 'error');
    }
  };

  const handleDelete = async (id) => {
    showConfirm(
      'Are you sure you want to remove this design concept?',
      async () => {
        try {
          await axios.delete(`/api/bespoke-designs/${id}`);
          showToast('Design concept removed.', 'success');
          fetchDesigns();
        } catch (err) {
          console.error('Failed to delete design', err);
          showToast('Failed to remove design.', 'error');
        }
      }
    );
  };

  return (
    <div className="p-8 lg:p-12 animate-in fade-in duration-1000">
      <section className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-6 mb-12">
        <div>
          <nav className="d-flex align-items-center gap-3 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700 mb-4">
            <Link to="/admin" className="hover:text-dark transition">Operations</Link>
            <span className="material-symbols-outlined fs-6 text-stone-200">chevron_right</span>
            <span className="text-primary">Design Registry</span>
          </nav>
          <h1 className="display-4 fw-black font-serif text-dark tracking-tighter mb-0 lowercase">Design.Archive</h1>
        </div>

        <div className="d-flex gap-4">
          <Link to="/admin/analytics" className="text-decoration-none px-8 py-3.5 rounded-2xl bg-white border border-stone-100 text-[10px] fw-black text-uppercase tracking-widest text-dark hover:bg-stone-50 transition duration-500 shadow-sm d-flex align-items-center gap-3">
            <span className="material-symbols-outlined fs-5">monitoring</span>
            Analytics
          </Link>
          <Link to="/admin/catalog" className="text-decoration-none px-8 py-3.5 rounded-2xl bg-dark text-white text-[10px] fw-black text-uppercase tracking-widest shadow-2xl hover:-translate-y-1 transition duration-500 d-flex align-items-center gap-3">
            <span className="material-symbols-outlined fs-5">stars</span>
            Curate Collection
          </Link>
        </div>
      </section>

      {designs.length === 0 ? (
        <div className="glass-panel p-12 rounded-[3rem] border-stone-100 shadow-premium text-center">
          <span className="material-symbols-outlined text-stone-300 text-[64px] d-block mb-4">draw</span>
          <p className="text-sm fw-bold text-stone-500 mb-0">No bespoke design submissions yet.</p>
        </div>
      ) : (
        <div className="row g-8">
          {designs.map((design, i) => (
            <div key={i} className="col-lg-3 col-md-6">
              <div className="glass-panel rounded-[2.5rem] border-stone-100 shadow-premium overflow-hidden group hover:border-dark transition-all duration-700">
                <div className="aspect-[4/5] relative overflow-hidden">
                  <img src={design.image} className="w-100 h-100 object-cover group-hover:scale-110 transition-transform duration-1000" alt={design.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 d-flex flex-column justify-content-end p-6">
                    <button onClick={() => handleDelete(design._id)} className="w-100 py-3 rounded-xl bg-rose-600 text-white text-[10px] fw-black text-uppercase tracking-widest mb-2 border-0">Delete Design</button>
                    <button onClick={() => handleUpdateStatus(design._id, 'In Production')} className="w-100 py-3 rounded-xl bg-primary text-white text-[10px] fw-black text-uppercase tracking-widest border-0">Mark for Production</button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-[10px] fw-black text-stone-700 tracking-tighter">{design.id}</span>
                    <span className={`text-[8px] fw-black text-uppercase tracking-widest px-2 py-0.5 rounded-full ${design.complexity === 'Ultra' ? 'bg-amber-500/10 text-amber-600' : 'bg-stone-100 text-stone-600'}`}>
                      {design.complexity} Spec ({design.status})
                    </span>
                  </div>
                  <h4 className="text-lg fw-black text-dark tracking-tight mb-1">{design.name}</h4>
                  <p className="text-[10px] fw-black text-uppercase tracking-widest text-stone-600 mb-0">Patron: {design.patron}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDesigns;
