import { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const Payment = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);

    if (!state || !state.bookingData) {
        return <div className="container" style={{ marginTop: '50px', textAlign: 'center' }}>Invalid Payment Session</div>;
    }

    if (!user || !user.token) {
        return <div className="container" style={{ marginTop: '50px', textAlign: 'center' }}>
            <h3>Authentication Required</h3>
            <p>Please log in again to complete your booking.</p>
            <button onClick={() => navigate('/login')} className="irctc-btn btn-blue">Go to Login</button>
        </div>;
    }

    const { bookingData } = state;

    const handlePayment = async () => {
        setIsLoading(true);
        try {
            const token = user.token;
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            };

            // Simulate Network Delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            const { data } = await axios.post('http://localhost:5000/api/bookings', bookingData, config);

            // Navigate to Success Page with Booking Data
            navigate('/booking-success', { state: { booking: data } });

        } catch (error) {
            console.error('Payment Error:', error);
            const message = error.response?.data?.message || 'Payment Failed';
            alert(message);
            if (message.includes('Not authorized') || message.includes('token')) {
                // If auth failed, might need to re-login
                // Suggest logout or redirect to login
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ background: '#f5f5f5', minHeight: '100vh', padding: '50px 0' }}>
            <div className="container" style={{ maxWidth: '600px', background: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                <h2 style={{ color: '#213d77', textAlign: 'center', marginBottom: '30px' }}>Payment Gateway</h2>

                <div style={{ marginBottom: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '5px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <span style={{ color: '#666' }}>Amount to Pay:</span>
                        <span style={{ fontSize: '20px', fontWeight: 'bold' }}>₹ {bookingData.totalAmount.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#666' }}>Transaction ID:</span>
                        <span style={{ fontWeight: '500' }}>TXN{Math.floor(Math.random() * 1000000000)}</span>
                    </div>
                </div>

                <div style={{ marginBottom: '30px' }}>
                    <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>Select Payment Method:</p>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <div style={{ flex: 1, padding: '15px', border: '2px solid #fb792b', borderRadius: '5px', textAlign: 'center', color: '#fb792b', fontWeight: 'bold', background: '#fff0e5' }}>
                            UPI / QMarl
                        </div>
                        <div style={{ flex: 1, padding: '15px', border: '1px solid #ddd', borderRadius: '5px', textAlign: 'center', color: '#666' }}>
                            Card
                        </div>
                        <div style={{ flex: 1, padding: '15px', border: '1px solid #ddd', borderRadius: '5px', textAlign: 'center', color: '#666' }}>
                            Net Banking
                        </div>
                    </div>
                </div>

                <button
                    onClick={handlePayment}
                    disabled={isLoading}
                    style={{
                        width: '100%',
                        padding: '15px',
                        background: isLoading ? '#ccc' : '#4caf50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        cursor: isLoading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {isLoading ? 'Processing Payment...' : `Pay ₹ ${bookingData.totalAmount.toFixed(2)}`}
                </button>
            </div>
        </div>
    );
};

export default Payment;
