import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminCatalog = () => {
  const [products, setProducts] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      const formattedData = data.map(p => ({
        ...p,
        id: p.product_id || p._id,
        _id: p._id,
        image: p.imageUrl || 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&q=80',
        stock: p.inStock ? 10 : 0, 
        status: p.inStock && p.is_available !== false ? 'In Stock' : 'Out of Stock'
      }));
      setProducts(formattedData);
    } catch (err) {
      console.error('Fetch products error:', err);
    }
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [isSeasonalModalOpen, setIsSeasonalModalOpen] = useState(false);
  const [isPriceMatrixModalOpen, setIsPriceMatrixModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingProduct, setViewingProduct] = useState(null);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.category.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleAuditExport = () => {
    const csv = ['SKU,Name,Category,Price,Stock,Status'];
    products.forEach(p => csv.push(`${p.id},"${p.name}",${p.category},${p.price},${p.stock},${p.status}`));
    const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'catalog_audit_stock.csv';
    a.click();
  };

  const handleDeploy = async (e) => {
    e.preventDefault();
    const payload = {
      product_id: e.target.product_id.value,
      name: e.target.name.value,
      category: e.target.category.value,
      price: parseInt(e.target.price.value.replace(/,/g, '')),
      inStock: parseInt(e.target.stock.value) > 0,
      is_available: true,
      sizes_available: e.target.sizes.value ? e.target.sizes.value.split(',').map(s => Number(s.trim())) : [],
      details: {
        color: e.target.color.value || 'Black',
        material: e.target.material.value || 'Leather'
      },
      discount: e.target.discount.value ? parseInt(e.target.discount.value) : null,
      description: 'Handcrafted luxury shoe',
      imageUrl: e.target.imageUrl.value || 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&q=80'
    };

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        setIsDeployModalOpen(false);
        fetchProducts(); // refresh list
      } else {
        const errorData = await response.json();
        alert(`Failed to deploy: ${errorData.message}`);
      }
    } catch (err) {
      console.error(err);
      alert('Network error while deploying.');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const updatedStock = parseInt(e.target.stock.value);
    
    const payload = {
      price: parseInt(e.target.price.value.replace(/,/g, '')),
      inStock: updatedStock > 0,
      is_available: parseInt(e.target.stock.value) > 0,
      discount: e.target.discount.value ? parseInt(e.target.discount.value) : null,
      sizes_available: e.target.sizes.value ? e.target.sizes.value.split(',').map(s => Number(s.trim())) : [],
      details: {
        color: e.target.color.value || editingProduct.details?.color || 'Black',
        material: e.target.material.value || editingProduct.details?.material || 'Leather'
      }
    };

    try {
      const response = await fetch(`/api/products/${editingProduct._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        setIsEditModalOpen(false);
        fetchProducts();
      } else {
        const errorData = await response.json();
        alert(`Failed to update: ${errorData.message}`);
      }
    } catch (err) {
      console.error(err);
      alert('Network error while updating.');
    }
  };

  const handleDelete = async (dataId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const response = await fetch(`/api/products/${dataId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        fetchProducts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setIsEditModalOpen(true);
  };

  const openViewModal = (product) => {
    setViewingProduct(product);
    setIsViewModalOpen(true);
  };

  return (
    <div className="p-8 lg:p-12 animate-in fade-in duration-1000">
      <section className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-6 mb-12">
        <div>
          <nav className="d-flex align-items-center gap-3 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700 mb-4">
            <Link to="/admin" className="hover:text-dark transition">Operations</Link>
            <span className="material-symbols-outlined fs-6 text-stone-200">chevron_right</span>
            <span className="text-primary">Catalog Management</span>
          </nav>
          <h1 className="display-4 fw-black font-serif text-dark tracking-tighter mb-0 lowercase">Luxury.Catalog</h1>
        </div>
        
        <div className="d-flex gap-4">
          <button onClick={handleAuditExport} className="px-8 py-3.5 rounded-2xl bg-white border border-stone-100 text-[10px] fw-black text-uppercase tracking-widest text-dark hover:bg-stone-50 transition duration-500 shadow-sm d-flex align-items-center gap-3">
            <span className="material-symbols-outlined fs-5">inventory</span>
            Audit Stock
          </button>
          <button onClick={() => setIsDeployModalOpen(true)} className="px-8 py-3.5 rounded-2xl bg-dark text-white text-[10px] fw-black text-uppercase tracking-widest shadow-2xl hover:-translate-y-1 transition duration-500 d-flex align-items-center gap-3">
            <span className="material-symbols-outlined fs-5">library_add</span>
            Deploy New Model
          </button>
        </div>
      </section>

      <section className="glass-panel p-4 rounded-[2.5rem] border-stone-100 shadow-premium d-flex align-items-center gap-6 mb-10">
          <div className="position-relative d-flex-grow-1 group px-4 w-100">
             <span className="material-symbols-outlined position-absolute left-8 top-50 translate-middle-y text-stone-700 fs-5">search</span>
             <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-100 bg-stone-50/50 border-stone-100 rounded-xl pl-12 pr-6 py-3 text-xs fw-black text-dark outline-none focus:bg-white focus:border-dark transition duration-500" placeholder="Filter collection by model, category or SKU..." type="text" />
          </div>
          <div className="border-start border-stone-100 pl-6 h-12 d-flex align-items-center gap-4">
             <button onClick={() => setIsSeasonalModalOpen(true)} className="px-6 py-3 rounded-xl border border-stone-100 text-[10px] fw-black text-uppercase tracking-widest text-stone-600 hover:text-dark hover:border-dark transition">Seasonal Curation</button>
             <button onClick={() => setIsPriceMatrixModalOpen(true)} className="px-6 py-3 rounded-xl border border-stone-100 text-[10px] fw-black text-uppercase tracking-widest text-stone-600 hover:text-dark hover:border-dark transition">Price Matrix</button>
          </div>
      </section>

      <div className="glass-panel rounded-[3rem] border-stone-100 shadow-premium overflow-hidden">
        <div className="table-responsive">
          <table className="w-100 text-start align-middle">
            <thead className="bg-stone-50/50">
              <tr>
                <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">SKU Code</th>
                <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Visual Asset</th>
                <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Model Name</th>
                <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Valuation (PKR)</th>
                <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Stock Availability</th>
                <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700 text-end">Operational Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {paginatedProducts.length > 0 ? paginatedProducts.map((product, i) => (
                <tr key={i} className="group hover:bg-stone-50/50 transition-all duration-500">
                  <td className="px-10 py-8 text-xs fw-black text-stone-600 tracking-tighter">{product.id}</td>
                  <td className="px-10 py-8">
                    <div className="size-16 rounded-2xl overflow-hidden border border-stone-100 shadow-sm relative group">
                        <img src={product.image} className="w-100 h-100 object-cover group-hover:scale-125 transition-transform duration-1000" alt={product.name} />
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="d-flex flex-column">
                       <span className="text-sm fw-black text-dark tracking-tight mb-1">{product.name}</span>
                       <span className="text-[9px] fw-black text-uppercase tracking-widest text-stone-700 font-display mb-2">{product.category}</span>
                       <div className="d-flex gap-1">
                          {product.colors?.map((c, idx) => (
                             <span key={idx} className="size-3 rounded-full border border-stone-200 shadow-sm" style={{ backgroundColor: c }}></span>
                          ))}
                       </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <span className="text-sm fw-black text-dark font-display">{product.price}</span>
                  </td>
                  <td className="px-10 py-8">
                    <div className="d-flex align-items-center gap-4">
                       <div className="h-1 lg:w-24 bg-stone-100 rounded-full overflow-hidden shadow-inner">
                          <div className={`h-100 rounded-full transition-all duration-1000 ${product.stock > 10 ? 'bg-primary' : product.stock > 0 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${Math.min(product.stock * 5, 100)}%` }}></div>
                       </div>
                       <span className={`text-[9px] fw-black text-uppercase tracking-widest ${product.status === 'In Stock' ? 'text-primary' : product.status === 'Low Stock' ? 'text-amber-500' : 'text-rose-500'}`}>{product.status}</span>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-end">
                    <div className="d-flex justify-content-end gap-3 transition-all duration-500">
                       <button onClick={() => handleDelete(product._id)} className="size-10 rounded-xl bg-white border border-stone-100 shadow-sm text-stone-600 hover:bg-stone-50 hover:text-rose-500 hover:border-rose-500 transition d-flex align-items-center justify-content-center" title="Delete">
                          <span className="material-symbols-outlined fs-5">delete</span>
                       </button>
                       <button onClick={() => openEditModal(product)} className="size-10 rounded-xl bg-white border border-stone-100 shadow-sm text-stone-600 hover:bg-stone-50 hover:text-primary hover:border-primary transition d-flex align-items-center justify-content-center" title="Edit">
                          <span className="material-symbols-outlined fs-5">edit</span>
                       </button>
                       <button onClick={() => openViewModal(product)} className="size-10 rounded-xl bg-white border border-stone-100 shadow-sm text-stone-600 hover:bg-stone-50 hover:text-dark hover:border-dark transition d-flex align-items-center justify-content-center" title="View">
                          <span className="material-symbols-outlined fs-5">visibility</span>
                       </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="px-10 py-12 text-center text-sm fw-medium text-stone-600">No items matched your search query.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {totalPages > 1 && (
          <div className="px-10 py-6 border-top border-stone-50 bg-stone-50/30 d-flex align-items-center justify-content-between">
            <p className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-600 mb-0">Page {currentPage.toString().padStart(2, '0')} of {totalPages.toString().padStart(2, '0')} — Active Collection: {filteredProducts.length} Items</p>
            <div className="d-flex align-items-center gap-4">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="size-10 rounded-2xl border border-stone-100 bg-white d-flex align-items-center justify-content-center text-stone-200 hover:text-dark hover:border-dark transition duration-500 disabled:opacity-30 disabled:hover:border-stone-100 disabled:hover:text-stone-200 cursor-pointer disabled:cursor-default"
              >
                <span className="material-symbols-outlined fs-5">chevron_left</span>
              </button>
              <div className="d-flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button 
                      key={p} 
                      onClick={() => setCurrentPage(p)}
                      className={`size-10 rounded-2xl text-[10px] fw-black transition duration-500 ${p === currentPage ? 'bg-dark text-white shadow-xl shadow-stone-200 cursor-default' : 'text-stone-600 hover:bg-white hover:text-dark hover:border-stone-100'}`}
                    >
                      {p}
                    </button>
                ))}
              </div>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="size-10 rounded-2xl border border-stone-100 bg-white d-flex align-items-center justify-content-center text-stone-600 hover:text-dark hover:border-dark transition duration-500 disabled:opacity-30 disabled:hover:border-stone-100 disabled:hover:text-stone-600 cursor-pointer disabled:cursor-default"
              >
                <span className="material-symbols-outlined fs-5">chevron_right</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Deploy Model Modal */}
      {isDeployModalOpen && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark/50 backdrop-blur-sm z-[100] d-flex align-items-center justify-content-center p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-[600px] w-100 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="px-8 py-6 border-bottom border-stone-100 d-flex justify-content-between align-items-center bg-stone-50/50">
              <h3 className="fs-5 fw-black font-serif text-dark mb-0 tracking-tight lowercase">Deploy.Model</h3>
              <button onClick={() => setIsDeployModalOpen(false)} className="text-stone-600 hover:text-dark transition">
                <span className="material-symbols-outlined fs-5">close</span>
              </button>
            </div>
            <form onSubmit={handleDeploy} className="p-8 space-y-6">
              <div className="row g-4">
                <div className="col-12">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">SKU / Product ID</label>
                  <input name="product_id" required className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" placeholder="e.g., P01" />
                </div>
                <div className="col-12">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Model Name</label>
                  <input name="name" required className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" />
                </div>
                <div className="col-12">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Image URL (Optional)</label>
                  <input name="imageUrl" className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" placeholder="https://..." />
                </div>
                <div className="col-md-4">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Category</label>
                  <select name="category" className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition">
                    <option value="Formal">Formal</option>
                    <option value="Casual">Casual</option>
                    <option value="Boots">Boots</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Sizes Available (Comma sep)</label>
                  <input name="sizes" type="text" placeholder="7, 8, 9, 10" className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" />
                </div>
                <div className="col-md-4">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Primary Color</label>
                  <input name="color" type="text" placeholder="Black" className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" />
                </div>
                <div className="col-md-4">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Material</label>
                  <input name="material" type="text" placeholder="Leather" className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" />
                </div>
                <div className="col-md-4">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Discount Value</label>
                  <input name="discount" type="number" placeholder="0" className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" />
                </div>
                <div className="col-md-4">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Price (PKR)</label>
                  <input name="price" required type="text" className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" />
                </div>
                <div className="col-md-4">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Initial Stock</label>
                  <input name="stock" required type="number" min="0" className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" />
                </div>
              </div>
              <div className="pt-6 border-top border-stone-100 d-flex justify-content-end gap-3 mt-8">
                <button type="button" onClick={() => setIsDeployModalOpen(false)} className="px-6 py-2.5 rounded-xl border border-stone-200 text-[10px] fw-black text-uppercase tracking-widest text-stone-700 hover:bg-stone-50 transition">Discard</button>
                <button type="submit" className="px-6 py-2.5 rounded-xl bg-dark text-white text-[10px] fw-black text-uppercase tracking-widest hover:bg-stone-800 transition shadow-lg">Deploy Release</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Seasonal Curation Modal */}
      {isSeasonalModalOpen && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark/50 backdrop-blur-sm z-[100] d-flex align-items-center justify-content-center p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-[500px] w-100 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="px-8 py-6 border-bottom border-stone-100 d-flex justify-content-between align-items-center bg-stone-50/50">
              <h3 className="fs-5 fw-black font-serif text-dark mb-0 tracking-tight lowercase">Seasonal.Curation</h3>
              <button onClick={() => setIsSeasonalModalOpen(false)} className="text-stone-600 hover:text-dark transition">
                <span className="material-symbols-outlined fs-5">close</span>
              </button>
            </div>
            <div className="p-8">
              <p className="text-sm fw-medium text-stone-700 mb-6">Upcoming seasonal picks mapped by our design council.</p>
              <div className="d-flex flex-column gap-3">
                 <div className="p-4 rounded-xl border border-stone-100 bg-stone-50 hover:border-dark transition cursor-pointer">
                    <h5 className="text-sm fw-black text-dark mb-1">Autumn '26 Collection</h5>
                    <p className="text-[10px] text-stone-600 mb-0">Includes: Derby Classic, Artisan Brogue</p>
                 </div>
                 <div className="p-4 rounded-xl border border-stone-100 bg-stone-50 hover:border-dark transition cursor-pointer">
                    <h5 className="text-sm fw-black text-dark mb-1">Winter Luxe '26</h5>
                    <p className="text-[10px] text-stone-600 mb-0">Includes: Chelsea Luxe (Prioritized Stocking)</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Price Matrix Modal */}
      {isPriceMatrixModalOpen && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark/50 backdrop-blur-sm z-[100] d-flex align-items-center justify-content-center p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-[600px] w-100 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="px-8 py-6 border-bottom border-stone-100 d-flex justify-content-between align-items-center bg-stone-50/50">
              <h3 className="fs-5 fw-black font-serif text-dark mb-0 tracking-tight lowercase">Price.Matrix</h3>
              <button onClick={() => setIsPriceMatrixModalOpen(false)} className="text-stone-600 hover:text-dark transition">
                <span className="material-symbols-outlined fs-5">close</span>
              </button>
            </div>
            <div className="p-8">
              <table className="w-100">
                 <thead className="bg-stone-50/50 text-[9px] fw-black text-uppercase tracking-widest text-stone-600 text-start">
                    <tr><th className="p-4">Tier/Category</th><th className="p-4 text-end">Base Cost</th><th className="p-4 text-end">Market Price (PKR)</th></tr>
                 </thead>
                 <tbody className="text-xs fw-black text-dark">
                    <tr className="border-bottom border-stone-50"><td className="p-4">Boots (Premium)</td><td className="p-4 text-end text-stone-600">~22,000</td><td className="p-4 text-end">52,000+</td></tr>
                    <tr className="border-bottom border-stone-50"><td className="p-4">Formal Oxfords</td><td className="p-4 text-end text-stone-600">~18,000</td><td className="p-4 text-end">45,000</td></tr>
                    <tr className="border-bottom border-stone-50"><td className="p-4">Casual Loafers</td><td className="p-4 text-end text-stone-600">~15,500</td><td className="p-4 text-end">38,000</td></tr>
                 </tbody>
              </table>
              <div className="d-flex justify-content-end mt-6">
                 <button onClick={() => setIsPriceMatrixModalOpen(false)} className="px-6 py-2.5 rounded-xl bg-dark text-white text-[10px] fw-black text-uppercase tracking-widest shadow-lg hover:bg-stone-800 transition">Update Matrix</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {isEditModalOpen && editingProduct && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark/50 backdrop-blur-sm z-[100] d-flex align-items-center justify-content-center p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-[500px] w-100 overflow-hidden animate-in zoom-in-95 duration-300 border border-stone-100">
            <div className="px-8 py-6 border-bottom border-stone-100 d-flex justify-content-between align-items-center bg-stone-50/50">
              <div className="d-flex align-items-center gap-3">
                 <span className="material-symbols-outlined text-primary fs-4">inventory</span>
                 <h3 className="fs-5 fw-black font-serif text-dark mb-0 tracking-tight lowercase">Update.Stock</h3>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} className="text-stone-600 hover:text-dark transition">
                <span className="material-symbols-outlined fs-5">close</span>
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-8 space-y-6">
              
              <div className="d-flex gap-4 align-items-center p-4 bg-stone-50 rounded-2xl border border-stone-100 mb-6">
                 <div className="size-16 rounded-xl overflow-hidden border border-stone-200">
                    <img src={editingProduct.image} className="w-100 h-100 object-cover" alt="product" />
                 </div>
                 <div>
                    <span className="text-[10px] text-stone-600 fw-black text-uppercase tracking-widest d-block">{editingProduct.id}</span>
                    <span className="text-sm fw-black text-dark">{editingProduct.name}</span>
                 </div>
              </div>

              <div className="row g-4">
                <div className="col-12">
                   <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Current Stock Level</label>
                   <div className="d-flex align-items-center gap-3 bg-stone-50/50 p-2 rounded-xl border border-stone-100">
                      <input name="stock" type="number" required defaultValue={editingProduct.stock} className="w-100 bg-transparent border-0 px-2 fw-black text-lg text-dark outline-none" min="0" />
                      <span className="px-4 py-2 bg-white rounded-lg text-[10px] fw-black text-uppercase tracking-widest shadow-sm text-stone-700 border border-stone-100">Pairs</span>
                   </div>
                </div>

                <div className="col-6">
                   <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Valuation (PKR)</label>
                   <div className="d-flex align-items-center gap-3 bg-stone-50/50 p-2 rounded-xl border border-stone-100">
                      <span className="px-4 py-2 rounded-lg text-[10px] fw-black text-uppercase tracking-widest text-stone-600">Rs.</span>
                      <input name="price" type="text" required defaultValue={editingProduct.price} className="w-100 bg-transparent border-0 px-2 fw-black text-lg text-dark outline-none" />
                   </div>
                </div>
                
                <div className="col-6">
                   <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Discount Value</label>
                   <div className="d-flex align-items-center gap-3 bg-stone-50/50 p-2 rounded-xl border border-stone-100">
                      <input name="discount" type="number" defaultValue={editingProduct.discount || ''} className="w-100 bg-transparent border-0 px-2 fw-black text-lg text-dark outline-none" />
                   </div>
                </div>

                <div className="col-12">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Sizes Available (Comma sep)</label>
                  <input name="sizes" type="text" defaultValue={editingProduct.sizes_available ? editingProduct.sizes_available.join(', ') : ''} className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" />
                </div>
                
                <div className="col-6">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Color</label>
                  <input name="color" type="text" defaultValue={editingProduct.details?.color || ''} className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" />
                </div>

                <div className="col-6">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Material</label>
                  <input name="material" type="text" defaultValue={editingProduct.details?.material || ''} className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" />
                </div>
              </div>

              <div className="pt-6 border-top border-stone-100 d-flex justify-content-end gap-3 mt-8">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-6 py-3 rounded-xl border border-stone-200 text-[10px] fw-black text-uppercase tracking-widest text-stone-700 hover:bg-stone-50 transition">Discard Changes</button>
                <button type="submit" className="px-6 py-3 rounded-xl bg-primary text-white text-[10px] fw-black text-uppercase tracking-widest hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-1 transition duration-500">Commit Update</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Product Modal */}
      {isViewModalOpen && viewingProduct && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark/50 backdrop-blur-sm z-[100] d-flex align-items-center justify-content-center p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-[500px] w-100 overflow-hidden animate-in zoom-in-95 duration-300 border border-stone-100">
            <div className="px-8 py-6 border-bottom border-stone-100 d-flex justify-content-between align-items-center bg-stone-50/50">
              <div className="d-flex align-items-center gap-3">
                 <span className="material-symbols-outlined text-primary fs-4">visibility</span>
                 <h3 className="fs-5 fw-black font-serif text-dark mb-0 tracking-tight lowercase">Product.Details</h3>
              </div>
              <button onClick={() => setIsViewModalOpen(false)} className="text-stone-600 hover:text-dark transition">
                <span className="material-symbols-outlined fs-5">close</span>
              </button>
            </div>
            
            <div className="p-8">
              <div className="aspect-ratio-4-5 rounded-2xl overflow-hidden mb-6 relative border border-stone-100 shadow-sm">
                 <img src={viewingProduct.image} className="w-100 h-100 object-cover" alt="product preview" />
                 <div className="position-absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] fw-black text-uppercase tracking-widest shadow-sm">
                   {viewingProduct.status}
                 </div>
              </div>
              
              <h4 className="fs-3 fw-black font-serif text-dark mb-1">{viewingProduct.name}</h4>
              <p className="text-xs fw-black text-uppercase tracking-widest text-stone-500 mb-6">{viewingProduct.category} • SKU: {viewingProduct.id}</p>

              <div className="row g-4 mb-6">
                <div className="col-6">
                   <div className="p-4 bg-stone-50 rounded-xl border border-stone-100">
                      <span className="text-[9px] fw-black text-uppercase tracking-widest text-stone-500 d-block mb-1">Standard Valuation</span>
                      <span className="text-lg fw-black text-dark">Rs. {viewingProduct.price}</span>
                   </div>
                </div>
                <div className="col-6">
                   <div className="p-4 bg-stone-50 rounded-xl border border-stone-100">
                      <span className="text-[9px] fw-black text-uppercase tracking-widest text-stone-500 d-block mb-1">Warehouse Stock</span>
                      <span className="text-lg fw-black text-dark">{viewingProduct.stock} Pairs</span>
                   </div>
                </div>
              </div>

              {viewingProduct.colors && (
                <div>
                   <span className="text-[9px] fw-black text-uppercase tracking-widest text-stone-500 d-block mb-2">Color Manifest</span>
                   <div className="d-flex gap-2">
                     {viewingProduct.colors.map((c, idx) => (
                        <div key={idx} className="size-8 rounded-full border border-stone-200 shadow-sm" style={{ backgroundColor: c }}></div>
                     ))}
                   </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCatalog;
