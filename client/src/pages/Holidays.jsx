const Holidays = () => {
    const packages = [
        {
            title: 'Golden Triangle Tour',
            duration: '5 Days / 4 Nights',
            places: 'Delhi → Agra → Jaipur',
            price: 15999,
            image: '🕌',
            includes: ['Hotel', 'Meals', 'Transport', 'Guide']
        },
        {
            title: 'Kashmir Paradise',
            duration: '6 Days / 5 Nights',
            places: 'Srinagar → Gulmarg → Pahalgam',
            price: 24999,
            image: '🏔️',
            includes: ['Hotel', 'Meals', 'Shikara', 'Sightseeing']
        },
        {
            title: 'Kerala Backwaters',
            duration: '4 Days / 3 Nights',
            places: 'Kochi → Alleppey → Munnar',
            price: 18999,
            image: '🛶',
            includes: ['Houseboat', 'Meals', 'Transport', 'Activities']
        },
        {
            title: 'Goa Beach Getaway',
            duration: '3 Days / 2 Nights',
            places: 'North Goa → South Goa',
            price: 12999,
            image: '🏖️',
            includes: ['Resort', 'Breakfast', 'Water Sports', 'Cruise']
        }
    ];

    return (
        <div className="container" style={{ padding: '40px 0' }}>
            <h1 style={{ color: '#213d77', borderBottom: '3px solid #fb792b', display: 'inline-block', paddingBottom: '10px', marginBottom: '30px' }}>
                Holiday Packages
            </h1>

            <div className="card" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white', marginBottom: '40px', textAlign: 'center', padding: '40px' }}>
                <h2 style={{ fontSize: '36px', marginBottom: '10px' }}>Explore India with IRCTC</h2>
                <p style={{ fontSize: '18px', opacity: 0.9 }}>Curated holiday packages with train journeys included</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '30px', marginBottom: '40px' }}>
                {packages.map((pkg, idx) => (
                    <div key={idx} className="card" style={{ overflow: 'hidden' }}>
                        <div style={{ fontSize: '100px', textAlign: 'center', background: '#f5f5f5', padding: '40px' }}>
                            {pkg.image}
                        </div>
                        <div style={{ padding: '25px' }}>
                            <h2 style={{ color: '#213d77', margin: '0 0 10px 0' }}>{pkg.title}</h2>
                            <p style={{ color: '#666', marginBottom: '5px' }}>📅 {pkg.duration}</p>
                            <p style={{ color: '#fb792b', fontWeight: 'bold', marginBottom: '15px' }}>🗺️ {pkg.places}</p>

                            <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '6px', marginBottom: '20px' }}>
                                <div style={{ fontWeight: 'bold', marginBottom: '10px', color: '#213d77' }}>Package Includes:</div>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    {pkg.includes.map((item, i) => (
                                        <span key={i} style={{ background: 'white', padding: '5px 12px', borderRadius: '4px', fontSize: '13px', border: '1px solid #ddd' }}>
                                            ✓ {item}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px solid #eee', paddingTop: '20px' }}>
                                <div>
                                    <div style={{ fontSize: '14px', color: '#666' }}>Starting from</div>
                                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#fb792b' }}>₹{pkg.price}</div>
                                    <div style={{ fontSize: '12px', color: '#999' }}>per person</div>
                                </div>
                                <button className="irctc-btn btn-orange" style={{ padding: '12px 30px' }}>View Details</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="card" style={{ background: '#e8f5e9', textAlign: 'center', padding: '30px' }}>
                <h3 style={{ color: '#2e7d32', marginBottom: '15px' }}>Why Choose IRCTC Holiday Packages?</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginTop: '25px' }}>
                    <div>
                        <div style={{ fontSize: '40px', marginBottom: '10px' }}>🚂</div>
                        <div style={{ fontWeight: 'bold', color: '#213d77' }}>Train Journey Included</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '40px', marginBottom: '10px' }}>🏨</div>
                        <div style={{ fontWeight: 'bold', color: '#213d77' }}>Best Hotels</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '40px', marginBottom: '10px' }}>🎯</div>
                        <div style={{ fontWeight: 'bold', color: '#213d77' }}>All-Inclusive</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '40px', marginBottom: '10px' }}>💯</div>
                        <div style={{ fontWeight: 'bold', color: '#213d77' }}>Trusted Brand</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Holidays;
