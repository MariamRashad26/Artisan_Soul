import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AdminDesigns = () => {
  const [designs, setDesigns] = useState([]);
  
  useEffect(() => {
    const fetchDesigns = async () => {
      try {
        const { data } = await axios.get('/api/products');
        setDesigns(data.map(p => ({
          id: p.product_id || p._id.substring(0, 8),
          name: p.name,
          patron: 'Artisan Studio', // Placeholder
          date: new Date(p.createdAt).toLocaleDateString(),
          image: p.imageUrl || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
          complexity: p.price > 20000 ? 'Ultra' : p.price > 10000 ? 'High' : 'Medium'
        })));
      } catch (err) {
        console.error('Failed to fetch designs', err);
      }
    };
    fetchDesigns();
  }, []);

  const [isGuidelinesModalOpen, setIsGuidelinesModalOpen] = useState(false);

  const handleUpdateGuidelines = (e) => {
    e.preventDefault();
    // In a real app this would post to an API
    alert('Design guidelines updated successfully.');
    setIsGuidelinesModalOpen(false);
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

      <div className="row g-8">
        {designs.map((design, i) => (
          <div key={i} className="col-lg-3 col-md-6">
            <div className="glass-panel rounded-[2.5rem] border-stone-100 shadow-premium overflow-hidden group hover:border-dark transition-all duration-700">
              <div className="aspect-[4/5] relative overflow-hidden">
                <img src={design.image} className="w-100 h-100 object-cover group-hover:scale-110 transition-transform duration-1000" alt={design.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 d-flex flex-column justify-content-end p-6">
                   <button className="w-100 py-3 rounded-xl bg-white text-[10px] fw-black text-uppercase tracking-widest text-dark mb-2">Inspect Vector</button>
                   <button className="w-100 py-3 rounded-xl bg-primary text-white text-[10px] fw-black text-uppercase tracking-widest">Mark for Production</button>
                </div>
              </div>
              <div className="p-6">
                <div className="d-flex justify-content-between align-items-center mb-2">
                   <span className="text-[10px] fw-black text-stone-700 tracking-tighter">{design.id}</span>
                   <span className={`text-[8px] fw-black text-uppercase tracking-widest px-2 py-0.5 rounded-full ${design.complexity === 'Ultra' ? 'bg-amber-500/10 text-amber-600' : 'bg-stone-100 text-stone-600'}`}>
                      {design.complexity} Spec
                   </span>
                </div>
                <h4 className="text-lg fw-black text-dark tracking-tight mb-1">{design.name}</h4>
                <p className="text-[10px] fw-black text-uppercase tracking-widest text-stone-600 mb-0">Patron: {design.patron}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <section className="mt-12 p-10 glass-panel rounded-[3rem] border-stone-100 shadow-premium">
         <div className="row g-12 align-items-center">
            <div className="col-lg-4">
               <h3 className="text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700 mb-6">Trending.Aesthetics</h3>
               <div className="space-y-6">
                  {[
                    { label: 'Calfskin Tan', strength: 84 },
                    { label: 'Oxford Model', strength: 65 },
                    { label: 'Traditional Broguing', strength: 42 }
                  ].map((trend, i) => (
                    <div key={i}>
                       <div className="d-flex justify-content-between text-[10px] fw-black text-dark tracking-widest mb-2">
                          <span>{trend.label}</span>
                          <span>{trend.strength}%</span>
                       </div>
                       <div className="h-1 bg-stone-100 rounded-full overflow-hidden">
                          <div className="h-100 bg-dark rounded-full" style={{ width: `${trend.strength}%` }}></div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
            <div className="col-lg-8">
               <div className="p-8 bg-stone-950 rounded-[2.5rem] shadow-2xl relative overflow-hidden text-white">
                  <div className="position-absolute top-[-20%] right-[-10%] text-white/5">
                     <span className="material-symbols-outlined text-[200px]">auto_awesome</span>
                  </div>
                  <div className="relative z-1">
                     <span className="text-[10px] fw-black text-uppercase tracking-[0.4em] text-stone-700 mb-6 d-block text-primary">Intelligence Insight</span>
                     <h2 className="display-6 fw-black font-serif tracking-tighter mb-6 lowercase italic">Minimalist profiles are seeing an 18% surge in VIP registrations this quarter.</h2>
                     <button onClick={() => setIsGuidelinesModalOpen(true)} className="px-8 py-3 rounded-xl bg-white text-dark text-[10px] fw-black text-uppercase tracking-widest hover:bg-stone-100 transition">Update Design Guidelines</button>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Guidelines Modal */}
      {isGuidelinesModalOpen && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark/50 backdrop-blur-sm z-[100] d-flex align-items-center justify-content-center p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-[500px] w-100 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="px-8 py-6 border-bottom border-stone-100 d-flex justify-content-between align-items-center bg-stone-50/50">
              <h3 className="fs-5 fw-black font-serif text-dark mb-0 tracking-tight lowercase">Update.Guidelines</h3>
              <button onClick={() => setIsGuidelinesModalOpen(false)} className="text-stone-600 hover:text-dark transition">
                <span className="material-symbols-outlined fs-5">close</span>
              </button>
            </div>
            <form onSubmit={handleUpdateGuidelines} className="p-8 space-y-6">
              <div className="row g-4">
                <div className="col-12">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Guideline Document Name</label>
                  <input name="docTitle" required defaultValue="Q4 Minimalist Styling Specs" className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" />
                </div>
                <div className="col-12">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Key Directives</label>
                  <textarea name="directives" required rows="4" defaultValue="Emphasize unlined calfskin interiors. Avoid broguing on vamp area. Stick to monochromatic laces." className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition resize-none"></textarea>
                </div>
              </div>
              <div className="pt-6 border-top border-stone-100 d-flex justify-content-end gap-3 mt-8">
                <button type="button" onClick={() => setIsGuidelinesModalOpen(false)} className="px-6 py-2.5 rounded-xl border border-stone-200 text-[10px] fw-black text-uppercase tracking-widest text-stone-700 hover:bg-stone-50 transition">Discard</button>
                <button type="submit" className="px-6 py-2.5 rounded-xl bg-dark text-white text-[10px] fw-black text-uppercase tracking-widest hover:bg-stone-800 transition shadow-lg">Publish Guidelines</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDesigns;
