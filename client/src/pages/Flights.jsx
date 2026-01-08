const Flights = () => {
    const popularFlights = [
        { from: 'Delhi', to: 'Mumbai', airline: 'Air India', price: 4500, duration: '2h 15m' },
        { from: 'Bangalore', to: 'Chennai', airline: 'IndiGo', price: 3200, duration: '1h 00m' },
        { from: 'Mumbai', to: 'Goa', airline: 'SpiceJet', price: 2800, duration: '1h 10m' },
        { from: 'Delhi', to: 'Kolkata', airline: 'Vistara', price: 5100, duration: '2h 30m' }
    ];

    return (
        <div className="container" style={{ padding: '40px 0' }}>
            <h1 style={{ color: '#213d77', borderBottom: '3px solid #fb792b', display: 'inline-block', paddingBottom: '10px', marginBottom: '30px' }}>
                Flight Booking
            </h1>

            <div className="card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', marginBottom: '30px' }}>
                <h2>Book Flights at Best Prices</h2>
                <p style={{ opacity: 0.9, marginBottom: '25px' }}>Search from 500+ destinations across India and worldwide</p>

                <div style={{ background: 'white', padding: '25px', borderRadius: '8px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: '15px' }}>
                        <input type="text" placeholder="From" className="irctc-input" />
                        <input type="text" placeholder="To" className="irctc-input" />
                        <input type="date" className="irctc-input" />
                        <input type="number" placeholder="Passengers" className="irctc-input" defaultValue="1" min="1" />
                        <button className="irctc-btn btn-orange" style={{ padding: '0 30px', whiteSpace: 'nowrap' }}>Search Flights</button>
                    </div>
                </div>
            </div>

            <h2 style={{ color: '#213d77', marginBottom: '20px' }}>Popular Domestic Routes</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '40px' }}>
                {popularFlights.map((flight, idx) => (
                    <div key={idx} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h3 style={{ margin: 0 }}>{flight.from} → {flight.to}</h3>
                            <p style={{ color: '#666', margin: '5px 0' }}>{flight.airline} • {flight.duration}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fb792b' }}>₹{flight.price}</div>
                            <button className="irctc-btn btn-blue" style={{ marginTop: '10px', fontSize: '13px' }}>Book Now</button>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                <div className="card" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '48px', marginBottom: '15px' }}>✈️</div>
                    <h3 style={{ color: '#213d77' }}>Multiple Airlines</h3>
                    <p style={{ color: '#666', fontSize: '14px' }}>Compare prices from all major airlines</p>
                </div>
                <div className="card" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '48px', marginBottom: '15px' }}>💳</div>
                    <h3 style={{ color: '#213d77' }}>Instant Booking</h3>
                    <p style={{ color: '#666', fontSize: '14px' }}>Get confirmed tickets in seconds</p>
                </div>
                <div className="card" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '48px', marginBottom: '15px' }}>🎁</div>
                    <h3 style={{ color: '#213d77' }}>Best Offers</h3>
                    <p style={{ color: '#666', fontSize: '14px' }}>Exclusive deals and cashback offers</p>
                </div>
            </div>
        </div>
    );
};

export default Flights;
