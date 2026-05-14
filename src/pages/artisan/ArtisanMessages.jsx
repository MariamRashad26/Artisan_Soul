import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ArtisanMessages = () => {
  const [threads, setThreads] = useState([
    { id: 1, name: 'Jonathan Reeves', order: 'Custom Sovereign Wingtip (#AS-8812)', time: '10m', msg: 'The wingtip looks amazing! Will the dye loosen over time?', active: true, unread: true, messages: [
      { sender: 'patron', initials: 'JR', text: 'The wingtip looks amazing! Will the dye loosen or lighten over time? I want to make sure the patina holds that deep chestnut edge.', time: 'Today, 10:42 AM' },
      { sender: 'artisan', initials: 'MS', text: 'Thank you, Jonathan. We use a proprietary sealing wax during the final burnishing stage which locks in the deepest part of the chestnut hue. It will naturally soften in the flex points, but the toe and heel will remain exactly as dark as you see now.', time: 'Today, 11:15 AM' }
    ] },
    { id: 2, name: 'Sarah Jenkins', order: 'Brogue Artisan (#AS-9425)', time: '2h', msg: 'Could we slightly alter the heel block?', active: false, unread: false, messages: [
      { sender: 'patron', initials: 'SJ', text: 'Could we slightly alter the heel block? I was hoping for something a bit more slanted.', time: 'Yesterday, 04:30 PM' }
    ] },
    { id: 3, name: 'Marcus Chen', order: 'Monk Strap Elite (#AS-9430)', time: '1d', msg: 'Received the technical pack. Approved.', active: false, unread: false, messages: [
      { sender: 'artisan', initials: 'MS', text: 'Good morning Marcus. Please find the finalized technical pack attached for your bespoke Monk Strap.', time: 'Tuesday, 09:00 AM' },
      { sender: 'patron', initials: 'MC', text: 'Received the technical pack. Approved.', time: 'Tuesday, 11:45 AM' }
    ] }
  ]);
  
  const [activeThreadId, setActiveThreadId] = useState(1);
  const [messageInput, setMessageInput] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await axios.get('/api/chat');
        if (data.length > 0) {
           // We map the backend messages to the dummy threads format for now
           // In a real app we'd group by receiver_id or sender_id
           const newThreads = [...threads];
           const newMessages = data.map(m => ({
               sender: m.sender_id?.role === 'admin' || m.sender_id?.role === 'artisan' ? 'artisan' : 'patron',
               initials: m.sender_id?.name ? m.sender_id.name.substring(0,2).toUpperCase() : 'US',
               text: m.content,
               time: new Date(m.timestamp).toLocaleTimeString()
           }));
           newThreads[0].messages = [...newThreads[0].messages, ...newMessages];
           setThreads(newThreads);
        }
      } catch (err) {
        console.error("Error fetching chats", err);
      }
    };
    fetchMessages();
  }, []);

  const activeThread = threads.find(t => t.id === activeThreadId);

  const handleThreadClick = (id) => {
    setActiveThreadId(id);
    setThreads(threads.map(t => t.id === id ? { ...t, unread: false } : t));
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;
    
    // Optimistic UI update
    const optimisticMsg = { sender: 'artisan', initials: 'MS', text: messageInput, time: 'Just now' };
    setThreads(threads.map(t => {
      if (t.id === activeThreadId) {
        return {
          ...t,
          messages: [...t.messages, optimisticMsg],
          msg: messageInput
        };
      }
      return t;
    }));
    
    const contentToSend = messageInput;
    setMessageInput('');
    
    try {
       // We need a sender_id. In a real app this comes from auth context.
       // Let's get any admin/artisan user to act as sender.
       const usersRes = await axios.get('/api/auth/users');
       const sender = usersRes.data.find(u => u.role === 'admin' || u.role === 'artisan');
       if (sender) {
           await axios.post('/api/chat', {
               sender_id: sender._id,
               content: contentToSend
           });
       }
    } catch (err) {
       console.error("Failed to send message", err);
    }
  };
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
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-10 animate-in fade-in slide-in-from-bottom duration-1000">
        <div className="row g-5 h-[700px]">
          {/* Thread List */}
          <div className="col-lg-4 h-100 d-flex flex-column">
             <div className="bg-white rounded-[2rem] shadow-premium border border-stone-100 h-100 overflow-hidden d-flex flex-column">
                <div className="p-6 border-bottom border-stone-100 bg-stone-50">
                    <h3 className="text-[10px] fw-black text-stone-400 text-uppercase tracking-[0.3em] mb-4">Active Threads</h3>
                    <div className="position-relative">
                       <span className="material-symbols-outlined position-absolute top-50 start-0 translate-middle-y ms-3 text-stone-400 fs-5">search</span>
                       <input type="text" placeholder="Search patron..." className="form-control bg-white border-stone-200 rounded-xl py-3 ps-10 text-sm shadow-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none text-dark" />
                    </div>
                </div>
                <div className="flex-grow-1 overflow-y-auto custom-scrollbar">
                   {threads.map((t) => (
                     <div key={t.id} onClick={() => handleThreadClick(t.id)} className={`p-4 border-bottom border-stone-50 cursor-pointer transition ${t.id === activeThreadId ? 'bg-primary/5 border-l-4 border-l-primary' : 'hover:bg-stone-50 bg-white'}`}>
                        <div className="d-flex justify-content-between align-items-center mb-1">
                           <h4 className={`fs-6 fw-black mb-0 ${t.id === activeThreadId ? 'text-primary' : 'text-dark'}`}>{t.name}</h4>
                           <span className={`text-[10px] fw-bold ${t.unread ? 'text-amber-500' : 'text-stone-400'}`}>{t.time}</span>
                        </div>
                        <p className={`text-xs text-truncate mb-0 ${t.unread ? 'text-dark fw-bold' : 'text-stone-500'}`}>{t.msg}</p>
                     </div>
                   ))}
                </div>
             </div>
          </div>

          {/* Chat Window */}
          <div className="col-lg-8 h-100">
             <div className="bg-white rounded-[2rem] shadow-premium border border-stone-100 h-100 overflow-hidden d-flex flex-column relative">
                <div className="p-6 border-bottom border-stone-100 bg-stone-50 d-flex justify-content-between align-items-center">
                   <div>
                      <h3 className="fs-5 fw-black text-dark tracking-tight mb-1">{activeThread.name}</h3>
                      <p className="text-[10px] fw-black text-stone-400 text-uppercase tracking-[0.2em] mb-0">Order: {activeThread.order}</p>
                   </div>
                   <button className="btn btn-outline-primary text-xs fw-bold rounded-xl py-2 px-4 shadow-sm border-primary-20">View Specs</button>
                </div>
                
                <div className="flex-grow-1 p-6 overflow-y-auto custom-scrollbar space-y-6 bg-slate-50/30">
                   {activeThread.messages.map((msg, idx) => {
                     if (msg.sender === 'patron') {
                       return (
                         <div key={idx} className="d-flex gap-4">
                            <div className="size-10 rounded-full bg-stone-200 text-stone-500 d-flex align-items-center justify-content-center text-xs fw-black shadow-inner">
                               {msg.initials}
                            </div>
                            <div className="bg-white border border-stone-100 rounded-2xl p-4 shadow-sm max-w-[80%]">
                               <p className="text-sm text-stone-700 leading-relaxed mb-0">{msg.text}</p>
                               <p className="text-[10px] text-stone-400 mt-2 mb-0 fw-bold">{msg.time}</p>
                            </div>
                         </div>
                       )
                     } else {
                       return (
                         <div key={idx} className="d-flex gap-4 flex-row-reverse">
                            <div className="size-10 rounded-full bg-primary text-white d-flex align-items-center justify-content-center text-xs fw-black shadow-lg shadow-primary/30">
                               {msg.initials}
                            </div>
                            <div className="bg-primary text-white rounded-2xl p-4 shadow-md max-w-[80%]">
                               <p className="text-sm text-white/90 leading-relaxed mb-0">{msg.text}</p>
                               <p className="text-[10px] text-white/50 mt-2 mb-0 fw-bold text-end">{msg.time}</p>
                            </div>
                         </div>
                       )
                     }
                   })}
                </div>

                <div className="p-4 bg-white border-top border-stone-100">
                   <div className="p-2 border border-stone-200 rounded-2xl bg-stone-50 d-flex align-items-center gap-2">
                      <button className="size-10 rounded-xl text-stone-400 hover:bg-white hover:text-primary transition border border-transparent hover:border-stone-200 d-flex align-items-center justify-content-center">
                         <span className="material-symbols-outlined fs-5">attach_file</span>
                      </button>
                      <input type="text" value={messageInput} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} onChange={(e) => setMessageInput(e.target.value)} placeholder="Message patron..." className="flex-grow-1 bg-transparent border-0 outline-none text-sm text-dark px-2" />
                      <button onClick={handleSendMessage} disabled={!messageInput.trim()} className="size-10 rounded-xl bg-primary text-white hover:-translate-y-1 transition-transform shadow-md shadow-primary/30 d-flex align-items-center justify-content-center disabled:opacity-50 disabled:hover:translate-y-0">
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
