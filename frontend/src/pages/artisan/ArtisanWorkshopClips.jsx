// import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { Modal, Button } from 'react-bootstrap';
// import axios from '../../utils/axiosInstance';

// const ArtisanWorkshopClips = () => {
//   const [showUploadModal, setShowUploadModal] = useState(false);
//   const [showPlayerModal, setShowPlayerModal] = useState(false);
//   const [activeVideo, setActiveVideo] = useState(null);

//   const [filter, setFilter] = useState('All');
//   const [clips, setClips] = useState([]);
//   const [uploadUrl, setUploadUrl] = useState('');
//   const [uploadTitle, setUploadTitle] = useState('');

//   useEffect(() => {
//     const fetchClips = async () => {
//       try {
//         const { data } = await axios.get('/api/clips');
//         const formatted = data.map(c => ({
//           dbId: c._id,
//           id: c.order_id?.orderId || '#AS-9999',
//           tag: c.status || 'Stitching',
//           title: c.duration || 'Workshop Clip',
//           url: c.video_url,
//           duration: c.duration || '0:20',
//           views: 'Sent'
//         }));
//         setClips(formatted);
//       } catch (error) {
//         console.error('Error fetching clips:', error);
//       }
//     };
//     fetchClips();
//   }, []);

//   const handleUpload = async () => {
//     if (!uploadUrl || !uploadTitle) {
//       alert("Please enter a Title and a Media URL.");
//       return;
//     }
    
//     try {
//       const newClip = {
//         // Need to pass valid object IDs if possible, but the schema accepts strings if properly cast
//         video_url: uploadUrl,
//         thumbnail_url: uploadUrl,
//         duration: '0:20',
//         status: filter === 'All' ? 'Stitching' : filter
//       };

//       const { data } = await axios.post('/api/clips', newClip);
//       const formattedData = {
//           dbId: data._id,
//           id: data.order_id?.orderId || '#AS-9999',
//           tag: data.status || 'Stitching',
//           title: uploadTitle,
//           url: data.video_url,
//           duration: data.duration || '0:20',
//           views: 'Sent'
//       };
//       setClips([formattedData, ...clips]);
//       setShowUploadModal(false);
//       setUploadUrl('');
//       setUploadTitle('');
//     } catch (error) {
//       console.error('Error uploading clip:', error);
//       alert('Upload failed. Is the backend running?');
//     }
//   };

//   const filteredClips = filter === 'All' ? clips : clips.filter(c => c.tag === filter);

//   const handlePlayClip = (clip) => {
//     setActiveVideo(clip);
//     setShowPlayerModal(true);
//   };
//   return (
//     <div className="min-vh-100 bg-background-light font-display text-dark lg:pb-20">
//       <header className="bg-white/80 backdrop-blur-xl border-bottom border-stone-200 px-6 lg:px-12 py-6 sticky-top z-40 shadow-sm animate-in slide-in-from-top duration-700">
//         <div className="max-w-7xl mx-auto d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-6">
//           <div className="d-flex align-items-center gap-5">
//             <Link to="/artisan" className="size-12 rounded-xl bg-stone-50 border border-stone-200 d-flex align-items-center justify-content-center text-stone-400 hover:text-dark hover:bg-white hover:border-dark transition duration-500 shadow-sm group">
//               <span className="material-symbols-outlined fs-4 group-hover:-translate-x-1 transition-transform">arrow_back</span>
//             </Link>
//             <div>
//               <div className="d-flex align-items-center gap-3 text-primary mb-1">
//                 <span className="material-symbols-outlined fs-6">video_library</span>
//                 <span className="text-[10px] fw-black text-uppercase tracking-[0.3em]">Behind The Seams</span>
//               </div>
//               <h1 className="display-6 fw-black font-serif text-dark tracking-tighter mb-0 lowercase">Workshop.Clips</h1>
//             </div>
//           </div>
//           <button onClick={() => setShowUploadModal(true)} className="px-6 py-3.5 rounded-2xl bg-dark text-white fw-black text-xs text-uppercase tracking-widest shadow-xl hover:-translate-y-1 transition duration-500 d-flex align-items-center gap-3">
//              <span className="material-symbols-outlined fs-5">upload</span>
//              Publish Clip
//           </button>
//         </div>
//       </header>

//       <Modal show={showUploadModal} onHide={() => setShowUploadModal(false)} centered className="artisan-modal">
//          <Modal.Header closeButton className="border-0">
//             <Modal.Title className="fs-5 fw-black font-serif tracking-tight">Upload Production Clip</Modal.Title>
//          </Modal.Header>
//          <Modal.Body className="p-5 text-center">
//             <div className="size-20 bg-primary/10 text-primary rounded-full d-flex align-items-center justify-content-center mx-auto mb-4">
//                <span className="material-symbols-outlined fs-1">cloud_upload</span>
//             </div>
//             <h4 className="fs-6 fw-bold text-dark mb-4">Publish Clip to Database</h4>
            
//             <div className="mb-4 text-start">
//                <label className="text-[10px] fw-black tracking-widest text-uppercase text-stone-500 mb-2">Clip Title</label>
//                <input type="text" className="form-control rounded-xl py-3 text-sm border-stone-200" placeholder="e.g. Burnishing the lateral edges" value={uploadTitle} onChange={(e) => setUploadTitle(e.target.value)} />
//             </div>

