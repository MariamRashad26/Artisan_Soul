import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../utils/axiosInstance';

const AdminInventory = () => {
  const [activeTab, setActiveTab] = useState('raw_materials');
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [isRawMaterialModalOpen, setIsRawMaterialModalOpen] = useState(false);
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
  
  const [isEditRawMaterialModalOpen, setIsEditRawMaterialModalOpen] = useState(false);
  const [isEditPurchaseModalOpen, setIsEditPurchaseModalOpen] = useState(false);
  const [isEditInventoryModalOpen, setIsEditInventoryModalOpen] = useState(false);

  const [rawMaterials, setRawMaterials] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [productInventory, setProductInventory] = useState([]);
  
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  const [editingRawMaterial, setEditingRawMaterial] = useState(null);
  const [editingPurchase, setEditingPurchase] = useState(null);
  const [editingInventory, setEditingInventory] = useState(null);

  const fetchAllData = async () => {
    try {
      const [matRes, invRes, purRes, prodRes, suppRes] = await Promise.all([
        axios.get('/api/materials'),
        axios.get('/api/inventory'),
        axios.get('/api/finance/purchases'),
        axios.get('/api/products'),
        axios.get('/api/suppliers')
      ]);
      
      const mappedMat = matRes.data.map(item => ({
        ...item,
        id: item.materialId || 'RM-000',
        reorder: item.reorderLevel || 0
      }));
      setRawMaterials(mappedMat);

      setProductInventory(invRes.data.map(i => ({
        ...i,
        sku: i.product_id?.product_id || 'UNKNOWN',
        name: i.product_id?.name || 'Unknown Product',
        size: 'Standard',
        stock: i.quantity_in_stock,
        location: i.warehouse_location || 'Main Warehouse'
      })));
      
      setPurchases(purRes.data.map(p => ({
        ...p,
        id: p._id.substring(0, 8),
        date: new Date(p.purchase_date).toLocaleDateString(),
        item: p.raw_material_id?.name || 'Material',
        cost: p.total_cost,
        status: p.status
      })));
      
      setProducts(prodRes.data);
      setSuppliers(suppRes.data);
      
    } catch (err) {
      console.error('Failed to fetch inventory data:', err);
    }
  };

  useEffect(() => {
    const loadData = async () => { await fetchAllData(); };
    loadData();
  }, []);

  // Purchase Operations
  const handlePurchaseMaterial = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/finance/purchases', {
        raw_material_id: e.target.raw_material_id.value,
        supplier_id: e.target.supplier_id.value,
        quantity: Number(e.target.quantity.value),
        total_cost: Number(e.target.quantity.value) * Number(e.target.unit_price.value),
        status: e.target.status.value,
        purchase_date: new Date()
      });
      setIsPurchaseModalOpen(false);
      fetchAllData();
    } catch {
      alert('Failed to log purchase');
    }
  };

  const handleEditPurchase = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/finance/purchases/${editingPurchase._id}`, {
        quantity: Number(e.target.quantity.value),
        total_cost: Number(e.target.total_cost.value),
        status: e.target.status.value
      });
      setIsEditPurchaseModalOpen(false);
      setEditingPurchase(null);
      fetchAllData();
    } catch {
      alert('Failed to update purchase');
    }
  };

  const handleDeletePurchase = async (id) => {
    if (!window.confirm('Are you sure you want to delete this purchase entry?')) return;
    try {
      await axios.delete(`/api/finance/purchases/${id}`);
      fetchAllData();
    } catch {
      alert('Failed to delete purchase');
    }
  };

  // Raw Material Operations
  const handleLogRawMaterial = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/materials', {
        materialId: e.target.materialId.value,
        name: e.target.name.value,
        description: e.target.description.value,
        unit: e.target.unit.value,
        quantity: Number(e.target.quantity.value),
        reorderLevel: Number(e.target.reorderLevel.value),
        supplier: e.target.supplier.value
      });
      setIsRawMaterialModalOpen(false);
      fetchAllData();
    } catch {
      alert('Failed to log material');
    }
  };

  const handleEditRawMaterial = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/materials/${editingRawMaterial.materialId}`, {
        name: e.target.name.value,
        description: e.target.description.value,
        unit: e.target.unit.value,
        quantity: Number(e.target.quantity.value),
        reorderLevel: Number(e.target.reorderLevel.value),
        supplier: e.target.supplier.value
      });
      setIsEditRawMaterialModalOpen(false);
      setEditingRawMaterial(null);
      fetchAllData();
    } catch {
      alert('Failed to update material');
    }
  };

  const handleDeleteRawMaterial = async (materialId) => {
    if (!window.confirm('Are you sure you want to delete this raw material?')) return;
    try {
      await axios.delete(`/api/materials/${materialId}`);
      fetchAllData();
    } catch {
      alert('Failed to delete material');
    }
  };

  // Product Inventory Operations
  const handleCreateInventory = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/inventory', {
        product_id: e.target.product_id.value,
        quantity_in_stock: Number(e.target.quantity_in_stock.value),
        warehouse_location: e.target.warehouse_location.value
      });
      setIsInventoryModalOpen(false);
      fetchAllData();
    } catch {
      alert('Failed to create inventory entry');
    }
  };

  const handleEditInventory = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/inventory/${editingInventory._id}`, {
        quantity_in_stock: Number(e.target.quantity_in_stock.value),
        warehouse_location: e.target.warehouse_location.value
      });
      setIsEditInventoryModalOpen(false);
      setEditingInventory(null);
      fetchAllData();
    } catch {
      alert('Failed to update inventory entry');
    }
  };

  const handleDeleteInventory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this inventory record?')) return;
    try {
      await axios.delete(`/api/inventory/${id}`);
      fetchAllData();
    } catch {
      alert('Failed to delete inventory record');
    }
  };

  const tabs = [
    { id: 'raw_materials', label: 'Raw Materials' },
    { id: 'material_purchases', label: 'Material Purchases' },
    { id: 'product_inventory', label: 'Product Inventory' }
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
          <button onClick={() => setIsInventoryModalOpen(true)} className="px-8 py-3.5 rounded-2xl bg-white text-dark text-[10px] fw-black text-uppercase tracking-widest shadow-sm hover:shadow-md transition duration-500 d-flex align-items-center gap-3 border border-stone-200">
            <span className="material-symbols-outlined fs-5">inventory</span>
            Add Inventory Item
          </button>
          <button onClick={() => setIsRawMaterialModalOpen(true)} className="px-8 py-3.5 rounded-2xl bg-white text-dark text-[10px] fw-black text-uppercase tracking-widest shadow-sm hover:shadow-md transition duration-500 d-flex align-items-center gap-3 border border-stone-200">
            <span className="material-symbols-outlined fs-5">inventory_2</span>
            Log Raw Material
          </button>
          <button onClick={() => setIsPurchaseModalOpen(true)} className="px-8 py-3.5 rounded-2xl bg-dark text-white text-[10px] fw-black text-uppercase tracking-widest shadow-2xl hover:-translate-y-1 transition duration-500 d-flex align-items-center gap-3">
            <span className="material-symbols-outlined fs-5">shopping_cart_checkout</span>
            Purchase Material
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
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Supplier</th>
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700 text-end">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {rawMaterials.map((item, i) => (
                  <tr key={i} className="group hover:bg-stone-50/50 transition-all duration-500">
                    <td className="px-10 py-8 text-xs fw-bold text-primary">{item.id}</td>
                    <td className="px-10 py-8 text-sm fw-black text-dark">{item.name}</td>
                    <td className="px-10 py-8 text-xs fw-bold text-stone-600">{item.quantity} {item.unit}</td>
                    <td className="px-10 py-8 text-xs fw-bold text-rose-500">{item.reorder} {item.unit}</td>
                    <td className="px-10 py-8 text-xs fw-bold text-stone-500">{item.supplier || 'N/A'}</td>
                    <td className="px-10 py-8 text-end">
                      <div className="d-flex justify-content-end gap-2">
                        <button onClick={() => { setEditingRawMaterial(item); setIsEditRawMaterialModalOpen(true); }} className="p-2 rounded-xl bg-stone-100 hover:bg-dark hover:text-white transition text-stone-600 d-inline-flex align-items-center">
                          <span className="material-symbols-outlined fs-6">edit</span>
                        </button>
                        <button onClick={() => handleDeleteRawMaterial(item.materialId)} className="p-2 rounded-xl bg-rose-50 hover:bg-rose-500 hover:text-white transition text-rose-600 d-inline-flex align-items-center">
                          <span className="material-symbols-outlined fs-6">delete</span>
                        </button>
                      </div>
                    </td>
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
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Status</th>
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700 text-end">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {purchases.map((po, i) => (
                  <tr key={i} className="group hover:bg-stone-50/50 transition-all duration-500">
                    <td className="px-10 py-8 text-xs fw-bold text-primary">{po.id}</td>
                    <td className="px-10 py-8 text-sm fw-bold text-stone-600">{po.date}</td>
                    <td className="px-10 py-8 text-sm fw-black text-dark">{po.item}</td>
                    <td className="px-10 py-8 text-sm fw-bold text-stone-600">${po.cost?.toLocaleString()}</td>
                    <td className="px-10 py-8">
                       <span className={`text-[9px] fw-black text-uppercase tracking-widest px-3 py-1.5 rounded-pill ${po.status === 'Completed' || po.status === 'Received' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                          {po.status}
                       </span>
                    </td>
                    <td className="px-10 py-8 text-end">
                      <div className="d-flex justify-content-end gap-2">
                        <button onClick={() => { setEditingPurchase(po); setIsEditPurchaseModalOpen(true); }} className="p-2 rounded-xl bg-stone-100 hover:bg-dark hover:text-white transition text-stone-600 d-inline-flex align-items-center">
                          <span className="material-symbols-outlined fs-6">edit</span>
                        </button>
                        <button onClick={() => handleDeletePurchase(po._id)} className="p-2 rounded-xl bg-rose-50 hover:bg-rose-500 hover:text-white transition text-rose-600 d-inline-flex align-items-center">
                          <span className="material-symbols-outlined fs-6">delete</span>
                        </button>
                      </div>
                    </td>
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
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Location</th>
                  <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700 text-end">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {productInventory.map((item, i) => (
                  <tr key={i} className="group hover:bg-stone-50/50 transition-all duration-500">
                    <td className="px-10 py-8 text-xs fw-bold text-primary">{item.sku}</td>
                    <td className="px-10 py-8 text-sm fw-black text-dark">{item.name}</td>
                    <td className="px-10 py-8 text-sm fw-bold text-stone-600">US {item.size}</td>
                    <td className="px-10 py-8 text-sm fw-bold text-stone-600">{item.stock}</td>
                    <td className="px-10 py-8 text-xs fw-bold text-stone-400">{item.location}</td>
                    <td className="px-10 py-8 text-end">
                      <div className="d-flex justify-content-end gap-2">
                        <button onClick={() => { setEditingInventory(item); setIsEditInventoryModalOpen(true); }} className="p-2 rounded-xl bg-stone-100 hover:bg-dark hover:text-white transition text-stone-600 d-inline-flex align-items-center">
                          <span className="material-symbols-outlined fs-6">edit</span>
                        </button>
                        <button onClick={() => handleDeleteInventory(item._id)} className="p-2 rounded-xl bg-rose-50 hover:bg-rose-500 hover:text-white transition text-rose-600 d-inline-flex align-items-center">
                          <span className="material-symbols-outlined fs-6">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Product Inventory Modal */}
      {isInventoryModalOpen && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark/50 backdrop-blur-sm z-[100] d-flex align-items-center justify-content-center p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-[600px] w-100 max-h-[90vh] overflow-y-auto custom-scrollbar border border-stone-100 animate-in zoom-in-95 duration-200">
            <div className="sticky-top bg-stone-50/90 backdrop-blur-md px-8 py-6 border-bottom border-stone-100 d-flex justify-content-between align-items-center z-10">
              <div className="d-flex align-items-center gap-3">
                 <span className="material-symbols-outlined text-dark fs-4">inventory</span>
                 <h3 className="fs-5 fw-black font-serif text-dark mb-0 tracking-tight lowercase">Add.Inventory</h3>
              </div>
              <button onClick={() => setIsInventoryModalOpen(false)} className="text-stone-600 hover:text-dark transition">
                <span className="material-symbols-outlined fs-5">close</span>
              </button>
            </div>
            <form onSubmit={handleCreateInventory} className="p-8 space-y-6">
              <div className="row g-4">
                <div className="col-12">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Select Product</label>
                  <select name="product_id" required className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition">
                    <option value="">Choose a Product</option>
                    {products.map(p => (
                      <option key={p._id} value={p._id}>{p.name} (${p.price})</option>
                    ))}
                  </select>
                </div>
                <div className="col-12 col-md-6">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Quantity in Stock</label>
                  <input name="quantity_in_stock" type="number" required min="0" className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" placeholder="e.g. 100" />
                </div>
                <div className="col-12 col-md-6">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Warehouse Location</label>
                  <input name="warehouse_location" required className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" placeholder="e.g. Shelf C4" />
                </div>
              </div>
              <div className="pt-6 border-top border-stone-100 d-flex justify-content-end gap-3 mt-8">
                <button type="button" onClick={() => setIsInventoryModalOpen(false)} className="px-6 py-2.5 rounded-xl border border-stone-200 text-[10px] fw-black text-uppercase tracking-widest text-stone-700 hover:bg-stone-50 transition">Discard</button>
                <button type="submit" className="px-6 py-2.5 rounded-xl bg-dark text-white text-[10px] fw-black text-uppercase tracking-widest hover:bg-stone-800 transition shadow-lg">Save Item</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Inventory Modal */}
      {isEditInventoryModalOpen && editingInventory && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark/50 backdrop-blur-sm z-[100] d-flex align-items-center justify-content-center p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-[600px] w-100 max-h-[90vh] overflow-y-auto custom-scrollbar border border-stone-100 animate-in zoom-in-95 duration-200">
            <div className="sticky-top bg-stone-50/90 backdrop-blur-md px-8 py-6 border-bottom border-stone-100 d-flex justify-content-between align-items-center z-10">
              <div className="d-flex align-items-center gap-3">
                 <span className="material-symbols-outlined text-dark fs-4">edit_square</span>
                 <h3 className="fs-5 fw-black font-serif text-dark mb-0 tracking-tight lowercase">Edit.Inventory</h3>
              </div>
              <button onClick={() => { setIsEditInventoryModalOpen(false); setEditingInventory(null); }} className="text-stone-600 hover:text-dark transition">
                <span className="material-symbols-outlined fs-5">close</span>
              </button>
            </div>
            <form onSubmit={handleEditInventory} className="p-8 space-y-6">
              <div className="row g-4">
                <div className="col-12 col-md-6">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Quantity in Stock</label>
                  <input name="quantity_in_stock" type="number" required min="0" defaultValue={editingInventory.stock} className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" />
                </div>
                <div className="col-12 col-md-6">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Warehouse Location</label>
                  <input name="warehouse_location" required defaultValue={editingInventory.location} className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" />
                </div>
              </div>
              <div className="pt-6 border-top border-stone-100 d-flex justify-content-end gap-3 mt-8">
                <button type="button" onClick={() => { setIsEditInventoryModalOpen(false); setEditingInventory(null); }} className="px-6 py-2.5 rounded-xl border border-stone-200 text-[10px] fw-black text-uppercase tracking-widest text-stone-700 hover:bg-stone-50 transition">Discard</button>
                <button type="submit" className="px-6 py-2.5 rounded-xl bg-dark text-white text-[10px] fw-black text-uppercase tracking-widest hover:bg-stone-800 transition shadow-lg">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Purchase Material Modal */}
      {isPurchaseModalOpen && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark/50 backdrop-blur-sm z-[100] d-flex align-items-center justify-content-center p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-[600px] w-100 max-h-[90vh] overflow-y-auto custom-scrollbar border border-stone-100 animate-in zoom-in-95 duration-200">
            <div className="sticky-top bg-stone-50/90 backdrop-blur-md px-8 py-6 border-bottom border-stone-100 d-flex justify-content-between align-items-center z-10">
              <div className="d-flex align-items-center gap-3">
                 <span className="material-symbols-outlined text-dark fs-4">shopping_cart_checkout</span>
                 <h3 className="fs-5 fw-black font-serif text-dark mb-0 tracking-tight lowercase">Purchase.Material</h3>
              </div>
              <button onClick={() => setIsPurchaseModalOpen(false)} className="text-stone-600 hover:text-dark transition">
                <span className="material-symbols-outlined fs-5">close</span>
              </button>
            </div>
            <form onSubmit={handlePurchaseMaterial} className="p-8 space-y-6">
              <div className="row g-4">
                <div className="col-12 col-md-6">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Select Raw Material</label>
                  <select name="raw_material_id" required className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition">
                    <option value="">Choose Material</option>
                    {rawMaterials.map(m => (
                      <option key={m.materialId} value={m._id}>{m.name} ({m.unit})</option>
                    ))}
                  </select>
                </div>
                <div className="col-12 col-md-6">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Select Supplier</label>
                  <select name="supplier_id" required className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition">
                    <option value="">Choose Supplier</option>
                    {suppliers.map(s => (
                      <option key={s._id} value={s._id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div className="col-12 col-md-4">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Quantity</label>
                  <input name="quantity" type="number" required min="1" className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" />
                </div>
                <div className="col-12 col-md-4">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Unit Price ($)</label>
                  <input name="unit_price" type="number" step="0.01" required min="0.01" className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" />
                </div>
                <div className="col-12 col-md-4">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Status</label>
                  <select name="status" defaultValue="Ordered" className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition">
                    <option value="Ordered">Ordered</option>
                    <option value="Received">Received</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              <div className="pt-6 border-top border-stone-100 d-flex justify-content-end gap-3 mt-8">
                <button type="button" onClick={() => setIsPurchaseModalOpen(false)} className="px-6 py-2.5 rounded-xl border border-stone-200 text-[10px] fw-black text-uppercase tracking-widest text-stone-700 hover:bg-stone-50 transition">Discard</button>
                <button type="submit" className="px-6 py-2.5 rounded-xl bg-dark text-white text-[10px] fw-black text-uppercase tracking-widest hover:bg-stone-800 transition shadow-lg">Submit Purchase</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Purchase Modal */}
      {isEditPurchaseModalOpen && editingPurchase && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark/50 backdrop-blur-sm z-[100] d-flex align-items-center justify-content-center p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-[600px] w-100 max-h-[90vh] overflow-y-auto custom-scrollbar border border-stone-100 animate-in zoom-in-95 duration-200">
            <div className="sticky-top bg-stone-50/90 backdrop-blur-md px-8 py-6 border-bottom border-stone-100 d-flex justify-content-between align-items-center z-10">
              <div className="d-flex align-items-center gap-3">
                 <span className="material-symbols-outlined text-dark fs-4">edit_square</span>
                 <h3 className="fs-5 fw-black font-serif text-dark mb-0 tracking-tight lowercase">Edit.Purchase</h3>
              </div>
              <button onClick={() => { setIsEditPurchaseModalOpen(false); setEditingPurchase(null); }} className="text-stone-600 hover:text-dark transition">
                <span className="material-symbols-outlined fs-5">close</span>
              </button>
            </div>
            <form onSubmit={handleEditPurchase} className="p-8 space-y-6">
              <div className="row g-4">
                <div className="col-12 col-md-6">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Quantity</label>
                  <input name="quantity" type="number" required min="1" defaultValue={editingPurchase.quantity} className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" />
                </div>
                <div className="col-12 col-md-6">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Total Cost ($)</label>
                  <input name="total_cost" type="number" step="0.01" required min="0.01" defaultValue={editingPurchase.cost} className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" />
                </div>
                <div className="col-12">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Status</label>
                  <select name="status" defaultValue={editingPurchase.status} className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition">
                    <option value="Ordered">Ordered</option>
                    <option value="Received">Received</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              <div className="pt-6 border-top border-stone-100 d-flex justify-content-end gap-3 mt-8">
                <button type="button" onClick={() => { setIsEditPurchaseModalOpen(false); setEditingPurchase(null); }} className="px-6 py-2.5 rounded-xl border border-stone-200 text-[10px] fw-black text-uppercase tracking-widest text-stone-700 hover:bg-stone-50 transition">Discard</button>
                <button type="submit" className="px-6 py-2.5 rounded-xl bg-dark text-white text-[10px] fw-black text-uppercase tracking-widest hover:bg-stone-800 transition shadow-lg">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Log Raw Material Modal */}
      {isRawMaterialModalOpen && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark/50 backdrop-blur-sm z-[100] d-flex align-items-center justify-content-center p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-[600px] w-100 max-h-[90vh] overflow-y-auto custom-scrollbar border border-stone-100 animate-in zoom-in-95 duration-200">
            <div className="sticky-top bg-stone-50/90 backdrop-blur-md px-8 py-6 border-bottom border-stone-100 d-flex justify-content-between align-items-center z-10">
              <div className="d-flex align-items-center gap-3">
                 <span className="material-symbols-outlined text-dark fs-4">inventory_2</span>
                 <h3 className="fs-5 fw-black font-serif text-dark mb-0 tracking-tight lowercase">Log.Material</h3>
              </div>
              <button onClick={() => setIsRawMaterialModalOpen(false)} className="text-stone-600 hover:text-dark transition">
                <span className="material-symbols-outlined fs-5">close</span>
              </button>
            </div>
            <form onSubmit={handleLogRawMaterial} className="p-8 space-y-6">
              <div className="row g-4">
                <div className="col-12 col-md-6">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Material ID</label>
                  <input name="materialId" required className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" placeholder="RM-001" />
                </div>
                <div className="col-12 col-md-6">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Name / Grade</label>
                  <input name="name" required className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" placeholder="Premium Leather" />
                </div>
                <div className="col-12 col-md-6">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Supplier</label>
                  <input name="supplier" required className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" placeholder="Supplier Name" />
                </div>
                <div className="col-12 col-md-6">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Description</label>
                  <input name="description" required className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" placeholder="e.g. Italian calf leather" />
                </div>
                <div className="col-12 col-md-4">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Unit</label>
                  <input name="unit" required className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" placeholder="sq ft, pairs, etc." />
                </div>
                <div className="col-12 col-md-4">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Initial Quantity</label>
                  <input name="quantity" type="number" required min="0" className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" />
                </div>
                <div className="col-12 col-md-4">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Reorder Level</label>
                  <input name="reorderLevel" type="number" required min="0" className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" />
                </div>
              </div>
              <div className="pt-6 border-top border-stone-100 d-flex justify-content-end gap-3 mt-8">
                <button type="button" onClick={() => setIsRawMaterialModalOpen(false)} className="px-6 py-2.5 rounded-xl border border-stone-200 text-[10px] fw-black text-uppercase tracking-widest text-stone-700 hover:bg-stone-50 transition">Discard</button>
                <button type="submit" className="px-6 py-2.5 rounded-xl bg-dark text-white text-[10px] fw-black text-uppercase tracking-widest hover:bg-stone-800 transition shadow-lg">Log Material</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Raw Material Modal */}
      {isEditRawMaterialModalOpen && editingRawMaterial && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark/50 backdrop-blur-sm z-[100] d-flex align-items-center justify-content-center p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-[600px] w-100 max-h-[90vh] overflow-y-auto custom-scrollbar border border-stone-100 animate-in zoom-in-95 duration-200">
            <div className="sticky-top bg-stone-50/90 backdrop-blur-md px-8 py-6 border-bottom border-stone-100 d-flex justify-content-between align-items-center z-10">
              <div className="d-flex align-items-center gap-3">
                 <span className="material-symbols-outlined text-dark fs-4">edit_square</span>
                 <h3 className="fs-5 fw-black font-serif text-dark mb-0 tracking-tight lowercase">Edit.Material</h3>
              </div>
              <button onClick={() => { setIsEditRawMaterialModalOpen(false); setEditingRawMaterial(null); }} className="text-stone-600 hover:text-dark transition">
                <span className="material-symbols-outlined fs-5">close</span>
              </button>
            </div>
            <form onSubmit={handleEditRawMaterial} className="p-8 space-y-6">
              <div className="row g-4">
                <div className="col-12 col-md-6">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Name / Grade</label>
                  <input name="name" required defaultValue={editingRawMaterial.name} className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" />
                </div>
                <div className="col-12 col-md-6">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Supplier</label>
                  <input name="supplier" required defaultValue={editingRawMaterial.supplier} className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" />
                </div>
                <div className="col-12 col-md-6">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Description</label>
                  <input name="description" required defaultValue={editingRawMaterial.description} className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" />
                </div>
                <div className="col-12 col-md-6">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Unit</label>
                  <input name="unit" required defaultValue={editingRawMaterial.unit} className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" />
                </div>
                <div className="col-12 col-md-6">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Quantity</label>
                  <input name="quantity" type="number" required min="0" defaultValue={editingRawMaterial.quantity} className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" />
                </div>
                <div className="col-12 col-md-6">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Reorder Level</label>
                  <input name="reorderLevel" type="number" required min="0" defaultValue={editingRawMaterial.reorderLevel} className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" />
                </div>
              </div>
              <div className="pt-6 border-top border-stone-100 d-flex justify-content-end gap-3 mt-8">
                <button type="button" onClick={() => { setIsEditRawMaterialModalOpen(false); setEditingRawMaterial(null); }} className="px-6 py-2.5 rounded-xl border border-stone-200 text-[10px] fw-black text-uppercase tracking-widest text-stone-700 hover:bg-stone-50 transition">Discard</button>
                <button type="submit" className="px-6 py-2.5 rounded-xl bg-dark text-white text-[10px] fw-black text-uppercase tracking-widest hover:bg-stone-800 transition shadow-lg">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminInventory;
