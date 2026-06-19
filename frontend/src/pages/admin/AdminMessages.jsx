import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../utils/axiosInstance';
import { useAuth } from '../../context/AuthContext';

const AdminMessages = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [threads, setThreads] = useState([]);
  const [activeThreadId, setActiveThreadId] = useState('global');
  const [loadingThreads, setLoadingThreads] = useState(true);
  const bottomRef = useRef(null);

  // Fetch all distinct threads (grouped conversations)
  const fetchThreads = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/chat/threads');
      const mapped = data.map(t => ({
        id: t._id,
        name: t._id === 'global' ? 'Atelier Floor (Global)' : `Order Thread: ${t._id}`,
        detail: t.lastMessage?.substring(0, 50) + (t.lastMessage?.length > 50 ? '...' : ''),
        time: t.lastTime ? new Date(t.lastTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''
      }));
      // Always ensure global thread exists
      if (!mapped.find(t => t.id === 'global')) {
        mapped.unshift({ id: 'global', name: 'Atelier Floor (Global)', detail: 'Broadcast to all staff', time: '' });
      }
      setThreads(mapped);
      setLoadingThreads(false);
    } catch {
      console.error('Failed to fetch threads');
      setThreads([{ id: 'global', name: 'Atelier Floor (Global)', detail: 'Broadcast to all staff', time: '' }]);
      setLoadingThreads(false);
    }
  }, []);

  // Fetch messages for the active thread
  const fetchMessages = useCallback(async () => {
    try {
      const { data } = await axios.get(`/api/chat?thread_id=${activeThreadId}`);
      setMessages(data);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch {
      console.error('Failed to fetch messages');
    }
  }, [activeThreadId]);

  useEffect(() => {
    const loadThreads = async () => { await fetchThreads(); };
    loadThreads();
  }, [fetchThreads]);

  useEffect(() => {
    const loadMessages = async () => { await fetchMessages(); };
    loadMessages();
    const interval = setInterval(async () => { await fetchMessages(); }, 5000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!messageInput.trim()) return;
    try {
      await axios.post('/api/chat', {
        sender_id: user?._id,
        content: messageInput,
        thread_id: activeThreadId
      });
      setMessageInput('');
      fetchMessages();
      fetchThreads();
    } catch {
      console.error('Failed to send message');
    }
  };

  const handleDeleteMessage = async (msgId) => {
    if (!window.confirm('Delete this message from the registry?')) return;
    try {
      await axios.delete(`/api/chat/${msgId}`);
      fetchMessages();
    } catch {
      console.error('Failed to delete message');
    }
  };

  const activeThread = threads.find(t => t.id === activeThreadId);

  return (
    <div className="p-8 lg:p-12 animate-in fade-in duration-1000">
      <section className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-6 mb-12">
        <div>
          <nav className="d-flex align-items-center gap-3 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700 mb-4">
            <Link to="/admin" className="hover:text-dark transition">Operations</Link>
            <span className="material-symbols-outlined fs-6 text-stone-200">chevron_right</span>
            <span className="text-primary">Curator Communications</span>
          </nav>
          <h1 className="display-4 fw-black font-serif text-dark tracking-tighter mb-0 lowercase">Atelier.Intercom</h1>
        </div>
        <div className="d-flex align-items-center gap-3">
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-4 py-2 rounded-full text-[9px] fw-black uppercase tracking-widest d-flex align-items-center gap-2">
            <span className="size-1.5 bg-emerald-500 rounded-full animate-pulse d-inline-block"></span>
            Live — {threads.length} Thread{threads.length !== 1 ? 's' : ''}
          </span>
        </div>
      </section>

      <div className="row g-6" style={{ height: '680px' }}>
        {/* Thread Sidebar */}
        <div className="col-lg-4 h-100 d-flex flex-column">
          <div className="glass-panel rounded-[2.5rem] border-stone-100 shadow-premium h-100 overflow-hidden d-flex flex-column">
            <div className="p-6 border-bottom border-stone-50 bg-stone-50/50">
              <h3 className="text-[10px] fw-black text-stone-400 text-uppercase tracking-[0.3em] mb-4">Active Channels</h3>
              <div className="position-relative">
                <span className="material-symbols-outlined position-absolute top-50 start-0 translate-middle-y ms-3 text-stone-400 fs-5">search</span>
                <input type="text" placeholder="Filter channels..." className="form-control bg-white border-stone-100 rounded-xl py-3 ps-10 text-xs fw-bold shadow-sm outline-none text-dark" />
              </div>
            </div>
            <div className="flex-grow-1 overflow-y-auto custom-scrollbar">
              {loadingThreads ? (
                <div className="p-6 text-center text-stone-400 text-xs fw-bold">Loading threads...</div>
              ) : threads.map(t => (
                <div
                  key={t.id}
                  onClick={() => setActiveThreadId(t.id)}
                  className={`p-5 border-bottom border-stone-50 cursor-pointer transition ${t.id === activeThreadId ? 'bg-primary/5 border-l-4 border-l-primary' : 'hover:bg-stone-50 bg-white'}`}
                >
                  <div className="d-flex justify-content-between align-items-start mb-1">
                    <h4 className={`text-sm fw-black mb-0 text-truncate ${t.id === activeThreadId ? 'text-primary' : 'text-dark'}`} style={{ maxWidth: '160px' }}>
                      {t.name}
                    </h4>
                    <span className="text-[9px] fw-bold text-stone-400 ms-2 flex-shrink-0">{t.time}</span>
                  </div>
                  <p className="text-[10px] text-stone-500 mb-0 font-medium text-truncate">{t.detail || 'No messages yet'}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Window */}
        <div className="col-lg-8 h-100">
          <div className="glass-panel rounded-[2.5rem] border-stone-100 shadow-premium h-100 overflow-hidden d-flex flex-column bg-white">
            <div className="p-6 border-bottom border-stone-100 bg-stone-50/50 d-flex justify-content-between align-items-center">
              <div>
                <h3 className="text-sm fw-black text-dark tracking-tight mb-1">
                  {activeThread?.name || activeThreadId}
                </h3>
                <p className="text-[9px] fw-black text-stone-400 text-uppercase tracking-[0.2em] mb-0">
                  Head Curator Portal · Thread: {activeThreadId}
                </p>
              </div>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 rounded-full text-[9px] fw-black uppercase tracking-widest d-flex align-items-center gap-1">
                <span className="size-1.5 bg-emerald-500 rounded-full animate-pulse d-inline-block"></span> Live Sync
              </span>
            </div>

            {/* Messages feed */}
            <div className="flex-grow-1 p-6 overflow-y-auto custom-scrollbar bg-stone-50/20 d-flex flex-column gap-4">
              {messages.length === 0 && (
                <div className="text-center text-stone-400 py-10 text-xs fw-bold m-auto">
                  <span className="material-symbols-outlined fs-1 text-stone-200 d-block mb-3">forum</span>
                  No messages in this thread. Send the first message below!
                </div>
              )}
              {messages.map((msg, idx) => {
                const isCurator = msg.sender_id?._id === user?._id || msg.sender_id === user?._id;
                return (
                  <div key={idx} className={`d-flex ${isCurator ? 'justify-content-end' : 'justify-content-start'} group`}>
                    <div className="d-flex gap-3 max-w-[80%]">
                      {!isCurator && (
                        <div className="size-9 rounded-full bg-stone-200 text-stone-600 d-flex align-items-center justify-content-center text-xs fw-black shadow-inner flex-shrink-0">
                          {msg.sender_id?.name ? msg.sender_id.name.substring(0, 2).toUpperCase() : 'US'}
                        </div>
                      )}
                      <div className={`p-4 rounded-2xl shadow-sm ${isCurator ? 'bg-primary text-white rounded-tr-none' : 'bg-white border border-stone-100 text-dark rounded-tl-none'}`}>
                        <div className="d-flex justify-content-between align-items-center mb-1 gap-4">
                          <span className={`text-[9px] fw-black text-uppercase ${isCurator ? 'text-white/60' : 'text-primary'}`}>
                            {msg.sender_id?.name || 'Anonymous'} · {msg.sender_id?.role || ''}
                          </span>
                          {isCurator && (
                            <button onClick={() => handleDeleteMessage(msg._id)} className="text-white/40 hover:text-white border-0 bg-transparent p-0 d-flex opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="material-symbols-outlined fs-6">delete</span>
                            </button>
                          )}
                        </div>
                        <p className="text-sm mb-0 leading-relaxed">{msg.content}</p>
                        <span className={`text-[8px] fw-bold d-block mt-2 text-end ${isCurator ? 'text-white/40' : 'text-stone-400'}`}>
                          {new Date(msg.timestamp || msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      {isCurator && (
                        <div className="size-9 rounded-full bg-dark text-white d-flex align-items-center justify-content-center text-xs fw-black shadow-md flex-shrink-0">
                          {user?.name ? user.name.substring(0, 2).toUpperCase() : 'AD'}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-top border-stone-100">
              <div className="d-flex align-items-center gap-2 p-2 border border-stone-200 rounded-xl bg-stone-50">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder={`Message in "${activeThread?.name || activeThreadId}"...`}
                  className="flex-grow-1 bg-transparent border-0 outline-none text-sm text-dark px-2"
                />
                <button type="submit" disabled={!messageInput.trim()} className="size-9 rounded-lg bg-primary text-white border-0 hover:scale-105 transition-all d-flex align-items-center justify-content-center disabled:opacity-50 disabled:hover:scale-100">
                  <span className="material-symbols-outlined fs-5">send</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMessages;
