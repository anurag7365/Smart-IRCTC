const Meals = () => {
    const categories = [
        { name: 'Breakfast', icon: '🍳', items: 15 },
        { name: 'Lunch', icon: '🍛', items: 25 },
        { name: 'Dinner', icon: '🍽️', items: 20 },
        { name: 'Snacks', icon: '🍪', items: 12 }
    ];

    const meals = [
        { name: 'Veg Thali', type: 'Lunch', price: 150, rating: 4.5, image: '🍛' },
        { name: 'Chicken Biryani', type: 'Lunch', price: 180, rating: 4.7, image: '🍗' },
        { name: 'Masala Dosa', type: 'Breakfast', price: 80, rating: 4.6, image: '🥘' },
        { name: 'Paneer Tikka', type: 'Snacks', price: 120, rating: 4.4, image: '🧆' },
        { name: 'Dal Makhani Combo', type: 'Dinner', price: 140, rating: 4.5, image: '🍲' },
        { name: 'Idli Sambhar', type: 'Breakfast', price: 60, rating: 4.3, image: '🥣' }
    ];

    return (
        <div className="container" style={{ padding: '40px 0' }}>
            <h1 style={{ color: '#213d77', borderBottom: '3px solid #fb792b', display: 'inline-block', paddingBottom: '10px', marginBottom: '30px' }}>
                Order Food in Train
            </h1>

            <div className="card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', marginBottom: '30px', padding: '30px', textAlign: 'center' }}>
                <h2 style={{ fontSize: '28px', marginBottom: '10px' }}>Delicious Meals Delivered to Your Seat</h2>
                <p style={{ opacity: 0.9, fontSize: '16px' }}>Pre-order from 400+ railway stations across India</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
                {categories.map((cat, idx) => (
                    <div key={idx} className="card" style={{ textAlign: 'center', padding: '25px', cursor: 'pointer', transition: 'transform 0.2s' }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                        <div style={{ fontSize: '50px', marginBottom: '15px' }}>{cat.icon}</div>
                        <h3 style={{ color: '#213d77', margin: '10px 0' }}>{cat.name}</h3>
                        <p style={{ color: '#666', fontSize: '14px' }}>{cat.items} items</p>
                    </div>
                ))}
            </div>

            <h2 style={{ color: '#213d77', marginBottom: '20px' }}>Popular Meals</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px', marginBottom: '40px' }}>
                {meals.map((meal, idx) => (
                    <div key={idx} className="card">
                        <div style={{ fontSize: '80px', textAlign: 'center', background: '#f5f5f5', padding: '30px' }}>
                            {meal.image}
                        </div>
                        <div style={{ padding: '20px' }}>
                            <h3 style={{ margin: '0 0 5px 0', color: '#213d77' }}>{meal.name}</h3>
                            <p style={{ color: '#666', fontSize: '13px', marginBottom: '10px' }}>{meal.type}</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                <div style={{ background: '#4caf50', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '13px' }}>
                                    ⭐ {meal.rating}
                                </div>
                                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#fb792b' }}>₹{meal.price}</div>
                            </div>
                            <button className="irctc-btn btn-orange" style={{ width: '100%' }}>Add to Cart</button>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                <div className="card" style={{ background: '#e3f2fd', textAlign: 'center', padding: '20px' }}>
                    <div style={{ fontSize: '40px', marginBottom: '10px' }}>🍽️</div>
                    <h4 style={{ color: '#213d77' }}>Hygiene First</h4>
                    <p style={{ fontSize: '13px', color: '#666' }}>FSSAI certified meals</p>
                </div>
                <div className="card" style={{ background: '#f3e5f5', textAlign: 'center', padding: '20px' }}>
                    <div style={{ fontSize: '40px', marginBottom: '10px' }}>🚚</div>
                    <h4 style={{ color: '#213d77' }}>On-Time Delivery</h4>
                    <p style={{ fontSize: '13px', color: '#666' }}>Delivered at your seat</p>
                </div>
                <div className="card" style={{ background: '#e8f5e9', textAlign: 'center', padding: '20px' }}>
                    <div style={{ fontSize: '40px', marginBottom: '10px' }}>💳</div>
                    <h4 style={{ color: '#213d77' }}>Easy Payment</h4>
                    <p style={{ fontSize: '13px', color: '#666' }}>Multiple payment options</p>
                </div>
            </div>
        </div>
    );
};

export default Meals;
