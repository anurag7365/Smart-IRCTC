import Navbar from './Navbar';
import Footer from './Footer';
import SmartAssist from './SmartAssist';

const Layout = ({ children }) => {
    return (
        <>
            <Navbar />
            <main className="container" style={{ marginTop: '20px', minHeight: '80vh' }}>
                {children}
            </main>
            <SmartAssist />
            <Footer />
        </>
    );
};

export default Layout;
