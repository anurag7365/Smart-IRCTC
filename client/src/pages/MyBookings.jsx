import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const MyBookings = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('upcoming'); // Moved Hook to top

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` }
                };
                const { data } = await axios.get('http://localhost:5000/api/bookings/mybookings', config);
                setBookings(data);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchBookings();
    }, [user]);

    const handleCancel = async (bookingId) => {
        if (!window.confirm("Are you sure you want to cancel this ticket?")) return;
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`http://localhost:5000/api/bookings/${bookingId}/cancel`, {}, config);
            alert("Booking Cancelled Successfully");
            // Refresh list
            const { data } = await axios.get('http://localhost:5000/api/bookings/mybookings', config);
            setBookings(data);
        } catch (error) {
            console.error(error);
            alert("Cancellation Failed");
        }
    };

    if (loading) return <div className="container" style={{ marginTop: '20px' }}>Loading Bookings...</div>;



    const filteredBookings = bookings.filter(b => {
        const bookingDate = new Date(b.journeyDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (activeTab === 'cancelled') return b.status === 'Cancelled';
        if (activeTab === 'upcoming') {
            return b.status !== 'Cancelled' && bookingDate >= today;
        }
        if (activeTab === 'completed') {
            return b.status !== 'Cancelled' && bookingDate < today;
        }
        return true;
    });

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', flexDirection: 'column', gap: '20px' }}>
            <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #213d77', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            <div style={{ color: '#666' }}>Fetching your journey history...</div>
        </div>
    );

    return (
        <div className="container" style={{ paddingBottom: '50px' }}>
            {/* Header Section */}
            <div style={{ background: 'white', padding: '20px 0', borderBottom: '1px solid #eee', marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ margin: 0, color: '#213d77', fontSize: '28px' }}>My Bookings</h2>
                    <p style={{ margin: '5px 0 0 0', color: '#666' }}>Manage your train journeys and electronic tickets</p>
                </div>
                <Link to="/" className="irctc-btn btn-orange" style={{ textTransform: 'none', borderRadius: '25px' }}>+ Book New Ticket</Link>
            </div>

            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', borderBottom: '1px solid #ddd' }}>
                {['upcoming', 'completed', 'cancelled'].map(tab => (
                    <div
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            padding: '12px 20px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            color: activeTab === tab ? '#213d77' : '#888',
                            borderBottom: activeTab === tab ? '3px solid #fb792b' : '3px solid transparent',
                            textTransform: 'uppercase',
                            fontSize: '13px',
                            transition: 'all 0.3s'
                        }}
                    >
                        {tab === 'upcoming' ? 'Upcoming Journey' : tab === 'completed' ? 'Past Journeys' : 'Cancelled Tickets'}
                    </div>
                ))}
            </div>

            {filteredBookings.length === 0 ? (
                <div style={{ padding: '40px', borderRadius: '12px', textAlign: 'center' }}>
                    <div style={{ background: '#f9f9f9', padding: '40px', borderRadius: '12px', border: '1px dashed #ccc', display: 'inline-block', maxWidth: '600px', width: '100%' }}>
                        <div style={{ fontSize: '50px', marginBottom: '20px' }}>🎫</div>
                        <h3 style={{ color: '#213d77', marginBottom: '10px' }}>No {activeTab} bookings found</h3>
                        <p style={{ color: '#666', marginBottom: '30px' }}>Looks like you haven't planned any trips in this category yet.</p>
                        <div style={{ marginTop: '20px' }}>
                            <button onClick={() => navigate('/')} className="irctc-btn btn-blue">Go to Home</button>
                        </div>
                    </div>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '25px' }}>
                    {filteredBookings.map(booking => (
                        <div
                            key={booking._id}
                            style={{
                                background: 'white',
                                border: '1px solid #e0e0e0',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            {/* Card Top: Train Info & Status */}
                            <div style={{ padding: '20px', background: '#f8fafd', borderBottom: '1px dashed #ccc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <div style={{ background: '#213d77', color: 'white', padding: '10px', borderRadius: '8px', textAlign: 'center', minWidth: '70px' }}>
                                        <div style={{ fontSize: '10px', opacity: 0.8 }}>TR NO</div>
                                        <div style={{ fontWeight: 'bold' }}>{booking.train.number}</div>
                                    </div>
                                    <div>
                                        <h3 style={{ margin: 0, color: '#213d77' }}>{booking.train.name}</h3>
                                        <div style={{ fontSize: '12px', color: '#666', marginTop: '3px' }}>
                                            PNR: <span style={{ fontWeight: 'bold', color: '#fb792b' }}>{booking.pnr}</span> | Quota: GENERAL
                                        </div>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{
                                        padding: '5px 15px',
                                        borderRadius: '20px',
                                        fontSize: '11px',
                                        fontWeight: 'bold',
                                        color: booking.status === 'Cancelled' ? '#d32f2f' : '#2e7d32',
                                        background: booking.status === 'Cancelled' ? '#ffebee' : '#e8f5e9',
                                        textTransform: 'uppercase'
                                    }}>
                                        {booking.status}
                                    </div>
                                    <div style={{ marginTop: '8px', fontSize: '13px', fontWeight: 'bold' }}>
                                        {new Date(booking.journeyDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </div>
                                </div>
                            </div>

                            {/* Card Middle: Route Visualization */}
                            <div style={{ padding: '25px 20px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <div style={{ textAlign: 'left', minWidth: '100px' }}>
                                    <div style={{ color: '#213d77', fontWeight: 'bold', fontSize: '18px' }}>{booking.source.code}</div>
                                    <div style={{ fontSize: '12px', color: '#666' }}>{booking.source.name}</div>
                                    <div style={{ fontSize: '14px', fontWeight: 'bold', marginTop: '5px' }}>{booking.train.route.find(r => (r.station._id || r.station) === booking.source._id)?.departureTime || '06:00'}</div>
                                </div>
                                <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <div style={{ height: '2px', background: '#ddd', width: '100%', position: 'absolute' }}></div>
                                    <div style={{ background: 'white', padding: '0 10px', zIndex: 1, fontSize: '12px', color: '#999' }}>
                                        {booking.classType}
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right', minWidth: '100px' }}>
                                    <div style={{ color: '#213d77', fontWeight: 'bold', fontSize: '18px' }}>{booking.destination.code}</div>
                                    <div style={{ fontSize: '12px', color: '#666' }}>{booking.destination.name}</div>
                                    <div style={{ fontSize: '14px', fontWeight: 'bold', marginTop: '5px' }}>{booking.train.route.find(r => (r.station._id || r.station) === booking.destination._id)?.arrivalTime || '14:30'}</div>
                                </div>
                            </div>

                            {/* Card Bottom: Actions & Summary */}
                            <div style={{ padding: '15px 20px', background: '#fafafa', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f0f0f0' }}>
                                <div style={{ fontSize: '13px', color: '#555' }}>
                                    <strong>{booking.passengers.length}</strong> Passenger{booking.passengers.length > 1 ? 's' : ''} | Total: <strong>₹ {booking.totalAmount.toFixed(2)}</strong>
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <Link
                                        to={`/pnr/${booking.pnr}`}
                                        className="irctc-btn btn-blue"
                                        style={{ fontSize: '12px', padding: '8px 15px', textTransform: 'none', borderRadius: '4px' }}
                                    >
                                        View Ticket / Status
                                    </Link>
                                    <button
                                        onClick={() => {
                                            const printContent = `
                                                <html>
                                                <head><title>Print Ticket</title></head>
                                                <body style="font-family: Arial, sans-serif; padding: 20px;">
                                                    <div style="border: 1px solid #ccc; padding: 20px; max-width: 600px; margin: 0 auto;">
                                                        <h2 style="color: #213d77; text-align: center;">Smart IRCTC E-Ticket</h2>
                                                        <hr/>
                                                        <p><strong>PNR:</strong> ${booking.pnr}</p>
                                                        <p><strong>Train:</strong> ${booking.train.name} (${booking.train.number})</p>
                                                        <p><strong>Date:</strong> ${new Date(booking.journeyDate).toLocaleDateString()}</p>
                                                        <p><strong>From:</strong> ${booking.source.name} (${booking.source.code})</p>
                                                        <p><strong>To:</strong> ${booking.destination.name} (${booking.destination.code})</p>
                                                        <div style="margin-top: 20px;">
                                                            <strong>Passengers:</strong>
                                                            <ul>
                                                                ${booking.passengers.map(p => `<li>${p.name} - ${p.age}/${p.gender} - ${p.status} ${p.seatNumber ? `(${p.coachCode}/${p.seatNumber})` : ''}</li>`).join('')}
                                                            </ul>
                                                        </div>
                                                        <p style="text-align: right; margin-top: 20px;"><strong>Total Amount: ₹ ${booking.totalAmount}</strong></p>
                                                    </div>
                                                    <script>window.print();</script>
                                                </body>
                                                </html>
                                            `;
                                            const printWindow = window.open('', '', 'height=600,width=800');
                                            printWindow.document.write(printContent);
                                            printWindow.document.close();
                                        }}
                                        className="irctc-btn"
                                        style={{ fontSize: '12px', padding: '8px 15px', textTransform: 'none', borderRadius: '4px', background: '#4caf50', color: 'white', border: 'none' }}
                                    >
                                        Print E-Ticket
                                    </button>
                                    {booking.status !== 'Cancelled' && activeTab === 'upcoming' && (
                                        <button
                                            onClick={() => handleCancel(booking._id)}
                                            style={{ background: 'white', color: '#d32f2f', border: '1px solid #d32f2f', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                                        >
                                            Cancel Ticket
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBookings;
