import React, { useState, useContext } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from '../utils/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const CustomDesigner = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addToCart } = useContext(CartContext);
  const { user } = useAuth();
  
  const paramBaseModel = searchParams.get('baseModel') || 'Heritage Sovereign';
  const paramBasePrice = parseInt(searchParams.get('basePrice')) || 850;
  const paramImage = searchParams.get('image') || "https://lh3.googleusercontent.com/aida-public/AB6AXuAOGKc254-rwbfp-_dbrqr32s6HEZexzzJ118k1CiPTwI-XoVZiAe6MtTdihL6hfeR3-5Ug4-pwTlEgLxpLhw-LQOL9JvBOZObPh7RyPp-0TkklPcCWMVkPIN1_V_qfaQ80PR1ESd5II0s1Za80ZGH2hJLwm_21mwuld3U-BDnu1EHWU-1V73CIY32gveELeAugBrWvoyc0lOXE4X2jOHyOFut_oFZfPTqcZ-9vA786Vyym3rCg3sTpe21zBkinyCeIlA8cNlKBLq2V";
  const paramId = searchParams.get('id') || 'bespoke-' + Math.floor(Math.random()*1000);

  const [activeTab, setActiveTab] = useState('Build');
  const [zoom, setZoom] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [viewAngle, setViewAngle] = useState('Side');
  
  // Customization States
  const archImages = {
    'Oxford': 'https://lh3.googleusercontent.com/aida-public/AB6AXuAor3v1l122gvXhjMHptOcRzb2ZwGC8I-a6fgaCucEvzXAp15dQrMHB7rObRw5jfASEexVOqSgQ7KTUrPO6mRJcRVWw0OEnL1RW2kq3AYfgi5wIqa-8d1WGCxi81Zl9BuiaVWCn1sZWKO70mT87e4VrQTzlGtmssAj-OgfhhZUSTZB5OgWQE_7nGXvH7nVbaX5gASa0yGpUZrA0tapYq6vhnPUvCdB4XybThvDjmo7Gl1xlu1DFMrZx58vxTS1NKHMkM7w8LoOpf9eL',
    'Derby': 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9uFSljacViCYL0GBjvNToSYhNZo9bWWWZkYFqEtZWnGPp6Uyq_ZJUlOdeJsOSExRUXlCtKn4N3VzZnC30uKu7l_Qcw6bebBUuQRM1raGVG_u7fwjNytc0IHwdWpugvtS1lHCzp3rrNF0ZZpKcZebFrFI8_IDmVOBmEP4nRmA0tYA9om_th7CM2FxYWEn8ueDVliiuffTSUq1StJ6J5E4_8CCH_GuDykMxcpYxIa6t5lBJVa2tHQJthfz24gwg0koLMGrSsWDepfy4',
    'Monk': 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWTiuweE10ZNe7rQhogaUBskaxv5EwMZ6DWw9jFF3o5jKY9rh-_K9me8XSfjSSrzDqcTFHWdj5EhNUs6QHLqlHAiKZI0QDqw8WwCLeruyOTqAuobt-IpiqtPiLH1jT-V1xOz6EnwpNPlov9PDlTU-ZQGx276Yoincm22M5uNzgC2cCPPHuADfjOe42dYPVlSB7lA9Q_mA_ED3ersYhVPcL1yw014dQAfT0LJkD4IUXHBjHLhCQHaTRQ_oE2OetruTOyAiTofWj8BTB',
    'Chelsea': 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOGKc254-rwbfp-_dbrqr32s6HEZexzzJ118k1CiPTwI-XoVZiAe6MtTdihL6hfeR3-5Ug4-pwTlEgLxpLhw-LQOL9JvBOZObPh7RyPp-0TkklPcCWMVkPIN1_V_qfaQ80PR1ESd5II0s1Za80ZGH2hJLwm_21mwuld3U-BDnu1EHWU-1V73CIY32gveELeAugBrWvoyc0lOXE4X2jOHyOFut_oFZfPTqcZ-9vA786Vyym3rCg3sTpe21zBkinyCeIlA8cNlKBLq2V'
  };

  const [baseArch, setBaseArch] = useState('Oxford');
  const [currentImage, setCurrentImage] = useState(paramImage);
  const [leather, setLeather] = useState({ name: 'Vachetta Calfskin', price: 0 });
  const [lining, setLining] = useState('#D2B48C');
  const [sole, setSole] = useState({ name: 'Double Leather Welt', price: 0 });
  const [hardware, setHardware] = useState('Antique Brass');
  const [monogram, setMonogram] = useState('');
  
  // Total Calculation
  const basePrice = paramBasePrice;
  const totalPrice = basePrice + leather.price + sole.price + (monogram ? 25 : 0);

  const handleAddToCollection = () => {
    const bespokeProduct = {
      _id: paramId + '-bespoke-' + Math.floor(Math.random() * 1000),
      name: `Bespoke ${paramBaseModel} - ${baseArch}`,
      price: totalPrice,
      imageUrl: currentImage,
      details: {
        material: leather.name,
        color: lining,
        hardware: hardware,
        sole: sole.name,
        monogram: monogram || 'None'
      }
    };
    addToCart(bespokeProduct, 'Custom Fit');
    navigate('/cart');
  };

  const handleSaveToLibrary = async () => {
    if (!user) {
      alert('Please log in to save your design to the library.');
      return navigate('/login');
    }
    try {
      const designPayload = {
        user: user._id,
        name: `Bespoke ${paramBaseModel} - ${baseArch}`,
        price: totalPrice,
        material: leather.name,
        status: 'Draft',
        category: 'Drafts',
        img: currentImage,
        details: {
          color: lining,
          hardware: hardware,
          sole: sole.name,
          monogram: monogram || 'None'
        }
      };
      await axios.post('/api/bespoke-designs', designPayload);
      alert('Design successfully saved to your library!');
      navigate('/user/designs');
    } catch (err) {
      console.error(err);
      alert('Failed to save design.');
    }
  };

  return (
    <div className="min-vh-100 bg-white font-display text-dark animate-in fade-in duration-700 position-relative overflow-hidden">
      {/* Cinematic Top Navigation */}
      <header className="d-flex align-items-center justify-content-between px-6 py-4 bg-white/80 backdrop-blur-xl sticky-top top-0 z-50 border-bottom border-gray-100">
        <Link to="/" className="d-flex align-items-center gap-3 text-decoration-none">
          <div className="size-10 bg-dark rounded-xl d-flex align-items-center justify-content-center text-white shadow-premium">
            <span className="material-symbols-outlined fs-5">auto_awesome</span>
          </div>
          <div>
            <h2 className="fs-5 fw-black font-serif tracking-tight mb-0 text-dark">Artisan Soul</h2>
            <p className="text-[10px] fw-black text-primary text-uppercase tracking-[0.2em] mb-0">Bespoke Atelier</p>
          </div>
        </Link>

        <div className="d-none d-md-flex px-1 py-1 bg-gray-50 rounded-pill border border-gray-100">
          {['Build', 'Materials', 'Sole', 'Details'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-pill font-display text-xs fw-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white shadow-sm text-dark' : 'text-secondary opacity-40 hover:opacity-100'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="d-flex align-items-center gap-4">
          <div className="d-flex flex-column text-end d-none d-sm-block">
            <p className="text-[10px] fw-black text-secondary opacity-40 text-uppercase tracking-widest mb-0">Current Estimate</p>
            <p className="fs-6 fw-black text-dark font-serif mb-0">PKR {totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </div>
          <button onClick={() => navigate('/cart')} className="size-12 rounded-full bg-dark text-white d-flex align-items-center justify-content-center shadow-premium hover:scale-105 transition">
            <span className="material-symbols-outlined fs-5">shopping_cart</span>
          </button>
        </div>
      </header>

      <main className="d-flex h-[calc(100vh-84px)] overflow-hidden">
        <aside className="w-[400px] bg-white border-end border-gray-100 overflow-y-auto no-scrollbar pt-8 px-8 pb-32">
          <div className="mb-12">
            <h1 className="fs-2 fw-black font-serif tracking-tight mb-2">{paramBaseModel}</h1>
            <p className="text-secondary opacity-60 font-display fs-6">Crafted with precision in our Sialkot atelier.</p>
          </div>

          <div className="space-y-12">
            
            {activeTab === 'Build' && (
              <section className="animate-in fade-in slide-in-from-right-4 duration-500">
                <h3 className="text-xs fw-black text-primary text-uppercase tracking-[0.2em] mb-6">Base Architecture</h3>
                <div className="row g-3">
                  {['Oxford', 'Derby', 'Monk', 'Chelsea'].map((type, i) => (
                    <div key={i} className="col-6">
                      <button 
                        onClick={() => { setBaseArch(type); setCurrentImage(archImages[type] || paramImage); }}
                        className={`w-100 p-4 rounded-2xl border transition-all ${baseArch === type ? 'bg-primary-5 border-primary shadow-premium' : 'bg-white border-gray-100 opacity-40 hover:opacity-100 text-secondary'}`}
                      >
                        <span className="material-symbols-outlined fs-3 mb-3 d-block">architecture</span>
                        <span className="text-xs fw-black text-uppercase tracking-widest">{type}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeTab === 'Materials' && (
              <section className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-10">
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-6">
                    <h3 className="text-xs fw-black text-primary text-uppercase tracking-[0.2em] mb-0">Leather Finish</h3>
                    <span className="text-[10px] text-secondary opacity-40 fw-black uppercase">Grade A++</span>
                  </div>
                  <div className="space-y-4">
                    {[
                      { name: 'Vachetta Calfskin', priceLabel: 'Included', price: 0, color: '#4A3728' },
                      { name: 'French Pebble Grain', priceLabel: '+PKR 80', price: 80, color: '#1A1A1A' },
                      { name: 'Horween Shell Cordovan', priceLabel: '+PKR 320', price: 320, color: '#3D0C02' }
                    ].map((item, i) => (
                      <button 
                         key={i} 
                         onClick={() => setLeather({ name: item.name, price: item.price })}
                         className={`w-100 p-4 rounded-2xl border d-flex align-items-center gap-4 transition-all ${leather.name === item.name ? 'bg-white border-gray-200 shadow-premium' : 'bg-gray-50/50 border-transparent opacity-40 hover:opacity-100'}`}
                      >
                        <div className="size-10 rounded-full shadow-inner border border-white" style={{ background: item.color }}></div>
                        <div className="text-start">
                          <p className="text-xs fw-black text-dark text-uppercase tracking-widest mb-0">{item.name}</p>
                          <p className="text-[10px] text-primary fw-bold mb-0">{item.priceLabel}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Accent Details */}
                <div>
                  <h3 className="text-xs fw-black text-primary text-uppercase tracking-[0.2em] mb-6">Lining & Finishes</h3>
                  <div className="d-flex gap-4">
                    {['#D2B48C', '#E5E5E5', '#2C3E50'].map((color, i) => (
                      <button 
                        key={i} 
                        onClick={() => setLining(color)}
                        className={`size-12 rounded-full shadow-premium border-2 transition-all ${lining === color ? 'border-primary ring-4 ring-primary/10 scale-110' : 'border-white hover:scale-105 opacity-40 hover:opacity-100'}`} 
                        style={{ backgroundColor: color }}
                      ></button>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {activeTab === 'Sole' && (
              <section className="animate-in fade-in slide-in-from-right-4 duration-500">
                <h3 className="text-xs fw-black text-primary text-uppercase tracking-[0.2em] mb-6">Sole Anatomy</h3>
                <div className="space-y-4">
                  {[
                    { name: 'Double Leather Welt', detail: 'Traditional elegance', priceLabel: 'Included', price: 0 },
                    { name: 'Vibram Commando', detail: 'All-weather traction', priceLabel: '+PKR 45', price: 45 },
                    { name: 'Crepe Rubber', detail: 'Casual comfort', priceLabel: '+PKR 35', price: 35 }
                  ].map((item, i) => (
                    <button 
                      key={i} 
                      onClick={() => setSole({ name: item.name, price: item.price })}
                      className={`w-100 p-4 rounded-2xl border d-flex justify-content-between align-items-center transition-all ${sole.name === item.name ? 'bg-primary-5 border-primary shadow-sm' : 'bg-white border-gray-100 opacity-60 hover:opacity-100 text-secondary'}`}
                    >
                       <div className="text-start">
                         <p className="text-xs fw-black text-dark text-uppercase tracking-widest mb-1">{item.name}</p>
                         <p className="text-[10px] text-secondary opacity-60 fw-bold mb-0">{item.detail}</p>
                       </div>
                       <p className="text-[10px] text-primary fw-bold mb-0">{item.priceLabel}</p>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {activeTab === 'Details' && (
              <section className="animate-in fade-in slide-in-from-right-4 duration-500">
                <h3 className="text-xs fw-black text-primary text-uppercase tracking-[0.2em] mb-6">Personal Touches</h3>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 mb-6">
                  <label className="text-[10px] text-secondary opacity-60 fw-black text-uppercase tracking-widest mb-2 d-block">Monogram Embossing (+PKR 25)</label>
                  <input type="text" maxLength="3" value={monogram} onChange={(e) => setMonogram(e.target.value)} placeholder="J.A" className="w-100 bg-white border border-gray-200 rounded-xl p-3 fw-black text-dark text-center tracking-[0.3em] uppercase focus:border-primary focus:outline-none transition" />
                </div>
                
                <h3 className="text-xs fw-black text-primary text-uppercase tracking-[0.2em] mb-6 mt-8">Hardware Finish</h3>
                <div className="row g-3">
                  {['Antique Brass', 'Gunmetal', 'Polished Silver'].map((hw, i) => (
                    <div key={i} className="col-12">
                      <button 
                        onClick={() => setHardware(hw)}
                        className={`w-100 p-3 rounded-2xl border transition-all text-xs fw-black uppercase tracking-widest ${hardware === hw ? 'bg-dark text-white border-dark shadow-lg' : 'bg-white text-secondary opacity-60 hover:opacity-100 border-gray-100'}`}
                      >
                        {hw}
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </aside>

        {/* Center: Cinematic Canvas */}
        <section className="flex-grow-1 bg-gray-50 position-relative d-flex align-items-center justify-content-center overflow-hidden">
          <div className="position-absolute top-0 start-0 w-100 h-100 bg-white opacity-50" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(200, 160, 110, 0.1) 0%, transparent 70%)' }}></div>
          
          <div className="position-absolute bottom-12 start-1/2 translate-middle-x z-10 glass-panel p-2 rounded-full border-gray-100 shadow-2xl d-flex gap-2">
            {['Side', 'Top', 'Heel', 'Sole'].map((view, i) => (
              <button 
                key={i} 
                onClick={() => setViewAngle(view)}
                className={`px-6 py-2 rounded-pill font-display text-[10px] fw-black uppercase tracking-widest transition-all ${viewAngle === view ? 'bg-dark text-white shadow-lg' : 'text-secondary hover:bg-gray-100'}`}
              >
                {view} View
              </button>
            ))}
          </div>

          <div className="position-absolute top-12 left-12 z-10 space-y-4 d-flex flex-column gap-3">
            <button 
               onClick={() => { setIsSpinning(true); setTimeout(() => setIsSpinning(false), 1500); }}
               className="size-12 bg-white rounded-full d-flex align-items-center justify-content-center shadow-premium hover:text-primary transition border-0">
              <span className={`material-symbols-outlined fs-5 ${isSpinning ? 'text-primary' : ''}`}>3d_rotation</span>
            </button>
            <button 
               onClick={() => setZoom(!zoom)}
               className={`size-12 rounded-full d-flex align-items-center justify-content-center shadow-premium transition border-0 ${zoom ? 'bg-primary text-white' : 'bg-white hover:text-primary'}`}>
              <span className="material-symbols-outlined fs-5">{zoom ? 'zoom_out' : 'zoom_in'}</span>
            </button>
          </div>

          {/* Immersive Product Mock */}
          <div className="position-relative w-100 max-w-4xl px-20">
            <div className="position-absolute top-1/2 left-1/2 translate-middle size-[500px] bg-primary rounded-full blur-[160px] opacity-10"></div>
            <img 
              src={currentImage} 
              className={`w-100 h-[500px] lg:h-[600px] object-contain drop-shadow-[0_50px_80px_rgba(0,0,0,0.3)] ${isSpinning ? '' : 'animate-float'}`}
              alt="Bespoke Shoe Preview"
              style={{ 
                transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: `
                  ${zoom ? 'scale(1.4)' : 'scale(1)'}
                  ${viewAngle === 'Heel' ? 'scaleX(-1)' : ''}
                  ${viewAngle === 'Top' ? 'rotateX(40deg) scaleY(0.9) translateY(50px)' : ''}
                  ${viewAngle === 'Sole' ? 'rotateX(-40deg) scaleY(0.9) translateY(-50px)' : ''}
                  ${isSpinning ? 'rotateY(360deg)' : ''}
                `
              }}
            />
          </div>
        </section>

        {/* Right: Summary & Order */}
        <aside className="w-[360px] bg-white border-start border-gray-100 p-10 d-flex flex-column justify-content-between overflow-y-auto no-scrollbar">
          <div className="space-y-12">
            <div>
              <h2 className="fs-5 fw-black font-serif mb-6 tracking-tight">Technical Review</h2>
              <div className="space-y-4">
                {[
                  { label: 'Base Wood', value: `Heritage ${baseArch}` },
                  { label: 'Primary Skin', value: leather.name },
                  { label: 'Hardware', value: hardware },
                  { label: 'Sole Unit', value: sole.name }
                ].map((spec, i) => (
                  <div key={i} className="d-flex justify-content-between align-items-center pb-3 border-bottom border-gray-50">
                    <span className="text-xs fw-medium text-secondary opacity-40 uppercase tracking-widest">{spec.label}</span>
                    <span className="text-xs fw-black text-dark uppercase tracking-widest">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8 rounded-2xl bg-dark text-white shadow-2xl position-relative overflow-hidden group">
              <div className="position-absolute top-[-20%] right-[-10%] size-32 bg-primary rounded-full blur-[60px] opacity-20"></div>
              <p className="text-[10px] fw-black text-primary text-uppercase tracking-[0.2em] mb-2">Total Commission</p>
              <div className="display-4 fw-black font-serif mb-0">${totalPrice.toFixed(2)}</div>
              <p className="text-[10px] text-white/40 fw-medium mt-2">Includes archival lasts & bespoke fit-check.</p>
            </div>
          </div>

          <div className="space-y-4 mt-12">
            <button onClick={handleAddToCollection} className="w-100 py-4 bg-primary text-white rounded-pill fw-black text-xs uppercase tracking-widest shadow-lg hover:scale-[1.02] transition">Add to Collection</button>
            <button onClick={handleSaveToLibrary} className="w-100 py-4 bg-gray-50 text-dark border border-gray-200 rounded-pill fw-black text-xs uppercase tracking-widest hover:bg-dark hover:text-white transition">Save to Library</button>
            <p className="text-[10px] text-center text-secondary opacity-40 font-display px-6">Every Artisan Soul piece is meticulously handcrafted by master cordwainers with over 20 years of experience.</p>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default CustomDesigner;
