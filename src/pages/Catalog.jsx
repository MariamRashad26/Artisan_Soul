import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Catalog = () => {
  const [activeCategory, setActiveCategory] = useState('Shoe Type');
  const [activeTag, setActiveTag] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const itemsPerPage = 6;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      
      const formattedData = data.map(p => ({
        id: p.product_id || p._id,
        name: p.name,
        detail: p.description,
        price: "Rs. " + p.price,
        priceValue: p.price,
        leather: p.details?.material || "Standard",
        color: p.details?.color || "Standard",
        type: p.category || "Formal", 
        img: p.imageUrl || 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop',
        label: p.inStock && p.is_available !== false ? null : "Out of Stock"
      }));
      
      setProducts(formattedData);
    } catch (err) {
      console.error('Fetch products error:', err);
    }
  };

  const categories = [
    { name: 'Shoe Type', icon: 'steps' },
    { name: 'Leather Type', icon: 'texture' },
    { name: 'Colorway', icon: 'palette' },
    { name: 'Price Range', icon: 'sell' }
  ];

  const tagsByCategory = {
    'Shoe Type': ['All', ...new Set(products.map(p => p.type).filter(Boolean))],
    'Leather Type': ['All', ...new Set(products.map(p => p.leather).filter(Boolean))],
    'Colorway': ['All', ...new Set(products.map(p => p.color).filter(Boolean))],
    'Price Range': ['All', 'Under 30,000', '30,000 - 45,000', 'Over 45,000']
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
  const currentProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="row flex-grow-1 px-4 px-md-5 py-5 g-5 bg-background-light m-0 w-100">
      {/* Sidebar Filters */}
      <aside className="col-12 col-md-3 col-xl-2 d-flex flex-column gap-5">
        <div>
          <h1 className="text-primary text-xs fw-bold text-uppercase tracking-widest mb-4">Collections</h1>
          <nav className="d-flex flex-column gap-2">
            {categories.map((cat) => (
              <button 
                key={cat.name}
                onClick={() => handleCategoryChange(cat.name)}
                className={`d-flex align-items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-decoration-none border-0 text-start w-100 ${
                  activeCategory === cat.name 
                    ? 'bg-primary text-white shadow-lg shadow-primary-20 hover-elevate' 
                    : 'bg-transparent text-secondary hover:bg-primary-10 hover:text-primary'
                }`}
              >
                <span className="material-symbols-outlined fs-5">{cat.icon}</span>
                <span className="small fw-bold">{cat.name}</span>
              </button>
            ))}
          </nav>
        </div>
        
        <div className="border-top border-primary-10 pt-4">
          <h3 className="text-dark small fw-bold mb-3">Quick Select</h3>
          <div className="d-flex flex-wrap gap-2">
            {currentTags.map(tag => (
              <button 
                key={tag} 
                onClick={() => handleTagChange(tag)}
                className={`px-3 py-1 border rounded-pill text-xs font-medium transition-all ${
                  activeTag === tag
                    ? 'bg-primary border-primary text-white shadow-sm'
                    : 'bg-white border-primary-10 text-dark hover:border-primary hover:text-primary'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Content Area */}
      <div className="col-12 col-md-9 col-xl-10 d-flex flex-column gap-5">
        <div className="d-flex flex-column gap-2">
          <h2 className="text-dark display-4 fw-black tracking-tight font-serif">Luxury Footwear</h2>
          <p className="text-muted fs-5">Meticulously handcrafted using the world's finest full-grain leathers.</p>
        </div>

        {/* Products Grid */}
        <div className="row g-4">
          {currentProducts.map(product => (
            <div className="col-12 col-sm-6 col-lg-4" key={product.id}>
              <Link to={`/product/${product.id}`} className="text-decoration-none group d-block">
                <div className="d-flex flex-column gap-3 p-3 bg-white rounded-xl shadow-premium hover-elevate transition-all border border-light">
                  <div className="position-relative w-100 rounded-lg overflow-hidden aspect-ratio-4-5 bg-background-light">
                    <img 
                      src={product.img} 
                      alt={product.name} 
                      className="w-100 h-100 object-fit-cover transition-transform duration-500 group-hover-scale"
                    />
                    <div className="position-absolute top-0 bottom-0 start-0 end-0 bg-dark bg-opacity-10 opacity-0 group-hover:opacity-100 transition-all"></div>
                    {product.label && (
                      <div className="position-absolute top-3 start-3 bg-white/90 px-3 py-1 rounded-pill text-xs fw-bold uppercase tracking-widest text-primary shadow-sm">
                        {product.label}
                      </div>
                    )}
                    <div className="position-absolute bottom-3 end-3 d-flex gap-2 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                      <button className="btn btn-light btn-sm rounded-circle d-flex align-items-center justify-content-center p-2 shadow">
                        <span className="material-symbols-outlined fs-6">visibility</span>
                      </button>
                      <button className="btn btn-primary btn-sm rounded-circle d-flex align-items-center justify-content-center p-2 shadow">
                        <span className="material-symbols-outlined fs-6 text-white">add_shopping_cart</span>
                      </button>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between align-items-start px-1">
                    <div>
                      <h3 className="fs-6 fw-bold text-dark mb-0 group-hover:text-primary transition-all">{product.name}</h3>
                      <p className="text-muted small mb-0">{product.detail}</p>
                    </div>
                    <span className="text-primary fw-bold">{product.price}</span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-center align-items-center gap-2 pt-5">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`size-10 d-flex align-items-center justify-content-center rounded-xl border ${currentPage === 1 ? 'border-gray-100 text-gray-300' : 'border-primary-10 text-muted hover:text-primary hover:border-primary'} transition-all bg-white shadow-sm`}
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button 
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`size-10 d-flex align-items-center justify-content-center rounded-xl font-medium shadow-sm border ${
                  currentPage === idx + 1 
                    ? 'bg-primary text-white border-primary fw-bold' 
                    : 'border-primary-10 text-dark hover:text-primary hover:border-primary bg-white'
                } transition-all`}
              >
                {idx + 1}
              </button>
            ))}

            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`size-10 d-flex align-items-center justify-content-center rounded-xl border ${currentPage === totalPages ? 'border-gray-100 text-gray-300' : 'border-primary-10 text-muted hover:text-primary hover:border-primary'} transition-all bg-white shadow-sm`}
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalog;