//             <div className="mb-6 text-start">
//                <label className="text-[10px] fw-black tracking-widest text-uppercase text-stone-500 mb-2">Media URL</label>
//                <input type="text" className="form-control rounded-xl py-3 text-sm border-stone-200" placeholder="https://image-url.com" value={uploadUrl} onChange={(e) => setUploadUrl(e.target.value)} />
//             </div>

//             <Button variant="dark" className="w-100 py-3 rounded-xl fw-bold text-xs tracking-widest uppercase shadow-lg shadow-dark/20" onClick={handleUpload}>Confirm & Publish</Button>
//          </Modal.Body>
//       </Modal>

//       <Modal show={showPlayerModal} onHide={() => setShowPlayerModal(false)} centered size="lg" className="artisan-modal bg-dark/90">
//          <Modal.Body className="p-0 bg-transparent relative">
//             <button onClick={() => setShowPlayerModal(false)} className="position-absolute top-4 right-4 z-50 size-10 bg-black/50 text-white rounded-full d-flex align-items-center justify-content-center hover:bg-black transition">
//                <span className="material-symbols-outlined">close</span>
//             </button>
//             {activeVideo && (
//               <div className="bg-dark rounded-[2rem] overflow-hidden aspect-video relative">
//                  <div className="w-100 h-100 bg-cover bg-center opacity-80" style={{ backgroundImage: `url('${activeVideo.url}')` }}></div>
//                  <div className="position-absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
//                     <h3 className="text-white fs-4 fw-black mb-1">{activeVideo.title}</h3>
//                     <p className="text-white/60 text-xs fw-bold tracking-widest uppercase mb-0">{activeVideo.tag} • {activeVideo.duration}</p>
//                  </div>
//                  <div className="position-absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-20 bg-white/10 backdrop-blur-md rounded-full d-flex align-items-center justify-content-center text-white cursor-pointer hover:bg-white/20 transition">
//                     <span className="material-symbols-outlined fs-1 ps-1">play_arrow</span>
//                  </div>
//               </div>
//             )}
//          </Modal.Body>
//       </Modal>

//       <main className="max-w-7xl mx-auto px-6 lg:px-12 py-10 animate-in fade-in slide-in-from-bottom duration-1000">
//         <div className="row g-5">
//            {/* Upload CTA Header */}
//            <div className="col-12">
//               <div className="bg-stone-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
//                  <div className="position-absolute top-[-10%] right-[-10%] size-80 bg-primary/20 rounded-full blur-[100px] group-hover:scale-110 transition-transform duration-1000"></div>
//                  <div className="row align-items-center relative z-1">
//                     <div className="col-md-8">
//                        <h2 className="fs-3 fw-black font-serif tracking-tight mb-2">Share the Craft.</h2>
//                        <p className="text-white/60 fs-6 fw-medium leading-relaxed mb-6">Clients love seeing their bespoke creations come to life. Upload a quick 10-second clip of you hand-stitching or burnishing their exact pair directly to their portal.</p>
//                        <div className="d-flex gap-4">
//                           <button onClick={() => setShowUploadModal(true)} className="px-6 py-3.5 bg-primary text-white rounded-xl fw-black text-[10px] text-uppercase tracking-widest hover:-translate-y-1 transition-transform shadow-lg shadow-primary/40 d-flex align-items-center gap-2">
//                              <span className="material-symbols-outlined fs-5">camera_roll</span>
//                              Select Media
//                           </button>
//                           <button onClick={() => setShowUploadModal(true)} className="px-6 py-3.5 bg-white text-dark rounded-xl border border-white fw-black text-[10px] text-uppercase tracking-widest hover:border-stone-200 transition-colors shadow-lg shadow-dark/5 d-flex align-items-center gap-2">
//                              <span className="material-symbols-outlined fs-5">smartphone</span>
//                              From Mobile App
//                           </button>
//                        </div>
//                     </div>
//                     <div className="col-md-4 d-none d-md-flex justify-content-end">
//                        <div className="size-32 rounded-full border border-white/10 d-flex align-items-center justify-content-center text-primary ripple-effect bg-white/5 backdrop-blur-md">
//                           <span className="material-symbols-outlined display-4">videocam</span>
//                        </div>
//                     </div>
//                  </div>
//               </div>
//            </div>

//            {/* Video Library Grid */}
//            <div className="col-12 mt-10">
//               <div className="d-flex justify-content-between align-items-end mb-8">
//                  <h3 className="fs-5 fw-black text-dark tracking-tighter text-uppercase">Published Archives <span className="ms-2 text-stone-400 fs-6">(04)</span></h3>
//                  <div className="d-flex gap-2">
//                     <span onClick={() => setFilter('All')} className={`badge border-0 pt-2 px-3 rounded-lg text-[10px] fw-black tracking-widest cursor-pointer transition ${filter === 'All' ? 'bg-primary/10 text-primary' : 'bg-stone-100 text-stone-500 hover:bg-stone-200'}`}>All</span>
//                     <span onClick={() => setFilter('Stitching')} className={`badge border-0 pt-2 px-3 rounded-lg text-[10px] fw-black tracking-widest cursor-pointer transition ${filter === 'Stitching' ? 'bg-primary/10 text-primary' : 'bg-white border text-stone-400 hover:bg-stone-50'}`}>Stitching</span>
//                     <span onClick={() => setFilter('Polishing')} className={`badge border-0 pt-2 px-3 rounded-lg text-[10px] fw-black tracking-widest cursor-pointer transition ${filter === 'Polishing' ? 'bg-primary/10 text-primary' : 'bg-white border text-stone-400 hover:bg-stone-50'}`}>Polishing</span>
//                  </div>
//               </div>

