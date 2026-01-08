const Hotels = () => {
    const hotels = [
        { name: 'Taj Palace, Delhi', location: 'New Delhi', rating: 4.8, price: 6500, image: '🏨', amenities: ['WiFi', 'Pool', 'Spa'] },
        { name: 'The Oberoi, Mumbai', location: 'Mumbai', rating: 4.9, price: 8200, image: '🏨', amenities: ['WiFi', 'Gym', 'Restaurant'] },
        { name: 'ITC Grand, Bangalore', location: 'Bangalore', rating: 4.7, price: 5800, image: '🏨', amenities: ['WiFi', 'Pool', 'Bar'] },
        { name: 'Radisson Blu, Chennai', location: 'Chennai', rating: 4.6, price: 4900, image: '🏨', amenities: ['WiFi', 'Gym', 'Parking'] }
    ];

    return (
        <div className="container" style={{ padding: '40px 0' }}>
            <h1 style={{ color: '#213d77', borderBottom: '3px solid #fb792b', display: 'inline-block', paddingBottom: '10px', marginBottom: '30px' }}>
                Hotel Booking
            </h1>

            <div className="card" style={{ marginBottom: '30px' }}>
                <h3 style={{ color: '#213d77', marginBottom: '20px' }}>Find Your Perfect Stay</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '15px' }}>
                    <input type="text" placeholder="City, Hotel Name" className="irctc-input" />
                    <input type="date" placeholder="Check-in" className="irctc-input" />
                    <input type="date" placeholder="Check-out" className="irctc-input" />
                    <button className="irctc-btn btn-orange" style={{ padding: '0 30px' }}>Search</button>
                </div>
            </div>

            <h2 style={{ color: '#213d77', marginBottom: '20px' }}>Featured Hotels</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '25px', marginBottom: '40px' }}>
                {hotels.map((hotel, idx) => (
                    <div key={idx} className="card" style={{ overflow: 'hidden' }}>
                        <div style={{ fontSize: '80px', textAlign: 'center', background: '#f5f5f5', padding: '30px' }}>
                            {hotel.image}
                        </div>
                        <div style={{ padding: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                                <div>
                                    <h3 style={{ margin: 0, color: '#213d77' }}>{hotel.name}</h3>
                                    <p style={{ color: '#666', margin: '5px 0' }}>📍 {hotel.location}</p>
                                </div>
                                <div style={{ background: '#4caf50', color: 'white', padding: '5px 10px', borderRadius: '4px', fontWeight: 'bold' }}>
                                    ⭐ {hotel.rating}
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap' }}>
                                {hotel.amenities.map((amenity, i) => (
                                    <span key={i} style={{ background: '#e3f2fd', color: '#1976d2', padding: '4px 10px', borderRadius: '4px', fontSize: '12px' }}>
                                        {amenity}
                                    </span>
                                ))}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                                <div>
                                    <div style={{ fontSize: '13px', color: '#666' }}>Starting from</div>
                                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#fb792b' }}>₹{hotel.price}</div>
                                    <div style={{ fontSize: '12px', color: '#999' }}>per night</div>
                                </div>
                                <button className="irctc-btn btn-blue">Book Now</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="card" style={{ background: '#fff3e0', border: '2px solid #ff9800' }}>
                <h3 style={{ color: '#e65100' }}>🎉 Special Offer</h3>
                <p style={{ color: '#666', margin: '10px 0' }}>
                    Book hotels along with train tickets and get up to 30% off! Use code: <strong>IRCTC30</strong>
                </p>
            </div>
        </div>
    );
};

export default Hotels;
