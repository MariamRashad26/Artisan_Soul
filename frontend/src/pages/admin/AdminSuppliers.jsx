import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../utils/axiosInstance';

const AdminSuppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);

  const fetchSuppliers = useCallback(async () => {
    try {
      const response = await axios.get('/api/suppliers');
      setSuppliers(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Fetch suppliers error:', err);
      setSuppliers([]);
    }
  }, []);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  const filteredSuppliers = Array.isArray(suppliers) ? suppliers.filter(s => 
    (s.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
    (s.supplier_id || '').toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.max(1, Math.ceil((filteredSuppliers || []).length / itemsPerPage));
  const paginatedSuppliers = (filteredSuppliers || []).slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleDeploy = async (e) => {
    e.preventDefault();
    const payload = {
      supplier_id: e.target.supplier_id.value,
      name: e.target.name.value,
      email: e.target.email.value,
      contact_numbers: e.target.contact_numbers.value ? e.target.contact_numbers.value.split(',').map(s => s.trim()) : [],
      rating: Number(e.target.rating.value) || 0,
      is_verified: e.target.is_verified.checked,
      payment_terms: e.target.payment_terms.value || '30 Days',
      supplied_materials: e.target.supplied_materials.value ? e.target.supplied_materials.value.split(',').map(s => s.trim()) : [],
      address: {
        city: e.target.city.value,
        area: e.target.area.value
      }
    };

    try {
      await axios.post('/api/suppliers', payload);
      setIsDeployModalOpen(false);
      fetchSuppliers(); 
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || 'Network error while deploying.';
      alert(`Failed to add supplier: ${errMsg}`);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    const payload = {
      name: e.target.name.value,
      email: e.target.email.value,
      contact_numbers: e.target.contact_numbers.value ? e.target.contact_numbers.value.split(',').map(s => s.trim()) : [],
      rating: Number(e.target.rating.value) || 0,
      is_verified: e.target.is_verified.checked,
      payment_terms: e.target.payment_terms.value,
      supplied_materials: e.target.supplied_materials.value ? e.target.supplied_materials.value.split(',').map(s => s.trim()) : [],
      address: {
        city: e.target.city.value,
        area: e.target.area.value
      }
    };

    try {
      await axios.put(`/api/suppliers/${editingSupplier._id}`, payload);
      setIsEditModalOpen(false);
      fetchSuppliers();
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || 'Network error while updating.';
      alert(`Failed to update: ${errMsg}`);
    }
  };

  const handleDelete = async (dataId) => {
    if (!window.confirm('Remove this supplier from the registry?')) return;
    try {
      await axios.delete(`/api/suppliers/${dataId}`);
      fetchSuppliers();
    } catch (err) {
      console.error(err);
    }
  };

  const openEditModal = (supplier) => {
    setEditingSupplier(supplier);
    setIsEditModalOpen(true);
  };

  return (
    <div className="p-8 lg:p-12 animate-in fade-in duration-1000">
      <section className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-6 mb-12">
        <div>
          <nav className="d-flex align-items-center gap-3 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700 mb-4">
            <Link to="/admin" className="hover:text-dark transition">Operations</Link>
            <span className="material-symbols-outlined fs-6 text-stone-200">chevron_right</span>
            <span className="text-primary">Resource Network</span>
          </nav>
          <h1 className="display-4 fw-black font-serif text-dark tracking-tighter mb-0 lowercase">Suppliers.Registry</h1>
        </div>
        
        <div className="d-flex gap-4">
          <button onClick={() => setIsDeployModalOpen(true)} className="px-8 py-3.5 rounded-2xl bg-dark text-white text-[10px] fw-black text-uppercase tracking-widest shadow-2xl hover:-translate-y-1 transition duration-500 d-flex align-items-center gap-3">
            <span className="material-symbols-outlined fs-5">domain_add</span>
            Register Supplier
          </button>
        </div>
      </section>

      <section className="glass-panel p-4 rounded-[2.5rem] border-stone-100 shadow-premium d-flex align-items-center gap-6 mb-10">
          <div className="position-relative d-flex-grow-1 group px-4 w-100">
             <span className="material-symbols-outlined position-absolute left-8 top-50 translate-middle-y text-stone-700 fs-5">search</span>
             <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-100 bg-stone-50/50 border-stone-100 rounded-xl pl-12 pr-6 py-3 text-xs fw-black text-dark outline-none focus:bg-white focus:border-dark transition duration-500" placeholder="Filter network by supplier name or ID..." type="text" />
          </div>
      </section>

      <div className="glass-panel rounded-[3rem] border-stone-100 shadow-premium overflow-hidden">
        <div className="table-responsive">
          <table className="w-100 text-start align-middle">
            <thead className="bg-stone-50/50">
              <tr>
                <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Vendor Identity</th>
                <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Material Specialization</th>
                <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Contact Route</th>
                <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700">Status</th>
                <th className="px-10 py-6 text-[10px] fw-black text-uppercase tracking-[0.3em] text-stone-700 text-end">Action Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {paginatedSuppliers.length > 0 ? paginatedSuppliers.map((supplier, i) => (
                <tr key={i} className="group hover:bg-stone-50/50 transition-all duration-500">
                  <td className="px-10 py-8">
                    <div className="d-flex flex-column">
                       <div className="d-flex align-items-center gap-2 mb-1">
                          <span className="text-sm fw-black text-dark tracking-tight">{supplier.name}</span>
                          {supplier.is_verified && <span className="material-symbols-outlined fs-6 text-primary" title="Verified Partner">verified</span>}
                       </div>
                       <span className="text-[10px] fw-black text-uppercase tracking-widest text-stone-500 font-display mb-2">{supplier.supplier_id} | Rating: {supplier.rating}/5</span>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="d-flex gap-2 flex-wrap max-w-[200px]">
                      {supplier.supplied_materials?.map((mat, idx) => (
                         <span key={idx} className="px-3 py-1.5 bg-white border border-stone-100 shadow-sm rounded-lg text-[9px] fw-black text-uppercase tracking-widest text-stone-700">
                            {mat}
                         </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="d-flex flex-column gap-1 text-[11px] fw-semibold text-stone-600">
                       <span>{supplier.email || 'N/A'}</span>
                       <span>{supplier.contact_numbers?.[0] || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                     <span className={`text-[9px] fw-black text-uppercase tracking-widest px-3 py-1.5 rounded-pill ${supplier.is_verified ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-stone-100 text-stone-500'}`}>
                        {supplier.is_verified ? 'Authorized' : 'Pending Review'}
                     </span>
                  </td>
                  <td className="px-10 py-8 text-end">
                    <div className="d-flex justify-content-end gap-3 transition-all duration-500">
                       <button onClick={() => handleDelete(supplier._id)} className="size-10 rounded-xl bg-white border border-stone-100 shadow-sm text-stone-600 hover:bg-stone-50 hover:text-rose-500 hover:border-rose-500 transition d-flex align-items-center justify-content-center" title="Delete">
                          <span className="material-symbols-outlined fs-5">delete</span>
                       </button>
                       <button onClick={() => openEditModal(supplier)} className="size-10 rounded-xl bg-white border border-stone-100 shadow-sm text-stone-600 hover:bg-stone-50 hover:text-primary hover:border-primary transition d-flex align-items-center justify-content-center" title="Edit">
                          <span className="material-symbols-outlined fs-5">edit</span>
                       </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-10 py-12 text-center text-sm fw-medium text-stone-600">No suppliers found in registry.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {totalPages > 1 && (
          <div className="px-10 py-6 border-top border-stone-50 bg-stone-50/30 d-flex align-items-center justify-content-between">
            <p className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-600 mb-0">Page {currentPage.toString().padStart(2, '0')} of {totalPages.toString().padStart(2, '0')} — Active Registry: {filteredSuppliers.length} Items</p>
            <div className="d-flex align-items-center gap-4">
               {/* Pagination structure mirrored from other admin pages */}
               <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} className="size-10 rounded-2xl border border-stone-100 bg-white d-flex align-items-center justify-content-center text-stone-200 hover:text-dark hover:border-dark transition duration-500 disabled:opacity-30">
                 <span className="material-symbols-outlined fs-5">chevron_left</span>
               </button>
               <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} className="size-10 rounded-2xl border border-stone-100 bg-white d-flex align-items-center justify-content-center text-stone-600 hover:text-dark hover:border-dark transition duration-500 disabled:opacity-30">
                 <span className="material-symbols-outlined fs-5">chevron_right</span>
               </button>
            </div>
          </div>
        )}
      </div>

      {/* Deploy/Register Supplier Modal */}
      {isDeployModalOpen && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark/50 backdrop-blur-sm z-[100] d-flex align-items-center justify-content-center p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-[700px] w-100 max-h-[90vh] overflow-y-auto custom-scrollbar border border-stone-100">
            <div className="sticky-top bg-stone-50/90 backdrop-blur-md px-8 py-6 border-bottom border-stone-100 d-flex justify-content-between align-items-center z-10">
              <div className="d-flex align-items-center gap-3">
                 <span className="material-symbols-outlined text-dark fs-4">domain_add</span>
                 <h3 className="fs-5 fw-black font-serif text-dark mb-0 tracking-tight lowercase">Register.Supplier</h3>
              </div>
              <button onClick={() => setIsDeployModalOpen(false)} className="text-stone-600 hover:text-dark transition">
                <span className="material-symbols-outlined fs-5">close</span>
              </button>
            </div>
            
            <form onSubmit={handleDeploy} className="p-8 space-y-6">
              <div className="row g-4">
                <div className="col-12 col-md-6">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Supplier ID (Auto-gen if empty)</label>
                  <input name="supplier_id" className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" placeholder="e.g., SUP01" />
                </div>
                <div className="col-12 col-md-6">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Company/Vendor Name</label>
                  <input name="name" required className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" />
                </div>
                <div className="col-12 col-md-6">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Email Address</label>
                  <input name="email" type="email" className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" />
                </div>
                <div className="col-12 col-md-6">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Contact Numbers (Comma sep)</label>
                  <input name="contact_numbers" className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" />
                </div>
                
                <div className="col-12">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Materials Supplied (Comma sep)</label>
                  <input name="supplied_materials" placeholder="Leather, Sole, Laces" className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" />
                </div>
                
                <div className="col-12 col-md-6">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Rating / Quality Score (0-5)</label>
                  <input name="rating" type="number" step="0.1" min="0" max="5" defaultValue={4} className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" />
                </div>
                <div className="col-12 col-md-6">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Payment Terms</label>
                  <input name="payment_terms" defaultValue="30 Days" className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" />
                </div>

                <div className="col-12 col-md-6">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">City</label>
                  <input name="city" className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" />
                </div>
                <div className="col-12 col-md-6">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Area / Zone</label>
                  <input name="area" placeholder="Industrial Zone" className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" />
                </div>
                
                <div className="col-12 d-flex align-items-center gap-3">
                   <input type="checkbox" name="is_verified" defaultChecked className="size-5 accent-dark border-stone-200 rounded filter grayscale" />
                   <label className="text-sm fw-black text-dark">Supplier is Officially Verified & Vetted</label>
                </div>
              </div>
              <div className="pt-6 border-top border-stone-100 d-flex justify-content-end gap-3 mt-8">
                <button type="button" onClick={() => setIsDeployModalOpen(false)} className="px-6 py-2.5 rounded-xl border border-stone-200 text-[10px] fw-black text-uppercase tracking-widest text-stone-700 hover:bg-stone-50 transition">Discard</button>
                <button type="submit" className="px-6 py-2.5 rounded-xl bg-dark text-white text-[10px] fw-black text-uppercase tracking-widest hover:bg-stone-800 transition shadow-lg">Finalize Registration</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Supplier Modal */}
      {isEditModalOpen && editingSupplier && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark/50 backdrop-blur-sm z-[100] d-flex align-items-center justify-content-center p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-[700px] w-100 max-h-[90vh] overflow-y-auto custom-scrollbar border border-stone-100">
            <div className="sticky-top bg-stone-50/90 backdrop-blur-md px-8 py-6 border-bottom border-stone-100 d-flex justify-content-between align-items-center z-10">
              <div className="d-flex align-items-center gap-3">
                 <span className="material-symbols-outlined text-primary fs-4">edit_square</span>
                 <h3 className="fs-5 fw-black font-serif text-dark mb-0 tracking-tight lowercase">Update.Supplier</h3>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} className="text-stone-600 hover:text-dark transition">
                <span className="material-symbols-outlined fs-5">close</span>
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="p-8 space-y-6">
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100 mb-6 text-center">
                 <span className="text-[10px] text-stone-600 fw-black text-uppercase tracking-widest d-block bg-white p-2 border border-stone-200 rounded align-self-center mx-auto max-w-[150px] shadow-sm">{editingSupplier.supplier_id}</span>
              </div>
            
              <div className="row g-4">
                <div className="col-12 col-md-6">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Company/Vendor Name</label>
                  <input name="name" required defaultValue={editingSupplier.name} className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" />
                </div>
                <div className="col-12 col-md-6">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Email Address</label>
                  <input name="email" type="email" defaultValue={editingSupplier.email} className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" />
                </div>
                <div className="col-12 col-md-6">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Contact Numbers (Comma sep)</label>
                  <input name="contact_numbers" defaultValue={editingSupplier.contact_numbers?.join(', ')} className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" />
                </div>
                <div className="col-12">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Materials Supplied (Comma sep)</label>
                  <input name="supplied_materials" defaultValue={editingSupplier.supplied_materials?.join(', ')} className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" />
                </div>
                
                <div className="col-12 col-md-6">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Rating / Quality Score (0-5)</label>
                  <input name="rating" type="number" step="0.1" min="0" max="5" defaultValue={editingSupplier.rating} className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" />
                </div>
                <div className="col-12 col-md-6">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Payment Terms</label>
                  <input name="payment_terms" defaultValue={editingSupplier.payment_terms} className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" />
                </div>

                <div className="col-12 col-md-6">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">City</label>
                  <input name="city" defaultValue={editingSupplier.address?.city} className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" />
                </div>
                <div className="col-12 col-md-6">
                  <label className="text-[10px] fw-black text-uppercase tracking-[0.2em] text-stone-700 mb-2 d-block">Area / Zone</label>
                  <input name="area" defaultValue={editingSupplier.address?.area} className="w-100 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm fw-medium text-dark focus:border-dark outline-none transition" />
                </div>

                <div className="col-12 d-flex align-items-center gap-3">
                   <input type="checkbox" name="is_verified" defaultChecked={editingSupplier.is_verified} className="size-5 accent-primary border-stone-200 rounded" />
                   <label className="text-sm fw-black text-dark">Supplier is Officially Verified & Vetted</label>
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
    </div>
  );
};

export default AdminSuppliers;
