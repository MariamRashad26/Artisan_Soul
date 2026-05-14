import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Landing() {
  return (
    <div className="position-relative d-flex vh-100 w-100 flex-column overflow-x-hidden bg-background-light text-dark font-display">
      <Navbar />
      <main className="flex-grow-1">
        {/* Hero */}
        <section className="max-w-[1280px] mx-auto px-3 px-md-5 py-5 py-lg-5">
          <div className="d-flex flex-column gap-5 flex-row align-items-center">
            <div className="d-flex flex-column gap-4 flex-grow-1">
              <div className="d-flex flex-column gap-3">
                <span className="text-primary fw-bold tracking-widest text-uppercase fs-6 text-muted">Masterfully Created</span>
                <h1 className="text-dark display-4 lg:text-7xl fw-bolder lh-sm tracking-tight">
                  Handcrafted Leather Shoes Made Just for You
                </h1>
                <p className="text-secondary fs-5 lg:text-xl max-w-xl">
                  Experience the pinnacle of traditional cordwaining with our bespoke and ready-to-wear collections. Built to last a lifetime.
                </p>
              </div>
              <div className="d-flex flex-wrap gap-3">
                <Link to="/login">
                  <button className="bg-primary text-white px-4 py-3 rounded-4 fw-bold fs-6 hover:shadow-lg hover:shadow-primary/20 transition">
                    Login to Continue
                  </button>
                </Link>
                <Link to="/signup">
                  <button className="bg-light text-dark px-4 py-3 rounded-4 fw-bold fs-6 hover:bg-slate-300 transition">
                    Sign Up
                  </button>
                </Link>
              </div>
            </div>
            <div className="flex-grow-1 w-100">
              <div className="position-relative aspect-square rounded-3xl overflow-hidden shadow-2xl">
                <div className="position-absolute top-0 bottom-0 start-0 end-0 bg-primary/10 mix-blend-multiply"></div>
                <div className="w-100 h-100 bg-center bg-cover" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCpoPIbOuQ28VBrd7dAJ7HTxvaVOk3miGDbN6ZzF3EbBl2g0WJ7rRWjf2zJdWVAZkYvjcLKMF-PYPo6Q4pTkOKLCLqEFB44m2gKiGgl2HHD3H02C4X0cHApnHdiduhxygrGheruVXJG81cfacmsF9Rx6orb7YQEs3xlM-QHrjWkUlJ_WvdELumcgC8cZ2gsCa80Ct6JKRy9Ty-Nj4OyXeMGQaDf9QPXfcAKwU6hMHa3LIQFfsfqMqYfQofWpj9xgSzRfIDR2_m2kACz')" }}></div>
              </div>
            </div>
          </div>
        </section>

        {/* Art of Craft */}
        <section className="bg-light py-5" id="craft">
          <div className="max-w-[1280px] mx-auto px-3 px-md-5">
            <div className="row row-cols-lg-2 gap-16 align-items-center">
              <div className="row row-cols-2 gap-3">
                <div className="aspect-[4/5] rounded-5 bg-cover bg-center mt-4" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAvTLPGwXLkl62Nwra-E_jLw349wltm2dbuMpfyDx8M7JBVMD6MoGsjryzwJkQCOTQhfD6A3UL9IPsSDLgyeZXhF9tq4cjS5fa5xumH2SWO8qUZs7Ye3f4ACB6qdBZSVN6hge27Jzza1n-ER30fKKHtnNrsGvNgY2A-nUJgSSrQWRhwA6FT5gHfDYIFENxsxZ70bm4b2wDNP-KS-q30xKGDni_KmjEisvp2A-ZwZpnJiyLlkkEnZJsB2K0UNxytCi3bnHgRtyBiPcfi')" }}></div>
                <div className="aspect-[4/5] rounded-5 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDMQrygNbljGWC5Cxnmtqbp0Euek7VK_eXZrWaF1Ln94tkPdMQ87ocz538q1wS9ryYvTPCX8nYL-hXRIsdSloGhwGTfxDE4uxTuw-UGoIJKeRt7Wl1xDIA9ZgmyHNZx5FkhRa7Oh6H50SYuRFBF8XGo2po0e_uADAmPIL7kx7Sb891SykF0fL2_qqZthJNTc6B2LLeqr6DaPMYqeEO8JO_Rxg0lVUNJJA_ISj7fT5xyFwxN47rH2L8EfmDG9-iug9wkT4rZMgqPK-fZ')" }}></div>
              </div>
              <div className="d-flex flex-column gap-4">
                <h2 className="fs-1 display-lg-4 fw-bold tracking-tight">The Art of Craft</h2>
                <p className="text-secondary fs-5">Every pair is a masterpiece of precision and passion, using only the finest full-grain leathers sourced from the oldest tanneries in Tuscany.</p>
                <ul className="space-y-6">
                  <li className="d-flex gap-3">
                    <div className="size-12 rounded-circle bg-primary/10 d-flex align-items-center justify-content-center shrink-0">
                      <span className="material-symbols-outlined text-primary">draw</span>
                    </div>
                    <div>
                      <h4 className="fw-bold fs-5">Hand-Stitching</h4>
                      <p className="text-secondary">Traditional Goodyear welting ensures durability and easy resoling for decades of use.</p>
                    </div>
                  </li>
                  <li className="d-flex gap-3">
                    <div className="size-12 rounded-circle bg-primary/10 d-flex align-items-center justify-content-center shrink-0">
                      <span className="material-symbols-outlined text-primary">workspace_premium</span>
                    </div>
                    <div>
                      <h4 className="fw-bold fs-5">Premium Materials</h4>
                      <p className="text-secondary">Only the top 5% of hides are selected for our footwear, ensuring a perfect patina over time.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Collections */}
        <section className="py-5 max-w-[1280px] mx-auto px-3 px-md-5" id="collections">
          <div className="d-flex justify-content-between align-items-end mb-5">
            <div>
              <h2 className="fs-1 fw-bold tracking-tight">Curated Collections</h2>
              <p className="text-secondary">The perfect fit for every occasion.</p>
            </div>
            <Link to="/login" className="text-primary fw-bold d-flex align-items-center gap-2 hover:underline">
              View All <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 gap-4">
            {[
              { name: 'The Classic Oxford', sub: 'Timeless elegance', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAor3v1l122gvXhjMHptOcRzb2ZwGC8I-a6fgaCucEvzXAp15dQrMHB7rObRw5jfASEexVOqSgQ7KTUrPO6mRJcRVWw0OEnL1RW2kq3AYfgi5wIqa-8d1WGCxi81Zl9BuiaVWCn1sZWKO70mT87e4VrQTzlGtmssAj-OgfhhZUSTZB5OgWQE_7nGXvH7nVbaX5gASa0yGpUZrA0tapYq6vhnPUvCdB4XybThvDjmo7Gl1xlu1DFMrZx58vxTS1NKHMkM7w8LoOpf9eL' },
              { name: 'The Heritage Boot', sub: 'Rugged sophistication', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9uFSljacViCYL0GBjvNToSYhNZo9bWWWZkYFqEtZWnGPp6Uyq_ZJUlOdeJsOSExRUXlCtKn4N3VzZnC30uKu7l_Qcw6bebBUuQRM1raGVG_u7fwjNytc0IHwdWpugvtS1lHCzp3rrNF0ZZpKcZebFrFI8_IDmVOBmEP4nRmA0tYA9om_th7CM2FxYWEn8ueDVliiuffTSUq1StJ6J5E4_8CCH_GuDykMxcpYxIa6t5lBJVa2tHQJthfz24gwg0koLMGrSsWDepfy4' },
              { name: 'The Urban Loafer', sub: 'Contemporary comfort', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWTiuweE10ZNe7rQhogaUBskaxv5EwMZ6DWw9jFF3o5jKY9rh-_K9me8XSfjSSrzDqcTFHWdj5EhNUs6QHLqlHAiKZI0QDqw8WwCLeruyOTqAuobt-IpiqtPiLH1jT-V1xOz6EnwpNPlov9PDlTU-ZQGx276Yoincm22M5uNzgC2cCPPHuADfjOe42dYPVlSB7lA9Q_mA_ED3ersYhVPcL1yw014dQAfT0LJkD4IUXHBjHLhCQHaTRQ_oE2OetruTOyAiTofWj8BTB' },
            ].map(c => (
              <Link to="/login" key={c.name} className="group cursor-pointer">
                <div className="aspect-[3/4] rounded-5 bg-cover bg-center overflow-hidden mb-3 position-relative" style={{ backgroundImage: `url('${c.img}')` }}>
                  <div className="position-absolute top-0 bottom-0 start-0 end-0 bg-black/20 group-hover:bg-black/0 transition duration-300"></div>
                </div>
                <h3 className="fs-4 fw-bold group-hover:text-primary transition">{c.name}</h3>
                <p className="text-secondary">{c.sub}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Process */}
        <section className="bg-primary/5 py-5 overflow-hidden" id="process">
          <div className="max-w-[1280px] mx-auto px-3 px-md-5">
            <div className="text-center mb-16">
              <h2 className="fs-1 fw-bold tracking-tight mb-3">The Journey of a Shoe</h2>
              <p className="text-secondary max-w-2xl mx-auto">From the initial selection of raw hides to the final polish, our 9-stage manufacturing process is a testament to quality.</p>
            </div>
            <div className="row row-cols-3 row-cols-md-5 row-cols-lg-9 gap-3 mb-16">
              {['Selection','Cutting','Skiving','Stitching','Lasting','Welting','Bottoming','Finishing','Polish'].map((s, i) => (
                <div key={s} className="d-flex flex-column align-items-center text-center gap-3">
                  <div className={`size-16 rounded-circle d-flex align-items-center justify-content-center fw-bold border border-light-subtle ${i === 8 ? 'bg-primary text-white shadow-lg' : 'bg-white shadow-sm text-primary border-primary/20'}`}>
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <span className="fs-6 text-muted fw-bold text-uppercase tracking-tighter">{s}</span>
                </div>
              ))}
            </div>
            <div className="aspect-video w-100 max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-2xl position-relative group">
              <div className="w-100 h-100 bg-center bg-cover transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB8rEYt92CaTy6smIzLhUbvnqP433d-Ub4NUBabQbBhzLNEyXbhaEYf7OnPCZfG1xhBQcSfwbekbCsk0ge2kSJxSl44jz7Ss-2oR9jEx5V4w1pUATD4qeMIiSE6XfWV5UnroeJTJq2iN_PpsOD4y3aE_N15tAaJWjLe7hxzmj8END8R-6rUYSppn_ZQOkBvrhn3q5JSK_-nRQzvluzob1ltam3uKMkiLKhi6nzbujyTXfxxHaZ9oBT1gLkqu3DFM56xSpVwiwVEf08Q')" }}></div>
              <div className="position-absolute top-0 bottom-0 start-0 end-0 bg-gradient-to-t from-background-dark/80 to-transparent d-flex align-items-end p-4 p-lg-5">
                <div className="text-white">
                  <h3 className="fs-3 fw-bold mb-1">Heritage in Every Thread</h3>
                  <p className="opacity-80 max-w-lg">Our master cordwainers spend over 40 hours on every single pair, ensuring perfection in every detail.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-5 max-w-[1280px] mx-auto px-3 px-md-5" id="reviews">
          <div className="text-center mb-5">
            <h2 className="fs-1 fw-bold mb-3 italic font-serif">Kind Words from the Connoisseurs</h2>
          </div>
          <div className="row row-cols-lg-3 gap-4">
            {[
              { quote: 'The best investment I\'ve made in years. The bespoke fitting is like wearing a second skin. Truly unmatched quality.', name: 'James Wilson', role: 'Architect', offset: false },
              { quote: 'I appreciate the transparency of their process. Knowing exactly how these boots were made adds so much value to them.', name: 'Sarah Lindholm', role: 'Designer', offset: true },
              { quote: 'Classical aesthetics meet modern comfort. I wear my Artisans to everything from board meetings to weddings.', name: 'Michael Kraus', role: 'Executive', offset: false },
            ].map(t => (
              <div key={t.name} className={`p-4 rounded-5 bg-white border border-light-subtle border-primary/5 shadow-sm ${t.offset ? 'lg:translate-y-4' : ''}`}>
                <div className="d-flex text-primary mb-3">
                  {[...Array(5)].map((_, i) => <span key={i} className="material-symbols-outlined fill-1">star</span>)}
                </div>
                <p className="text-secondary italic mb-4">"{t.quote}"</p>
                <div className="d-flex align-items-center gap-3">
                  <div className="size-10 rounded-circle bg-light"></div>
                  <div>
                    <h5 className="fw-bold fs-6">{t.name}</h5>
                    <p className="text-secondary fs-6 text-muted">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
