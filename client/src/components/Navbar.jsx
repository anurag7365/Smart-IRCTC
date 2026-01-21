import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useContext, useState, useEffect, useRef } from 'react';
import AuthContext from '../context/AuthContext';
import LanguageContext from '../context/LanguageContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { toggleLanguage, t } = useContext(LanguageContext);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [lineStyle, setLineStyle] = useState({ left: 0, width: 0, opacity: 0 });
    const navigate = useNavigate();
    const location = useLocation();
    const navContainerRef = useRef(null);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleFont = (size) => {
        const root = document.documentElement;
        if (size === 'Small') {
            root.style.setProperty('--fs-md', '12px');
            root.style.fontSize = '12px';
        } else if (size === 'Normal') {
            root.style.setProperty('--fs-md', '14px');
            root.style.fontSize = '14px';
        } else if (size === 'Large') {
            root.style.setProperty('--fs-md', '16px');
            root.style.fontSize = '16px';
        }
    };

    const handleMouseEnter = (e) => {
        const { offsetLeft, offsetWidth } = e.target;
        setLineStyle({ left: offsetLeft, width: offsetWidth, opacity: 1 });
    };

    const handleMouseLeave = () => {
        // Return to active link position
        updateActiveLink();
    };

    const updateActiveLink = () => {
        if (!navContainerRef.current) return;
        const activeLink = navContainerRef.current.querySelector(`a[href="${location.pathname}"]`);
        if (activeLink) {
            const { offsetLeft, offsetWidth } = activeLink;
            setLineStyle({ left: offsetLeft, width: offsetWidth, opacity: 1 });
        } else {
            setLineStyle({ left: 0, width: 0, opacity: 0 });
        }
    };

    // Set initial active link on mount and route change
    useEffect(() => {
        updateActiveLink();
    }, [location.pathname]);

    const navLinks = [
        { name: t('Trains'), path: '/', icon: '🚆' },
        { name: 'LIVE STATUS', path: '/tracking', icon: '📍' },
        { name: 'LOYALTY', path: '/loyalty', icon: '💎' },
        { name: 'BUSES', path: '/buses', icon: '🚌' },
        { name: 'FLIGHTS', path: '/flights', icon: '✈️' },
        { name: 'HOTELS', path: '/hotels', icon: '🏨' },
        { name: 'MEALS', path: '/meals', icon: '🍱' },
        { name: 'MORE', path: '/more', icon: '▾' }
    ];

    return (
        <header>
            {/* Top Bar with Date/Time and Settings */}
            <div className="irctc-header-top">
                <div className="container" style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}></div>
                    <div style={{ fontWeight: 'bold' }}>
                        {currentTime.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} [{currentTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}]
                    </div>
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '15px' }}>
                        <span>|</span>
                        <span className="cursor-pointer" onClick={() => handleFont('Small')}>A-</span>
                        <span className="cursor-pointer" onClick={() => handleFont('Normal')}>A</span>
                        <span className="cursor-pointer" onClick={() => handleFont('Large')}>A+</span>
                        <span>|</span>
                        <span style={{ fontWeight: 'bold', cursor: 'pointer' }} onClick={toggleLanguage}>{t('Language')}</span>
                    </div>
                </div>
            </div>

            {/* Main Navbar */}
            <nav className="irctc-navbar">
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                    {/* Left Logo Section */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <img src="https://pnghdpro.com/wp-content/themes/pnghdpro/download/social-media-and-brands/indian-railways-logo.png" alt="Indian Railways" style={{ height: '80px' }} />
                    </div>

                    {/* Navigation Links (Center/Right) */}
                    <div className="flex-col" style={{ alignItems: 'flex-end' }}>
                        <div className="flex gap-4" style={{ marginBottom: '10px', alignItems: 'center' }}>
                            {user ? (
                                <div className="dropdown">
                                    <div className="dropbtn">
                                        <div className="user-avatar">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: '1.2' }}>
                                            <span style={{ fontSize: '11px', color: '#666' }}>{t('Welcome')}</span>
                                            <span style={{ fontWeight: 'bold', color: '#213d77', fontSize: '14px' }}>{user.name} ▼</span>
                                        </div>
                                    </div>
                                    <div className="dropdown-content">
                                        {user.role === 'admin' && (
                                            <Link to="/admin/dashboard" className="dropdown-item">
                                                <span>⚙️</span> Admin Dashboard
                                            </Link>
                                        )}
                                        <Link to="/bookings" className="dropdown-item">
                                            <span>📅</span> {t('My Bookings')}
                                        </Link>
                                        <Link to="/my-transactions" className="dropdown-item">
                                            <span>💳</span> {t('My Transactions')}
                                        </Link>
                                        <div onClick={handleLogout} className="dropdown-item logout" style={{ cursor: 'pointer' }}>
                                            <span>🚪</span> {t('Logout')}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <Link to="/login" className="irctc-btn btn-blue" style={{ padding: '5px 10px', fontSize: '12px' }}>{t('Login')}</Link>
                                    <Link to="/register" className="irctc-btn" style={{ padding: '5px 10px', fontSize: '12px', border: '1px solid #ddd' }}>{t('Register')}</Link>
                                    <Link to="/agent" className="irctc-btn" style={{ padding: '5px 10px', fontSize: '12px', border: '1px solid #ddd' }}>{t('Agent Login')}</Link>
                                </>
                            )}
                        </div>

                        <div ref={navContainerRef} className="flex items-center" style={{ position: 'relative', width: '100%', justifyContent: 'space-between' }} onMouseLeave={handleMouseLeave}>
                            {navLinks.map((link, idx) => (
                                <Link
                                    key={idx}
                                    to={link.path}
                                    className="nav-link"
                                    onMouseEnter={handleMouseEnter}
                                    style={{ borderBottom: 'none' }}
                                >
                                    <span style={{ marginRight: '5px', fontSize: '1.1em' }}>{link.icon}</span>
                                    {link.name}
                                </Link>
                            ))}
                            <div
                                style={{
                                    position: 'absolute',
                                    bottom: '-5px',
                                    left: lineStyle.left,
                                    width: lineStyle.width,
                                    height: '3px',
                                    background: '#fb792b',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    opacity: lineStyle.opacity,
                                    pointerEvents: 'none',
                                    borderRadius: '2px'
                                }}
                            />
                        </div>
                    </div>

                    {/* Right Logo (IRCTC) */}
                    <div>
                        <img src="https://images.seeklogo.com/logo-png/18/1/irctc-india-logo-png_seeklogo-180379.png" alt="IRCTC" style={{ height: '70px' }} />
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
