import { useLocation, Link } from 'react-router-dom';
import TicketView from '../components/TicketView';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const BookingSuccess = () => {
    const { state } = useLocation();
    const { user } = useContext(AuthContext);

    if (!state || !state.booking) {
        return <div className="container" style={{ marginTop: '50px', center: 'center' }}>No booking information found.</div>;
    }

    const { booking } = state;

    return (
        <div className="container" style={{ marginTop: '40px' }}>
            <div className="no-print" style={{ textAlign: 'center', marginBottom: '30px' }}>
                <img src="https://pnghdpro.com/wp-content/themes/pnghdpro/download/social-media-and-brands/indian-railways-logo.png" alt="IRCTC" style={{ height: '80px', marginBottom: '20px' }} />
                <div style={{ width: '60px', height: '60px', background: '#4caf50', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px', margin: '0 auto 10px auto' }}>✓</div>
                <h2 style={{ color: '#213d77', fontSize: '28px' }}>Booking Confirmation</h2>
                <p style={{ color: '#666' }}>Your ticket has been successfully booked. An email has been sent to {user?.email}.</p>
            </div>

            <TicketView booking={booking} />

            <div style={{ textAlign: 'center', marginTop: '40px', paddingBottom: '40px', display: 'flex', gap: '20px', justifyContent: 'center' }}>
                <button onClick={() => window.print()} className="irctc-btn" style={{ background: '#666', color: 'white' }}>Print Ticket</button>
                <Link to="/" className="irctc-btn btn-blue" style={{ padding: '12px 30px', fontSize: '15px' }}>Book Another Ticket</Link>
            </div>
        </div>
    );
};

export default BookingSuccess;
