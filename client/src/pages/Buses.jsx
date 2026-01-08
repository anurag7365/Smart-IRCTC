const Buses = () => {
    const routes = [
        { from: 'Delhi', to: 'Jaipur', duration: '5h 30m', price: 450, operator: 'IRCTC Express' },
        { from: 'Mumbai', to: 'Pune', duration: '3h 45m', price: 380, operator: 'IRCTC Sleeper' },
        { from: 'Bangalore', to: 'Chennai', duration: '7h 00m', price: 650, operator: 'IRCTC Volvo' },
        { from: 'Kolkata', to: 'Patna', duration: '9h 15m', price: 720, operator: 'IRCTC AC' }
    ];

    return (
        <div className="container" style={{ padding: '40px 0' }}>
            <h1 style={{ color: '#213d77', borderBottom: '3px solid #fb792b', display: 'inline-block', paddingBottom: '10px', marginBottom: '30px' }}>
                Bus Booking
            </h1>

            <div className="card" style={{ marginBottom: '30px' }}>
                <h3 style={{ color: '#213d77', marginBottom: '20px' }}>Search Buses</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '15px' }}>
                    <input type="text" placeholder="From" className="irctc-input" />
                    <input type="text" placeholder="To" className="irctc-input" />
                    <input type="date" className="irctc-input" />
                    <button className="irctc-btn btn-orange" style={{ padding: '0 30px' }}>Search</button>
                </div>
            </div>

            <h2 style={{ color: '#213d77', marginBottom: '20px' }}>Popular Routes</h2>
            <div style={{ display: 'grid', gap: '20px' }}>
                {routes.map((route, idx) => (
                    <div key={idx} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px' }}>
                        <div style={{ flex: 1 }}>
                            <h3 style={{ margin: 0, color: '#333' }}>{route.from} → {route.to}</h3>
                            <p style={{ color: '#666', margin: '5px 0' }}>{route.operator}</p>
                        </div>
                        <div style={{ textAlign: 'center', padding: '0 30px' }}>
                            <div style={{ fontSize: '14px', color: '#666' }}>Duration</div>
                            <div style={{ fontWeight: 'bold', color: '#213d77' }}>{route.duration}</div>
                        </div>
                        <div style={{ textAlign: 'center', padding: '0 30px' }}>
                            <div style={{ fontSize: '14px', color: '#666' }}>Starting from</div>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fb792b' }}>₹{route.price}</div>
                        </div>
                        <button className="irctc-btn btn-blue">View Buses</button>
                    </div>
                ))}
            </div>

            <div className="card" style={{ marginTop: '40px', background: '#f8f9fa' }}>
                <h3 style={{ color: '#213d77', marginBottom: '15px' }}>Why Book Buses with IRCTC?</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', textAlign: 'center' }}>
                    <div>
                        <div style={{ fontSize: '36px', marginBottom: '10px' }}>🚌</div>
                        <div style={{ fontWeight: 'bold' }}>Wide Network</div>
                        <div style={{ fontSize: '13px', color: '#666' }}>500+ routes</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '36px', marginBottom: '10px' }}>💺</div>
                        <div style={{ fontWeight: 'bold' }}>Comfortable</div>
                        <div style={{ fontSize: '13px', color: '#666' }}>AC & Sleeper</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '36px', marginBottom: '10px' }}>🎫</div>
                        <div style={{ fontWeight: 'bold' }}>Easy Booking</div>
                        <div style={{ fontSize: '13px', color: '#666' }}>Quick & simple</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '36px', marginBottom: '10px' }}>💯</div>
                        <div style={{ fontWeight: 'bold' }}>Trusted</div>
                        <div style={{ fontSize: '13px', color: '#666' }}>IRCTC certified</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Buses;
