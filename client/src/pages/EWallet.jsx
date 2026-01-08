import { useState } from 'react';

const EWallet = () => {
    const [balance] = useState(1250.50);

    return (
        <div className="container" style={{ padding: '40px 0' }}>
            <h1 style={{ color: '#213d77', borderBottom: '3px solid #fb792b', display: 'inline-block', paddingBottom: '10px', marginBottom: '30px' }}>
                IRCTC E-Wallet
            </h1>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
                <div>
                    <div className="card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', marginBottom: '30px' }}>
                        <h3 style={{ opacity: 0.9 }}>Available Balance</h3>
                        <h1 style={{ fontSize: '48px', margin: '20px 0' }}>₹ {balance.toFixed(2)}</h1>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                            <button className="irctc-btn" style={{ background: 'white', color: '#667eea', flex: 1 }}>
                                Add Money
                            </button>
                            <button className="irctc-btn" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', flex: 1 }}>
                                Transfer
                            </button>
                        </div>
                    </div>

                    <div className="card">
                        <h3 style={{ color: '#213d77', marginBottom: '20px' }}>Recent Transactions</h3>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
                                    <th style={{ padding: '10px' }}>Date</th>
                                    <th style={{ padding: '10px' }}>Description</th>
                                    <th style={{ padding: '10px', textAlign: 'right' }}>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style={{ borderBottom: '1px solid #f5f5f5' }}>
                                    <td style={{ padding: '10px' }}>05 Jan 2026</td>
                                    <td style={{ padding: '10px' }}>Added to wallet</td>
                                    <td style={{ padding: '10px', textAlign: 'right', color: '#4caf50' }}>+ ₹1000.00</td>
                                </tr>
                                <tr style={{ borderBottom: '1px solid #f5f5f5' }}>
                                    <td style={{ padding: '10px' }}>03 Jan 2026</td>
                                    <td style={{ padding: '10px' }}>Train Booking - 12952</td>
                                    <td style={{ padding: '10px', textAlign: 'right', color: '#f44336' }}>- ₹850.00</td>
                                </tr>
                                <tr style={{ borderBottom: '1px solid #f5f5f5' }}>
                                    <td style={{ padding: '10px' }}>01 Jan 2026</td>
                                    <td style={{ padding: '10px' }}>Cashback</td>
                                    <td style={{ padding: '10px', textAlign: 'right', color: '#4caf50' }}>+ ₹100.50</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div>
                    <div className="card" style={{ marginBottom: '20px' }}>
                        <h3 style={{ color: '#213d77', marginBottom: '15px' }}>Benefits</h3>
                        <ul style={{ listStyle: 'none', padding: 0, fontSize: '14px', lineHeight: '2' }}>
                            <li>✅ Instant payments</li>
                            <li>✅ No transaction fees</li>
                            <li>✅ Cashback on bookings</li>
                            <li>✅ Secure & encrypted</li>
                            <li>✅ Quick refunds</li>
                        </ul>
                    </div>

                    <div className="card" style={{ background: '#e3f2fd' }}>
                        <h4 style={{ color: '#1976d2', marginBottom: '10px' }}>📢 Offer Alert!</h4>
                        <p style={{ fontSize: '13px', color: '#555' }}>
                            Add ₹1000 or more and get 5% cashback. Valid till 15th Jan 2026.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EWallet;