//               <div className="row g-5">
//                  {filteredClips.map((clip, i) => (
//                     <div key={i} className="col-md-4">
//                        <div onClick={() => handlePlayClip(clip)} className="bg-white rounded-[2rem] p-4 border border-stone-100 shadow-premium hover:shadow-2xl transition duration-500 hover:-translate-y-1 group cursor-pointer">
//                           <div className="aspect-ratio-square rounded-2xl overflow-hidden position-relative mb-4 bg-dark">
//                              <div className="w-100 h-100 bg-cover bg-center opacity-70 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700" style={{ backgroundImage: `url('${clip.url}')` }}></div>
//                              <div className="position-absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-12 rounded-full bg-white/20 backdrop-blur-md border border-white/50 d-flex align-items-center justify-content-center text-white scale-90 group-hover:scale-110 transition-transform">
//                                 <span className="material-symbols-outlined fs-3 ps-1">play_arrow</span>
//                              </div>
//                              <div className="position-absolute bottom-3 right-3 px-2 py-1 bg-dark/80 backdrop-blur-md text-white rounded text-[10px] fw-black tracking-widest">{clip.duration}</div>
//                              <div className="position-absolute top-3 left-3 px-3 py-1 bg-primary text-white rounded-lg text-[10px] fw-black tracking-widest text-uppercase shadow-md">{clip.tag}</div>
//                           </div>
//                           <div className="px-2 pb-2">
//                              <h4 className="fs-6 fw-black text-dark tracking-tight mb-1">{clip.title}</h4>
//                              <div className="d-flex justify-content-between align-items-center">
//                                 <p className="text-stone-400 text-xs fw-bold mb-0">For Order: <span className="text-primary">{clip.id}</span></p>
//                                 <span className={`text-[10px] fw-black text-uppercase tracking-widest d-flex align-items-center gap-1 ${clip.views === 'Seen' ? 'text-emerald-500' : 'text-stone-400'}`}>
//                                    {clip.views === 'Seen' && <span className="material-symbols-outlined fs-6">done_all</span>}
//                                    {clip.views === 'Sent' && <span className="material-symbols-outlined fs-6">check</span>}
//                                    {clip.views}
//                                 </span>
//                              </div>
//                           </div>
//                        </div>
//                     </div>
//                  ))}
//               </div>
//            </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default ArtisanWorkshopClips;
// import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { Modal, Button } from 'react-bootstrap';
// import axios from 'axios';

// const ArtisanWorkshopClips = () => {
//   const [showUploadModal, setShowUploadModal]   = useState(false);
//   const [showPlayerModal, setShowPlayerModal]   = useState(false);
//   const [showEditModal, setShowEditModal]       = useState(false);
//   const [activeVideo, setActiveVideo]           = useState(null);
//   const [editingClip, setEditingClip]           = useState(null);
//   const [filter, setFilter]                     = useState('All');
//   const [clips, setClips]                       = useState([]);

//   const [uploadUrl, setUploadUrl]     = useState('');
//   const [uploadTitle, setUploadTitle] = useState('');
//   const [uploadTag, setUploadTag]     = useState('Stitching');

//   const fetchClips = async () => {
//     try {
//       const { data } = await axios.get('/api/clips');
//       setClips(data.map(c => ({
//         dbId:     c._id,
//         id:       c.order_id?.orderId || '#AS-9999',
//         tag:      c.tag || 'Stitching',
//         title:    c.title || 'Workshop Clip',
//         url:      c.video_url,
//         duration: c.duration || '0:20',
//         views:    c.views || 'Sent',
//         status:   c.status || 'Pending Review'
//       })));
//     } catch (err) { console.error(err); }
//   };

//   useEffect(() => { fetchClips(); }, []);

//   const filteredClips = filter === 'All' ? clips : clips.filter(c => c.tag === filter);

//   const handleUpload = async () => {
//     if (!uploadUrl || !uploadTitle) { alert('Please enter a Title and Media URL.'); return; }
//     try {
//       await axios.post('/api/clips', {
//         video_url:     uploadUrl,
//         thumbnail_url: uploadUrl,
//         title:         uploadTitle,
//         tag:           uploadTag,
//         duration:      '0:20',
//         status:        'Pending Review'
//       });
//       setShowUploadModal(false);
//       setUploadUrl(''); setUploadTitle(''); setUploadTag('Stitching');
//       fetchClips();
//     } catch (err) { console.error(err); alert('Upload failed. Is the backend running?'); }
//   };

