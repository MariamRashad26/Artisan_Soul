import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

const Catalog = () => {
  const [activeCategory, setActiveCategory] = useState('Shoe Type');
  const [activeTag, setActiveTag] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const itemsPerPage = 6;

  useEffect(() => {
    fetchProducts();
  }, []);

  // ✅ FIX: fetch() ki jagah axiosInstance use karo - VITE_API_URL automatically lagega
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await axiosInstance.get('/api/products');

      const formattedData = data.map(p => ({
        id: p.product_id || p._id,
        name: p.name,
        detail: p.description,
        price: 'PKR ' + p.price,
        priceValue: p.price,
        leather: p.details?.material || 'Standard',
        color: p.details?.color || 'Standard',
        type: p.category || 'Formal',
        img: p.imageUrl || 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop',
        label: p.inStock && p.is_available !== false ? null : 'Out of Stock',
      }));

      setProducts(formattedData);
    } catch (err) {
      console.error('Fetch products error:', err);
      setError('Could not load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { name: 'Shoe Type', icon: 'steps' },
    { name: 'Leather Type', icon: 'texture' },
    { name: 'Colorway', icon: 'palette' },
    { name: 'Price Range', icon: 'sell' },
  ];

  const tagsByCategory = {
    'Shoe Type': ['All', ...new Set(products.map(p => p.type).filter(Boolean))],
    'Leather Type': ['All', ...new Set(products.map(p => p.leather).filter(Boolean))],
    'Colorway': ['All', ...new Set(products.map(p => p.color).filter(Boolean))],
    'Price Range': ['All', 'Under 30,000', '30,000 - 45,000', 'Over 45,000'],
  };

  const currentTags = tagsByCategory[activeCategory] || tagsByCategory['Shoe Type'];

  const filteredProducts = products.filter(product => {
    if (activeTag === 'All') return true;
    if (activeCategory === 'Shoe Type') return product.type === activeTag;
    if (activeCategory === 'Leather Type') return product.leather === activeTag;
    if (activeCategory === 'Colorway') return product.color === activeTag;
    if (activeCategory === 'Price Range') {
      if (activeTag === 'Under 30,000') return product.priceValue < 30000;
      if (activeTag === '30,000 - 45,000') return product.priceValue >= 30000 && product.priceValue <= 45000;
      if (activeTag === 'Over 45,000') return product.priceValue > 45000;
    }
    return true;
  });

  const handleCategoryChange = (catName) => {
    setActiveCategory(catName);
    setActiveTag('All');
    setCurrentPage(1);
  };

  const handleTagChange = (tag) => {
    setActiveTag(tag);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status"></div>
          <p className="text-muted">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <span className="material-symbols-outlined fs-1 text-danger mb-3 d-block">error</span>
          <p className="text-danger fw-bold">{error}</p>
          <button onClick={fetchProducts} className="btn btn-primary mt-2">Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-background-light font-display">
      {/* Header */}
      <div className="bg-white border-bottom px-4 py-5 text-center">
        <h1 className="display-5 fw-black tracking-tight">Our Collection</h1>
        <p className="text-muted">Handcrafted excellence, curated for you</p>
      </div>

      <div className="container-xl py-6">
        {/* Category Filters */}
        <div className="d-flex gap-3 mb-4 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat.name}
              onClick={() => handleCategoryChange(cat.name)}
              className={`btn btn-sm d-flex align-items-center gap-2 px-4 py-2 rounded-pill fw-bold ${
                activeCategory === cat.name ? 'btn-primary' : 'btn-outline-secondary'
              }`}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>

        {/* Tag Filters */}
        <div className="d-flex gap-2 mb-5 flex-wrap">
          {currentTags.map(tag => (
            <button
              key={tag}
              onClick={() => handleTagChange(tag)}
              className={`btn btn-sm px-3 py-1 rounded-pill text-xs fw-bold ${
                activeTag === tag ? 'btn-dark' : 'btn-outline-secondary opacity-60'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {paginatedProducts.length === 0 ? (
          <div className="text-center py-20">
            <span className="material-symbols-outlined fs-1 text-muted mb-3 d-block">inventory_2</span>
            <p className="fw-bold text-muted">No products found in this category.</p>
          </div>
        ) : (
          <div className="row g-4">
            {paginatedProducts.map(product => (
              <div key={product.id} className="col-12 col-sm-6 col-lg-4">
                <Link to={`/product/${product.id}`} className="text-decoration-none">
                  <div className="card border-0 shadow-sm h-100 rounded-3 overflow-hidden hover-shadow transition">
                    <div className="position-relative overflow-hidden" style={{ height: 260 }}>
                      <img
                        src={product.img}
                        alt={product.name}
                        className="w-100 h-100 object-cover"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop';
                        }}
                      />
                      {product.label && (
                        <span className="badge bg-danger position-absolute top-0 end-0 m-2">{product.label}</span>
                      )}
                    </div>
                    <div className="card-body p-4">
                      <h5 className="fw-black text-dark mb-1">{product.name}</h5>
                      <p className="text-muted small mb-2">{product.detail}</p>
                      <p className="fw-bold text-primary mb-0">{product.price}</p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-center gap-2 mt-6">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`btn btn-sm px-3 ${currentPage === page ? 'btn-primary' : 'btn-outline-secondary'}`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalog;
