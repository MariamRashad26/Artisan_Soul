import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate('/catalog');
            setIsMenuOpen(false);
        }
    };

    return (
        <header className="sticky-top top-0 z-50 w-100 border-bottom border-light-subtle glass-panel px-3 px-md-5 px-lg-5 py-3">
            <nav className="d-flex align-items-center justify-content-between max-w-[1280px] mx-auto position-relative">
                <div className="d-flex align-items-center gap-4">
                    <Link to="/" className="d-flex align-items-center gap-2 text-primary text-decoration-none">
                        <span className="material-symbols-outlined fs-2">architecture</span>
                        <h2 className="text-dark fs-4 fw-bold tracking-tight mb-0 d-none d-sm-block">Artisan Soul</h2>
                    </Link>

                    {/* Desktop Links */}
                    <div className="d-none d-md-flex align-items-center gap-4">
                        <Link to="/catalog" className="text-secondary hover:text-primary transition fs-6 fw-medium text-decoration-none">Collections</Link>
                        <Link to="/custom-designer" className="text-secondary hover:text-primary transition fs-6 fw-medium text-decoration-none">Custom</Link>
                    </div>
                </div>

                <div className="d-flex align-items-center gap-3">
                    <form onSubmit={handleSearch} className="d-none d-lg-flex align-items-center bg-primary/5 rounded-4 px-2 py-1.5 border border-light-subtle border-primary/10 transition focus-within:ring-2 focus-within:ring-primary/20">
                        <span className="material-symbols-outlined text-secondary fs-4">search</span>
                        <input
                            className="bg-transparent border-none focus:ring-0 focus:outline-none fs-6 w-32 md:w-48 placeholder:text-slate-400 text-dark px-1"
                            placeholder="Search models..."
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </form>

                    <Button to="/cart" variant="primary" className="px-3 !important d-flex align-items-center justify-content-center">
                        <span className="material-symbols-outlined fs-5">shopping_bag</span>
                        <span className="d-none d-sm-inline ms-2 fw-medium">Cart</span>
                    </Button>
                    
                    {user ? (
                        <div className="d-none d-md-flex align-items-center gap-3 ms-2">
                           <div className="size-8 bg-primary/10 text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold text-xs uppercase" title={user.name}>
                               {user.name?.charAt(0) || 'U'}
                           </div>
                           <button onClick={logout} className="border-0 bg-transparent text-secondary hover:text-dark transition fs-6 fw-medium p-0 d-flex align-items-center">
                               <span className="material-symbols-outlined fs-5">logout</span>
                           </button>
                        </div>
                    ) : (
                        <Link to="/login" className="d-none d-md-flex text-secondary hover:text-primary transition fs-6 fw-medium text-decoration-none ms-2">Login</Link>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="d-md-none border-0 bg-transparent text-dark p-2 d-flex align-items-center justify-content-center rounded-circle transition hover:bg-gray-50"
                    >
                        <span className="material-symbols-outlined fs-1">{isMenuOpen ? 'close' : 'menu'}</span>
                    </button>
                </div>
            </nav>

            {/* Mobile Dropdown Menu */}
            {isMenuOpen && (
                <div className="d-md-none position-absolute start-0 top-100 w-100 bg-white border-bottom border-light-subtle shadow-xl p-4 animate-in slide-in-from-top-4 duration-300 z-50">
                    <div className="d-flex flex-column gap-4 max-w-[1280px] mx-auto">
                        <form onSubmit={handleSearch} className="d-flex align-items-center bg-gray-50 rounded-pill px-3 py-3 border border-gray-200 focus-within:border-primary transition">
                            <span className="material-symbols-outlined text-secondary fs-4 me-2">search</span>
                            <input
                                className="bg-transparent border-none w-100 focus:ring-0 focus:outline-none fs-5 placeholder:text-slate-400 text-dark px-1"
                                placeholder="Search models..."
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </form>
                        <div className="d-flex flex-column gap-2 mb-2">
                            <Link onClick={() => setIsMenuOpen(false)} to="/catalog" className="text-dark fs-4 fw-bold text-decoration-none border-bottom border-gray-50 pb-4 pt-2 d-flex justify-content-between align-items-center hover:text-primary transition">
                                Collections <span className="material-symbols-outlined text-secondary fs-3">arrow_forward</span>
                            </Link>
                            <Link onClick={() => setIsMenuOpen(false)} to="/custom-designer" className="text-dark fs-4 fw-bold text-decoration-none border-bottom border-gray-50 pb-4 pt-4 d-flex justify-content-between align-items-center hover:text-primary transition">
                                Bespoke Designer <span className="material-symbols-outlined text-secondary fs-3">arrow_forward</span>
                            </Link>
                            
                            {user ? (
                                <button onClick={() => { setIsMenuOpen(false); logout(); }} className="text-danger fs-4 fw-bold text-decoration-none border-0 bg-transparent text-start pb-4 pt-4 d-flex justify-content-between align-items-center transition w-100">
                                    Sign Out <span className="material-symbols-outlined text-danger fs-3">logout</span>
                                </button>
                            ) : (
                                <Link onClick={() => setIsMenuOpen(false)} to="/login" className="text-primary fs-4 fw-bold text-decoration-none border-0 bg-transparent text-start pb-4 pt-4 d-flex justify-content-between align-items-center transition w-100">
                                    Login / Register <span className="material-symbols-outlined text-primary fs-3">login</span>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
