import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import axios from '../../utils/axiosInstance';
import { useAuth } from '../../context/AuthContext';

const ArtisanQualityCheck = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [checklist, setChecklist] = useState([
    { title: 'Stitching integrity', desc: 'Zero loose threads on welt and upper.', checked: true },
    { title: 'Grain Consistency', desc: 'Matched grain patterns between pairs.', checked: false },
    { title: 'Sole Attachment', desc: 'Clean edge finishing, no residue.', checked: false },
    { title: 'Structural Symmetry', desc: 'Toe caps aligned within 1mm.', checked: true },
    { title: 'Interior Comfort', desc: 'Smooth lining, no sharp edges.', checked: false },
    { title: 'Color Depth', desc: 'Consistent hand-burnished tones.', checked: false }
  ]);
  
  const [assessment, setAssessment] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [activeImage, setActiveImage] = useState(null);

  const [orderDbId, setOrderDbId] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [allOrders, setAllOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // 1. Fetch all orders on mount to support the fallback select dropdown
  useEffect(() => {
    const loadAllOrders = async () => {
      try {
        const { data } = await axios.get('/api/orders');
        setAllOrders(data || []);
      } catch (err) {
        console.error('Failed to load orders list', err);
      }
    };
    loadAllOrders();
  }, []);

  // 2. Resolve target order based on URL param 'id' or manually selected orderId
  useEffect(() => {
    const fetchOrder = async () => {
      const targetId = selectedOrderId || id;
      if (!targetId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setErrorMessage('');

      // Try different common order ID formats
      const formatsToTry = [
        targetId,
        `#${targetId}`,
        `#AS-${targetId}`,
        targetId.replace(/^AS-/, ''),
        targetId.replace(/^#AS-/, ''),
      ].filter(Boolean);

      let foundOrder = null;
      for (const ref of formatsToTry) {
        try {
          const { data } = await axios.get(`/api/orders/${encodeURIComponent(ref)}`);
          if (data) {
            foundOrder = data;
            break;
          }
        } catch (_) {
          // try next format
        }
      }

      if (foundOrder) {
        setOrderData(foundOrder);
        setOrderDbId(foundOrder._id);
        setSelectedOrderId(foundOrder.orderId || foundOrder._id);
      } else {
        setOrderData(null);
        setOrderDbId(null);
        setErrorMessage(`Could not find order "${targetId}". Please select an order below.`);
      }
      setLoading(false);
    };

    fetchOrder();
  }, [id, selectedOrderId]);

  // If no ID is in the URL and we haven't selected one, try to auto-select the first order awaiting QC
  useEffect(() => {
    if (!id && !selectedOrderId && allOrders.length > 0) {
      const awaitingQc = allOrders.find(o => o.status === 'Quality Check' || o.phase === 'Quality Control');
      if (awaitingQc) {
        setSelectedOrderId(awaitingQc.orderId || awaitingQc._id);
      }
    }
  }, [id, selectedOrderId, allOrders]);

  const submitQcReport = async (qcStatus) => {
    if (!orderDbId) {
      alert('No active order loaded to submit report for.');
      return;
    }

    try {
      const uncheckedItems = checklist.filter(c => !c.checked);
      const payload = {
        batch_id: orderDbId,
        inspector_id: user?._id || '664536761ab2093ce14e5a32', // fallback admin/inspector ID
        status: qcStatus,
        defects_found: String(uncheckedItems.length),
        comments: assessment || (uncheckedItems.length > 0 
          ? `Unchecked: ${uncheckedItems.map(c => c.title).join(', ')}`
          : 'All checks passed.')
      };
      await axios.post('/api/qc', payload);
      
      // Update order status in the database
      await axios.put(`/api/orders/${orderDbId}`, {
        status: qcStatus === 'Passed' ? 'Completed' : 'Failed QC',
        progress: qcStatus === 'Passed' ? 100 : 80,
        phase: qcStatus === 'Passed' ? 'Finished' : 'Quality Control'
      });

      alert(`Quality Control Report submitted successfully as: ${qcStatus}!`);
      navigate('/artisan');
    } catch (error) {
      console.error('Failed to submit QC report:', error);
      alert('Error submitting report. Check console.');
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
              <h1 className="display-6 fw-black font-serif text-dark tracking-tighter mb-0 lowercase">
                Check.#{orderData?.orderId || id || 'Select Order'}
              </h1>
            </div>
          </div>
          
          <div className="d-flex gap-3 align-items-center">
             {/* Dropdown to switch orders if necessary */}
             <div className="d-flex align-items-center gap-2">
               <span className="text-[10px] fw-black text-uppercase tracking-wider text-stone-500">Target:</span>
               <select 
                 value={selectedOrderId}
                 onChange={(e) => setSelectedOrderId(e.target.value)}
                 className="px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs fw-bold text-dark outline-none cursor-pointer"
               >
                 <option value="">-- Choose Order --</option>
                 {allOrders.map(o => (
                   <option key={o._id} value={o.orderId || o._id}>
                     {o.orderId || o._id} ({o.model} - {o.phase})
                   </option>
                 ))}
               </select>
             </div>

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
        
        {loading && (
          <div className="text-center py-10">
            <div className="spinner-border text-primary" role="status" />
            <p className="mt-3 text-stone-500 fw-bold">Loading Order Information...</p>
          </div>
        )}

        {errorMessage && !loading && (
          <div className="alert alert-warning p-5 rounded-2xl mb-8 d-flex align-items-center gap-3">
            <span className="material-symbols-outlined fs-3 text-amber-700">warning</span>
            <div>
              <p className="fw-bold mb-1 text-amber-800">{errorMessage}</p>
              <p className="text-xs text-amber-700 mb-0">Select an active order from the dropdown in the header to perform inspection.</p>
            </div>
          </div>
        )}

        {!loading && (
          <div className="row g-5">
            {/* Main Inspection Area */}
            <div className="col-lg-8 space-y-10">
              {/* Master Checklist */}
              <section className="glass-panel p-10 rounded-[3rem] border-stone-100 shadow-premium relative overflow-hidden bg-white">
                 <div className="position-absolute top-[-20%] left-[-10%] size-96 bg-primary/5 rounded-full blur-[100px]"></div>
                 
                 <div className="d-flex align-items-center justify-content-between mb-10 relative z-1 flex-wrap gap-4">
                   <div className="d-flex align-items-center gap-4">
                     <div className="size-14 bg-primary-10 rounded-2xl d-flex align-items-center justify-content-center text-primary shadow-inner">
                       <span className="material-symbols-outlined fs-2">task_alt</span>
                     </div>
                     <div>
                       <h3 className="text-[10px] fw-black text-stone-400 text-uppercase tracking-[0.4em] mb-1">Atelier Standards</h3>
                       <h4 className="fs-3 fw-black font-serif text-dark tracking-tight">Artisan Inspection Protocol</h4>
                     </div>
                   </div>
                   {orderData && (
                     <span className="badge bg-primary px-3 py-2 rounded-xl text-[10px] fw-black text-uppercase tracking-widest text-white">
                       {orderData.model} ({orderData.patron})
                     </span>
                   )}
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
            </div>

            {/* Sidebar Actions */}
            <div className="col-lg-4 space-y-10">
              {/* Endorsement Card */}
              <section className="bg-white rounded-[3rem] border border-stone-100 shadow-premium p-10 h-100 lg:h-auto overflow-hidden group">
                 <h3 className="text-[10px] fw-black text-stone-400 text-uppercase tracking-[0.4em] mb-10">Quality Inspection</h3>
                 
                 <div className="space-y-8">
                   <div className="relative">
                     <textarea 
                       value={assessment} 
                       onChange={(e) => setAssessment(e.target.value)} 
                       className="w-100 bg-stone-50 border border-stone-200 rounded-[2rem] p-6 fs-6 fw-medium outline-none focus:ring-4 focus:ring-primary/10 transition-all duration-500 resize-none h-40 lowercase font-serif italic" 
                       placeholder="final.craft.assessment..."
                     />
                     <div className="position-absolute bottom-4 right-6 text-stone-300 text-[10px] fw-black">ATELIER LOG ENTRY</div>
                   </div>

                   <div className="space-y-4 pt-10 border-top border-stone-100">
                     <button 
                       onClick={() => submitQcReport('Passed')} 
                       disabled={!orderDbId} 
                       className="w-100 py-5 rounded-3xl bg-primary text-white fw-black text-xs text-uppercase tracking-[0.4em] shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition duration-500 d-flex align-items-center justify-content-center gap-4 border-0"
                       style={{ opacity: !orderDbId ? 0.5 : 1 }}
                     >
                        Pass Inspection
                        <span className="material-symbols-outlined fs-4">verified</span>
                     </button>
                     <button 
                       onClick={() => submitQcReport('Failed')} 
                       disabled={!orderDbId} 
                       className="w-100 py-4 rounded-3xl bg-rose-500 hover:bg-rose-600 text-white fw-black text-xs text-uppercase tracking-[0.4em] shadow-xl shadow-rose-500/20 hover:shadow-rose-500/40 hover:-translate-y-1 transition duration-500 d-flex align-items-center justify-content-center gap-4 border-0"
                       style={{ opacity: !orderDbId ? 0.5 : 1 }}
                     >
                        Fail / Report Defect
                        <span className="material-symbols-outlined fs-4">gavel</span>
                     </button>
                   </div>
                 </div>
              </section>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ArtisanQualityCheck;
