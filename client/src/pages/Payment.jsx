import { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import './Payment.css';

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

            // Simulate Network Delay (Express)
            await new Promise(resolve => setTimeout(resolve, 1000));

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

    // State for Tabs
    const [activeTab, setActiveTab] = useState('ipay'); // ipay, multiple, netbanking, gateway, upi

    return (
        <div className="payment-page-container">
            {/* Header */}
            <div className="payment-header">
                <div className="container">
                    <h2>Payment Details</h2>
                </div>
            </div>

            <div className="container payment-grid">
                {/* 1. Payment Methods Sidebar */}
                <div className="payment-methods-card">
                    <div className="method-header">Payment Methods</div>
                    <div className={`method-item ${activeTab === 'ipay' ? 'active' : ''}`} onClick={() => setActiveTab('ipay')}>IRCTC iPay</div>
                    <div className={`method-item ${activeTab === 'multiple' ? 'active' : ''}`} onClick={() => setActiveTab('multiple')}>Multiple Payment Service</div>
                    <div className={`method-item ${activeTab === 'netbanking' ? 'active' : ''}`} onClick={() => setActiveTab('netbanking')}>Net Banking</div>
                    <div className={`method-item ${activeTab === 'gateway' ? 'active' : ''}`} onClick={() => setActiveTab('gateway')}>Payment Gateway / Credit / Debit</div>
                    <div className={`method-item ${activeTab === 'upi' ? 'active' : ''}`} onClick={() => setActiveTab('upi')}>UPI</div>
                </div>

                {/* 2. Main Content Area */}
                <div className="payment-content-card">
                    <div className="sub-header">
                        {activeTab === 'ipay' && 'IRCTC iPay (Credit/Debit Card | Net Banking | UPI)'}
                        {activeTab === 'multiple' && 'Multiple Payment Services'}
                        {activeTab === 'netbanking' && 'Internet Banking'}
                        {activeTab === 'gateway' && 'Payment Gateway / Credit / Debit'}
                        {activeTab === 'upi' && 'Bhim / UPI / USSD'}
                    </div>

                    {/* Dynamic Content based on Tab */}
                    {activeTab === 'ipay' && (
                        <div>
                            <div className="payment-option-box">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <input type="radio" checked readOnly style={{ width: '20px', height: '20px', accentColor: '#fb792b' }} />
                                    <span style={{ fontWeight: 'bold', color: '#333' }}>Credit/Debit Card | Net Banking | UPI</span>
                                </div>
                                <div className="gateway-logos" style={{ display: 'flex', alignItems: 'center' }}>
                                    <span style={{ fontSize: '12px', color: '#666', marginRight: '5px' }}>Powered by</span>
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" />
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" />
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/c/cb/Rupay-Logo.png" alt="RuPay" />
                                </div>
                            </div>

                            {/* Dummy Card Inputs for show */}
                            <div style={{ background: '#fafafa', padding: '20px', border: '1px solid #eee', borderRadius: '4px', marginTop: '10px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                                    <input type="text" placeholder="Card Number" style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} />
                                    <input type="text" placeholder="Name on Card" style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} />
                                </div>
                                <div style={{ display: 'flex', gap: '15px' }}>
                                    <input type="text" placeholder="Expiry (MM/YY)" style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '120px' }} />
                                    <input type="password" placeholder="CVV" style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '80px' }} />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'netbanking' && (
                        <div style={{ color: '#666', marginBottom: '20px' }}>Select your bank from the list to proceed securely.</div>
                    )}

                    {activeTab === 'upi' && (
                        <div style={{ textAlign: 'center', padding: '20px' }}>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" style={{ height: '40px', marginBottom: '10px' }} alt="UPI" />
                            <p>Enter your VPA or Scan QR code on next screen.</p>
                        </div>
                    )}

                    <button
                        onClick={handlePayment}
                        disabled={isLoading}
                        className="pay-btn-large"
                    >
                        {isLoading ? 'Processing...' : 'Pay & Book'}
                    </button>
                    <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '12px', color: '#999' }}>
                        By clicking "Pay & Book" you agree to our Terms & Conditions.
                    </div>
                </div>

                {/* 3. Transaction Summary */}
                <div className="summary-card">
                    <div className="summary-header">Transaction Summary</div>
                    <div className="summary-row">
                        <span>Ticket Fare</span>
                        <span>₹ {bookingData.totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="summary-row">
                        <span>IRCTC Convenience Fee</span>
                        <span>₹ 11.80</span>
                    </div>
                    <div className="summary-row">
                        <span>Travel Insurance</span>
                        <span>₹ 0.00</span>
                    </div>

                    <div className="total-row">
                        <span>Total Amount</span>
                        <span>₹ {(bookingData.totalAmount + 11.80).toFixed(2)}</span>
                    </div>

                    <div style={{ marginTop: '20px', fontSize: '11px', color: '#666', background: '#ffebee', padding: '10px', borderRadius: '4px' }}>
                        <strong>Note:</strong> Transaction failure is rare but possible. Do not press back or refresh while processing.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payment;
