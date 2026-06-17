import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../utils/axiosInstance';
import { useAuth } from '../../context/AuthContext';

const ArtisanMessages = () => {
  const { user } = useAuth();
  const [threads, setThreads] = useState([]);
  const [activeThreadId, setActiveThreadId] = useState('global');
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [loadingThreads, setLoadingThreads] = useState(true);
  const bottomRef = useRef(null);

  // Build thread list from this artisan's assigned work orders
  const fetchThreads = async () => {
    try {
      const { data: wos } = await axios.get('/api/work-orders');
      const currentUserId = (user?._id || '').toString();
      const currentUserName = (user?.name || '').trim().toLowerCase();

      const myWOs = wos.filter(wo => {
        const assignedId = (wo.assigned_to?._id || wo.assigned_to || '').toString();
        const assignedName = (wo.assigned_to?.name || '').trim().toLowerCase();
        return (
          (assignedId && currentUserId && assignedId === currentUserId) ||
          (assignedName && currentUserName && assignedName === currentUserName)
        );
      });

      const builtThreads = [
        { id: 'global', name: 'Atelier Floor', detail: 'Team-wide broadcast channel', patron: null, orderId: null }
      ];

      myWOs.forEach(wo => {
        const orderId = (wo.order_id?.orderId || wo.order_id?._id || wo.order_id || '').toString();
        const mongoId = (wo.order_id?._id || wo.order_id || '').toString();
        if (orderId) {
          builtThreads.push({
            id: mongoId,           // thread_id = mongo _id of the Order
            name: wo.order_id?.patron || `Order ${orderId}`,
            detail: wo.order_id?.model || 'Bespoke Commission',
            patron: wo.order_id?.patron,
            orderId
          });
        }
      });

      setThreads(builtThreads);
      setLoadingThreads(false);
    } catch (err) {
      console.error('Failed to fetch work order threads', err);
      setThreads([{ id: 'global', name: 'Atelier Floor', detail: 'Team-wide broadcast', patron: null, orderId: null }]);
      setLoadingThreads(false);
    }
  };

  // Fetch messages for active thread
  const fetchMessages = async () => {
    try {
      const { data } = await axios.get(`/api/chat?thread_id=${activeThreadId}`);
      setMessages(data);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch (err) {
      console.error('Failed to fetch messages', err);
    }
  };

  useEffect(() => {
    if (user) fetchThreads();
  }, [user]);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [activeThreadId]);

  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;

    // Optimistic update
    const optimistic = {
      _id: null,
      sender_id: { _id: user?._id, name: user?.name, role: user?.role },
      content: messageInput,
      timestamp: new Date().toISOString(),
      thread_id: activeThreadId
    };
    setMessages(prev => [...prev, optimistic]);
    const content = messageInput;
    setMessageInput('');

    try {
      await axios.post('/api/chat', {
        sender_id: user?._id,
        content,
        thread_id: activeThreadId
      });
      fetchMessages(); // get real message with _id for delete support
    } catch (err) {
      console.error('Failed to send message', err);
    }
  };

  const handleDeleteMessage = async (msgId) => {
    if (!msgId) return;
    try {
      await axios.delete(`/api/chat/${msgId}`);
      fetchMessages();
    } catch (err) {
      console.error('Failed to delete message', err);
    }
  };

  const activeThread = threads.find(t => t.id === activeThreadId) || threads[0];

  return (
    <div className="min-vh-100 bg-background-light font-display text-dark lg:pb-20">
      <header className="bg-white/80 backdrop-blur-xl border-bottom border-stone-200 px-6 lg:px-12 py-6 sticky-top z-40 shadow-sm animate-in slide-in-from-top duration-700">
        <div className="max-w-7xl mx-auto d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-6">
          <div className="d-flex align-items-center gap-5">
            <Link to="/artisan" className="size-12 rounded-xl bg-stone-50 border border-stone-200 d-flex align-items-center justify-content-center text-stone-400 hover:text-dark hover:bg-white hover:border-dark transition duration-500 shadow-sm group">
              <span className="material-symbols-outlined fs-4 group-hover:-translate-x-1 transition-transform">arrow_back</span>
            </Link>
            <div>
              <div className="d-flex align-items-center gap-3 text-primary mb-1">
                <span className="material-symbols-outlined fs-6">chat_bubble</span>
                <span className="text-[10px] fw-black text-uppercase tracking-[0.3em]">Direct Patron Comm</span>
              </div>
              <h1 className="display-6 fw-black font-serif text-dark tracking-tighter mb-0 lowercase">Client.Messages</h1>
            </div>
          </div>
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-4 py-2 rounded-full text-[9px] fw-black uppercase tracking-widest d-flex align-items-center gap-2">
            <span className="size-1.5 bg-emerald-500 rounded-full animate-pulse d-inline-block"></span>
            Live · {threads.length - 1} Order{threads.length - 1 !== 1 ? 's' : ''} Active
          </span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-10 animate-in fade-in slide-in-from-bottom duration-1000">
        <div className="row g-5" style={{ height: '700px' }}>
          {/* Thread List */}
          <div className="col-lg-4 h-100 d-flex flex-column">
            <div className="bg-white rounded-[2rem] shadow-premium border border-stone-100 h-100 overflow-hidden d-flex flex-column">
              <div className="p-6 border-bottom border-stone-100 bg-stone-50">
                <h3 className="text-[10px] fw-black text-stone-400 text-uppercase tracking-[0.3em] mb-4">Active Threads</h3>
                <div className="position-relative">
                  <span className="material-symbols-outlined position-absolute top-50 start-0 translate-middle-y ms-3 text-stone-400 fs-5">search</span>
                  <input type="text" placeholder="Search patron..." className="form-control bg-white border-stone-200 rounded-xl py-3 ps-10 text-sm shadow-sm outline-none text-dark" />
                </div>
              </div>
              <div className="flex-grow-1 overflow-y-auto custom-scrollbar">
                {loadingThreads ? (
                  <div className="p-6 text-center text-stone-400 text-xs fw-bold">Loading your order threads...</div>
                ) : threads.map(t => (
                  <div
                    key={t.id}
                    onClick={() => setActiveThreadId(t.id)}
                    className={`p-4 border-bottom border-stone-50 cursor-pointer transition ${t.id === activeThreadId ? 'bg-primary/5 border-l-4 border-l-primary' : 'hover:bg-stone-50 bg-white'}`}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <div className={`size-10 rounded-full d-flex align-items-center justify-content-center text-xs fw-black flex-shrink-0 ${t.id === 'global' ? 'bg-stone-900 text-white' : 'bg-primary/10 text-primary'}`}>
                        {t.id === 'global' ? <span className="material-symbols-outlined fs-6">broadcast_on_home</span> : (t.name.substring(0, 2).toUpperCase())}
                      </div>
                      <div className="flex-grow-1 min-w-0">
                        <h4 className={`fs-6 fw-black mb-0 text-truncate ${t.id === activeThreadId ? 'text-primary' : 'text-dark'}`}>{t.name}</h4>
                        <p className="text-xs text-stone-500 mb-0 text-truncate">{t.detail}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Window */}
          <div className="col-lg-8 h-100">
            <div className="bg-white rounded-[2rem] shadow-premium border border-stone-100 h-100 overflow-hidden d-flex flex-column">
              {/* Header */}
              <div className="p-6 border-bottom border-stone-100 bg-stone-50 d-flex justify-content-between align-items-center">
                <div>
                  <h3 className="fs-5 fw-black text-dark tracking-tight mb-1">{activeThread?.name || 'Global'}</h3>
                  <p className="text-[10px] fw-black text-stone-400 text-uppercase tracking-[0.2em] mb-0">
                    {activeThread?.orderId ? `Order: ${activeThread.orderId}` : 'Team broadcast channel'}
                  </p>
                </div>
                {activeThread?.orderId && (
                  <Link to={`/artisan/production/${activeThread.orderId.replace('#', '')}`} className="btn btn-outline-primary text-xs fw-bold rounded-xl py-2 px-4 shadow-sm text-decoration-none">
                    Open Order
                  </Link>
                )}
              </div>

              {/* Messages */}
              <div className="flex-grow-1 p-6 overflow-y-auto custom-scrollbar d-flex flex-column gap-4 bg-slate-50/30">
                {messages.length === 0 && (
                  <div className="text-center text-stone-400 py-10 text-xs fw-bold m-auto">
                    <span className="material-symbols-outlined fs-1 text-stone-200 d-block mb-3">forum</span>
                    No messages yet. Start the conversation!
                  </div>
                )}
                {messages.map((msg, idx) => {
                  const isMe = (msg.sender_id?._id || msg.sender_id) === user?._id ||
                               msg.sender_id?._id === user?._id;
                  return isMe ? (
                    <div key={idx} className="d-flex gap-3 flex-row-reverse group">
                      <div className="size-10 rounded-full bg-primary text-white d-flex align-items-center justify-content-center text-xs fw-black shadow-lg shadow-primary/30 flex-shrink-0">
                        {user?.name?.substring(0, 2).toUpperCase() || 'ME'}
                      </div>
                      <div className="bg-primary text-white rounded-2xl p-4 shadow-md max-w-[75%] position-relative">
                        <p className="text-sm text-white/90 leading-relaxed mb-0">{msg.content}</p>
                        <div className="d-flex justify-content-between align-items-center mt-2">
                          {msg._id && (
                            <button onClick={() => handleDeleteMessage(msg._id)} className="text-white/50 hover:text-white border-0 bg-transparent p-0 d-flex opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="material-symbols-outlined fs-6">delete</span>
                            </button>
                          )}
                          <p className="text-[10px] text-white/50 mb-0 fw-bold ms-auto">
                            {new Date(msg.timestamp || msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div key={idx} className="d-flex gap-3">
                      <div className="size-10 rounded-full bg-stone-200 text-stone-500 d-flex align-items-center justify-content-center text-xs fw-black shadow-inner flex-shrink-0">
                        {msg.sender_id?.name ? msg.sender_id.name.substring(0, 2).toUpperCase() : 'US'}
                      </div>
                      <div className="bg-white border border-stone-100 rounded-2xl p-4 shadow-sm max-w-[75%]">
                        <p className="text-[9px] fw-black text-primary text-uppercase tracking-widest mb-1">
                          {msg.sender_id?.name || 'Patron'} · {msg.sender_id?.role || ''}
                        </p>
                        <p className="text-sm text-stone-700 leading-relaxed mb-0">{msg.content}</p>
                        <p className="text-[10px] text-stone-400 mt-2 mb-0 fw-bold">
                          {new Date(msg.timestamp || msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="p-4 bg-white border-top border-stone-100">
                <div className="p-2 border border-stone-200 rounded-2xl bg-stone-50 d-flex align-items-center gap-2">
                  <button className="size-10 rounded-xl text-stone-400 hover:bg-white hover:text-primary transition border border-transparent hover:border-stone-200 d-flex align-items-center justify-content-center">
                    <span className="material-symbols-outlined fs-5">attach_file</span>
                  </button>
                  <input
                    type="text"
                    value={messageInput}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder={activeThread?.patron ? `Message ${activeThread.patron}...` : 'Broadcast to team...'}
                    className="flex-grow-1 bg-transparent border-0 outline-none text-sm text-dark px-2"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim()}
                    className="size-10 rounded-xl bg-primary text-white hover:-translate-y-1 transition-transform shadow-md shadow-primary/30 d-flex align-items-center justify-content-center disabled:opacity-50 disabled:hover:translate-y-0"
                  >
                    <span className="material-symbols-outlined fs-5">send</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ArtisanMessages;
