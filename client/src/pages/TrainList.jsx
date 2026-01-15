import { useState, useEffect, useContext } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import './TrainList.css';

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

        // Fetch Dynamic Fare from API using Map Logic
        const sourceCode = train.source.code;
        const destCode = train.destination.code;

        try {
            const { data } = await axios.post('http://localhost:5000/api/fares/calculate', {
                from: sourceCode,
                to: destCode,
                trainType: train.type || 'Express',
                classType: cls,
                quota: 'GN'
            });
            setCurrentPrice(data.totalFare);
        } catch (error) {
            console.error('Error fetching fare:', error);
            // Fallback to local if API fails (e.g. missing coordinates)
            setCurrentPrice(calculateFare(train, cls));
        }

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

    // Helper to get timing for specific train and route
    const getTrainTiming = (train) => {
        const sourceCode = sourceStation ? sourceStation.code : from;
        const destCode = destStation ? destStation.code : to;

        // Find route stops. Handle both populated objects and ID references
        const startStop = train.route.find(r => {
            const s = r.station;
            return (s.code === sourceCode) || (s._id === from) || (s === from);
        });
        const endStop = train.route.find(r => {
            const s = r.station;
            return (s.code === destCode) || (s._id === to) || (s === to);
        });

        const departureTime = startStop ? startStop.departureTime : '00:00';
        const arrivalTime = endStop ? endStop.arrivalTime : '00:00';

        // Calculate Duration
        let duration = "00h 00m";
        try {
            const [depH, depM] = departureTime.split(':').map(Number);
            const [arrH, arrM] = arrivalTime.split(':').map(Number);

            let diffH = arrH - depH;
            let diffM = arrM - depM;

            // Adjust for next day arrival (simple logic)
            // Ideally we should use dayCount diff, but fall back to 24h wrap for now
            let dayDiff = 0;
            if (endStop && startStop && endStop.dayCount && startStop.dayCount) {
                dayDiff = endStop.dayCount - startStop.dayCount;
            }

            // If day diff is known, add hours
            diffH += (dayDiff * 24);

            // If dayCount missing but time is backward, assume next day
            if (dayDiff === 0 && (diffH < 0 || (diffH === 0 && diffM < 0))) {
                diffH += 24;
            }

            if (diffM < 0) {
                diffH -= 1;
                diffM += 60;
            }

            duration = `${diffH}h ${diffM.toString().padStart(2, '0')}m`;
        } catch (e) { }

        return { departureTime, arrivalTime, duration };
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
            <div className="search-summary">
                <div>
                    <h2>
                        {trains.length} Results for {sourceStation ? `${sourceStation.name}` : from} <span style={{ color: '#fb792b' }}>➔</span> {destStation ? `${destStation.name}` : to}
                    </h2>
                    <div style={{ color: '#666', fontSize: '13px', marginTop: '4px' }}>
                        Journey Date: <strong>{formatDate(date)}</strong> | Quota: <strong>General</strong>
                    </div>
                </div>
                <div>
                    {/* Placeholder for Next/Prev day buttons */}
                    <button className="irctc-btn" style={{ marginRight: '10px', fontSize: '12px' }}>&lt; Previous Day</button>
                    <button className="irctc-btn" style={{ fontSize: '12px' }}>Next Day &gt;</button>
                </div>
            </div>

            {/* Train List */}
            <div style={{ marginTop: '10px' }}>
                {trains.length === 0 ? (
                    <div className="train-card" style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                        <h3>No trains found.</h3>
                        <p>Try searching for a different date.</p>
                    </div>
                ) : (
                    trains.map((train) => (
                        <div key={train._id} className="train-card">
                            {/* 1. Header */}
                            <div className="train-card-header">
                                <div className="train-name-box">
                                    <span className="train-title">{train.name} ({train.number})</span>
                                </div>
                                <div className="train-runs-on">
                                    Runs On:
                                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => {
                                        // Simple logic: assume daily if not specified, otherwise check array
                                        const isRunning = !train.daysOfOperation || train.daysOfOperation.includes(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]);
                                        return <span key={i} className={`runs-day ${isRunning ? 'active' : ''}`}>{day} </span>
                                    })}
                                </div>
                            </div>

                            {/* 2. Journey Details */}
                            {/* 2. Journey Details */}
                            {(() => {
                                const timing = getTrainTiming(train);
                                // Use search context stations if available, else fallback to search params
                                const dispSource = sourceStation ? sourceStation.code : from;
                                const dispDest = destStation ? destStation.code : to;

                                return (
                                    <div className="journey-row">
                                        <div className="station-time-box">
                                            <span className="time-big">{timing.departureTime}</span>
                                            <span className="station-details">| {dispSource} | {new Date(date).toLocaleDateString()}</span>
                                        </div>
                                        <div className="duration-box">
                                            <div className="duration-line"></div>
                                            <span className="duration-text">{timing.duration}</span>
                                        </div>
                                        <div className="station-time-box">
                                            <span className="time-big">{timing.arrivalTime}</span>
                                            <span className="station-details">| {dispDest} | {new Date(date).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                );
                            })()}

                            {/* 3. Class Tabs */}
                            <div className="class-tabs">
                                {train.classes.map((cls) => (
                                    <div
                                        key={cls}
                                        className={`class-tab ${expandedTrainId === train._id && selectedClass === cls ? 'active' : ''}`}
                                        onClick={() => handleClassSelect(train._id, cls)}
                                    >
                                        {/* Display Full Name mapping could be added here */}
                                        {cls === 'SL' ? 'Sleeper (SL)' : cls === '3A' ? 'AC 3 Tier (3A)' : cls === '2A' ? 'AC 2 Tier (2A)' : cls}
                                    </div>
                                ))}
                            </div>

                            {/* 4. Availability Strip & Refresh Logic */}
                            {expandedTrainId === train._id && (
                                <div style={{ background: '#fff' }}>
                                    <div className="availability-strip">
                                        {availabilityData.map((d, idx) => (
                                            <div
                                                key={idx}
                                                className={`availability-box ${selectedDateIndex === idx ? 'selected' : ''}`}
                                                onClick={() => setSelectedDateIndex(idx)}
                                            >
                                                <div className="date-text">{d.displayDate}</div>
                                                <div className={`status-text ${d.colorClass}`}>
                                                    {d.available > 0 ? `AVL ${d.available}` : d.status}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* 5. Footer Action */}
                                    <div className="card-footer">
                                        <button
                                            className="book-btn"
                                            onClick={() => handleBookNow(train._id)}
                                        >
                                            Book Now <span style={{ fontSize: '16px', marginLeft: '5px' }}>₹ {currentPrice}</span>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Prompt to select class if not expanded */}
                            {expandedTrainId !== train._id && (
                                <div style={{ padding: '10px', textAlign: 'center', fontSize: '12px', color: '#666' }}>
                                    Select a class to view availability and fare
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
