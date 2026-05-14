import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import { CartContext } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const [selectedSize, setSelectedSize] = useState('42');
  const [activeImage, setActiveImage] = useState(0);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);
        const data = await response.json();
        setProduct(data);
        if (data.sizes_available && data.sizes_available.length > 0) {
          setSelectedSize(data.sizes_available[0]);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const fallbackImages = [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDsyJ9JXkYB_-jLdyzdGf_ih22wNmsaxPj1DKdleCpTJQJ7SIY6EoBwHEobWRwkV4OyPTHBCgaoEobJEMv840BoBgAXVZ-0JW02pBXEsj99tlpKWsVdm_OuKPxs463PKCB6piRW8JVpcTg_pPgF1PrjIlcqzmiEKzTZ8Ygi9BCsnmDJRzgLkqKyTCgsLaA0wU6IYfngvr8pQTNpJJUlbAsUDFQE80RG1IiKwwFpU-irJojOoqGeb4x1c1iRUHCQsTfiywfWTTbQAf_R",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDgbEQgorqY_0ie07SINjITah-Ep5A9I7whzlSAPKeCNTgKzDbUO0NWNSRGhOqtD7ZPt-MEjt50YHKc6eZsxm0O2jyv_VeMP1Z66G1WwJYZ8HtNuCnZMcIkuyS4SJgBBM9R2JmkT4UQ1_NDmhPac1nC5nj8IDL_l1Lg46y1Aqgd-t5XGxwM3e_3er5kQKUUYAVQeAEaE2Dxph8Tfh7wGmtE_GNpnpd_DX9OGZnZw--a2Px8rH_eH7p1IFHbtUdeUpjctQEJBeZ67C4M",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCfnDmCdpn3GGdj16Y-isl8y-CTpiVIHNmCBYucQgAwjacdNW61hMLR8vWs3kcsOwH5qS0neqCeMb4fR8UlhNkuVbnC6AggkjwgGJ-3e3R2xfGEACa_ItLC6v2F1i4qsiws6wJiOejMm4YdPO3mm5d91eDGeki1fxkqmDHGVbka_bLRnYhtw596veAs4yLbIPuwNot8CdD8WqBeoRI1_gIm_NBXpjkGwt-2c2e77U2qzeOZTqys24_RttSgNEMnbJ--tFq5r4-BNblE",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDcTl3gE96CGd8aQeNFv2Qp-o9a6zqbIt3px_DV5Kfx_4OP0BYRZ-m8KYD2QAgKKxalWLzmRzIZwjTcPiWtqKwH9-NeeD9VOPgmlN68bf2zaTyRz1E_Zhf7hSnLVoITuqLNI8vHNtNqiXCDTkfkiM3yGvVTqqzFrW-BMEgODYpsLWn6Jy_KEXp7kF3jvuBCR9FHqKUaB4M-d9iXkUSb6TlbjJjhrhwIPbquGcsppaG6WdRv41tDbxfHfgUzvkjPjt5dczYBWgMayNPw"
  ];

  if (loading) {
    return (
      <div className="flex-grow-1 bg-white d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex-grow-1 bg-white d-flex justify-content-center align-items-center flex-column gap-3" style={{ minHeight: '60vh' }}>
        <h2>Product not found</h2>
        <Button to="/catalog" variant="primary">Back to Catalog</Button>
      </div>
    );
  }

  const images = product.imageUrl ? [product.imageUrl, product.imageUrl, product.imageUrl, product.imageUrl] : fallbackImages;

  return (
    <div className="flex-grow-1 bg-white animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto w-100 px-4 md:px-10 py-10 lg:py-20">
        <div className="row g-5 lg:g-24">
          {/* Product Gallery (Left) */}
          <div className="col-12 col-lg-7 d-flex flex-column gap-4">
            <div className="aspect-ratio-4-5 w-100 rounded-xl overflow-hidden bg-gray-50 shadow-premium">
              <div 
                className="w-100 h-100 bg-cover bg-center transition-transform hover:scale-105 duration-1000" 
                style={{ backgroundImage: `url("${images[activeImage]}")` }}
              ></div>
            </div>
            <div className="row row-cols-4 g-3">
              {images.map((img, idx) => (
                <div key={idx} className="col">
                  <div 
                    onClick={() => setActiveImage(idx)}
                    className={`aspect-square rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${activeImage === idx ? 'ring-2 ring-primary ring-offset-2' : 'opacity-60 hover:opacity-100'}`}
                  >
                    <div className="w-100 h-100 bg-cover bg-center" style={{ backgroundImage: `url("${img}")` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Product Info (Right) */}
          <div className="col-12 col-lg-5 d-flex flex-column gap-6">
            <div>
              <span className="text-secondary opacity-60 fw-bold tracking-widest text-uppercase d-block mb-3" style={{ fontSize: '0.75rem' }}>{product.category || 'Heritage Collection'}</span>
              <h1 className="display-5 fw-black text-dark tracking-tight font-serif mb-4">{product.name || 'The Sovereign Wingtip'}</h1>
              <div className="d-flex align-items-baseline gap-3">
                <span className="fs-3 fw-bold text-primary tracking-tight">Rs. {product.price}</span>
                {product.discount && (
                  <span className="text-secondary opacity-40 text-decoration-line-through">Rs. {product.price + product.discount}</span>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <p className="fs-5 text-secondary lh-lg opacity-80">
                {product.description || 'A masterpiece of traditional shoemaking. Hand-stitched using premium Full-Grain Box Calf leather, featuring our signature hand-burnished finish that develops a unique patina over time.'}
              </p>
              <div className="d-flex flex-column gap-3">
                <div className="d-flex align-items-center gap-3 py-2 px-3 bg-gray-50 rounded-lg w-fit border border-gray-100">
                  <span className="material-symbols-outlined text-primary fs-5">verified</span>
                  <span className="fs-6 fw-medium text-dark opacity-80">Individually numbered for authenticity</span>
                </div>
                <div className="d-flex align-items-center gap-3 py-2 px-3 bg-gray-50 rounded-lg w-fit border border-gray-100">
                  <span className="material-symbols-outlined text-primary fs-5">history_edu</span>
                  <span className="fs-6 fw-medium text-dark opacity-80">Includes Artisan Signature Certificate</span>
                </div>
              </div>
            </div>

            {/* Selectors */}
            <div className="pt-6 border-top border-gray-100">
              <div className="mb-6">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h3 className="fs-6 fw-bold text-uppercase tracking-wider">Select Size</h3>
                  <button onClick={() => alert("Size Guide Modal Opened")} className="btn btn-link p-0 text-primary text-decoration-none fw-bold text-xs opacity-80 border-0 bg-transparent">SIZE GUIDE</button>
                </div>
                <div className="d-flex flex-wrap gap-2">
                  {(product.sizes_available?.length > 0 ? product.sizes_available : ['40', '41', '42', '43', '44', '45']).map(size => (
                    <button 
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`size-12 d-flex align-items-center justify-content-center rounded-lg border fw-bold transition-all ${selectedSize === size ? 'bg-primary border-primary text-white shadow-lg scale-105' : 'bg-white border-gray-200 text-dark opacity-40 hover:opacity-100 hover:border-primary'}`}
                      style={{ width: '56px', height: '56px' }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="row g-3">
                <div className="col-6">
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 h-100">
                    <span className="text-xs fw-black text-primary text-uppercase tracking-widest d-block mb-1">Leather</span>
                    <span className="fs-6 fw-bold text-dark opacity-80">{product.details?.material || 'Italian Box Calf'}</span>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 h-100">
                    <span className="text-xs fw-black text-primary text-uppercase tracking-widest d-block mb-1">Color</span>
                    <span className="fs-6 fw-bold text-dark opacity-80">{product.details?.color || 'Classic'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="d-flex flex-column gap-3 pt-4">
              <button 
                onClick={() => {
                  addToCart(product, selectedSize);
                  navigate('/cart');
                }}
                className="btn btn-primary w-100 py-4 fs-5 fw-bold d-flex align-items-center justify-content-center gap-2 rounded-pill shadow-lg"
              >
                <span className="material-symbols-outlined fs-5">shopping_cart</span>
                Secure Your Pair
              </button>
              <Button to={`/custom-designer?baseModel=${encodeURIComponent(product.name)}&basePrice=${product.price}&image=${encodeURIComponent(images[0])}&id=${product._id || product.product_id}`} variant="outline" className="w-100 py-4 fs-5 fw-bold justify-content-center rounded-pill border-2 border-primary-20 text-dark hover:border-primary transition-all">
                <span className="material-symbols-outlined fs-5">edit_note</span>
                Bespoke Personalization
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="pt-8 row g-4 border-top border-gray-100">
              <div className="col-12 col-sm-6 d-flex gap-3">
                <div className="text-primary size-10 bg-primary-10 rounded-full d-flex align-items-center justify-content-center flex-shrink-0">
                  <span className="material-symbols-outlined fs-5">local_shipping</span>
                </div>
                <div>
                  <h4 className="fs-6 fw-bold mb-1">Free Global Shipping</h4>
                  <p className="text-xs text-secondary opacity-60 mb-0">Insured express delivery.</p>
                </div>
              </div>
              <div className="col-12 col-sm-6 d-flex gap-3">
                <div className="text-primary size-10 bg-primary-10 rounded-full d-flex align-items-center justify-content-center flex-shrink-0">
                  <span className="material-symbols-outlined fs-5">workspace_premium</span>
                </div>
                <div>
                  <h4 className="fs-6 fw-bold mb-1">Lifetime Care</h4>
                  <p className="text-xs text-secondary opacity-60 mb-0">Resoling & repair service.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Story Section */}
        <section className="mt-32">
          <div className="text-center mb-16">
            <h2 className="display-5 fw-black font-serif mb-4">The Artisan Difference</h2>
            <div className="h-1 bg-primary mx-auto opacity-20" style={{ width: '80px' }}></div>
          </div>
          <div className="row g-4 lg:g-5">
            {[
              {
                title: "Curated Materials",
                text: "Hand-selected from top Tuscany tanneries, ensuring every hide meets our rigorous standards for texture and durability.",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDOJQCMOJy3paPeP5JoIE4hCfyCA8bENAB-d37hXCmtccnsTh9c9UKIZ0uxgVKAHYULiAPRuPOtLb_yCkXWUZ9ntW0b0zxF43JnZmUGg-oMLajJyxteUmJZIrFCGYUMp9SBk5T3IoKq-Cn7n0LMZBhT8ZNP7WgC5XsBetwmyDPNtN3SII-_uFf0cqdeDh0_aDm8XY-qY_n6r5DmTQhQk1vuLNTArCiK4Gr90zF2I5-enBdg3vu8R-AiFzcPrTPiYAtci4GNpHlkLcIG"
              },
              {
                title: "Traditional Lasting",
                text: "Using generational techniques, each shoe is lasted for weeks to ensure a perfect shape that adapts to your foot over time.",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBmJ2EG38BnfTg7ZIez01-C3D4ZcaF6UvpuSuuhhsj9qtth--Bg_mRRB7M8rXDgYcUFd_ly-YtCpUy78H6hGxHLRVh_3O8q6JCLUIey4xxcgrF5FBwQmvNMqDBuocdxoTvYWxTRBsvLmXeFpZ2RRmTOxQlf9y-9eCgCDlN5k3zDmKw2_t_PnZzbymkNWwYZ09Afopmf0igI2LOU_fMzkDoK7Cxa1zMpdcjKP5rlFBt4dm5KKPmToCp5ALh8Fk5bOyXuf_EBLIZ5VtYe"
              },
              {
                title: "Hand Finishing",
                text: "The final touch is applied by master finishers who use secrets passed down through centuries to achieve our signature glow.",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBl5sLAtw5enFlqQsbZbvETy8T6fp3L3uR7tK6urpS6JP3lBTq7-jSUr4TBVdXd9Ns6Kq7GKK017uft-2rDX_8Cyy1zQ3gz9AtAUwOYuloIXM8nUXElozc1OlKSu5oR1ik3CJx_jQSAvJsJYVOVf7mxuxBbLj2d76GeEiLhxyFd4vp-389LQzOZmgVVQpPduchxRKEZNpQp1TRs0KUXcV8jnA9P7DaBIFjW_qvmpPk55tw7foLNkytXPQSlZy1Ea98Isf7z_93LYuVI"
              }
            ].map((story, i) => (
              <div key={i} className="col-md-4 group">
                <div className="aspect-ratio-4-5 rounded-xl overflow-hidden mb-6 shadow-premium">
                  <div className="w-100 h-100 bg-cover bg-center group-hover-scale duration-1000" style={{ backgroundImage: `url("${story.img}")` }}></div>
                </div>
                <h3 className="fs-4 fw-bold mb-3 font-serif">{story.title}</h3>
                <p className="text-secondary opacity-70 lh-lg mb-0">{story.text}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProductDetail;
