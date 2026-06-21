import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import axiosInstance from '../utils/axiosInstance';

const Home = () => {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get('/api/products');
        const data = response.data;
        const formatted = data.map(p => ({
          id: p.product_id || p._id,
          title: p.name,
          desc: p.description || 'Premium Quality',
          img: p.imageUrl || 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800'
        })).slice(0, 3);
        setCollections(formatted);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, []);
  return (
    <>
      {/* Hero Section */}
      <section className="max-w-[1280px] mx-auto px-3 px-md-5 px-lg-5 py-5 py-lg-5">
        <div className="@container">
          <div className="d-flex flex-column-reverse flex-lg-row gap-5 align-items-center">
            <div className="d-flex flex-column gap-4 flex-grow-1">
              <div className="d-flex flex-column gap-3">
                <span className="text-primary fw-bold tracking-widest text-uppercase fs-6 text-muted">Masterfully Created</span>
                <h1 className="text-dark  display-4 lg:text-7xl fw-bolder lh-sm tracking-tight">
                  Handcrafted Leather Shoes Made Just for You
                </h1>
                <p className="text-secondary  fs-5 lg:text-xl max-w-xl">
                  Experience the pinnacle of traditional cordwaining with our bespoke and ready-to-wear collections. Built to last a lifetime.
                </p>
              </div>
              <div className="d-flex flex-wrap gap-3">
                <Button to="/login" variant="primary" className="px-4 py-3 fs-6">
                  Login to Continue
                </Button>
                <Button to="/signup" variant="secondary" className="px-4 py-3 fs-6">
                  Sign Up
                </Button>
              </div>
            </div>
            <div className="flex-grow-1 w-100">
              <div className="position-relative aspect-square rounded-3xl overflow-hidden shadow-2xl">
                <div className="position-absolute top-0 bottom-0 start-0 end-0 bg-primary/10 mix-blend-multiply"></div>
                <div
                  className="w-100 h-100 bg-center bg-cover"
                  style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCpoPIbOuQ28VBrd7dAJ7HTxvaVOk3miGDbN6ZzF3EbBl2g0WJ7rRWjf2zJdWVAZkYvjcLKMF-PYPo6Q4pTkOKLCLqEFB44m2gKiGgl2HHD3H02C4X0cHApnHdiduhxygrGheruVXJG81cfacmsF9Rx6orb7YQEs3xlM-QHrjWkUlJ_WvdELumcgC8cZ2gsCa80Ct6JKRy9Ty-Nj4OyXeMGQaDf9QPXfcAKwU6hMHa3LIQFfsfqMqYfQofWpj9xgSzRfIDR2_m2kACz')" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features: The Art of Craft */}
      <section className="bg-light py-5" id="craft">
        <div className="max-w-[1280px] mx-auto px-3 px-md-5 px-lg-5">
          <div className="row row-cols-1 row-cols-lg-2 g-5 align-items-center">
            <div className="row row-cols-2 g-3">
              <div
                className="col aspect-[4/5] rounded-5 bg-cover bg-center mt-4"
                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAvTLPGwXLkl62Nwra-E_jLw349wltm2dbuMpfyDx8M7JBVMD6MoGsjryzwJkQCOTQhfD6A3UL9IPsSDLgyeZXhF9tq4cjS5fa5xumH2SWO8qUZs7Ye3f4ACB6qdBZSVN6hge27Jzza1n-ER30fKKHtnNrsGvNgY2A-nUJgSSrQWRhwA6FT5gHfDYIFENxsxZ70bm4b2wDNP-KS-q30xKGDni_KmjEisvp2A-ZwZpnJiyLlkkEnZJsB2K0UNxytCi3bnHgRtyBiPcfi')" }}
              ></div>
              <div
                className="col aspect-[4/5] rounded-5 bg-cover bg-center"
                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDMQrygNbljGWC5Cxnmtqbp0Euek7VK_eXZrWaF1Ln94tkPdMQ87ocz538q1wS9ryYvTPCX8nYL-hXRIsdSloGhwGTfxDE4uxTuw-UGoIJKeRt7Wl1xDIA9ZgmyHNZx5FkhRa7Oh6H50SYuRFBF8XGo2po0e_uADAmPIL7kx7Sb891SykF0fL2_qqZthJNTc6B2LLeqr6DaPMYqeEO8JO_Rxg0lVUNJJA_ISj7fT5xyFwxN47rH2L8EfmDG9-iug9wkT4rZMgqPK-fZ')" }}
              ></div>
            </div>
            <div className="d-flex flex-column gap-4 col">
              <h2 className="fs-1 display-lg-4 fw-bold tracking-tight">The Art of Craft</h2>
              <p className="text-secondary  fs-5">
                Every pair is a masterpiece of precision and passion, using only the finest full-grain leathers sourced from the oldest tanneries in Tuscany.
              </p>
              <ul className="space-y-6">
                <li className="d-flex gap-3">
                  <div className="h-12 w-12 rounded-circle bg-primary/10 d-flex align-items-center justify-content-center shrink-0">
                    <span className="material-symbols-outlined text-primary">draw</span>
                  </div>
                  <div>
                    <h4 className="fw-bold fs-5">Hand-Stitching</h4>
                    <p className="text-secondary ">Traditional Goodyear welting ensures durability and easy resoling for decades of use.</p>
                  </div>
                </li>
                <li className="d-flex gap-3">
                  <div className="h-12 w-12 rounded-circle bg-primary/10 d-flex align-items-center justify-content-center shrink-0">
                    <span className="material-symbols-outlined text-primary">workspace_premium</span>
                  </div>
                  <div>
                    <h4 className="fw-bold fs-5">Premium Materials</h4>
                    <p className="text-secondary ">Only the top 5% of hides are selected for our footwear, ensuring a perfect patina over time.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Curated Collections */}
      <section className="py-5 max-w-[1280px] mx-auto px-3 px-md-5 px-lg-5" id="collections">
        <div className="d-flex justify-content-between align-items-end mb-5">
          <div className="d-flex flex-column gap-2">
            <h2 className="fs-1 fw-bold tracking-tight">Curated Collections</h2>
            <p className="text-secondary ">The perfect fit for every occasion.</p>
          </div>
          <Link to="/catalog" className="text-primary fw-bold d-flex align-items-center gap-2 hover:underline">
            View All <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </div>
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {collections.map((item) => (
            <Link to={`/product/${item.id}`} key={item.id} className="group cursor-pointer d-block">
              <div
                className="aspect-[3/4] rounded-5 bg-cover bg-center overflow-hidden mb-3 position-relative transition-transform duration-500 group-hover:-translate-y-2 shadow-sm group-hover:shadow-xl group-hover:shadow-primary/10"
                style={{ backgroundImage: `url('${item.img}')` }}
              >
                <div className="position-absolute top-0 bottom-0 start-0 end-0 bg-black/20 group-hover:bg-black/0 transition duration-300"></div>
              </div>
              <h3 className="fs-4 fw-bold group-hover:text-primary transition">{item.title}</h3>
              <p className="text-secondary ">{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* The Journey: Manufacturing Process */}
      <section className="bg-primary/5 py-5 overflow-hidden" id="process">
        <div className="max-w-[1280px] mx-auto px-3 px-md-5 px-lg-5">
          <div className="text-center mb-16">
            <h2 className="fs-1 fw-bold tracking-tight mb-3">The Journey of a Shoe</h2>
            <p className="text-secondary  max-w-2xl mx-auto">From the initial selection of raw hides to the final polish, our 9-stage manufacturing process is a testament to quality.</p>
          </div>
          <div className="overflow-x-auto pb-2">
            <div className="d-flex flex-nowrap flex-lg-wrap justify-content-lg-center gap-4 py-2">
            {['Selection', 'Cutting', 'Skiving', 'Stitching', 'Lasting', 'Welting', 'Bottoming', 'Finishing', 'Polish'].map((step, index) => (
              <div key={step} className="d-flex flex-column align-items-center text-center gap-3 flex-shrink-0">
                <div className={`h-16 w-16 rounded-circle shadow-sm d-flex align-items-center justify-content-center fw-bold transition duration-300 hover:scale-110 ${index === 8 ? 'bg-primary text-white shadow-lg' : 'bg-white  text-primary border border-light-subtle border-primary/20 hover:bg-primary/10'}`}>
                  {String(index + 1).padStart(2, '0')}
                </div>
                <span className="fs-6 text-muted fw-bold text-uppercase tracking-tighter">{step}</span>
              </div>
            ))}
            </div>
          </div>
          <Link to="/craftsmanship" className="d-block mt-16 aspect-video w-100 max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-2xl position-relative group">
            <div
              className="w-100 h-100 bg-center bg-cover transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB8rEYt92CaTy6smIzLhUbvnqP433d-Ub4NUBabQbBhzLNEyXbhaEYf7OnPCZfG1xhBQcSfwbekbCsk0ge2kSJxSl44jz7Ss-2oR9jEx5V4w1pUATD4qeMIiSE6XfWV5UnroeJTJq2iN_PpsOD4y3aE_N15tAaJWjLe7hxzmj8END8R-6rUYSppn_ZQOkBvrhn3q5JSK_-nRQzvluzob1ltam3uKMkiLKhi6nzbujyTXfxxHaZ9oBT1gLkqu3DFM56xSpVwiwVEf08Q')" }}
            ></div>
            <div className="position-absolute top-0 bottom-0 start-0 end-0 bg-gradient-to-t from-background-dark/80 to-transparent d-flex align-items-end p-4 p-lg-5">
              <div className="text-white d-flex align-items-center justify-content-between w-100">
                <div>
                  <h3 className="fs-3 fw-bold mb-1">Heritage in Every Thread</h3>
                  <p className="opacity-80 max-w-lg">Our master cordwainers spend over 40 hours on every single pair, ensuring perfection in every detail.</p>
                </div>
                <div className="d-none d-md-flex h-14 w-14 rounded-circle bg-primary/80 backdrop-blur-sm align-items-center justify-content-center group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined fs-2">play_arrow</span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-5 max-w-[1280px] mx-auto px-3 px-md-5 px-lg-5" id="reviews">
        <div className="d-flex flex-column gap-5">
          <div className="text-center">
            <h2 className="fs-1 fw-bold mb-3 italic font-serif">Kind Words from the Connoisseurs</h2>
          </div>
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {[
              {
                text: "The best investment I've made in years. The bespoke fitting is like wearing a second skin. Truly unmatched quality.",
                name: "James Wilson",
                role: "Architect",
                translateY: ""
              },
              {
                text: "I appreciate the transparency of their process. Knowing exactly how these boots were made adds so much value to them.",
                name: "Sarah Lindholm",
                role: "Designer",
                translateY: "lg:translate-y-4"
              },
              {
                text: "Classical aesthetics meet modern comfort. I wear my Artisans to everything from board meetings to weddings.",
                name: "Michael Kraus",
                role: "Executive",
                translateY: ""
              }
            ].map((review, i) => (
              <div key={i} className={`p-4 rounded-5 bg-white  border border-light-subtle border-primary/5 shadow-sm hover:shadow-lg hover:border-primary/20 transition ${review.translateY}`}>
                <div className="d-flex text-primary mb-3">
                  {[...Array(5)].map((_, j) => (
                    <span key={j} className="material-symbols-outlined fill-1">star</span>
                  ))}
                </div>
                <p className="text-secondary  italic mb-4">"{review.text}"</p>
                <div className="d-flex align-items-center gap-3">
                  <div className="h-10 w-10 rounded-circle bg-light d-flex align-items-center justify-content-center fw-bold text-secondary">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <h5 className="fw-bold fs-6">{review.name}</h5>
                    <p className="text-secondary fs-6 text-muted">{review.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