//   const handleUpdate = async () => {
//     if (!editingClip) return;                                              // ← FIX
//     if (!editingClip.title || !editingClip.url) { alert('Title and URL are required.'); return; }
//     try {
//       await axios.put(`/api/clips/${editingClip.dbId}`, {
//         title:         editingClip.title,
//         tag:           editingClip.tag,
//         duration:      editingClip.duration,
//         video_url:     editingClip.url,
//         thumbnail_url: editingClip.url
//       });
//       setShowEditModal(false);
//       setEditingClip(null);
//       fetchClips();
//     } catch (err) { console.error(err); alert('Update failed.'); }
//   };

//   const handleDelete = async (dbId) => {
//     if (!window.confirm('Remove this clip permanently?')) return;
//     try {
//       await axios.delete(`/api/clips/${dbId}`);
//       fetchClips();
//     } catch (err) { console.error(err); alert('Delete failed.'); }
//   };

//   const openEdit = (clip) => { setEditingClip({ ...clip }); setShowEditModal(true); };
//   const handlePlayClip = (clip) => { setActiveVideo(clip); setShowPlayerModal(true); };

//   return (
//     <div className="min-vh-100 bg-background-light font-display text-dark lg:pb-20">

//       {/* ── Header ── */}
//       <header className="bg-white/80 backdrop-blur-xl border-bottom border-stone-200 px-6 lg:px-12 py-6 sticky-top z-40 shadow-sm animate-in slide-in-from-top duration-700">
//         <div className="max-w-7xl mx-auto d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-6">
//           <div className="d-flex align-items-center gap-5">
//             <Link to="/artisan" className="size-12 rounded-xl bg-stone-50 border border-stone-200 d-flex align-items-center justify-content-center text-stone-400 hover:text-dark hover:bg-white hover:border-dark transition duration-500 shadow-sm group">
//               <span className="material-symbols-outlined fs-4 group-hover:-translate-x-1 transition-transform">arrow_back</span>
//             </Link>
//             <div>
//               <div className="d-flex align-items-center gap-3 text-primary mb-1">
//                 <span className="material-symbols-outlined fs-6">video_library</span>
//                 <span className="text-[10px] fw-black text-uppercase tracking-[0.3em]">Behind The Seams</span>
//               </div>
//               <h1 className="display-6 fw-black font-serif text-dark tracking-tighter mb-0 lowercase">Workshop.Clips</h1>
//             </div>
//           </div>
//           <button onClick={() => setShowUploadModal(true)} className="px-6 py-3.5 rounded-2xl bg-dark text-white fw-black text-xs text-uppercase tracking-widest shadow-xl hover:-translate-y-1 transition duration-500 d-flex align-items-center gap-3">
//             <span className="material-symbols-outlined fs-5">upload</span>
//             Publish Clip
//           </button>
//         </div>
//       </header>

//       {/* ── Upload Modal ── */}
//       <Modal show={showUploadModal} onHide={() => setShowUploadModal(false)} centered className="artisan-modal">
//         <Modal.Header closeButton className="border-0">
//           <Modal.Title className="fs-5 fw-black font-serif tracking-tight">Upload Production Clip</Modal.Title>
//         </Modal.Header>
//         <Modal.Body className="p-5">
//           <div className="mb-4">
//             <label className="text-[10px] fw-black tracking-widest text-uppercase text-stone-500 mb-2 d-block">Clip Title</label>
//             <input type="text" className="form-control rounded-xl py-3 text-sm border-stone-200" placeholder="e.g. Burnishing the lateral edges" value={uploadTitle} onChange={e => setUploadTitle(e.target.value)} />
//           </div>
//           <div className="mb-4">
//             <label className="text-[10px] fw-black tracking-widest text-uppercase text-stone-500 mb-2 d-block">Tag</label>
//             <select className="form-control rounded-xl py-3 text-sm border-stone-200" value={uploadTag} onChange={e => setUploadTag(e.target.value)}>
//               {['Stitching','Polishing','Cutting','Lasting','Hand Stitching'].map(t => <option key={t}>{t}</option>)}
//             </select>
//           </div>
//           <div className="mb-6">
//             <label className="text-[10px] fw-black tracking-widest text-uppercase text-stone-500 mb-2 d-block">Media URL</label>
//             <input type="text" className="form-control rounded-xl py-3 text-sm border-stone-200" placeholder="https://video-url.com/clip.mp4" value={uploadUrl} onChange={e => setUploadUrl(e.target.value)} />
//           </div>
//           <Button variant="dark" className="w-100 py-3 rounded-xl fw-bold text-xs tracking-widest uppercase shadow-lg" onClick={handleUpload}>Confirm & Publish</Button>
//         </Modal.Body>
//       </Modal>

