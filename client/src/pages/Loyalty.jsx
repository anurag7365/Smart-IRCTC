import { Link } from 'react-router-dom';

const Loyalty = () => {
    return (
        <div className="container" style={{ padding: '40px 0' }}>
            <h1 style={{ color: '#213d77', borderBottom: '3px solid #fb792b', display: 'inline-block', paddingBottom: '10px', marginBottom: '30px' }}>
                IRCTC Loyalty Program
            </h1>

            <div className="card" style={{ marginBottom: '30px' }}>
                <h2 style={{ color: '#fb792b' }}>Earn Points, Save Money</h2>
                <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#555' }}>
                    Join the IRCTC Loyalty Program and earn points on every booking. Redeem your points for discounts on future train tickets, meals, and more!
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                <div className="card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                    <h3>🎁 Welcome Bonus</h3>
                    <p>Get 500 bonus points on signup!</p>
                    <h2 style={{ margin: '10px 0', fontSize: '36px' }}>500 Points</h2>
                </div>

                <div className="card" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
                    <h3>💳 Per Booking</h3>
                    <p>Earn 10 points for every ₹100 spent</p>
                    <h2 style={{ margin: '10px 0', fontSize: '36px' }}>10%</h2>
                </div>

                <div className="card" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
                    <h3>🎯 Redeem</h3>
                    <p>100 points = ₹10 discount</p>
                    <h2 style={{ margin: '10px 0', fontSize: '36px' }}>1:10</h2>
                </div>
            </div>

            <div className="card">
                <h3 style={{ color: '#213d77', marginBottom: '20px' }}>How It Works</h3>
                <ol style={{ fontSize: '16px', lineHeight: '2', color: '#555' }}>
                    <li><strong>Sign Up:</strong> Create your IRCTC account and get instant welcome bonus</li>
                    <li><strong>Book & Earn:</strong> Earn points on every train ticket, hotel, and meal booking</li>
                    <li><strong>Track Points:</strong> View your points balance in your account dashboard</li>
                    <li><strong>Redeem:</strong> Use your points for discounts on future bookings</li>
                </ol>
            </div>

            <div style={{ textAlign: 'center', marginTop: '40px' }}>
                <Link to="/register" className="irctc-btn btn-orange" style={{ padding: '15px 40px', fontSize: '18px' }}>
                    Join Loyalty Program
                </Link>
            </div>
        </div>
    );
};

export default Loyalty;
