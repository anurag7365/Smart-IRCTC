import { useState, useEffect, useContext } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

// Mock Price Configuration (Dynamic Base Prices)
const BASE_PRICES = {
    'SL': 150,
    '3A': 600,
    '2A': 1050,
    '1A': 1800,
    'CC': 450,
    '2S': 120
};

const TrainList = () => {
    const [searchParams] = useSearchParams();
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const date = searchParams.get('date');
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [trains, setTrains] = useState([]);
    const [loading, setLoading] = useState(true);

    // Expansion State
    const [expandedTrainId, setExpandedTrainId] = useState(null);
    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedDateIndex, setSelectedDateIndex] = useState(0);

    // Dynamic Data
    const [currentPrice, setCurrentPrice] = useState(0);
    const [availabilityData, setAvailabilityData] = useState([]);

    // UI State for Header
    const [sourceStation, setSourceStation] = useState(null);
    const [destStation, setDestStation] = useState(null);

    useEffect(() => {
        if (!from || !to || !date) {
            setLoading(false);
            return;
        }

        const fetchTrains = async () => {
            try {
                setLoading(true);
                // Fetch trains
                const { data } = await axios.get(`http://localhost:5000/api/trains/search?from=${from}&to=${to}&date=${date}`);
                setTrains(data);

                // Fetch Station Names for Header
                const sourceRes = await axios.get(`http://localhost:5000/api/stations/${from}`);
                setSourceStation(sourceRes.data);

                const destRes = await axios.get(`http://localhost:5000/api/stations/${to}`);
                setDestStation(destRes.data);

            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTrains();
    }, [from, to, date]);

    // Help calculate distance-based fare
    const calculateFare = (train, cls) => {
        try {
            const route = train.route;
            // Handle case where station might be an ID or an object
            const getDist = (stationId) => {
                const stop = route.find(r => (r.station._id || r.station) === stationId);
                return stop ? stop.distanceFromSource : 0;
            };

            const startDist = getDist(from);
            const endDist = getDist(to);
            const distance = Math.abs(endDist - startDist) || 100; // fallback

            const rates = {
                'SL': 0.6,
                '3A': 1.5,
                '2A': 2.2,
                '1A': 3.5,
                'CC': 1.2,
                '2S': 0.4
            };

            const baseFees = {
                'SL': 120,
                '3A': 350,
                '2A': 500,
                '1A': 800,
                'CC': 200,
                '2S': 60
            };

            const rate = rates[cls] || 1.0;
            const base = baseFees[cls] || 200;

            // Formula: (Distance * Rate) + Base Fee + small random cents for realism
            const calculated = Math.round((distance * rate) + base);
            return calculated;
        } catch (e) {
            return BASE_PRICES[cls] || 500;
        }
    };

    // Handle Class Selection
    const handleClassSelect = async (trainId, cls) => {
        const train = trains.find(t => t._id === trainId);
        if (!train) return;

        setExpandedTrainId(trainId);
        setSelectedClass(cls);
        setSelectedDateIndex(0);

        const fare = calculateFare(train, cls);
        setCurrentPrice(fare);

        // Fetch availability for next 6 days
        const dates = [];
        const startDate = new Date(date);

        // We will fetch 6 dates in parallel
        const promises = [];
        for (let i = 0; i < 6; i++) {
            const d = new Date(startDate);
            d.setDate(startDate.getDate() + i);
            const dateStr = d.toISOString().split('T')[0]; // YYYY-MM-DD

            promises.push(
                axios.get(`http://localhost:5000/api/trains/${trainId}/availability?date=${dateStr}&classType=${cls}`)
                    .then(res => ({
                        fullDate: d,
                        displayDate: d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
                        day: d.toLocaleDateString('en-US', { weekday: 'short' }),
                        status: res.data.status,
                        colorClass: res.data.available > 0 ? 'status-avl' : (res.data.racCount > 0 ? 'status-rac' : 'status-wl'),
                        available: res.data.available,
                        racCount: res.data.racCount,
                        wlCount: res.data.wlCount
                    }))
                    .catch(e => ({
                        fullDate: d,
                        displayDate: d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
                        day: d.toLocaleDateString('en-US', { weekday: 'short' }),
                        status: 'Error',
                        colorClass: 'status-wl',
                        available: 0
                    }))
            );
        }

        const results = await Promise.all(promises);
        setAvailabilityData(results);
    };

    const handleBookNow = (trainId) => {
        if (!user) {
            if (confirm('You must be logged in to book a ticket. Go to Login?')) {
                navigate('/login');
            }
            return;
        }

        // Navigate with booking details
        navigate(`/booking/${trainId}?date=${date}&from=${from}&to=${to}&class=${selectedClass}&price=${currentPrice}`);
    };

    // Helper to format date
    const formatDate = (dateString) => {
        const options = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    if (loading) {
        return (
            <div className="container" style={{ textAlign: 'center', marginTop: '100px' }}>
                <div style={{ fontSize: '20px', color: '#213d77' }}>Searching for trains...</div>
                <div style={{ marginTop: '10px', color: '#666' }}>Please wait while we fetch the best routes for you.</div>
            </div>
        );
    }

    return (
        <div className="container train-list-container">
            {/* Search Summary Header */}
            <div style={{ marginBottom: '20px' }}>
                <h2 style={{ color: '#213d77', margin: '0 0 5px 0' }}>
                    {trains.length} Results for {sourceStation ? `${sourceStation.name} (${sourceStation.code})` : from} <span style={{ color: '#fb792b' }}>➔</span> {destStation ? `${destStation.name} (${destStation.code})` : to}
                </h2>
                <div style={{ color: '#666', fontSize: '14px' }}>
                    Journey Date: <strong>{formatDate(date)}</strong> | Quota: <strong>General</strong>
                </div>
            </div>

            {/* Train List */}
            <div style={{ marginTop: '20px' }}>
                {trains.length === 0 ? (
                    <div className="train-card" style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                        <h3>No direct or connecting trains found for this route.</h3>
                        <p>Try searching for a nearby station or changing the date.</p>
                    </div>
                ) : (
                    trains.map((train) => (
                        <div key={train._id} className="train-card">
                            {/* Train Header */}
                            <div className="train-header">
                                <div className="flex items-center">
                                    {train.type === 'INDIRECT' && <span className="badge-indirect">Connecting via {train.transferStation}</span>}
                                    {train.type === 'NEARBY' && <span className="badge-nearby">Nearby Station</span>}

                                    <div className="train-name">{train.name}</div>
                                    <div className="train-number">({train.number})</div>
                                </div>
                                <div className="train-days">
                                    Runs On: {Array.isArray(train.daysOfOperation) ? train.daysOfOperation.join(' ') : 'Daily'}
                                </div>
                            </div>

                            {/* Train Body */}
                            <div className="train-body" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                                {/* Basic Info Row */}
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                                    {/* Route Info */}
                                    {/* Route Info */}
                                    <div className="train-route-info">
                                        <div className="station-info">
                                            <div className="station-code">{train.source.code}</div>
                                            <div className="station-name">{train.source.name}</div>
                                            <div style={{ fontWeight: 'bold', marginTop: '5px' }}>06:00</div>
                                        </div>

                                        <div className="duration-line"></div>

                                        <div className="station-info">
                                            <div className="station-code">{train.destination.code}</div>
                                            <div className="station-name">{train.destination.name}</div>
                                            <div style={{ fontWeight: 'bold', marginTop: '5px' }}>14:30</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Class Selection Row */}
                                <div className="class-container">
                                    {train.classes.map((cls) => (
                                        <div
                                            key={cls}
                                            className={`class-box ${expandedTrainId === train._id && selectedClass === cls ? 'active-class' : ''}`}
                                            onClick={() => handleClassSelect(train._id, cls)}
                                        >
                                            <div className="class-header">{cls}</div>
                                            <div className="class-body">
                                                <div className="availability">
                                                    {expandedTrainId === train._id && selectedClass === cls && availabilityData[0]
                                                        ? (availabilityData[0].available > 0 ? `AVL ${availabilityData[0].available}` : availabilityData[0].status)
                                                        : 'Refresh'}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Expanded Details Section */}
                                {expandedTrainId === train._id && (
                                    <div className="train-expanded-section">
                                        {/* Date Strip */}
                                        <div className="date-strip">
                                            {availabilityData.map((d, idx) => (
                                                <div
                                                    key={idx}
                                                    className={`date-card ${selectedDateIndex === idx ? 'selected' : ''}`}
                                                    onClick={() => setSelectedDateIndex(idx)}
                                                >
                                                    <div className="date-card-date">
                                                        {d.displayDate}, {d.day}
                                                    </div>
                                                    <div className={`date-card-status ${d.colorClass}`} style={{ fontWeight: 'bold' }}>
                                                        {d.status}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Action Bar */}
                                        <div className="booking-action-bar">
                                            <div className="price-display">
                                                <span>₹ {currentPrice}</span>
                                            </div>
                                            <button
                                                className="irctc-btn btn-orange"
                                                onClick={() => handleBookNow(train._id)}
                                            >
                                                Book Now
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Footer / Context Info for Indirect */}
                            {train.type === 'INDIRECT' && (
                                <div style={{ background: '#fff8e1', padding: '10px 15px', fontSize: '12px', borderTop: '1px solid #ffe0b2', color: '#f57c00' }}>
                                    <strong>Note:</strong> This is a connecting journey. You will switch trains at <strong>{train.transferStation}</strong>.
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default TrainList;
