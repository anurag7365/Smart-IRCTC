import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import LanguageContext from '../context/LanguageContext';
import VideoPopup from '../components/VideoPopup';

const Home = () => {
    const navigate = useNavigate();
    const { t } = useContext(LanguageContext);
    const [stations, setStations] = useState([]);
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [fromSearch, setFromSearch] = useState('');
    const [toSearch, setToSearch] = useState('');
    const [showFromList, setShowFromList] = useState(false);
    const [showToList, setShowToList] = useState(false);
    const [date, setDate] = useState('');
    const [activeTab, setActiveTab] = useState('BOOK'); // BOOK, PNR or CHARTS

    useEffect(() => {
        const fetchStations = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/stations');
                setStations(data.sort((a, b) => a.name.localeCompare(b.name)));
            } catch (error) {
                console.error('Error fetching stations:', error);
            }
        };
        fetchStations();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();

        const findStation = (searchStr, currentId) => {
            if (currentId) return currentId;
            if (!searchStr) return null;

            const lowerSearch = searchStr.toLowerCase().trim();

            // 1. Try exact name or code
            let match = stations.find(s =>
                s.name.toLowerCase() === lowerSearch ||
                s.code.toLowerCase() === lowerSearch
            );
            if (match) return match._id;

            // 2. Try "Name (Code)" format (set when clicking from list)
            const parenMatch = lowerSearch.match(/^(.+)\s\((.+)\)$/);
            if (parenMatch) {
                const namePart = parenMatch[1].trim();
                const codePart = parenMatch[2].trim();
                match = stations.find(s =>
                    s.name.toLowerCase() === namePart &&
                    s.code.toLowerCase() === codePart
                );
                if (match) return match._id;
            }

            // 3. Fallback: Take the first partial match if it's reasonably close
            match = stations.find(s =>
                s.name.toLowerCase().includes(lowerSearch) ||
                s.code.toLowerCase().includes(lowerSearch)
            );
            return match ? match._id : null;
        };

        const finalFrom = findStation(fromSearch, from);
        const finalTo = findStation(toSearch, to);

        if (!finalFrom) {
            alert('Please select a valid origin station');
            return;
        }
        if (!finalTo) {
            alert('Please select a valid destination station');
            return;
        }

        if (date) {
            navigate(`/trains?from=${finalFrom}&to=${finalTo}&date=${date}`);
        } else {
            alert('Please select a journey date');
        }
    };

    return (
        <div style={{ background: 'url("https://www.irctc.co.in/nget/assets/images/secondry-bg.jpg") repeat-x bottom', minHeight: 'calc(100vh - 120px)', position: 'relative' }}>
            <VideoPopup />

            {/* Header Text Overlay */}
            <div className="container" style={{ textAlign: 'right', paddingTop: '10px' }}>
                <h1 style={{ color: '#213d77', fontSize: '3.5rem', margin: 0 }}>{t('Indian Railways')}</h1>
                <div style={{ fontSize: '1.2rem', color: '#333' }}>{t('Safety')}</div>
            </div>

            <div className="container" style={{ display: 'flex', marginTop: '20px', gap: '40px' }}>

                {/* Left: Booking Widget */}
                <div style={{ width: '500px', zIndex: 10 }}>
                    <div className="booking-widget">
                        <div className="widget-tabs">
                            <div className={`widget-tab ${activeTab === 'BOOK' ? 'active' : ''}`} onClick={() => setActiveTab('BOOK')}>
                                <i className="fa fa-train"></i> {t('Book Ticket')}
                            </div>
                            <div className={`widget-tab ${activeTab === 'PNR' ? 'active' : ''}`} onClick={() => setActiveTab('PNR')}>
                                <i className="fa fa-ticket"></i> {t('PNR Status')}
                            </div>
                            <div className={`widget-tab ${activeTab === 'CHARTS' ? 'active' : ''}`} onClick={() => setActiveTab('CHARTS')}>
                                <i className="fa fa-bar-chart"></i> {t('Charts / Vacancy')}
                            </div>
                        </div>

                        {/* Main Booking Area Header within Widget */}
                        <div style={{ background: '#fff', padding: '15px 20px', borderBottom: '1px solid #eee' }}>
                            <h2 style={{ margin: 0, color: '#213d77', fontSize: '24px' }}>
                                {activeTab === 'BOOK' ? t('Book Ticket') : activeTab === 'PNR' ? t('PNR Status') : t('Charts / Vacancy')}
                            </h2>
                        </div>

                        <div className="widget-content">
                            {activeTab === 'PNR' ? (
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    const pnr = e.target.pnr.value;
                                    if (pnr) navigate(`/pnr/${pnr}`);
                                }}>
                                    <div className="irctc-input-group">
                                        <label className="irctc-label">{t('Enter PNR')}</label>
                                        <input className="irctc-input" name="pnr" type="text" placeholder="Enter 10-digit PNR" required maxLength="10" />
                                    </div>
                                    <button type="submit" className="irctc-btn btn-orange" style={{ width: '100%' }}>{t('Check Status')}</button>
                                </form>
                            ) : activeTab === 'CHARTS' ? (
                                <div style={{ padding: '20px', textAlign: 'center' }}>feature coming soon</div>
                            ) : (
                                /* Default View (Actually implied to be Book Ticket based on screenshot, but logic here separates tabs. 
                                   Adjusting: The SCREENSHOT shows 'Book Ticket' as the main header, and PNR/Charts as buttons above.
                                   Let's align with that: The tabs switch context, but initial load is BOOK TICKET. 
                                   Let's render Booking Form always unless PNR/Charts is explicitly active overlay. 
                                   Actually, simpler: Just keep standard tab logic for now but style it validly. */
                                <form onSubmit={handleSearch}>
                                    <div className="flex gap-2">
                                        <div className="irctc-input-group flex-1" style={{ position: 'relative' }}>
                                            <span className="irctc-label">{t('From')}</span>
                                            <input
                                                className="irctc-input"
                                                type="text"
                                                placeholder="Type station name/code"
                                                value={fromSearch}
                                                onChange={(e) => {
                                                    setFromSearch(e.target.value);
                                                    setFrom('');
                                                    setShowFromList(true);
                                                }}
                                                onFocus={() => setShowFromList(true)}
                                                onBlur={() => setTimeout(() => setShowFromList(false), 200)}
                                            />
                                            {showFromList && (
                                                <ul style={{ position: 'absolute', top: '100%', left: 0, width: '100%', background: 'white', border: '1px solid #ccc', zIndex: 100, maxHeight: '250px', overflowY: 'auto', listStyle: 'none', padding: 0, margin: 0, boxShadow: '0 4px 12px rgba(0,0,0,0.15)', borderRadius: '0 0 4px 4px' }}>
                                                    {stations
                                                        .filter(s =>
                                                            !fromSearch ||
                                                            s.name.toLowerCase().includes(fromSearch.toLowerCase()) ||
                                                            s.code.toLowerCase().includes(fromSearch.toLowerCase())
                                                        )
                                                        .map(s => (
                                                            <li key={s._id} onMouseDown={() => { setFrom(s._id); setFromSearch(`${s.name} (${s.code})`); setShowFromList(false); }} style={{ padding: '10px 15px', cursor: 'pointer', borderBottom: '1px solid #eee', fontSize: '13px' }} onMouseOver={(e) => e.target.style.background = '#f0f4f8'} onMouseOut={(e) => e.target.style.background = 'white'}>
                                                                <div style={{ fontWeight: '600' }}>{s.name}</div>
                                                                <div style={{ fontSize: '11px', color: '#666' }}>{s.code} - {s.location}</div>
                                                            </li>
                                                        ))}
                                                    {stations.filter(s => !fromSearch || s.name.toLowerCase().includes(fromSearch.toLowerCase()) || s.code.toLowerCase().includes(fromSearch.toLowerCase())).length === 0 && (
                                                        <li style={{ padding: '10px', color: '#999', textAlign: 'center' }}>No stations found</li>
                                                    )}
                                                </ul>
                                            )}
                                        </div>
                                        <div className="irctc-input-group flex-1" style={{ position: 'relative' }}>
                                            <span className="irctc-label">{t('To')}</span>
                                            <input
                                                className="irctc-input"
                                                type="text"
                                                placeholder="Type station name/code"
                                                value={toSearch}
                                                onChange={(e) => {
                                                    setToSearch(e.target.value);
                                                    setTo('');
                                                    setShowToList(true);
                                                }}
                                                onFocus={() => setShowToList(true)}
                                                onBlur={() => setTimeout(() => setShowToList(false), 200)}
                                            />
                                            {showToList && (
                                                <ul style={{ position: 'absolute', top: '100%', left: 0, width: '100%', background: 'white', border: '1px solid #ccc', zIndex: 100, maxHeight: '250px', overflowY: 'auto', listStyle: 'none', padding: 0, margin: 0, boxShadow: '0 4px 12px rgba(0,0,0,0.15)', borderRadius: '0 0 4px 4px' }}>
                                                    {stations
                                                        .filter(s =>
                                                            !toSearch ||
                                                            s.name.toLowerCase().includes(toSearch.toLowerCase()) ||
                                                            s.code.toLowerCase().includes(toSearch.toLowerCase())
                                                        )
                                                        .map(s => (
                                                            <li key={s._id} onMouseDown={() => { setTo(s._id); setToSearch(`${s.name} (${s.code})`); setShowToList(false); }} style={{ padding: '10px 15px', cursor: 'pointer', borderBottom: '1px solid #eee', fontSize: '13px' }} onMouseOver={(e) => e.target.style.background = '#f0f4f8'} onMouseOut={(e) => e.target.style.background = 'white'}>
                                                                <div style={{ fontWeight: '600' }}>{s.name}</div>
                                                                <div style={{ fontSize: '11px', color: '#666' }}>{s.code} - {s.location}</div>
                                                            </li>
                                                        ))}
                                                    {stations.filter(s => !toSearch || s.name.toLowerCase().includes(toSearch.toLowerCase()) || s.code.toLowerCase().includes(toSearch.toLowerCase())).length === 0 && (
                                                        <li style={{ padding: '10px', color: '#999', textAlign: 'center' }}>No stations found</li>
                                                    )}
                                                </ul>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <div className="irctc-input-group flex-1">
                                            <span className="irctc-label">{t('Date')}</span>
                                            <input 
                                                className="irctc-input" 
                                                type="date" 
                                                min={new Date().toLocaleDateString('en-CA')} 
                                                value={date} 
                                                onChange={(e) => setDate(e.target.value)} 
                                                required 
                                            />
                                        </div>
                                        <div className="irctc-input-group flex-1">
                                            <span className="irctc-label">{t('All Classes')}</span>
                                            <select className="irctc-input" disabled><option>All Classes</option></select>
                                        </div>
                                    </div>

                                    <div className="irctc-input-group">
                                        <span className="irctc-label">{t('General')}</span>
                                        <select className="irctc-input" disabled><option>GENERAL</option></select>
                                    </div>

                                    <div style={{ fontSize: '11px', color: '#213d77', fontWeight: 'bold', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                                        <label><input type="checkbox" /> {t('Person With Disability Concession')}</label>
                                        <label><input type="checkbox" defaultChecked /> {t('Flexible With Date')}</label>
                                        <label><input type="checkbox" /> {t('Train with Available Berth')}</label>
                                        <label><input type="checkbox" /> {t('Railway Pass Concession')}</label>
                                    </div>

                                    <button type="submit" className="irctc-btn btn-orange" style={{ width: '100%' }}>{t('Search')}</button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: Vande Bharat Image */}
                <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                    {/* Image is handled by background or explicit img if needed. 
                         Using explicit IMG for simulated look */}
                    <img src="/vande-bharat.png" alt="Vande Bharat" style={{ maxWidth: '80%', borderRadius: '20px 0 0 20px', boxShadow: '-10px 10px 20px rgba(0,0,0,0.2)' }} />
                </div>
            </div>

            {/* Services Shortcuts Bar */}
            <div className="container" style={{ marginTop: '40px', marginBottom: '40px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '20px', textAlign: 'center' }}>
                    <div onClick={() => navigate('/buses')} style={{ cursor: 'pointer', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                        <div style={{ fontSize: '40px', background: '#fff', width: '70px', height: '70px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>🚌</div>
                        <div style={{ fontWeight: 'bold', fontSize: '13px', color: '#213d77' }}>BUSES</div>
                    </div>
                    <div onClick={() => navigate('/flights')} style={{ cursor: 'pointer', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                        <div style={{ fontSize: '40px', background: '#fff', width: '70px', height: '70px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>✈️</div>
                        <div style={{ fontWeight: 'bold', fontSize: '13px', color: '#213d77' }}>FLIGHTS</div>
                    </div>
                    <div onClick={() => navigate('/hotels')} style={{ cursor: 'pointer', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                        <div style={{ fontSize: '40px', background: '#fff', width: '70px', height: '70px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>🏨</div>
                        <div style={{ fontWeight: 'bold', fontSize: '13px', color: '#213d77' }}>HOTELS</div>
                    </div>
                    <div onClick={() => navigate('/holidays')} style={{ cursor: 'pointer', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                        <div style={{ fontSize: '40px', background: '#fff', width: '70px', height: '70px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>🏖️</div>
                        <div style={{ fontWeight: 'bold', fontSize: '13px', color: '#213d77' }}>HOLIDAYS</div>
                    </div>
                    <div onClick={() => navigate('/meals')} style={{ cursor: 'pointer', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                        <div style={{ fontSize: '40px', background: '#fff', width: '70px', height: '70px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>🍛</div>
                        <div style={{ fontWeight: 'bold', fontSize: '13px', color: '#213d77' }}>MEALS</div>
                    </div>
                    <div onClick={() => navigate('/loyalty')} style={{ cursor: 'pointer', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                        <div style={{ fontSize: '40px', background: '#fff', width: '70px', height: '70px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>🎁</div>
                        <div style={{ fontWeight: 'bold', fontSize: '13px', color: '#213d77' }}>LOYALTY</div>
                    </div>
                    <div onClick={() => navigate('/e-wallet')} style={{ cursor: 'pointer', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                        <div style={{ fontSize: '40px', background: '#fff', width: '70px', height: '70px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>💳</div>
                        <div style={{ fontWeight: 'bold', fontSize: '13px', color: '#213d77' }}>E-WALLET</div>
                    </div>
                    <div onClick={() => navigate('/promotions')} style={{ cursor: 'pointer', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                        <div style={{ fontSize: '40px', background: '#fff', width: '70px', height: '70px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>🎉</div>
                        <div style={{ fontWeight: 'bold', fontSize: '13px', color: '#213d77' }}>OFFERS</div>
                    </div>
                </div>
            </div>

            <div className="container" style={{ marginTop: '50px', textAlign: 'center' }}>
                {/* Footer simulation */}
                <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ color: '#213d77' }}>Have you not found the right train?</h3>
                    <p>Try our mock indirect route finder feature!</p>
                </div>
            </div>
        </div>
    );
};

export default Home;
