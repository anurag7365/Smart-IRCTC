const Promotions = () => {
    const offers = [
        {
            title: 'New Year Special',
            discount: '40% OFF',
            code: 'NEWYEAR40',
            description: 'Book train tickets and get flat 40% off on your first booking',
            validTill: '31 Jan 2026',
            color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        },
        {
            title: 'IRCTC E-Wallet Cashback',
            discount: '₹500 Cashback',
            code: 'WALLET500',
            description: 'Add money to your e-wallet and get instant cashback',
            validTill: '15 Feb 2026',
            color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
        },
        {
            title: 'Hotel Booking Offer',
            discount: '30% OFF',
            code: 'HOTEL30',
            description: 'Book hotels with train tickets and save big',
            validTill: '28 Feb 2026',
            color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
        },
        {
            title: 'Group Booking Discount',
            discount: 'Up to 25% OFF',
            code: 'GROUP25',
            description: 'Book for 4 or more passengers and get exclusive discount',
            validTill: '31 Mar 2026',
            color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
        },
        {
            title: 'Weekend Getaway',
            discount: '₹1000 OFF',
            code: 'WEEKEND1000',
            description: 'On holiday packages booked for weekends',
            validTill: '30 Apr 2026',
            color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
        },
        {
            title: 'Senior Citizen Special',
            discount: 'Extra 10% OFF',
            code: 'SENIOR10',
            description: 'Additional discount for senior citizens on all bookings',
            validTill: 'Ongoing',
            color: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)'
        }
    ];

    return (
        <div className="container" style={{ padding: '40px 0' }}>
            <h1 style={{ color: '#213d77', borderBottom: '3px solid #fb792b', display: 'inline-block', paddingBottom: '10px', marginBottom: '30px' }}>
                Promotions & Offers
            </h1>

            <div className="card" style={{ background: '#fff3e0', border: '2px solid #ff9800', marginBottom: '40px', padding: '25px', textAlign: 'center' }}>
                <h2 style={{ color: '#e65100', margin: '0 0 10px 0' }}>🎉 Limited Time Offers!</h2>
                <p style={{ color: '#666', fontSize: '16px' }}>Grab these exclusive deals before they expire</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '25px', marginBottom: '40px' }}>
                {offers.map((offer, idx) => (
                    <div key={idx} className="card" style={{ background: offer.color, color: 'white', padding: '30px', overflow: 'hidden', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.3)', padding: '8px 15px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
                            Valid till {offer.validTill}
                        </div>
                        <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>{offer.title}</h2>
                        <div style={{ fontSize: '48px', fontWeight: 'bold', margin: '20px 0' }}>{offer.discount}</div>
                        <p style={{ fontSize: '15px', marginBottom: '20px', opacity: 0.95 }}>{offer.description}</p>
                        <div style={{ background: 'rgba(255,255,255,0.2)', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                            <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '5px' }}>Use Coupon Code:</div>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', letterSpacing: '2px' }}>{offer.code}</div>
                        </div>
                        <button className="irctc-btn" style={{ background: 'white', color: '#213d77', width: '100%', padding: '12px', fontWeight: 'bold' }}>
                            Book Now
                        </button>
                    </div>
                ))}
            </div>

            <div className="card" style={{ background: '#f8f9fa', padding: '30px' }}>
                <h3 style={{ color: '#213d77', marginBottom: '20px', textAlign: 'center' }}>How to Use Promo Codes</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ background: '#213d77', color: 'white', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px', fontSize: '24px', fontWeight: 'bold' }}>1</div>
                        <p style={{ fontSize: '14px', color: '#666' }}>Select your service</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ background: '#213d77', color: 'white', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px', fontSize: '24px', fontWeight: 'bold' }}>2</div>
                        <p style={{ fontSize: '14px', color: '#666' }}>Fill booking details</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ background: '#213d77', color: 'white', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px', fontSize: '24px', fontWeight: 'bold' }}>3</div>
                        <p style={{ fontSize: '14px', color: '#666' }}>Apply promo code</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ background: '#fb792b', color: 'white', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px', fontSize: '24px', fontWeight: 'bold' }}>✓</div>
                        <p style={{ fontSize: '14px', color: '#666' }}>Get instant discount</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Promotions;
