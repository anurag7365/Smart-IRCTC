import { Link } from 'react-router-dom';

const More = () => {
    const services = [
        { name: 'Loyalty Program', icon: '🎁', link: '/loyalty' },
        { name: 'E-Wallet', icon: '💳', link: '/e-wallet' },
        { name: 'Buses', icon: '🚌', link: '/buses' },
        { name: 'Flights', icon: '✈️', link: '/flights' },
        { name: 'Hotels', icon: '🏨', link: '/hotels' },
        { name: 'Holidays', icon: '🏖️', link: '/holidays' },
        { name: 'Meals', icon: '🍽️', link: '/meals' },
        { name: 'Promotions', icon: '🎉', link: '/promotions' }
    ];

    return (
        <div className="container" style={{ padding: '40px 0' }}>
            <h1 style={{ color: '#213d77', marginBottom: '30px' }}>More Services</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                {services.map((service, idx) => (
                    <Link key={idx} to={service.link} style={{ textDecoration: 'none' }}>
                        <div className="card" style={{ textAlign: 'center', padding: '25px' }}>
                            <div style={{ fontSize: '50px', marginBottom: '15px' }}>{service.icon}</div>
                            <h3 style={{ color: '#213d77' }}>{service.name}</h3>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default More;