//       {/* ── Edit Modal ── */}
//       <Modal show={showEditModal} onHide={() => { setShowEditModal(false); setEditingClip(null); }} centered className="artisan-modal">
//         <Modal.Header closeButton className="border-0">
//           <Modal.Title className="fs-5 fw-black font-serif tracking-tight">Edit Clip</Modal.Title>
//         </Modal.Header>
//         <Modal.Body className="p-5">
//           {editingClip && (
//             <>
//               <div className="mb-4">
//                 <label className="text-[10px] fw-black tracking-widest text-uppercase text-stone-500 mb-2 d-block">Clip Title</label>
//                 <input type="text" className="form-control rounded-xl py-3 text-sm border-stone-200" value={editingClip.title} onChange={e => setEditingClip({ ...editingClip, title: e.target.value })} />
//               </div>
//               <div className="mb-4">
//                 <label className="text-[10px] fw-black tracking-widest text-uppercase text-stone-500 mb-2 d-block">Tag</label>
//                 <select className="form-control rounded-xl py-3 text-sm border-stone-200" value={editingClip.tag} onChange={e => setEditingClip({ ...editingClip, tag: e.target.value })}>
//                   {['Stitching','Polishing','Cutting','Lasting','Hand Stitching'].map(t => <option key={t}>{t}</option>)}
//                 </select>
//               </div>
//               <div className="mb-4">
//                 <label className="text-[10px] fw-black tracking-widest text-uppercase text-stone-500 mb-2 d-block">Duration</label>
//                 <input type="text" className="form-control rounded-xl py-3 text-sm border-stone-200" value={editingClip.duration} onChange={e => setEditingClip({ ...editingClip, duration: e.target.value })} />
//               </div>
//               <div className="mb-6">
//                 <label className="text-[10px] fw-black tracking-widest text-uppercase text-stone-500 mb-2 d-block">Media URL</label>
//                 <input type="text" className="form-control rounded-xl py-3 text-sm border-stone-200" value={editingClip.url} onChange={e => setEditingClip({ ...editingClip, url: e.target.value })} />
//               </div>
//               <div className="d-flex gap-3">
//                 <Button variant="outline-secondary" className="flex-grow-1 rounded-xl" onClick={() => { setShowEditModal(false); setEditingClip(null); }}>Discard</Button>
//                 <Button variant="dark" className="flex-grow-1 rounded-xl fw-bold text-xs tracking-widest uppercase" onClick={handleUpdate}>Save Changes</Button>
//               </div>
//             </>
//           )}
//         </Modal.Body>
//       </Modal>

//       {/* ── Player Modal ── */}
//       <Modal show={showPlayerModal} onHide={() => setShowPlayerModal(false)} centered size="lg" className="artisan-modal bg-dark/90">
//         <Modal.Body className="p-0 bg-transparent relative">
//           <button onClick={() => setShowPlayerModal(false)} className="position-absolute top-4 right-4 z-50 size-10 bg-black/50 text-white rounded-full d-flex align-items-center justify-content-center hover:bg-black transition">
//             <span className="material-symbols-outlined">close</span>
//           </button>
//           {activeVideo && (
//             <div className="bg-dark rounded-[2rem] overflow-hidden aspect-video relative">
//               <video src={activeVideo.url} autoPlay controls className="w-100 h-100 object-cover" poster={activeVideo.url} />
//               <div className="position-absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent pointer-events-none">
//                 <h3 className="text-white fs-4 fw-black mb-1">{activeVideo.title}</h3>
//                 <p className="text-white/60 text-xs fw-bold tracking-widest uppercase mb-0">{activeVideo.tag} • {activeVideo.duration}</p>
//               </div>
//             </div>
//           )}
//         </Modal.Body>
//       </Modal>

//       {/* ── Main ── */}
//       <main className="max-w-7xl mx-auto px-6 lg:px-12 py-10 animate-in fade-in slide-in-from-bottom duration-1000">
//         <div className="row g-5">

//           {/* CTA Banner */}
//           <div className="col-12">
//             <div className="bg-stone-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
//               <div className="position-absolute top-[-10%] right-[-10%] size-80 bg-primary/20 rounded-full blur-[100px] group-hover:scale-110 transition-transform duration-1000"></div>
//               <div className="row align-items-center relative z-1">
//                 <div className="col-md-8">
//                   <h2 className="fs-3 fw-black font-serif tracking-tight mb-2">Share the Craft.</h2>
//                   <p className="text-white/60 fs-6 fw-medium leading-relaxed mb-6">Clients love seeing their bespoke creations come to life. Upload a quick clip directly to their portal.</p>
//                   <button onClick={() => setShowUploadModal(true)} className="px-6 py-3.5 bg-primary text-white rounded-xl fw-black text-[10px] text-uppercase tracking-widest hover:-translate-y-1 transition-transform shadow-lg shadow-primary/40 d-flex align-items-center gap-2">
//                     <span className="material-symbols-outlined fs-5">camera_roll</span>
//                     Select Media
//                   </button>
//                 </div>
//                 <div className="col-md-4 d-none d-md-flex justify-content-end">
//                   <div className="size-32 rounded-full border border-white/10 d-flex align-items-center justify-content-center text-primary bg-white/5 backdrop-blur-md">
//                     <span className="material-symbols-outlined display-4">videocam</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Clip Grid */}
//           <div className="col-12 mt-10">
//             <div className="d-flex justify-content-between align-items-end mb-8">
//               <h3 className="fs-5 fw-black text-dark tracking-tighter text-uppercase">
//                 Published Archives <span className="ms-2 text-stone-400 fs-6">({filteredClips.length.toString().padStart(2,'0')})</span>
//               </h3>
//               <div className="d-flex gap-2">
//                 {['All','Stitching','Polishing'].map(f => (
//                   <span key={f} onClick={() => setFilter(f)} className={`badge border-0 pt-2 px-3 rounded-lg text-[10px] fw-black tracking-widest cursor-pointer transition ${filter === f ? 'bg-primary/10 text-primary' : 'bg-stone-100 text-stone-500 hover:bg-stone-200'}`}>{f}</span>
//                 ))}
//               </div>
//             </div>

