import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
    return (
        <div style={{
            position: 'relative',
            display: 'flex',
            minHeight: '100vh',
            width: '100%',
            flexDirection: 'column',
            overflowX: 'hidden',
            backgroundColor: '#ffffff',
            fontFamily: 'sans-serif',
            color: '#0f172a'
        }}>
            <Navbar />
            <main style={{
                flex: '1 1 0%',
                display: 'flex',
                flexDirection: 'column'
            }}>
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
