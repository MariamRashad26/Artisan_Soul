import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../utils/axiosInstance';
import { useToast } from '../../context/ToastContext';

const AdminLiveStudio = () => {
  const [clips, setClips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingClip, setEditingClip] = useState(null);
  const { showToast, showConfirm } = useToast();

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
      const formatted = data.map(c => ({
        _id: c._id,
        id: c._id.substring(0, 8).toUpperCase(),
        order: c.order_id?.orderId || '#AS-UNKNOWN',
        artisan: c.artisan_id?.name || 'Unknown Artisan',
        title: c.title || 'Workshop Clip',
        duration: c.duration || '0:20',
        status: c.status || 'Pending Review',
        tag: c.tag || 'production',
        thumbnail: c.thumbnail_url,
        video: c.video_url,
        isYouTube: c.isYouTube || false,
      }));
      setClips(formatted);
    } catch (err) {
      console.error('Error fetching clips:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClips();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingClip) return;
    try {
      await axios.put(`/api/clips/${editingClip._id}`, {
        title: editingClip.title,
        status: editingClip.status,
        tag: editingClip.tag,
        duration: editingClip.duration,
        thumbnail_url: editingClip.thumbnail,
        video_url: editingClip.video,
        isYouTube: editingClip.video?.includes('youtube') || editingClip.video?.includes('youtu.be'),
      });
      setEditingClip(null);
      fetchClips();
      showToast('Video clip updated successfully.', 'success');
    } catch (error) {
      console.error(error);
      showToast('Failed to update video clip.', 'error');
    }
  };

  const handleDelete = async (id) => {
    showConfirm(
      'Are you sure you want to remove this video clip from the archive?',
      async () => {
        try {
          await axios.delete(`/api/clips/${id}`);
          fetchClips();
          showToast('Video clip removed from archive.', 'success');
        } catch (error) {
          console.error(error);
          showToast('Failed to delete clip.', 'error');
        }
      }
    );
  };

  return (
    <div className="p-8 lg:p-12 animate-in fade-in duration-1000">
      {/* Header */}
      <section className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-6 mb-12">
        <div>
          <nav className="d-flex align-items-center gap-3 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700 mb-4">
            <Link to="/admin" className="hover:text-dark transition">Operations</Link>
            <span className="material-symbols-outlined fs-6 text-stone-200">chevron_right</span>
            <span className="text-primary">Live Studio</span>
          </nav>
          <h1 className="display-4 fw-black font-serif text-dark tracking-tighter mb-0 lowercase">Workshop.Mosaic</h1>
        </div>
      </section>

      {/* Clips Grid */}
      <div className="row g-8 mb-12">
        {loading ? (
          <div className="col-12 text-center py-12 text-stone-500 fw-bold">Loading workshop clips...</div>
        ) : clips.length === 0 ? (
          <div className="col-12">
            <div className="glass-panel p-12 rounded-[3rem] border-stone-100 shadow-premium text-center">
              <span className="material-symbols-outlined text-stone-300 text-[64px] d-block mb-4">videocam_off</span>
              <p className="text-sm fw-bold text-stone-500 mb-0">No workshop clips uploaded yet.</p>
            </div>
          </div>
        ) : clips.map((clip) => (
          <div key={clip._id} className="col-lg-3 col-md-6">
            <div className="glass-panel rounded-[2.5rem] border-stone-100 shadow-premium overflow-hidden group hover:border-dark transition-all duration-700">
              <div className="aspect-video relative overflow-hidden bg-stone-900">
                {clip.isYouTube ? (
                  <iframe
                    src={getYouTubeEmbedUrl(clip.video)}
                    className="w-100 h-100"
                    allowFullScreen
                    title={clip.title}
                  />
                ) : (
                  <video
                    src={clip.video}
                    autoPlay
                    muted
                    loop
                    poster={clip.thumbnail}
                    className="w-100 h-100 object-cover"
                  />
                )}
              </div>

              <div className="p-6">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-[10px] fw-black text-stone-700 tracking-tighter">{clip.id}</span>
                  <span className={`text-[8px] fw-black text-uppercase tracking-widest px-2 py-0.5 rounded-full ${clip.status === 'Live' ? 'bg-emerald-500/10 text-emerald-600' : clip.status === 'Pending Review' ? 'bg-amber-500/10 text-amber-600' : 'bg-primary/10 text-primary'}`}>
                    {clip.status}
                  </span>
                </div>
                <h5 className="text-stone-900 text-xs fw-black tracking-tight mb-1">{clip.title}</h5>
                <p className="text-[10px] fw-medium text-stone-500 tracking-tight mb-2">Asset: {clip.order}</p>
                <p className="text-[10px] fw-black text-uppercase tracking-widest text-stone-600 mb-4">Artisan: {clip.artisan}</p>

                <div className="d-flex gap-2 pt-3 border-top border-stone-50">
                  <button onClick={() => setEditingClip(clip)} className="flex-grow-1 py-1.5 rounded-xl border border-stone-200 text-[9px] fw-black text-uppercase tracking-widest text-stone-700 bg-white hover:bg-stone-50 transition">Edit</button>
                  <button onClick={() => handleDelete(clip._id)} className="py-1.5 px-3 rounded-xl border border-rose-100 text-[9px] fw-black text-uppercase tracking-widest text-rose-600 bg-white hover:bg-rose-50 transition">Delete</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingClip && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark/50 backdrop-blur-sm z-[100] d-flex align-items-center justify-content-center p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-[500px] w-100 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="px-8 py-6 border-bottom border-stone-100 d-flex justify-content-between align-items-center bg-stone-50/50">
              <h3 className="fs-5 fw-black font-serif text-dark mb-0 tracking-tight lowercase">Edit.Clip</h3>
              <button onClick={() => setEditingClip(null)} className="text-stone-600 hover:text-dark transition">
                <span className="material-symbols-outlined fs-5">close</span>
              </button>
            </div>
            <form onSubmit={handleUpdate} className="p-8 space-y-6">
              <div>
                <label className="text-[10px] fw-black text-uppercase tracking-widest text-stone-700 mb-2 d-block">Video Title</label>
                <input type="text" value={editingClip.title} onChange={e => setEditingClip({...editingClip, title: e.target.value})} className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm focus:border-dark outline-none transition" />
              </div>
              <div>
                <label className="text-[10px] fw-black text-uppercase tracking-widest text-stone-700 mb-2 d-block">Video URL</label>
                <input type="text" value={editingClip.video} onChange={e => setEditingClip({...editingClip, video: e.target.value})} className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm focus:border-dark outline-none transition" />
              </div>
              <div>
                <label className="text-[10px] fw-black text-uppercase tracking-widest text-stone-700 mb-2 d-block">Status</label>
                <select value={editingClip.status} onChange={e => setEditingClip({...editingClip, status: e.target.value})} className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm focus:border-dark outline-none transition">
                  <option value="Live">Live</option>
                  <option value="Pending Review">Pending Review</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>
              <div className="d-flex justify-content-end gap-3">
                <button type="button" onClick={() => setEditingClip(null)} className="px-6 py-2.5 rounded-xl border border-stone-200 text-[10px] fw-black text-uppercase tracking-widest text-stone-700 hover:bg-stone-50 transition">Discard</button>
                <button type="submit" className="px-6 py-2.5 rounded-xl bg-dark text-white text-[10px] fw-black text-uppercase tracking-widest hover:bg-stone-800 transition shadow-lg">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLiveStudio;
