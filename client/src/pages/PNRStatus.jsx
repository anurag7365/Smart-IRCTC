import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import TicketView from '../components/TicketView';

const PNRStatus = () => {
    const { pnr } = useParams();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPNR = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5000/api/bookings/pnr/${pnr}`);
                setBooking(data);
            } catch (err) {
                setError(err.response?.data?.message || 'PNR Not Found');
            } finally {
                setLoading(false);
            }
        };
        fetchPNR();
    }, [pnr]);

    if (loading) return <div className="container" style={{ marginTop: '20px' }}>Loading PNR Status...</div>;

    if (error) return (
        <div className="container" style={{ marginTop: '20px', textAlign: 'center' }}>
            <h2 style={{ color: 'red' }}>Error</h2>
            <p>{error}</p>
            <Link to="/" className="btn btn-primary">Go Home</Link>
        </div>
    );

    const getLiveStatus = () => {
        if (!booking || booking.status === 'Cancelled') return null;

        const now = new Date();
        const jDate = new Date(booking.journeyDate);

        // Find source and destination timings in route
        const route = booking.train.route;
        const sourceStop = route.find(r => r.station._id === booking.source._id || r.station === booking.source._id);
        const destStop = route.find(r => r.station._id === booking.destination._id || r.station === booking.destination._id);

        if (!sourceStop || !destStop) return { current: 'Not Available', next: '--', progress: 0, delay: 0 };

        // Parse time like "10:30" into a date object relative to journeyDate
        const parseTimeToDate = (timeStr, baseDate) => {
            const [hrs, mins] = timeStr.split(':').map(Number);
            const d = new Date(baseDate);
            d.setHours(hrs, mins, 0, 0);
            return d;
        };

        const depTime = parseTimeToDate(sourceStop.departureTime || "08:00", jDate);
        const arrTime = parseTimeToDate(destStop.arrivalTime || "22:00", jDate);

        // Simulation parameters
        if (now < depTime) {
            return {
                status: 'Not Started',
                current: booking.source.name,
                next: route[1]?.station.name || '--',
                platform: Math.floor(Math.random() * 5) + 1,
                progress: 0,
                delay: 0
            };
        }

        if (now > arrTime) {
            return {
                status: 'Reached',
                current: booking.destination.name,
                next: '--',
                platform: Math.floor(Math.random() * 10) + 1,
                progress: 100,
                delay: Math.floor(Math.random() * 10)
            };
        }

        // Calculate progress between source and destination
        const totalDuration = arrTime - depTime;
        const elapsed = now - depTime;
        const progress = Math.min(Math.round((elapsed / totalDuration) * 100), 99);

        // Find "Current Station" based on route progress
        const segmentProgress = 100 / (route.length - 1);
        const currentIndex = Math.min(Math.floor(progress / segmentProgress), route.length - 1);
        const currentSt = route[currentIndex];
        const nextSt = route[currentIndex + 1];

        return {
            status: 'Running',
            current: currentSt.station.name || currentSt.station,
            next: nextSt?.station.name || nextSt?.station || '--',
            platform: Math.floor(Math.random() * 8) + 1,
            progress: progress,
            delay: Math.floor(Math.random() * 15)
        };
    };

    const live = getLiveStatus();

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', flexDirection: 'column', gap: '20px' }}>
            <div className="spinner" style={{ width: '50px', height: '50px', border: '5px solid #f3f3f3', borderTop: '5px solid #fb792b', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            <div style={{ color: '#213d77', fontWeight: 'bold' }}>Fetching Live Satellite Data...</div>
        </div>
    );

    if (error) return (
        <div className="container" style={{ marginTop: '50px', textAlign: 'center' }}>
            <div style={{ fontSize: '50px', marginBottom: '20px' }}>⚠️</div>
            <h2 style={{ color: '#d32f2f' }}>PNR Not Found</h2>
            <p style={{ color: '#666', marginBottom: '30px' }}>The PNR number you entered is invalid or has expired.</p>
            <Link to="/" className="irctc-btn btn-blue">Back to Home</Link>
        </div>
    );

    return (
        <div className="container" style={{ marginTop: '30px', maxWidth: '1000px', paddingBottom: '50px' }}>
            {/* Page Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '2px solid #eee', paddingBottom: '15px' }}>
                <div>
                    <h2 style={{ margin: 0, color: '#213d77' }}>Passenger Current Status</h2>
                    <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>PNR: <span style={{ fontWeight: 'bold', color: '#fb792b' }}>{pnr}</span></p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '12px', color: '#888' }}>Last Updated</div>
                    <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{new Date().toLocaleTimeString()}</div>
                </div>
            </div>

            {booking.status === 'Cancelled' ? (
                <div style={{ background: '#ffebee', border: '1px solid #ffcdd2', padding: '30px', borderRadius: '8px', textAlign: 'center', marginBottom: '30px' }}>
                    <h2 style={{ color: '#c62828', margin: 0 }}>🚫 This Booking is CANCELLED</h2>
                    <p style={{ color: '#b71c1c' }}>Refund of ₹{(booking.totalAmount * 0.8).toFixed(2)} processed to your original payment method.</p>
                </div>
            ) : (
                <>
                    {/* Live Status Card - Premium Design */}
                    <div style={{ background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)', color: 'white', padding: '25px', borderRadius: '12px', marginBottom: '30px', boxShadow: '0 8px 16px rgba(0,0,0,0.2)', position: 'relative', overflow: 'hidden' }}>
                        {/* Decorative background element */}
                        <div style={{ position: 'absolute', right: '-50px', top: '-50px', width: '200px', height: '200px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }}></div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ background: '#fff', color: '#1a237e', width: '35px', height: '35px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🚆</div>
                                <div>
                                    <div style={{ fontSize: '12px', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '1px' }}>Current Live Status</div>
                                    <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{live.current}</div>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '12px', opacity: 0.8 }}>Delay Status</div>
                                <div style={{ color: live.delay === 0 ? '#4caf50' : '#ffeb3b', fontWeight: 'bold', fontSize: '18px' }}>
                                    {live.delay === 0 ? 'ON TIME' : `${live.delay} MIN DELAY`}
                                </div>
                            </div>
                        </div>

                        {/* Progress Tracker */}
                        <div style={{ margin: '30px 0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px', opacity: 0.9 }}>
                                <span>{booking.source.code}</span>
                                <span>{live.progress}% Complete</span>
                                <span>{booking.destination.code}</span>
                            </div>
                            <div style={{ height: '8px', background: 'rgba(255,255,255,0.2)', borderRadius: '4px', position: 'relative' }}>
                                <div style={{ height: '100%', width: `${live.progress}%`, background: '#fb792b', borderRadius: '4px', transition: 'width 1s ease-in-out', boxShadow: '0 0 10px #fb792b' }}></div>
                                <div style={{ position: 'absolute', left: `${live.progress}%`, top: '50%', transform: 'translate(-50%, -50%)', width: '16px', height: '16px', background: 'white', borderRadius: '50%', border: '3px solid #fb792b', zIndex: 2 }}></div>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', background: 'rgba(255,255,255,0.1)', padding: '15px', borderRadius: '8px' }}>
                            <div>
                                <div style={{ fontSize: '11px', opacity: 0.8 }}>Next Station</div>
                                <div style={{ fontWeight: 'bold' }}>{live.next}</div>
                            </div>
                            <div style={{ borderLeft: '1px solid rgba(255,255,255,0.2)', paddingLeft: '15px' }}>
                                <div style={{ fontSize: '11px', opacity: 0.8 }}>Platform #</div>
                                <div style={{ fontWeight: 'bold' }}>PF {live.platform}</div>
                            </div>
                            <div style={{ borderLeft: '1px solid rgba(255,255,255,0.2)', paddingLeft: '15px' }}>
                                <div style={{ fontSize: '11px', opacity: 0.8 }}>Coach Position</div>
                                <div style={{ fontWeight: 'bold' }}>{booking.passengers[0]?.coach || 'B2'} (Front)</div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Ticket Slip */}
            <div style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderRadius: '8px', overflow: 'hidden' }}>
                <TicketView booking={booking} />
            </div>
        </div>
    );
};

export default PNRStatus;
