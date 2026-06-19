import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getSubtotal } = useContext(CartContext);
  const [videoAdded] = useState(false);

  const subtotal = getSubtotal();
  const videoCost = videoAdded ? 50 : 0;
  // Let's assume an 8% tax
  const tax = (subtotal + videoCost) * 0.08;
  const total = subtotal + videoCost + tax;

  return (
    <div className="min-vh-100 bg-white font-display text-dark animate-in fade-in duration-700">
      {/* Immersive Header Section */}
      <section className="bg-dark text-white py-20 px-4 md:px-10 position-relative overflow-hidden mb-12">
        <div className="position-absolute top-[-20%] right-[-10%] size-96 bg-primary rounded-full blur-[120px] opacity-20"></div>
        <div className="max-w-7xl mx-auto position-relative z-1 text-center">
          <div className="d-flex align-items-center justify-content-center gap-3 text-primary text-xs fw-black text-uppercase tracking-[0.3em] mb-4">
            <span className="material-symbols-outlined fs-5">shopping_bag</span>
            Atelier Cart
          </div>
          <h1 className="display-4 fw-black font-serif tracking-tight mb-4">Complete Your Collection</h1>
          <p className="fs-4 text-white/60 mb-0 font-display">Handcrafting excellence for your curated selection.</p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 md:px-10 pb-20">
          <div className="row g-5">
            {/* Cart Items List */}
            <div className="col-12 col-lg-8 space-y-6">
              {cartItems.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border-gray-100">
                  <span className="material-symbols-outlined fs-1 text-secondary opacity-20 mb-3">production_quantity_limits</span>
                  <h3 className="fs-4 fw-bold font-serif mb-2">Your collection is empty</h3>
                  <p className="text-secondary opacity-60 mb-4">Explore our heritage collections and curate your custom selection.</p>
                  <Link to="/catalog" className="btn btn-primary px-5 py-3 rounded-pill fw-bold uppercase tracking-widest text-xs">Return to Catalog</Link>
                </div>
              ) : (
                cartItems.map((item, idx) => (
                  <div key={idx} className="glass-panel p-6 rounded-2xl border-gray-100 d-flex flex-column flex-md-row gap-6 shadow-premium transition group hover:shadow-2xl">
                    <div 
                      className="rounded-lg shrink-0 shadow-sm" 
                      style={{ 
                        backgroundImage: `url('${item.product.imageUrl || item.product.img || "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800"}')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        width: '160px',
                        height: '160px'
                      }}
                    ></div>
                    <div className="flex-grow-1 d-flex flex-column justify-content-between">
                      <div className="d-flex justify-content-between align-items-start gap-4">
                        <div>
                          <h3 className="fs-4 fw-black font-serif text-dark mb-1 group-hover:text-primary transition">{item.product.name}</h3>
                          <p className="text-xs text-secondary opacity-60 uppercase tracking-widest fw-bold">
                          {item.product.details?.material ? `Leather: ${item.product.details?.material}` : 'Premium Edition'} | Size: {item.size}
                          </p>
                        </div>
                        <p className="text-dark font-serif fs-3 fw-black">PKR {item.product.price}</p>
                      </div>
                      <div className="d-flex align-items-center justify-content-between mt-4">
                        <div className="d-flex align-items-center gap-4 bg-gray-50 rounded-pill px-4 py-2 border border-gray-100">
                          <button 
                            onClick={() => updateQuantity(item.product._id, item.size, item.quantity - 1)}
                            className="text-secondary hover:text-primary transition-colors border-0 bg-transparent flex items-center p-0"
                          >
                            <span className="material-symbols-outlined fs-6">remove</span>
                          </button>
                          <span className="fs-6 fw-black w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.product._id, item.size, item.quantity + 1)}
                            className="text-secondary hover:text-primary transition-colors border-0 bg-transparent flex items-center p-0"
                          >
                            <span className="material-symbols-outlined fs-6">add</span>
                          </button>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.product._id, item.size)}
                          className="text-secondary hover:text-red-500 transition-all border-0 bg-transparent d-flex align-items-center gap-2 text-xs fw-black text-uppercase tracking-widest"
                        >
                          <span className="material-symbols-outlined fs-5">delete</span>
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}

            </div>

            {/* Order Summary Sidebar */}
            <div className="col-12 col-lg-4">
              <div className="d-flex flex-column gap-6 sticky-top top-32">
                <div className="glass-panel p-8 rounded-2xl border-gray-100 shadow-premium">
                  <h3 className="fs-4 fw-black font-serif tracking-tight mb-6 border-bottom border-gray-50 pb-4">Order Summary</h3>
                  <div className="d-flex flex-column gap-4 mb-6">
                    <div className="d-flex justify-content-between text-secondary">
                      <span className="text-xs fw-bold tracking-widest uppercase">Subtotal</span>
                      <span className="fw-black text-dark">PKR {subtotal.toLocaleString()}</span>
                    </div>
                    {videoAdded && (
                      <div className="d-flex justify-content-between text-secondary">
                        <span className="text-xs fw-bold tracking-widest uppercase">Video Package</span>
                        <span className="fw-black text-dark">PKR {videoCost}</span>
                      </div>
                    )}
                    <div className="d-flex justify-content-between text-secondary">
                      <span className="text-xs fw-bold tracking-widest uppercase">Shipping</span>
                      <span className="text-primary fw-black text-xs tracking-widest uppercase">Complimentary</span>
                    </div>
                    <div className="d-flex justify-content-between text-secondary">
                      <span className="text-xs fw-bold tracking-widest uppercase">Estimated Tax (8%)</span>
                      <span className="fw-black text-dark">PKR {tax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between border-top border-gray-100 pt-6 mb-8">
                    <span className="fs-5 fw-black text-dark font-serif">Total</span>
                    <span className="fs-3 fw-black text-primary tracking-tight">PKR {total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <Link 
                    to={cartItems.length > 0 ? "/checkout" : "#"} 
                    className={`w-100 ${cartItems.length > 0 ? 'bg-primary hover:bg-dark hover:-translate-y-1' : 'bg-gray-300 pointer-events-none'} text-white py-4 rounded-pill fw-black text-xs uppercase tracking-widest shadow-lg d-flex align-items-center justify-content-center gap-2 text-center decoration-none transition-all`}
                  >
                    Proceed to Checkout
                    <span className="material-symbols-outlined fs-5">arrow_forward</span>
                  </Link>
                  <p className="text-center text-[10px] text-uppercase tracking-widest text-secondary opacity-40 mt-6 fw-black">
                    Handcrafted with devotion in Italy
                  </p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 d-flex flex-column gap-3 shadow-sm">
                  <div className="d-flex align-items-start gap-4">
                    <span className="material-symbols-outlined text-dark opacity-60 fs-3">verified_user</span>
                    <div>
                      <p className="fw-black text-dark text-xs text-uppercase tracking-widest mb-1">Lifetime Guarantee</p>
                      <p className="text-xs text-secondary opacity-60 mb-0 font-medium">Our master artisans ensure every stitch is perfect, guaranteed for life.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </main>
    </div>
  );
};

export default Cart;
