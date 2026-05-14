import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-dark text-secondary py-5 px-3 px-md-5 px-lg-5 mt-auto">
            <div className="max-w-[1280px] mx-auto row row-cols-1 row-cols-md-4 gap-5 border-bottom border-light-subtle border-slate-800 pb-12 mb-5">
                <div className="col-1 md:col-span-1">
                    <div className="d-flex align-items-center gap-2 text-white mb-4">
                        <span className="material-symbols-outlined text-primary">architecture</span>
                        <h2 className="fs-4 fw-bold tracking-tight">Artisan Soul</h2>
                    </div>
                    <p className="fs-6 lh-lg">
                        Preserving the heritage of traditional footwear through exceptional craftsmanship and ethical sourcing.
                    </p>
                </div>

                <div>
                    <h4 className="text-white fw-bold mb-4">Collections</h4>
                    <ul className="space-y-4 fs-6">
                        <li><Link to="/catalog" className="hover:text-primary transition">Oxfords</Link></li>
                        <li><Link to="/catalog" className="hover:text-primary transition">Derbies</Link></li>
                        <li><Link to="/catalog" className="hover:text-primary transition">Boots</Link></li>
                        <li><Link to="/catalog" className="hover:text-primary transition">Loafers</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-white fw-bold mb-4">Company</h4>
                    <ul className="space-y-4 fs-6">
                        <li><Link to="#" className="hover:text-primary transition">Our Story</Link></li>
                        <li><Link to="/craftsmanship" className="hover:text-primary transition">The Atelier</Link></li>
                        <li><Link to="#" className="hover:text-primary transition">Sustainability</Link></li>
                        <li><Link to="#" className="hover:text-primary transition">Contact</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-white fw-bold mb-4">Newsletter</h4>
                    <p className="fs-6 mb-3">Join our list for exclusive releases and care tips.</p>
                    <div className="d-flex gap-2">
                        <input
                            className="bg-dark border-none rounded-3 fs-6 flex-grow-1 focus:ring-1 focus:ring-primary px-2 focus:outline-none text-white placeholder:text-slate-500"
                            placeholder="Your email"
                            type="email"
                        />
                        <button className="bg-primary text-white p-1 rounded-3 hover:bg-primary/90 transition">
                            <span className="material-symbols-outlined">send</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-[1280px] mx-auto d-flex flex-column flex-row justify-content-between align-items-center gap-4 fs-6 text-muted text-uppercase tracking-widest">
                <p>© {new Date().getFullYear()} Artisan Soul. All Rights Reserved.</p>
                <div className="d-flex gap-4">
                    <Link to="#" className="hover:text-white transition">Privacy Policy</Link>
                    <Link to="#" className="hover:text-white transition">Terms of Service</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