//             <div className="row g-5">
//               {filteredClips.map((clip, i) => (
//                 <div key={i} className="col-md-4">
//                   <div className="bg-white rounded-[2rem] p-4 border border-stone-100 shadow-premium hover:shadow-2xl transition duration-500 hover:-translate-y-1 group">
//                     <div onClick={() => handlePlayClip(clip)} className="aspect-ratio-square rounded-2xl overflow-hidden position-relative mb-4 bg-dark cursor-pointer">
//                       <div className="w-100 h-100 bg-cover bg-center opacity-70 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700" style={{ backgroundImage: `url('${clip.url}')` }}></div>
//                       <div className="position-absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-12 rounded-full bg-white/20 backdrop-blur-md border border-white/50 d-flex align-items-center justify-content-center text-white scale-90 group-hover:scale-110 transition-transform">
//                         <span className="material-symbols-outlined fs-3 ps-1">play_arrow</span>
//                       </div>
//                       <div className="position-absolute bottom-3 right-3 px-2 py-1 bg-dark/80 backdrop-blur-md text-white rounded text-[10px] fw-black tracking-widest">{clip.duration}</div>
//                       <div className="position-absolute top-3 left-3 px-3 py-1 bg-primary text-white rounded-lg text-[10px] fw-black tracking-widest text-uppercase shadow-md">{clip.tag}</div>
//                     </div>

//                     <div className="px-2 pb-2">
//                       <h4 className="fs-6 fw-black text-dark tracking-tight mb-1">{clip.title}</h4>
//                       <div className="d-flex justify-content-between align-items-center mb-3">
//                         <p className="text-stone-400 text-xs fw-bold mb-0">Order: <span className="text-primary">{clip.id}</span></p>
//                         <span className={`text-[10px] fw-black text-uppercase tracking-widest d-flex align-items-center gap-1 ${clip.views === 'Seen' ? 'text-emerald-500' : 'text-stone-400'}`}>
//                           <span className="material-symbols-outlined fs-6">{clip.views === 'Seen' ? 'done_all' : 'check'}</span>
//                           {clip.views}
//                         </span>
//                       </div>

//                       <div className="d-flex gap-2 pt-3 border-top border-stone-100">
//                         <button onClick={() => handlePlayClip(clip)} className="flex-grow-1 py-2 rounded-xl bg-stone-50 border border-stone-100 text-[9px] fw-black text-uppercase tracking-widest text-stone-600 hover:bg-stone-100 transition d-flex align-items-center justify-content-center gap-1">
//                           <span className="material-symbols-outlined" style={{fontSize:'13px'}}>play_circle</span> Play
//                         </button>
//                         <button onClick={() => openEdit(clip)} className="flex-grow-1 py-2 rounded-xl bg-stone-50 border border-stone-100 text-[9px] fw-black text-uppercase tracking-widest text-stone-700 hover:bg-stone-100 transition d-flex align-items-center justify-content-center gap-1">
//                           <span className="material-symbols-outlined" style={{fontSize:'13px'}}>edit</span> Edit
//                         </button>
//                         <button onClick={() => handleDelete(clip.dbId)} className="py-2 px-3 rounded-xl border border-rose-100 text-[9px] fw-black text-uppercase tracking-widest text-rose-600 bg-white hover:bg-rose-50 transition d-flex align-items-center justify-content-center gap-1">
//                           <span className="material-symbols-outlined" style={{fontSize:'13px'}}>delete</span>
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}

//               {filteredClips.length === 0 && (
//                 <div className="col-12 text-center py-16 text-stone-400">
//                   <span className="material-symbols-outlined display-4 d-block mb-3">video_library</span>
//                   <p className="fw-black text-uppercase tracking-widest text-sm">No clips found</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default ArtisanWorkshopClips;

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import axios from '../../utils/axiosInstance';

