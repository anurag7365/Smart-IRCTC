import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';

const MyTransactions = () => {
    const { user } = useContext(AuthContext);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` }
                };
                // Reusing bookings API as a proxy for transactions
                const { data } = await axios.get('http://localhost:5000/api/bookings/mybookings', config);
                // Sort by date desc
                const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setTransactions(sortedData);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchTransactions();
    }, [user]);

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', flexDirection: 'column', gap: '20px' }}>
            <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #213d77', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            <div style={{ color: '#666' }}>Loading transaction history...</div>
        </div>
    );

    return (
        <div className="container" style={{ paddingBottom: '50px' }}>
            {/* Header Section */}
            <div style={{ background: 'white', padding: '20px 0', borderBottom: '1px solid #eee', marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ margin: 0, color: '#213d77', fontSize: '28px' }}>My Transactions</h2>
                    <p style={{ margin: '5px 0 0 0', color: '#666' }}>View your payment history and booking summaries</p>
                </div>
                <div style={{ background: '#e3f2fd', color: '#213d77', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold' }}>
                    Total Spent: ₹ {transactions.filter(t => t.status !== 'Cancelled').reduce((acc, curr) => acc + curr.totalAmount, 0).toFixed(2)}
                </div>
            </div>

            {transactions.length === 0 ? (
                <div style={{ padding: '40px', borderRadius: '12px', textAlign: 'center' }}>
                    <div style={{ background: '#f9f9f9', padding: '40px', borderRadius: '12px', border: '1px dashed #ccc', display: 'inline-block', maxWidth: '600px', width: '100%' }}>
                        <div style={{ fontSize: '50px', marginBottom: '20px' }}>💳</div>
                        <h3 style={{ color: '#213d77', marginBottom: '10px' }}>No transactions found</h3>
                        <p style={{ color: '#666', marginBottom: '30px' }}>You haven't made any bookings yet.</p>
                        <Link to="/" className="irctc-btn btn-blue">Book a Ticket</Link>
                    </div>
                </div>
            ) : (
                <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ background: '#f8fafd', color: '#213d77' }}>
                            <tr>
                                <th style={{ padding: '15px 20px', borderBottom: '2px solid #eee' }}>Transaction Date</th>
                                <th style={{ padding: '15px 20px', borderBottom: '2px solid #eee' }}>Description</th>
                                <th style={{ padding: '15px 20px', borderBottom: '2px solid #eee' }}>PNR / ID</th>
                                <th style={{ padding: '15px 20px', borderBottom: '2px solid #eee' }}>Amount</th>
                                <th style={{ padding: '15px 20px', borderBottom: '2px solid #eee' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map(txn => (
                                <tr key={txn._id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '15px 20px', color: '#555' }}>
                                        {new Date(txn.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        <div style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>
                                            {new Date(txn.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </td>
                                    <td style={{ padding: '15px 20px' }}>
                                        <div style={{ fontWeight: 'bold', color: '#213d77' }}>Ticket Booking</div>
                                        <div style={{ fontSize: '12px', color: '#666' }}>{txn.train.name} ({txn.train.number})</div>
                                    </td>
                                    <td style={{ padding: '15px 20px', fontFamily: 'monospace', color: '#fb792b', fontWeight: 'bold' }}>
                                        {txn.pnr}
                                    </td>
                                    <td style={{ padding: '15px 20px', fontWeight: 'bold', color: '#333' }}>
                                        ₹ {txn.totalAmount.toFixed(2)}
                                    </td>
                                    <td style={{ padding: '15px 20px' }}>
                                        <span style={{
                                            padding: '4px 12px',
                                            borderRadius: '20px',
                                            fontSize: '11px',
                                            fontWeight: 'bold',
                                            textTransform: 'uppercase',
                                            color: txn.status === 'Cancelled' ? '#d32f2f' : '#2e7d32',
                                            background: txn.status === 'Cancelled' ? '#ffebee' : '#e8f5e9'
                                        }}>
                                            {txn.status === 'Booked' ? 'Success' : txn.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MyTransactions;
