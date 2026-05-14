import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const ArtisanMaterials = () => {
  const [activeTab, setActiveTab] = useState('log_usage');

  const [logs, setLogs] = useState([]);
  const [orders, setOrders] = useState([]);
  const [materials, setMaterials] = useState([]);
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    batch_id: '',
    raw_material_id: '',
    quantity_used: ''
  });

  const fetchData = async () => {
    try {
      const [logRes, matRes, orderRes] = await Promise.all([
        axios.get('/api/raw-materials/consume'),
        axios.get('/api/raw-materials'),
        axios.get('/api/orders')
      ]);
      setLogs(logRes.data.map(l => ({
        id: l._id.slice(-6).toUpperCase(),
        material: l.raw_material_id?.name || 'Unknown',
        batch: l.batch_id?.orderId || 'Unknown',
        amount: l.quantity_used,
        unit: l.raw_material_id?.unit || '',
        date: new Date(l.date).toLocaleDateString()
      })));
      setMaterials(matRes.data);
      setOrders(orderRes.data);
    } catch(err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/raw-materials/consume', {
        ...formData,
        logged_by: user?._id || '664536761ab2093ce14e5a32'
      });
      setActiveTab('history');
      setFormData({ batch_id: '', raw_material_id: '', quantity_used: '' });
      fetchData();
    } catch(err) {
      console.error(err);
      alert('Failed to log material usage');
    }
  };

  return (
    <div className="p-8 lg:p-12 animate-in fade-in duration-1000">
      <section className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-6 mb-12">
        <div>
          <nav className="d-flex align-items-center gap-3 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700 mb-4">
            <Link to="/artisan" className="hover:text-dark transition">Workshop</Link>
            <span className="material-symbols-outlined fs-6 text-stone-200">chevron_right</span>
            <span className="text-primary">Inventory Control</span>
          </nav>
          <h1 className="display-4 fw-black font-serif text-dark tracking-tighter mb-0 lowercase">Material.Logs</h1>
        </div>
      </section>

      <div className="d-flex flex-wrap gap-4 mb-8 border-bottom border-stone-200 pb-4">
        <button 
          onClick={() => setActiveTab('log_usage')}
          className={`text-xs fw-black text-uppercase tracking-widest px-6 py-2 rounded-full transition-all duration-300 ${activeTab === 'log_usage' ? 'bg-primary text-white shadow-md' : 'text-stone-500 hover:bg-stone-100'}`}
        >
          Submit New Log
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`text-xs fw-black text-uppercase tracking-widest px-6 py-2 rounded-full transition-all duration-300 ${activeTab === 'history' ? 'bg-primary text-white shadow-md' : 'text-stone-500 hover:bg-stone-100'}`}
        >
          My Consumption History
        </button>
      </div>

      <div className="glass-panel rounded-[3rem] border-stone-100 shadow-sm overflow-hidden">
        {activeTab === 'log_usage' && (
          <div className="p-8 lg:p-12 max-w-[800px]">
            <h3 className="fs-5 fw-black font-serif text-dark mb-6 tracking-tight lowercase">Log Material Usage</h3>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="row g-4">
                 <div className="col-12 col-md-6">
                    <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Target Batch / Work Order</label>
                    <select required value={formData.batch_id} onChange={e => setFormData({...formData, batch_id: e.target.value})} className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition appearance-none">
                       <option value="">Select Target...</option>
                       {orders.map(o => (
                         <option key={o._id} value={o._id}>{o.orderId} - {o.model}</option>
                       ))}
                    </select>
                 </div>
                 <div className="col-12 col-md-6">
                    <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Material Consumed</label>
                    <select required value={formData.raw_material_id} onChange={e => setFormData({...formData, raw_material_id: e.target.value})} className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition appearance-none">
                       <option value="">Select Material...</option>
                       {materials.map(m => (
                         <option key={m._id} value={m._id}>{m.name} ({m.stock_quantity} {m.unit} in stock)</option>
                       ))}
                    </select>
                 </div>
                 <div className="col-12 col-md-6">
                    <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Amount Used</label>
                    <input required value={formData.quantity_used} onChange={e => setFormData({...formData, quantity_used: e.target.value})} type="number" step="0.1" placeholder="e.g., 4.5" className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" />
                 </div>
                 <div className="col-12 col-md-6">
                    <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Unit of Measurement</label>
                    <input type="text" readOnly value={materials.find(m => m._id === formData.raw_material_id)?.unit || ''} className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition appearance-none" />
                 </div>
              </div>
              <div className="pt-6 mt-4 border-top border-stone-100 d-flex justify-content-end">
                <button type="submit" className="px-8 py-3.5 rounded-2xl bg-primary text-white text-[10px] fw-black text-uppercase tracking-widest hover:shadow-lg hover:-translate-y-1 transition duration-500">
                  Transmit to Ledger
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="table-responsive">
            <table className="w-100 text-start align-middle">
               <thead className="bg-stone-50/50">
                  <tr>
                     <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Log ID</th>
                     <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Material</th>
                     <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Target Batch</th>
                     <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Amount Used</th>
                     <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700 text-end">Date</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-stone-50">
                  {logs.map((log, i) => (
                    <tr key={i} className="group hover:bg-stone-50/50 transition-all duration-500">
                       <td className="px-10 py-8 text-xs fw-bold text-primary">{log.id}</td>
                       <td className="px-10 py-8 text-sm fw-black text-dark">{log.material}</td>
                       <td className="px-10 py-8 text-xs fw-bold text-stone-600">{log.batch}</td>
                       <td className="px-10 py-8 text-sm fw-bold text-rose-500">-{log.amount} {log.unit}</td>
                       <td className="px-10 py-8 text-end text-xs fw-bold text-stone-500">{log.date}</td>
                    </tr>
                  ))}
               </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtisanMaterials;
