import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LiveTracking = () => {
    const [trains, setTrains] = useState([]);
    const [trainNumber, setTrainNumber] = useState('');
    const [selectedTrain, setSelectedTrain] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [simTime, setSimTime] = useState(new Date());
    const [coaches, setCoaches] = useState([]);
    const [showChart, setShowChart] = useState(false);

    // Fetch all trains on mount
    useEffect(() => {
        const fetchAllTrains = async () => {
            try {
                // Get ALL trains from the main endpoint
                const { data } = await axios.get('http://localhost:5000/api/trains');
                setTrains(data);
                if (data.length > 0) {
                    setSelectedTrain(data[0]); // Auto-select first train for instant visualization
                }
            } catch (err) {
                setError('Failed to fetch train database.');
            } finally {
                setLoading(false);
            }
        };
        fetchAllTrains();

        // Simulation clock to refresh progress every minute
        const timer = setInterval(() => {
            setSimTime(new Date());
        }, 60000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (selectedTrain) {
            const fetchCoaches = async () => {
                try {
                    const { data } = await axios.get(`http://localhost:5000/api/trains/${selectedTrain._id}/coaches`);
                    setCoaches(data);
                } catch (err) {
                    console.error('Failed to fetch coaches', err);
                }
            };
            fetchCoaches();
        }
    }, [selectedTrain]);

    const handleSearch = (e) => {
        if (e) e.preventDefault();
        const found = trains.find(t => t.number.includes(trainNumber) || t.name.toLowerCase().includes(trainNumber.toLowerCase()));
        if (found) {
            setSelectedTrain(found);
            setError('');
        } else {
            setError('Train not found in schedule.');
        }
    };

    // Simulated "Current Location" calculation
    const getStatus = (train) => {
        if (!train) return null;
        const hr = simTime.getHours();
        const min = simTime.getMinutes();
        const totalMins = hr * 60 + min;

        // Mock journey parameters: Starts early morning, ends late night
        const start = 300; // 5:00 AM
        const end = 1400;  // 11:20 PM

        if (totalMins < start) return { status: 'Not Started', progress: 0, lat: 28.6139, lng: 77.2090, current: train.source.name };
        if (totalMins > end) return { status: 'Reached', progress: 100, lat: 19.0760, lng: 72.8777, current: train.destination.name };

        const progress = Math.min(Math.max((totalMins - start) / (end - start), 0), 1);

        const lat = 28.6139 + progress * (19.0760 - 28.6139);
        const lng = 77.2090 + progress * (72.8777 - 77.2090);

        const stopIndex = Math.min(Math.floor(progress * (train.route.length + 1)), train.route.length);
        const currentLoc = stopIndex === 0 ? train.source.name : (train.route[stopIndex - 1]?.station?.name || 'In Transit');

        return {
            status: 'Running',
            progress: Math.round(progress * 100),
            lat: lat.toFixed(4),
            lng: lng.toFixed(4),
            current: currentLoc
        };
    };

    const status = getStatus(selectedTrain);

    if (loading) return (
        <div style={{ textAlign: 'center', marginTop: '100px', fontFamily: 'monospace' }}>
            <div className="spinner" style={{ width: '40px', height: '40px', border: '3px solid #eee', borderTop: '3px solid #fb792b', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }}></div>
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            CONNECTING TO IRCTC SATELLITE NETWORK...
        </div>
    );

    return (
        <div className="container" style={{ padding: '20px 0', maxWidth: '1400px' }}>
            {/* Header HUD */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', background: '#213d77', padding: '15px 25px', borderRadius: '12px', color: 'white', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '22px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ color: '#fb792b' }}>●</span> LIVE TRAIN TRACKING SYSTEM
                    </h1>
                    <div style={{ fontSize: '11px', opacity: 0.7, marginTop: '3px' }}>MONITORING {trains.length} ACTIVE LOCOMOTIVES | GPS UPLINK ACTIVE</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '12px', fontWeight: 'bold' }}>{simTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</div>
                    <div style={{ fontSize: '10px', opacity: 0.7 }}>{simTime.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr 320px', gap: '20px', height: '700px' }}>
                {/* Left Panel */}
                <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #ddd', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    <div style={{ padding: '15px', borderBottom: '1px solid #eee' }}>
                        <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#888', marginBottom: '8px' }}>SEARCH TRAIN</div>
                        <div style={{ display: 'flex', gap: '5px' }}>
                            <input
                                type="text"
                                placeholder="Number/Name..."
                                value={trainNumber}
                                onChange={(e) => setTrainNumber(e.target.value)}
                                style={{ flex: 1, padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px' }}
                            />
                            <button onClick={handleSearch} style={{ background: '#213d77', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>➔</button>
                        </div>
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        <div style={{ padding: '10px 15px', background: '#f8f9fa', fontSize: '11px', fontWeight: 'bold', color: '#666' }}>ACTIVE SCHEDULE</div>
                        {trains.filter(t => t.name.toLowerCase().includes(trainNumber.toLowerCase()) || t.number.includes(trainNumber)).map(t => (
                            <div key={t._id} onClick={() => setSelectedTrain(t)} style={{ padding: '15px', borderBottom: '1px solid #f0f0f0', cursor: 'pointer', background: selectedTrain?._id === t._id ? '#e3f2fd' : 'white', borderLeft: selectedTrain?._id === t._id ? '4px solid #fb792b' : '4px solid transparent' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}><span style={{ fontWeight: 'bold', fontSize: '14px', color: '#213d77' }}>{t.number}</span></div>
                                <div style={{ fontSize: '12px', color: '#666' }}>{t.name}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Panel: Interactive Map HUD */}
                <div style={{ background: '#0a0a0a', borderRadius: '12px', overflow: 'hidden', position: 'relative', border: '1px solid #333', boxShadow: '0 8px 30px rgba(0,0,0,0.4)' }}>
                    {/* Map Grid Background */}
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.3, background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))', backgroundSize: '100% 2px, 3px 100%' }}></div>

                    {selectedTrain ? (
                        <>
                            {/* Simulated Route Path (Dashed) */}
                            <svg style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none' }}>
                                <line x1="15%" y1="20%" x2="85%" y2="80%" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeDasharray="10,10" />
                                <line x1="15%" y1="20%" x2={`${15 + (status.progress * 0.7)}%`} y2={`${20 + (status.progress * 0.6)}%`} stroke="#fb792b" strokeWidth="3" opacity="0.6" />
                            </svg>

                            {/* Locomotive Pulse Marker */}
                            <div style={{
                                position: 'absolute',
                                left: `${15 + (status.progress * 0.7)}%`,
                                top: `${20 + (status.progress * 0.6)}%`,
                                transform: 'translate(-50%, -50%)',
                                zIndex: 100
                            }}>
                                <div style={{ position: 'absolute', background: 'rgba(251, 121, 43, 0.3)', width: '60px', height: '60px', borderRadius: '50%', transform: 'translate(-50%, -50%)', animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite' }}></div>
                                <style>{`@keyframes ping { 75%, 100% { transform: translate(-50%, -50%) scale(2); opacity: 0; } }`}</style>

                                <div style={{ background: '#fb792b', padding: '6px 12px', borderRadius: '4px', color: 'white', fontWeight: 'bold', fontSize: '12px', boxShadow: '0 0 15px #fb792b', display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '80px', position: 'relative', top: '-45px' }}>
                                    {selectedTrain.number}
                                    <div style={{ fontSize: '8px', opacity: 0.8 }}>{status.progress}% COMPLETE</div>
                                </div>
                                <div style={{ fontSize: '32px', filter: 'drop-shadow(0 0 5px #fb792b)' }}>🚆</div>
                            </div>

                            {/* Map HUD Overlays */}
                            <div style={{ position: 'absolute', top: '25px', left: '25px', color: '#fb792b', fontFamily: 'monospace', letterSpacing: '1px' }}>
                                <div style={{ fontSize: '11px', opacity: 0.6 }}>CURRENT DIRECTION</div>
                                <div style={{ fontSize: '20px', fontWeight: 'bold' }}>SOUTH-WEST (225°)</div>
                            </div>
                        </>
                    ) : (
                        <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#444', fontSize: '18px' }}>
                            SELECT A LOCOMOTIVE FROM THE SIDEBAR
                        </div>
                    )}
                </div>

                {/* Right Panel */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {selectedTrain && (
                        <>
                            <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #ddd', padding: '20px' }}>
                                <div style={{ fontSize: '11px', color: '#888', fontWeight: 'bold' }}>ESTIMATED POSITION</div>
                                <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#213d77', margin: '8px 0' }}>{status.current}</div>
                                <button onClick={() => setShowChart(!showChart)} style={{ marginTop: '15px', width: '100%', padding: '10px', background: '#fb792b', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                                    {showChart ? 'HIDE COACH CHART' : 'VIEW COACH CHART'}
                                </button>
                            </div>
                            <div style={{ background: 'white', border: '1px solid #ddd', borderRadius: '12px', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                                <div style={{ background: '#213d77', color: 'white', padding: '12px 15px', display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 'bold', letterSpacing: '0.5px' }}>
                                    <span style={{ width: '60px' }}>ARRIVAL</span>
                                    <span style={{ flex: 1, textAlign: 'center' }}>STATION DETAILS</span>
                                    <span style={{ width: '70px', textAlign: 'right' }}>DEPARTURE</span>
                                </div>
                                <div style={{ flex: 1, overflowY: 'auto', padding: '15px 10px', position: 'relative', background: '#fcfcfc' }}>
                                    {/* Vertical connector line - Thicker and lighter blue for accent */}
                                    <div style={{ position: 'absolute', left: '72px', top: '30px', bottom: '30px', width: '5px', background: '#bbdefb', zIndex: 0, borderRadius: '10px' }}></div>

                                    {/* Map source, route, and destination to a unified list for the timeline */}
                                    {[
                                        { station: selectedTrain.source, arrivalTime: 'Start', departureTime: '00:00', distanceFromSource: 0, isSource: true },
                                        ...selectedTrain.route,
                                        { station: selectedTrain.destination, arrivalTime: 'End', departureTime: '--', distanceFromSource: selectedTrain.route.length > 0 ? selectedTrain.route[selectedTrain.route.length - 1].distanceFromSource + 100 : 500, isDest: true }
                                    ].map((stop, i) => {
                                        const st = stop.station;
                                        const totalStops = selectedTrain.route.length + 2;
                                        const isPast = (status.progress / 100) * totalStops > i;
                                        const isCurrent = Math.floor((status.progress / 100) * (totalStops - 1)) === i;

                                        return (
                                            <div key={i} style={{ display: 'flex', marginBottom: '30px', position: 'relative', zIndex: 1, alignItems: 'flex-start' }}>
                                                {/* Arrival Time */}
                                                <div style={{ width: '60px', fontSize: '11px', fontWeight: 'bold', color: isPast || isCurrent ? '#333' : '#999', paddingTop: '2px' }}>
                                                    {stop.arrivalTime === 'Start' ? '---' : stop.arrivalTime}
                                                    {isPast && !isCurrent && <div style={{ fontSize: '9px', color: '#4caf50' }}>{stop.arrivalTime}</div>}
                                                </div>

                                                {/* Vertical Indicator Block */}
                                                <div style={{ width: '24px', display: 'flex', justifyContent: 'center', margin: '0 5px' }}>
                                                    <div style={{
                                                        width: '14px',
                                                        height: '14px',
                                                        borderRadius: '50%',
                                                        background: isCurrent ? '#fb792b' : (isPast ? '#4caf50' : '#fff'),
                                                        border: '2px solid ' + (isCurrent ? '#fb792b' : (isPast ? '#4caf50' : '#bbdefb')),
                                                        boxShadow: isCurrent ? '0 0 8px rgba(251, 121, 43, 0.6)' : 'none',
                                                        zIndex: 2,
                                                        marginTop: '2px'
                                                    }}>
                                                        {isCurrent && <div style={{ width: '6px', height: '6px', background: 'white', borderRadius: '50%', margin: '2px auto' }}></div>}
                                                    </div>
                                                </div>

                                                {/* Station Info */}
                                                <div style={{ flex: 1, paddingRight: '10px' }}>
                                                    <div style={{ fontWeight: 'bold', fontSize: '12px', color: isPast || isCurrent ? '#213d77' : '#777', lineHeight: '1.2' }}>
                                                        {st.name || st}
                                                    </div>
                                                    <div style={{ fontSize: '10px', color: '#888', marginTop: '2px', display: 'flex', gap: '8px' }}>
                                                        <span>{stop.distanceFromSource} km</span>
                                                        <span>Platform {((i + 1) % 5) + 1}</span>
                                                    </div>
                                                    {isCurrent && (
                                                        <div style={{ fontSize: '9px', background: '#fff3e0', color: '#e65100', padding: '2px 6px', borderRadius: '4px', marginTop: '4px', fontWeight: 'bold', border: '1px solid #ffe0b2', display: 'inline-block' }}>
                                                            ● CURRENTLY HERE
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Departure Time */}
                                                <div style={{ width: '60px', textAlign: 'right', fontSize: '11px', fontWeight: 'bold', color: isPast ? '#4caf50' : '#333', paddingTop: '2px' }}>
                                                    {stop.departureTime === 'End' ? '---' : stop.departureTime}
                                                    {isPast && <div style={{ fontSize: '9px', opacity: 0.6 }}>DEPARTED</div>}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Coach Chart Section - BELOW THE HUD */}
            {selectedTrain && showChart && (
                <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #ddd', padding: '30px', marginTop: '25px', marginBottom: '40px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '10px', height: '10px', background: '#4caf50', borderRadius: '50%', animation: 'pulse 1.5s infinite' }}></div>
                            <style>{`@keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }`}</style>
                            <span style={{ fontWeight: 'bold', color: '#333' }}>LIVE TRAIN COMPOSITION & VACANCY</span>
                        </div>
                        <div style={{ fontSize: '12px', background: '#e8f5e9', color: '#2e7d32', padding: '4px 12px', borderRadius: '20px', fontWeight: 'bold' }}>
                            STATUS: {status.status.toUpperCase()} @ {status.current.toUpperCase()}
                        </div>
                    </div>

                    <div style={{ maxWidth: '600px', margin: '0 auto 40px auto', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
                        <div style={{ background: '#3f51b5', color: 'white', padding: '12px', textAlign: 'center', fontWeight: 'bold' }}>First Chart Full Vacant Berth Status ❄ at {simTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} Hrs.</div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', background: '#f8f9fa' }}>
                            {['1A', '2A', '3A', 'SL'].map(cls => (
                                <div key={cls} style={{ padding: '15px', textAlign: 'center', borderRight: cls !== 'SL' ? '1px solid #eee' : 'none' }}>
                                    <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#666' }}>{cls}</div>
                                    <div style={{ fontSize: '16px', color: '#3f51b5', fontWeight: 'bold' }}>{coaches.filter(c => c.type === cls).reduce((a, b) => a + b.vacantCount, 0)}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ overflowX: 'auto', background: '#fcfcfc', padding: '30px 20px', borderRadius: '8px', border: '1px solid #f0f0f0' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', minWidth: 'max-content' }}>
                            <div style={{ marginRight: '20px', paddingTop: '45px', fontSize: '12px', fontWeight: 'bold', color: '#888' }}>
                                <div style={{ height: '40px', display: 'flex', alignItems: 'center' }}>Class</div>
                                <div style={{ height: '30px', display: 'flex', alignItems: 'center' }}>Vacant</div>
                            </div>

                            {/* Engine with Connector */}
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div style={{ background: '#ff5722', color: 'white', padding: '10px 20px', borderRadius: '6px', fontWeight: 'bold', minHeight: '40px', display: 'flex', alignItems: 'center', boxShadow: '0 4px 8px rgba(255,87,34,0.3)' }}>ENGINE</div>
                                <div style={{ width: '15px', height: '4px', background: '#888' }}></div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                {coaches.map((c, idx) => (
                                    <React.Fragment key={c.code}>
                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{ background: '#3f51b5', color: 'white', padding: '10px', borderRadius: '6px', minWidth: '60px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{c.code}</div>
                                            <div style={{ fontSize: '12px', color: '#666', marginTop: '5px', height: '20px' }}>{c.type}</div>
                                            <div style={{ fontWeight: 'bold', color: c.vacantCount > 0 ? '#4caf50' : '#f44336' }}>{c.vacantCount}</div>
                                        </div>
                                        <div style={{ width: '10px', height: '4px', background: '#888', marginTop: '-35px' }}></div>
                                    </React.Fragment>
                                ))}
                                {/* Fillers for longer train look */}
                                {[...Array(Math.max(0, 12 - coaches.length))].map((_, i) => (
                                    <React.Fragment key={`filler-${i}`}>
                                        <div style={{ textAlign: 'center', opacity: 0.6 }}>
                                            <div style={{ background: '#7986cb', color: 'white', padding: '10px', borderRadius: '6px', minWidth: '60px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>B{i + (coaches.length > 0 ? coaches.length : 1)}</div>
                                            <div style={{ fontSize: '11px', color: '#999', marginTop: '5px', height: '20px' }}>GEN</div>
                                            <div style={{ fontWeight: 'bold', color: '#bbb' }}>-</div>
                                        </div>
                                        <div style={{ width: '10px', height: '4px', background: '#ddd', marginTop: '-35px' }}></div>
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LiveTracking;