const ArtisanWorkshopClips = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  
  const [activeVideo, setActiveVideo] = useState(null);
  const [editingClip, setEditingClip] = useState(null);
  const [filter, setFilter] = useState('All');
  const [clips, setClips] = useState([]);

  const [uploadType, setUploadType] = useState('url');
  const [uploadUrl, setUploadUrl] = useState('');
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadTag, setUploadTag] = useState('Stitching');

  // YouTube Embed Helper Function
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return '';
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = match && match[2].length === 11 ? match[2] : null;
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0` : url;
  };

  const fetchClips = async () => {
    try {
      const { data } = await axios.get('/api/clips');
      setClips(data.map(c => ({
        dbId: c._id,
        id: c.order_id?.orderId || '#AS-9999',
        tag: c.tag || 'Stitching',
        title: c.title || 'Workshop Clip',
        url: c.video_url,
        duration: c.duration || '0:20',
        views: c.views || 'Sent',
        status: c.status || 'Pending Review',
        isYouTube: c.isYouTube || false
      })));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchClips(); }, []);

  const filteredClips = filter === 'All' ? clips : clips.filter(c => c.tag === filter);

  const handleUpload = async () => {
    if (!uploadTitle) return alert('Please enter Title');

    try {
      if (uploadType === 'file' && uploadFile) {
        const formData = new FormData();
        formData.append('video', uploadFile);
        formData.append('title', uploadTitle);
        formData.append('tag', uploadTag);
        formData.append('duration', '0:20');
        formData.append('status', 'Pending Review');

        await axios.post('/api/clips', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        if (!uploadUrl) return alert('Please enter URL');
        await axios.post('/api/clips', {
          video_url: uploadUrl,
          title: uploadTitle,
          tag: uploadTag,
          duration: '0:20',
          status: 'Pending Review',
          isYouTube: uploadType === 'youtube'
        });
      }

      setShowUploadModal(false);
      setUploadUrl(''); 
      setUploadFile(null); 
      setUploadTitle(''); 
      setUploadTag('Stitching');
      setUploadType('url');
      fetchClips();
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    }
  };

  const handleUpdate = async () => {
    if (!editingClip) return;
    try {
      await axios.put(`/api/clips/${editingClip.dbId}`, {
        title: editingClip.title,
        tag: editingClip.tag,
        duration: editingClip.duration,
        video_url: editingClip.url
      });
      setShowEditModal(false);
      setEditingClip(null);
      fetchClips();
    } catch (err) { 
      console.error(err);
      alert('Update failed'); 
    }
  };

  const handleDelete = async (dbId) => {
    if (!window.confirm('Delete this clip?')) return;
    try {
      await axios.delete(`/api/clips/${dbId}`);
      fetchClips();
    } catch (err) { 
      console.error(err);
      alert('Delete failed'); 
    }
  };

  const openEdit = (clip) => { 
    setEditingClip({ ...clip }); 
    setShowEditModal(true); 
  };

  const handlePlayClip = (clip) => { 
    setActiveVideo(clip); 
    setShowPlayerModal(true); 
  };

  return (
    <div className="min-vh-100 bg-background-light font-display text-dark lg:pb-20">

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-bottom border-stone-200 px-6 lg:px-12 py-6 sticky-top z-40 shadow-sm">
        <div className="max-w-7xl mx-auto d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-6">
          <div className="d-flex align-items-center gap-5">
            <Link to="/artisan" className="size-12 rounded-xl bg-stone-50 border border-stone-200 d-flex align-items-center justify-content-center text-stone-400 hover:text-dark hover:bg-white hover:border-dark transition">
              <span className="material-symbols-outlined fs-4">arrow_back</span>
            </Link>
            <div>
              <div className="d-flex align-items-center gap-3 text-primary mb-1">
                <span className="material-symbols-outlined fs-6">video_library</span>
                <span className="text-[10px] fw-black text-uppercase tracking-[0.3em]">Behind The Seams</span>
              </div>
              <h1 className="display-6 fw-black font-serif text-dark tracking-tighter mb-0 lowercase">Workshop.Clips</h1>
            </div>
          </div>
          <button onClick={() => setShowUploadModal(true)} className="px-6 py-3.5 rounded-2xl bg-dark text-white fw-black text-xs text-uppercase tracking-widest shadow-xl hover:-translate-y-1 transition d-flex align-items-center gap-3">
            <span className="material-symbols-outlined fs-5">upload</span>
            Publish Clip
          </button>
        </div>
      </header>

      {/* Upload Modal */}
      <Modal show={showUploadModal} onHide={() => setShowUploadModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fw-black">Upload Production Clip</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-5">
          <div className="mb-4">
            <div className="d-flex gap-2">
              {['url', 'youtube', 'file'].map(t => (
                <button 
                  key={t} 
                  onClick={() => setUploadType(t)} 
                  className={`flex-1 py-3 rounded-xl ${uploadType === t ? 'bg-dark text-white' : 'bg-stone-100'}`}
                >
                  {t === 'url' ? 'Direct URL' : t === 'youtube' ? 'YouTube' : 'File Upload'}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="text-uppercase text-stone-500 mb-2 d-block">Clip Title</label>
            <input type="text" className="form-control" value={uploadTitle} onChange={e => setUploadTitle(e.target.value)} />
          </div>

          <div className="mb-4">
            <label className="text-uppercase text-stone-500 mb-2 d-block">Tag</label>
            <select className="form-control" value={uploadTag} onChange={e => setUploadTag(e.target.value)}>
              {['Stitching','Polishing','Cutting','Lasting','Hand Stitching'].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>

          {uploadType === 'file' ? (
            <input type="file" accept="video/*" className="form-control" onChange={e => setUploadFile(e.target.files[0])} />
          ) : (
            <input type="text" className="form-control" placeholder="Enter URL" value={uploadUrl} onChange={e => setUploadUrl(e.target.value)} />
          )}

          <Button variant="dark" className="w-100 mt-4" onClick={handleUpload}>Publish</Button>
        </Modal.Body>
      </Modal>

      {/* Player Modal */}
      <Modal show={showPlayerModal} onHide={() => setShowPlayerModal(false)} centered size="lg">
        <Modal.Body className="p-0 bg-black rounded-[2rem] overflow-hidden">
          <button 
            onClick={() => setShowPlayerModal(false)} 
            className="position-absolute top-4 right-4 z-50 size-10 bg-black/70 text-white rounded-full"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
          {activeVideo && (
            <div className="aspect-video">
              {activeVideo.isYouTube ? (
                <iframe 
                  width="100%" 
                  height="100%" 
                  src={getYouTubeEmbedUrl(activeVideo.url)}
                  allowFullScreen
                />
              ) : (
                <video 
                  src={activeVideo.url} 
                  autoPlay 
                  controls 
                  className="w-100 h-100" 
                />
              )}
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => { setShowEditModal(false); setEditingClip(null); }} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Clip</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-5">
          {editingClip && (
            <>
              <div className="mb-4">
                <label className="text-uppercase text-stone-500 mb-2 d-block">Title</label>
                <input type="text" className="form-control" value={editingClip.title} onChange={e => setEditingClip({...editingClip, title: e.target.value})} />
              </div>
              <div className="mb-4">
                <label className="text-uppercase text-stone-500 mb-2 d-block">Tag</label>
                <select className="form-control" value={editingClip.tag} onChange={e => setEditingClip({...editingClip, tag: e.target.value})}>
                  {['Stitching','Polishing','Cutting','Lasting','Hand Stitching'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="mb-4">
                <label className="text-uppercase text-stone-500 mb-2 d-block">Duration</label>
                <input type="text" className="form-control" value={editingClip.duration} onChange={e => setEditingClip({...editingClip, duration: e.target.value})} />
              </div>
              <div className="mb-4">
                <label className="text-uppercase text-stone-500 mb-2 d-block">Video URL</label>
                <input type="text" className="form-control" value={editingClip.url} onChange={e => setEditingClip({...editingClip, url: e.target.value})} />
              </div>
              <div className="d-flex gap-3">
                <Button variant="outline-secondary" className="flex-grow-1" onClick={() => {setShowEditModal(false); setEditingClip(null);}}>Cancel</Button>
                <Button variant="dark" className="flex-grow-1" onClick={handleUpdate}>Save Changes</Button>
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-10">
        <div className="d-flex justify-content-between align-items-end mb-8">
          <h3 className="fs-5 fw-black text-dark tracking-tighter text-uppercase">
            Published Archives <span className="ms-2 text-stone-400 fs-6">({filteredClips.length.toString().padStart(2,'0')})</span>
          </h3>
          <div className="d-flex gap-2">
            {['All','Stitching','Polishing'].map(f => (
              <span key={f} onClick={() => setFilter(f)} className={`badge border-0 pt-2 px-3 rounded-lg text-[10px] fw-black tracking-widest cursor-pointer transition ${filter === f ? 'bg-primary/10 text-primary' : 'bg-stone-100 text-stone-500 hover:bg-stone-200'}`}>{f}</span>
            ))}
          </div>
        </div>

        <div className="row g-5">
          {filteredClips.map((clip, i) => (
            <div key={i} className="col-md-4">
              <div className="bg-white rounded-[2rem] p-4 border border-stone-100 shadow-premium hover:shadow-2xl transition hover:-translate-y-1 group">
                <div onClick={() => handlePlayClip(clip)} className="aspect-video rounded-2xl overflow-hidden position-relative mb-4 bg-dark cursor-pointer">
                  <div className="w-100 h-100 bg-cover bg-center opacity-70 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700" style={{ backgroundImage: `url('${clip.url}')` }}></div>
                  <div className="position-absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-12 rounded-full bg-white/20 backdrop-blur-md border border-white/50 d-flex align-items-center justify-content-center text-white scale-90 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined fs-3 ps-1">play_arrow</span>
                  </div>
                  <div className="position-absolute bottom-3 right-3 px-2 py-1 bg-dark/80 backdrop-blur-md text-white rounded text-[10px] fw-black tracking-widest">{clip.duration}</div>
                  <div className="position-absolute top-3 left-3 px-3 py-1 bg-primary text-white rounded-lg text-[10px] fw-black tracking-widest text-uppercase shadow-md">{clip.tag}</div>
                </div>

                <div className="px-2 pb-2">
                  <h4 className="fs-6 fw-black text-dark tracking-tight mb-1">{clip.title}</h4>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <p className="text-stone-400 text-xs fw-bold mb-0">Order: <span className="text-primary">{clip.id}</span></p>
                    <span className={`text-[10px] fw-black text-uppercase tracking-widest d-flex align-items-center gap-1 ${clip.views === 'Seen' ? 'text-emerald-500' : 'text-stone-400'}`}>
                      <span className="material-symbols-outlined fs-6">{clip.views === 'Seen' ? 'done_all' : 'check'}</span>
                      {clip.views}
                    </span>
                  </div>

                  <div className="d-flex gap-2 pt-3 border-top border-stone-100">
                    <button onClick={() => handlePlayClip(clip)} className="flex-grow-1 py-2 rounded-xl bg-stone-50 border border-stone-100 text-[9px] fw-black text-uppercase tracking-widest text-stone-600 hover:bg-stone-100 transition">Play</button>
                    <button onClick={() => openEdit(clip)} className="flex-grow-1 py-2 rounded-xl bg-stone-50 border border-stone-100 text-[9px] fw-black text-uppercase tracking-widest text-stone-700 hover:bg-stone-100 transition">Edit</button>
                    <button onClick={() => handleDelete(clip.dbId)} className="py-2 px-3 rounded-xl border border-rose-100 text-[9px] fw-black text-uppercase tracking-widest text-rose-600 bg-white hover:bg-rose-50 transition">Delete</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ArtisanWorkshopClips;