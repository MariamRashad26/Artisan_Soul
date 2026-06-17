import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import Button from '../components/ui/Button';
import { CartContext } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Checkout = () => {
  const { cartItems, getSubtotal, clearCart } = useContext(CartContext);
  const { user } = useAuth();
  const [step, setStep] = useState(1); // 1: Shipping, 2: Review
  const navigate = useNavigate();

  const [shippingData, setShippingData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    zip: '',
    country: ''
  });

  const [formError, setFormError] = useState('');

  const handleInputChange = (e) => {
    setShippingData({ ...shippingData, [e.target.name]: e.target.value });
  };

  const handleContinueToReview = () => {
    if (!shippingData.firstName || !shippingData.lastName || !shippingData.address || !shippingData.city || !shippingData.zip || !shippingData.country) {
      setFormError('Please properly complete all shipping details before continuing.');
      return;
    }
    setFormError('');
    setStep(2);
  };

  const handleCheckout = async () => {
    try {
      if (cartItems.length === 0) {
        setFormError('Your cart is empty.');
        return;
      }

      const modelNames = cartItems.map(item => item.product.name).join(', ');
      const img = cartItems[0]?.product?.imageUrl || cartItems[0]?.product?.img || "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800";
      const formattedAddress = `${shippingData.firstName} ${shippingData.lastName}, ${shippingData.address}, ${shippingData.city}, ${shippingData.zip}, ${shippingData.country}`;

      const orderPayload = {
        patron: `${shippingData.firstName} ${shippingData.lastName}`,
        model: modelNames,
        phase: 'Design Prep',
        status: 'normal',
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        progress: 0,
        img: img,
        user: user ? user._id : null,
        price: getSubtotal() * 1.08,
        shippingAddress: formattedAddress,
        paymentMethod: 'Cash on Delivery',
        paymentStatus: 'Pending'
      };
      
      const { data } = await axiosInstance.post('/api/orders', orderPayload);
      clearCart();
      navigate(`/track-order/${encodeURIComponent(data.orderId.replace('#', ''))}`);
    } catch (error) {
      console.error("Order failed", error);
      setFormError('Failed to place order. Please try again.');
    }
  };

  return (
    <div className="min-vh-100 bg-background-light font-display text-dark animate-in fade-in duration-700">
      {/* Top Navigation Bar */}
      <header className="d-flex align-items-center justify-content-between border-bottom border-white/10 px-4 px-md-10 py-4 bg-dark text-white sticky-top top-0 z-50">
        <Link to="/" className="d-flex align-items-center gap-3 hover:opacity-80 transition-opacity decoration-none text-white group">
          <div className="text-white bg-primary p-2 rounded-lg shadow-premium group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined fs-4">auto_fix_high</span>
          </div>
          <h2 className="text-white fs-4 fw-black tracking-tight mb-0 font-serif">Artisan Soul</h2>
        </Link>
        
        {/* Progress Tracker */}
        <div className="d-none d-md-flex align-items-center gap-4">
          {[
            { id: 1, label: 'Shipping' },
            { id: 2, label: 'Review' }
          ].map((s, i) => (
            <React.Fragment key={s.id}>
              <div className={`d-flex align-items-center gap-2 ${step >= s.id ? 'text-primary' : 'text-white/40'}`}>
                <span className={`size-8 d-flex align-items-center justify-content-center rounded-full fw-bold text-xs ${step >= s.id ? 'bg-primary text-white shadow-lg' : 'bg-white/10 text-white/50'}`}>
                  {step > s.id ? <span className="material-symbols-outlined fs-6">check</span> : s.id}
                </span>
                <span className={`fs-6 fw-black text-uppercase tracking-widest ${step >= s.id ? 'text-white' : 'text-white/40'}`} style={{ fontSize: '0.7rem' }}>{s.label}</span>
              </div>
              {i < 1 && <div className={`h-px w-8 ${step > s.id ? 'bg-primary' : 'bg-white/20'}`}></div>}
            </React.Fragment>
          ))}
        </div>

        <div className="d-flex align-items-center gap-3">
          <Link to="/cart" className="text-white/60 hover:text-white transition decoration-none d-flex align-items-center gap-2">
            <span className="material-symbols-outlined fs-5">shopping_bag</span>
            <span className="d-none d-sm-inline fw-bold text-xs tracking-widest uppercase">Return to Cart</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl w-100 px-4 py-8 lg:py-16">
        <div className="row g-5">
          {/* Left Column: Multi-step Form */}
          <div className="col-lg-8 animate-in slide-in-from-left duration-700">
            {step === 1 && (
              <section className="space-y-8">
                <div className="mb-10">
                  <h1 className="display-6 fw-black font-serif tracking-tight mb-3">Shipping Details</h1>
                  <p className="text-secondary opacity-60 fs-6">Where should we deliver your bespoke creation?</p>
                  {formError && (
                    <div className="mt-4 p-4 bg-danger text-white rounded-xl shadow-premium fw-bold fs-6 d-flex align-items-center gap-3">
                      <span className="material-symbols-outlined rounded-full bg-white/20 p-1">error</span>
                      {formError}
                    </div>
                  )}
                </div>
                
                <div className="row g-4">
                  <div className="col-md-6">
                    <label className="text-[10px] fw-black text-primary text-uppercase tracking-widest mb-2 d-block">First Name</label>
                    <input name="firstName" value={shippingData.firstName} onChange={handleInputChange} className="w-100 rounded-xl border border-gray-200 bg-white p-4 fs-6 outline-none focus:border-primary transition fw-medium" placeholder="Julian" type="text" />
                  </div>
                  <div className="col-md-6">
                    <label className="text-[10px] fw-black text-primary text-uppercase tracking-widest mb-2 d-block">Last Name</label>
                    <input name="lastName" value={shippingData.lastName} onChange={handleInputChange} className="w-100 rounded-xl border border-gray-200 bg-white p-4 fs-6 outline-none focus:border-primary transition fw-medium" placeholder="Arnaud" type="text" />
                  </div>
                  <div className="col-12">
                    <label className="text-[10px] fw-black text-primary text-uppercase tracking-widest mb-2 d-block">Street Address</label>
                    <input name="address" value={shippingData.address} onChange={handleInputChange} className="w-100 rounded-xl border border-gray-200 bg-white p-4 fs-6 outline-none focus:border-primary transition fw-medium" placeholder="123 Artisan Way, Suite 400" type="text" />
                  </div>
                  <div className="col-md-6">
                    <label className="text-[10px] fw-black text-primary text-uppercase tracking-widest mb-2 d-block">City</label>
                    <input name="city" value={shippingData.city} onChange={handleInputChange} className="w-100 rounded-xl border border-gray-200 bg-white p-4 fs-6 outline-none focus:border-primary transition fw-medium" placeholder="Florence" type="text" />
                  </div>
                  <div className="col-md-3">
                    <label className="text-[10px] fw-black text-primary text-uppercase tracking-widest mb-2 d-block">Postal Code</label>
                    <input name="zip" value={shippingData.zip} onChange={handleInputChange} className="w-100 rounded-xl border border-gray-200 bg-white p-4 fs-6 outline-none focus:border-primary transition fw-medium" placeholder="50123" type="text" />
                  </div>
                  <div className="col-md-3">
                    <label className="text-[10px] fw-black text-primary text-uppercase tracking-widest mb-2 d-block">Country</label>
                    <input name="country" value={shippingData.country} onChange={handleInputChange} className="w-100 rounded-xl border border-gray-200 bg-white p-4 fs-6 outline-none focus:border-primary transition fw-medium" placeholder="Italy" type="text" />
                  </div>
                </div>

                <div className="pt-10">
                  <button onClick={handleContinueToReview} className="w-100 md:w-auto px-10 py-4 bg-primary text-white fs-6 fw-black text-xs text-uppercase tracking-widest rounded-pill shadow-lg hover:shadow-xl hover:scale-105 transition-all d-flex align-items-center justify-content-center gap-2 border-0">
                    Review Order
                    <span className="material-symbols-outlined fs-5">arrow_forward</span>
                  </button>
                </div>
              </section>
            )}

            {step === 2 && (
              <section className="space-y-8 animate-in zoom-in duration-500">
                <div className="mb-10">
                  <h1 className="display-6 fw-black font-serif tracking-tight mb-3">Final Review</h1>
                  <p className="text-secondary opacity-60 fs-6">Please verify your order details and delivery address.</p>
                  {formError && (
                    <div className="mt-4 p-4 bg-danger text-white rounded-xl shadow-premium fw-bold fs-6 d-flex align-items-center gap-3">
                      <span className="material-symbols-outlined rounded-full bg-white/20 p-1">error</span>
                      {formError}
                    </div>
                  )}
                </div>

                <div className="row g-4 mb-10">
                  <div className="col-md-6">
                    <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 h-100">
                      <h4 className="fs-6 fw-black text-primary text-uppercase tracking-widest mb-4">Shipping To</h4>
                      <p className="fs-6 text-dark opacity-80 mb-1 fw-bold">{shippingData.firstName} {shippingData.lastName}</p>
                      <p className="fs-6 text-secondary opacity-60 mb-0">{shippingData.address}<br/>{shippingData.city}, {shippingData.zip}, {shippingData.country}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 h-100">
                      <h4 className="fs-6 fw-black text-primary text-uppercase tracking-widest mb-4">Payment Method</h4>
                      <div className="d-flex align-items-center gap-3">
                        <span className="material-symbols-outlined text-secondary fs-4">local_shipping</span>
                        <p className="fs-6 text-dark opacity-80 mb-0 fw-bold">Cash on Delivery (COD)</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-primary-5 rounded-xl border-primary-20">
                  <div className="d-flex align-items-center gap-4">
                    <span className="material-symbols-outlined text-primary fs-3">history_edu</span>
                    <div>
                      <h4 className="fs-6 fw-bold mb-1">Artisan Agreement</h4>
                      <p className="text-xs text-secondary opacity-70 mb-0">By confirming, you acknowledge that each bespoke piece is handcrafted specifically for you. Payment will be collected in cash upon delivery.</p>
                    </div>
                  </div>
                </div>

                <div className="pt-10 d-flex flex-column flex-md-row gap-4">
                  <button onClick={() => setStep(1)} className="px-10 py-4 bg-transparent text-dark border border-gray-200 hover:border-dark fs-6 fw-black text-xs text-uppercase tracking-widest rounded-pill transition-all d-flex align-items-center justify-content-center gap-2">
                    Back to Shipping
                  </button>
                  <button onClick={handleCheckout} className="px-10 py-4 bg-black text-white fs-6 fw-black text-xs text-uppercase tracking-widest rounded-pill shadow-premium hover:shadow-2xl hover:scale-105 transition-all d-flex align-items-center justify-content-center gap-2 border-0 text-decoration-none">
                    Confirm & Place Order
                    <span className="material-symbols-outlined fs-5 ms-2">shopping_bag</span>
                  </button>
                </div>
              </section>
            )}
          </div>

          {/* Right Column: Order Summary (Sticky Glass) */}
          <aside className="col-lg-4">
            <div className="sticky-top top-32 glass-panel p-6 rounded-xl shadow-premium animate-in slide-in-from-bottom duration-700">
              <h3 className="fs-4 fw-black font-serif tracking-tight mb-6">In Your Atelier</h3>
              
              <div className="space-y-6">
                {/* Items List */}
                <div className="space-y-4 pb-6 border-bottom border-gray-100">
                  {cartItems.map((item, idx) => (
                    <div key={idx} className="d-flex gap-4">
                      <div className="size-20 bg-gray-50 rounded-xl overflow-hidden shadow-premium border border-gray-100 flex-shrink-0">
                        <img className="h-100 w-100 object-cover" src={item.product.imageUrl || item.product.img || "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800"} alt="Product" />
                      </div>
                      <div className="py-1">
                        <h4 className="fs-6 fw-bold text-dark tracking-tight mb-1">{item.product.name}</h4>
                        <p className="text-xs text-secondary opacity-60 uppercase tracking-widest mb-2">Size {item.size} • {item.product.details?.material || 'Premium'}</p>
                        <span className="fs-6 fw-black text-primary">PKR {item.product.price} <span className="opacity-50 text-[10px]">x{item.quantity}</span></span>
                      </div>
                    </div>
                  ))}
                  {cartItems.length === 0 && (
                     <div className="text-secondary opacity-60 text-center py-4">Your cart is empty.</div>
                  )}
                </div>

                {/* Subtotals */}
                <div className="space-y-4 mt-6">
                  <div className="d-flex justify-content-between">
                    <span className="fs-6 text-secondary opacity-60">Subtotal</span>
                    <span className="fs-6 fw-bold text-dark">PKR {getSubtotal().toLocaleString()}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="fs-6 text-secondary opacity-60">Handcrafting Fee</span>
                    <span className="fs-6 fw-bold text-primary">COMPLIMENTARY</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="fs-6 text-secondary opacity-60">Estimated Tax (8%)</span>
                    <span className="fs-6 fw-bold text-dark">PKR {(getSubtotal() * 0.08).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="pt-6 border-top border-gray-100 d-flex justify-content-between align-items-baseline">
                    <span className="fs-5 fw-black text-dark font-serif">Estimated Total</span>
                    <span className="fs-3 fw-black text-primary tracking-tight">PKR {(getSubtotal() * 1.08).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-gray-50 rounded-lg text-center">
                <p className="text-xs text-secondary opacity-60 mb-0 font-medium tracking-wide">
                  Expected Workshop Delivery:<br/>
                  <span className="text-dark fw-bold uppercase">October 24 - 28</span>
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Modern Footer for Checkout */}
      <footer className="mt-20 py-12 px-10 bg-white border-top border-gray-100">
        <div className="max-w-7xl mx-auto d-flex flex-column flex-md-row justify-content-between align-items-center gap-6">
          <div className="d-flex gap-8">
            <div className="d-flex align-items-center gap-2 text-secondary opacity-40">
              <span className="material-symbols-outlined fs-4">verified</span>
              <span className="text-xs fw-bold tracking-widest uppercase">Certified Artisan</span>
            </div>
            <div className="d-flex align-items-center gap-2 text-secondary opacity-40">
              <span className="material-symbols-outlined fs-4">encrypted</span>
              <span className="text-xs fw-bold tracking-widest uppercase">Secure Payments</span>
            </div>
          </div>
          <p className="mb-0 text-xs text-secondary opacity-40 fw-medium tracking-widest uppercase">
            © 2024 Artisan Soul Footwear Studio
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Checkout;
