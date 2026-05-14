import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AdminInventory = () => {
  const [activeTab, setActiveTab] = useState('raw_materials');

  const [rawMaterials, setRawMaterials] = useState([]);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const { data } = await axios.get('/api/materials');
        const mapped = data.map(item => ({
          ...item,
          id: item.materialId || 'RM-000',
          reorder: item.reorderLevel || 0
        }));
        setRawMaterials(mapped);
      } catch (error) {
        console.error('Failed to fetch materials', error);
      }
    };
    fetchMaterials();
  }, []);

  const [purchases, setPurchases] = useState([]);
  const [consumptionLogs, setConsumptionLogs] = useState([]);
  const [productInventory, setProductInventory] = useState([]);
  const [packagingLogs, setPackagingLogs] = useState([]);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [invRes, purRes] = await Promise.all([
          axios.get('/api/inventory'),
          axios.get('/api/finance/purchases')
        ]);
        
        setProductInventory(invRes.data.map(i => ({
          sku: i.product_id?.product_id || 'UNKNOWN',
          name: i.product_id?.name || 'Unknown Product',
          size: 'Standard',
          stock: i.quantity_in_stock,
          location: i.warehouse_location || 'Main Warehouse'
        })));
        
        setPurchases(purRes.data.map(p => ({
          id: p._id.substring(0, 8),
          date: new Date(p.purchase_date).toLocaleDateString(),
          item: p.raw_material_id?.name || 'Material',
          cost: p.total_cost,
          status: p.status
        })));
        
      } catch (err) {
        console.error('Failed to fetch inventory data:', err);
      }
    };
    fetchAllData();
  }, []);

  const tabs = [
    { id: 'raw_materials', label: 'Raw Materials' },
    { id: 'material_purchases', label: 'Material Purchases' },
    { id: 'material_consumption', label: 'Consumption Logs' },
    { id: 'product_inventory', label: 'Product Inventory' },
    { id: 'packaging_logs', label: 'Packaging Logs' }
  ];

  return (
    <div className="p-8 lg:p-12 animate-in fade-in duration-1000">
      <section className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-6 mb-12">
        <div>
          <nav className="d-flex align-items-center gap-3 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700 mb-4">
            <Link to="/admin" className="hover:text-dark transition">Operations</Link>
            <span className="material-symbols-outlined fs-6 text-stone-200">chevron_right</span>
            <span className="text-primary">Logistics</span>
          </nav>
          <h1 className="display-4 fw-black font-serif text-dark tracking-tighter mb-0 lowercase">Inventory.Logistics</h1>
        </div>
        
        <div className="d-flex gap-4">
          <button className="px-8 py-3.5 rounded-2xl bg-dark text-white text-[10px] fw-black text-uppercase tracking-widest shadow-2xl hover:-translate-y-1 transition duration-500 d-flex align-items-center gap-3">
            <span className="material-symbols-outlined fs-5">category</span>
            Log New Item
          </button>
        </div>
      </section>

      {/* Tabs */}
      <div className="d-flex flex-wrap gap-4 mb-8 border-bottom border-stone-200 pb-4">
        {tabs.map((tab) => (
           <button 
             key={tab.id}
             onClick={() => setActiveTab(tab.id)}
             className={`text-xs fw-black text-uppercase tracking-widest px-6 py-2 rounded-full transition-all duration-300 ${activeTab === tab.id ? 'bg-dark text-white shadow-md' : 'text-stone-500 hover:bg-stone-100'}`}
           >
             {tab.label}
           </button>
        ))}
      </div>

      <div className="glass-panel rounded-[3rem] border-stone-100 shadow-premium overflow-hidden">
        {activeTab === 'raw_materials' && (
          <div className="table-responsive">
            <table className="w-100 text-start align-middle">
              <thead className="bg-stone-50/50">
                <tr>
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Material ID</th>
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Name & Grade</th>
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Stock Quantity</th>
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Reorder Level</th>
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700 text-end">Supplier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {rawMaterials.map((item, i) => (
                  <tr key={i} className="group hover:bg-stone-50/50 transition-all duration-500">
                    <td className="px-10 py-8 text-xs fw-bold text-primary">{item.id}</td>
                    <td className="px-10 py-8 text-sm fw-black text-dark">{item.name}</td>
                    <td className="px-10 py-8 text-xs fw-bold text-stone-600">{item.quantity} {item.unit}</td>
                    <td className="px-10 py-8 text-xs fw-bold text-rose-500">{item.reorder} {item.unit}</td>
                    <td className="px-10 py-8 text-end text-xs fw-bold text-stone-500">{item.supplier}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'material_purchases' && (
          <div className="table-responsive">
            <table className="w-100 text-start align-middle">
              <thead className="bg-stone-50/50">
                <tr>
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Order ID</th>
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Date Ordered</th>
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Item Details</th>
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Cost</th>
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700 text-end">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {purchases.map((po, i) => (
                  <tr key={i} className="group hover:bg-stone-50/50 transition-all duration-500">
                    <td className="px-10 py-8 text-xs fw-bold text-primary">{po.id}</td>
                    <td className="px-10 py-8 text-sm fw-bold text-stone-600">{po.date}</td>
                    <td className="px-10 py-8 text-sm fw-black text-dark">{po.item}</td>
                    <td className="px-10 py-8 text-sm fw-bold text-stone-600">${po.cost.toLocaleString()}</td>
                    <td className="px-10 py-8 text-end">
                       <span className={`text-[9px] fw-black text-uppercase tracking-widest px-3 py-1.5 rounded-pill ${po.status === 'Received' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                          {po.status}
                       </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'material_consumption' && (
          <div className="table-responsive">
            <table className="w-100 text-start align-middle">
              <thead className="bg-stone-50/50">
                <tr>
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Log ID</th>
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Batch Target</th>
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Material Used</th>
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Amount</th>
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700 text-end">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {consumptionLogs.map((log, i) => (
                  <tr key={i} className="group hover:bg-stone-50/50 transition-all duration-500">
                    <td className="px-10 py-8 text-xs fw-bold text-stone-500">{log.logId}</td>
                    <td className="px-10 py-8 text-xs fw-bold text-primary">{log.batch}</td>
                    <td className="px-10 py-8 text-sm fw-black text-dark">{log.material}</td>
                    <td className="px-10 py-8 text-xs fw-bold text-rose-500">-{log.amount} {log.unit}</td>
                    <td className="px-10 py-8 text-end text-xs fw-bold text-stone-500">{log.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'product_inventory' && (
          <div className="table-responsive">
            <table className="w-100 text-start align-middle">
              <thead className="bg-stone-50/50">
                <tr>
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">SKU</th>
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Product Line</th>
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Size</th>
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Units in Stock</th>
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700 text-end">Location</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {productInventory.map((item, i) => (
                  <tr key={i} className="group hover:bg-stone-50/50 transition-all duration-500">
                    <td className="px-10 py-8 text-xs fw-bold text-primary">{item.sku}</td>
                    <td className="px-10 py-8 text-sm fw-black text-dark">{item.name}</td>
                    <td className="px-10 py-8 text-sm fw-bold text-stone-600">US {item.size}</td>
                    <td className="px-10 py-8 text-sm fw-bold text-stone-600">{item.stock}</td>
                    <td className="px-10 py-8 text-end text-xs fw-bold text-stone-400">{item.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'packaging_logs' && (
          <div className="table-responsive">
            <table className="w-100 text-start align-middle">
              <thead className="bg-stone-50/50">
                <tr>
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Package ID</th>
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Target Order</th>
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Item Packed</th>
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Materials</th>
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700 text-end">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {packagingLogs.map((log, i) => (
                  <tr key={i} className="group hover:bg-stone-50/50 transition-all duration-500">
                    <td className="px-10 py-8 text-xs fw-bold text-stone-500">{log.boxId}</td>
                    <td className="px-10 py-8 text-xs fw-bold text-primary">{log.orderId}</td>
                    <td className="px-10 py-8 text-sm fw-black text-dark">{log.sku}</td>
                    <td className="px-10 py-8 text-xs fw-bold text-stone-500">{log.materialsUsed}</td>
                    <td className="px-10 py-8 text-end text-xs fw-bold text-stone-400">{log.date}</td>
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

export default AdminInventory;
