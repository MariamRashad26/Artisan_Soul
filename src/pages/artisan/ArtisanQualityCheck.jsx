import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const ArtisanQualityCheck = () => {
  const { id } = useParams();
  const orderId = id || 'AS-9421';

  const [checklist, setChecklist] = useState([
    { title: 'Stitching integrity', desc: 'Zero loose threads on welt and upper.', checked: true },
    { title: 'Grain Consistency', desc: 'Matched grain patterns between pairs.', checked: false },
    { title: 'Sole Attachment', desc: 'Clean edge finishing, no residue.', checked: false },
    { title: 'Structural Symmetry', desc: 'Toe caps aligned within 1mm.', checked: true },
    { title: 'Interior Comfort', desc: 'Smooth lining, no sharp edges.', checked: false },
    { title: 'Color Depth', desc: 'Consistent hand-burnished tones.', checked: false }
  ]);
  
  const [signed, setSigned] = useState(false);
  const [assessment, setAssessment] = useState('');

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [activeImage, setActiveImage] = useState(null); // URL string

  const navigate = useNavigate();
  const { user } = useAuth();
  const [orderDbId, setOrderDbId] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(`/api/orders/${encodeURIComponent(orderId)}`);
        setOrderDbId(data._id);
      } catch (err) {
        console.error(err);
      }
    };
    fetchOrder();
  }, [orderId]);

  const submitQcReport = async (status) => {
    try {
      const payload = {
        batch_id: orderDbId, // Using Order's ObjectId
        inspector_id: user?._id || '664536761ab2093ce14e5a32', // fallback dummy id if missing
        status: status,
        defects_found: assessment,
        comments: checklist.filter(c => !c.checked).map(c => c.title).join(', ')
      };
      await axios.post('/api/qc', payload);
      navigate('/artisan');
    } catch (error) {
      console.error('Failed to submit QC report:', error);
      alert('Error submitting report.');
    }
  };

  const toggleCheck = (index) => {
    const newList = [...checklist];
    newList[index].checked = !newList[index].checked;
    setChecklist(newList);
  };

  return (
    <div className="min-vh-100 bg-background-light font-display text-dark lg:pb-20">
      {/* Sticky Premium Header */}
      <header className="bg-white/80 backdrop-blur-xl border-bottom border-stone-200 px-6 lg:px-12 py-6 sticky-top z-40 shadow-sm animate-in slide-in-from-top duration-700">
        <div className="max-w-7xl mx-auto d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-6">
          <div className="d-flex align-items-center gap-5">
            <Link to="/artisan" className="size-12 rounded-xl bg-stone-50 border border-stone-200 d-flex align-items-center justify-content-center text-stone-400 hover:text-dark hover:bg-white hover:border-dark transition duration-500 shadow-sm group">
              <span className="material-symbols-outlined fs-4 group-hover:-translate-x-1 transition-transform">arrow_back</span>
            </Link>
            <div>
              <div className="d-flex align-items-center gap-3 text-primary mb-1">
                <span className="material-symbols-outlined fs-6">verified_user</span>
                <span className="text-[10px] fw-black text-uppercase tracking-[0.3em]">Final Atelier Inspection</span>
              </div>
              <h1 className="display-6 fw-black font-serif text-dark tracking-tighter mb-0 lowercase">Check.#{orderId}</h1>
            </div>
          </div>
          
          <div className="d-flex gap-3">
             <span className="px-5 py-3 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 text-xs fw-black text-uppercase tracking-widest d-flex align-items-center gap-2">
                <span className="size-2 bg-amber-500 rounded-full animate-pulse"></span>
                In Inspection
             </span>
          </div>
        </div>
      </header>

      {/* Modals */}
      <Modal show={showUploadModal} onHide={() => setShowUploadModal(false)} centered className="artisan-modal">
         <Modal.Header closeButton className="border-0">
            <Modal.Title className="fs-5 fw-black font-serif tracking-tight">Upload Detail View</Modal.Title>
         </Modal.Header>
         <Modal.Body className="p-5 text-center">
            <div className="size-20 bg-primary/10 text-primary rounded-full d-flex align-items-center justify-content-center mx-auto mb-4">
               <span className="material-symbols-outlined fs-1">add_photo_alternate</span>
            </div>
            <h4 className="fs-6 fw-bold text-dark mb-2">Upload visual evidence</h4>
            <p className="text-stone-400 text-xs mb-4">JPEG or PNG. High resolution preferred.</p>
            <Button variant="dark" className="w-100 py-3 rounded-xl fw-bold text-xs tracking-widest uppercase" onClick={() => setShowUploadModal(false)}>Browse Files</Button>
         </Modal.Body>
      </Modal>

      <Modal show={!!activeImage} onHide={() => setActiveImage(null)} centered size="xl" className="artisan-modal bg-dark/95">
         <Modal.Body className="p-0 bg-transparent text-center relative">
            <button onClick={() => setActiveImage(null)} className="position-absolute top-4 right-4 z-50 size-10 bg-black/50 text-white rounded-full d-flex align-items-center justify-content-center hover:bg-black transition">
               <span className="material-symbols-outlined">close</span>
            </button>
            <img src={activeImage} alt="Evidence Frame" className="img-fluid rounded-[2rem] max-h-[85vh] object-contain shadow-2xl mx-auto" />
         </Modal.Body>
      </Modal>

      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-10 animate-in fade-in slide-in-from-bottom duration-1000">
        <div className="row g-5">
          {/* Main Inspection Area */}
          <div className="col-lg-8 space-y-10">
            {/* Master Checklist */}
            <section className="glass-panel p-10 rounded-[3rem] border-stone-100 shadow-premium relative overflow-hidden">
               <div className="position-absolute top-[-20%] left-[-10%] size-96 bg-primary/5 rounded-full blur-[100px]"></div>
               
               <div className="d-flex align-items-center gap-4 mb-10 relative z-1">
                 <div className="size-14 bg-primary-10 rounded-2xl d-flex align-items-center justify-content-center text-primary shadow-inner">
                   <span className="material-symbols-outlined fs-2">task_alt</span>
                 </div>
                 <div>
                   <h3 className="text-[10px] fw-black text-stone-400 text-uppercase tracking-[0.4em] mb-1">Atelier Standards</h3>
                   <h4 className="fs-3 fw-black font-serif text-dark tracking-tight">Artisan Inspection Protocol</h4>
                 </div>
               </div>

               <div className="row row-cols-1 row-cols-md-2 g-6 relative z-1">
                 {checklist.map((item, idx) => (
                   <div key={idx} className="col">
                     <label className="d-block p-6 rounded-[2rem] border border-stone-100 bg-white/50 hover:bg-white hover:border-primary/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 cursor-pointer group">
                       <input type="checkbox" className="d-none" checked={item.checked} onChange={() => toggleCheck(idx)} />
                       <div className="d-flex align-items-start gap-4">
                         <div className={`size-6 rounded-lg border-2 mt-1 transition-all duration-500 d-flex align-items-center justify-content-center ${item.checked ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-110' : 'border-stone-200 group-hover:border-primary'}`}>
                           {item.checked && <span className="material-symbols-outlined text-[14px] fw-black">check</span>}
                         </div>
                         <div>
                           <h5 className={`fs-6 fw-black mb-1 transition-colors duration-500 ${item.checked ? 'text-primary' : 'text-dark group-hover:text-primary'}`}>{item.title}</h5>
                           <p className="text-stone-500 text-[13px] fw-medium leading-relaxed mb-0">{item.desc}</p>
                         </div>
                       </div>
                     </label>
                   </div>
                 ))}
               </div>
            </section>

            {/* Evidence Gallery */}
            <section className="bg-stone-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
               <div className="position-absolute bottom-[-10%] right-[-10%] size-80 bg-primary/10 rounded-full blur-[100px] group-hover:scale-110 transition-transform duration-1000"></div>
               
               <div className="d-flex justify-content-between align-items-center mb-10 relative z-1">
                 <div className="d-flex align-items-center gap-4">
                    <span className="material-symbols-outlined text-primary fs-2 bg-white/5 p-3 rounded-2xl shadow-inner border border-white/5">camera_enhance</span>
                    <div>
                      <h4 className="fs-4 fw-black font-serif tracking-tight mb-1">High-Fidelity Evidence</h4>
                      <p className="text-white/40 text-[10px] fw-black tracking-[0.3em] text-uppercase mb-0">Atelier Archives No. 94</p>
                    </div>
                 </div>
                 <button onClick={() => setShowUploadModal(true)} className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] fw-black tracking-widest uppercase border border-white/10 transition duration-500">
                   ADD VIEW
                 </button>
               </div>

               <div className="row g-4 relative z-1">
                 {[
                   { label: 'Welt Detail', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC38ZqD6oE1kniLvDNXzPtPckdrkAz8PqO-ZR0Jzg_2x-eI4iEt--BFwoghe_RWTX4LyGFjzlloPlZgJoB2um-p7RzpqfPY8ET1tZZOG-RmTOYq8JzUody3DsSxHuccbvDNjazYP_K3b8ihVwXS-OWaVvMZWBwEWA5NgmdO2vEXzWkQ2eE-SyU4IdH0wwJGZtVr5OL0f5HyaVW6C0YoLC3FPm2_uJPGO-lSYVpdiI6-40w4FK6KKu4BGYpi6TwitWU0YXIUR_Nli9ho' },
                   { label: 'Toe Symmetry', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBYcbgfCe2orIt1gTXg7dm8GPoYN_q0LMQknpHo7BIGtHjzqiDRBNptp5HR3Lrz4wfmWnr3ncUavxpWDO4GBArsC7Y9TTPtPEclVhBR6HmlkyI12iPOoTZOseb-nwioQ0Yr_bmD6txq3rQbXbt8e7R79s59EKu-ekAv55CnVXWWOJhEYNL3r65WcaS9_xeD-idipUJjw8tgesKpbl8PVq8bTwXKdRbjHSarqMnAA67ZbZ5jKQTSsfK-O-HcZ6vVudpQKdEMW-oksSjL' },
                   { label: 'Finish Verification', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCim8wtadXtnKEufK_mYVM0lMVqSKQ0rSHTOwminc19AUqdfFHu8s02TyKjBMJ_ZPHQCJtV3YDdmtFQ9g4WEqHWVrbQoFbZ3PWbnZ9FQeiRClqBAunnEH5vKpHAn6syVUiA4uijDV9vJJlcVjq845wMjUIomQ7MHemBHlXv8mNLTcqEdZdS5l1kNJlgMkL9tWCLEUW_rYz8-L1drZ-7JRT1KiXSX9DgR5mciyroF3lvM7yN3n-UvQWxGlREkAngm-Yw0MJ6B99zRMTu' }
                 ].map((img, i) => (
                   <div key={i} className="col-md-4">
                     <div onClick={() => setActiveImage(img.url)} className="aspect-ratio-square bg-white/5 rounded-[2rem] overflow-hidden border border-white/10 group-img cursor-pointer position-relative shadow-2xl">
                        <div className="w-100 h-100 bg-cover bg-center group-hover:scale-110 transition-transform duration-1000 opacity-60 group-hover:opacity-100" style={{ backgroundImage: `url('${img.url}')` }}></div>
                        <div className="position-absolute bottom-4 left-0 right-0 text-center">
                           <span className="text-[10px] fw-black tracking-widest uppercase bg-dark/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/5">{img.label}</span>
                        </div>
                     </div>
                   </div>
                 ))}
               </div>
            </section>
          </div>

          {/* Sidebar Actions */}
          <div className="col-lg-4 space-y-10">
            {/* Endorsement Card */}
            <section className="bg-white rounded-[3rem] border border-stone-100 shadow-premium p-10 h-100 lg:h-auto overflow-hidden group">
               <h3 className="text-[10px] fw-black text-stone-400 text-uppercase tracking-[0.4em] mb-10">Craft Certification</h3>
               
               <div className="space-y-8">
                 <div className="relative">
                   <textarea value={assessment} onChange={(e) => setAssessment(e.target.value)} className="w-100 bg-stone-50 border border-stone-200 rounded-[2rem] p-6 fs-6 fw-medium outline-none focus:ring-4 focus:ring-primary/10 transition-all duration-500 resize-none h-40 lowercase font-serif italic" placeholder="final.craft.assessment..."></textarea>
                   <div className="position-absolute bottom-4 right-6 text-stone-300 text-[10px] fw-black">ATELIER LOG ENTRY</div>
                 </div>

                 <div onClick={() => setSigned(!signed)} className={`p-8 rounded-[2.5rem] border text-center relative overflow-hidden group-sign cursor-pointer transition-all duration-500 ${signed ? 'bg-primary/5 border-primary/30' : 'bg-stone-50 border-stone-100 hover:border-primary/30'}`}>
                    <div className="position-absolute inset-0 bg-primary/0 group-hover:bg-primary/[0.02] transition-colors duration-500"></div>
                    <p className={`text-[10px] fw-black tracking-[0.3em] uppercase mb-6 ${signed ? 'text-primary' : 'text-stone-300'}`}>Digital Signature</p>
                    <h4 className={`display-5 font-serif fw-light mb-2 tracking-tighter cursor-default select-none pointer-events-none transition-opacity ${signed ? 'text-primary opacity-100' : 'text-dark opacity-100'}`}>Marco V. Cellini</h4>
                    <div className={`w-32 mx-auto h-[1px] mb-3 ${signed ? 'bg-primary/50' : 'bg-primary/20'}`}></div>
                    <p className="text-[9px] fw-black text-primary tracking-widest uppercase mb-0">VERIFIED ID: ART-2495-992</p>
                    <div className="position-absolute top-4 right-6 transition-opacity">
                      {signed ? <span className="material-symbols-outlined fs-4 text-emerald-500">verified</span> : <span className="material-symbols-outlined fs-4 text-primary opacity-20 group-hover:opacity-100">draw</span>}
                    </div>
                 </div>

                 <div className="space-y-4 pt-10 border-top border-stone-100">
                   <button onClick={() => submitQcReport('Passed')} disabled={!orderDbId} className="w-100 py-5 rounded-3xl bg-primary text-white fw-black text-xs text-uppercase tracking-[0.4em] shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition duration-500 d-flex align-items-center justify-content-center gap-4">
                      Pass Inspection
                      <span className="material-symbols-outlined fs-4">verified</span>
                   </button>
                   <button onClick={() => submitQcReport('Rework')} disabled={!orderDbId} className="w-100 py-5 rounded-3xl bg-rose-50 text-rose-600 border border-rose-100 fw-black text-xs text-uppercase tracking-[0.4em] hover:bg-rose-600 hover:text-white transition duration-500 d-flex align-items-center justify-content-center gap-4">
                      Flag Rework
                      <span className="material-symbols-outlined fs-4">flag</span>
                   </button>
                 </div>

                 <div className="p-6 bg-stone-900 rounded-[2rem] text-white/50 text-[11px] fw-bold leading-relaxed d-flex gap-4">
                    <span className="material-symbols-outlined text-amber-500 fs-4">info</span>
                    <p className="mb-0">"By endorsing this certificate, you acknowledge that the item conforms to Artisan Soul's Grade-A Heritage standards."</p>
                 </div>
               </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ArtisanQualityCheck;
