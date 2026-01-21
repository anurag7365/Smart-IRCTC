import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const { user, loading } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && (!user || user.role !== 'admin')) {
            navigate('/');
        }
    }, [user, loading, navigate]);

    // Fetch Stats
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get('http://localhost:5000/api/admin/stats', config);
                setStats(data);
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        };
        if (user && user.role === 'admin') fetchStats();
    }, [user]);

    // Fetch Data based on tab
    useEffect(() => {
        const fetchData = async () => {
            if (!user || user.role !== 'admin') return;
            setIsLoadingData(true);
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };

                if (activeTab === 'users' && users.length === 0) {
                    const { data } = await axios.get('http://localhost:5000/api/admin/users', config);
                    setUsers(data);
                } else if ((activeTab === 'bookings' || activeTab === 'transactions') && bookings.length === 0) {
                    const { data } = await axios.get('http://localhost:5000/api/admin/bookings', config);
                    setBookings(data);
                }
            } catch (error) {
                console.error(`Error fetching ${activeTab}:`, error);
            } finally {
                setIsLoadingData(false);
            }
        };

        if (activeTab !== 'overview') {
            fetchData();
        }
    }, [activeTab, user, users.length, bookings.length]);

    if (loading) return <div>Loading...</div>;
    if (!user || user.role !== 'admin') return null;

    return (
        <div style={{ padding: '30px', background: '#f5f7fa', minHeight: '100vh' }}>
            <div className="container">
                <h1 style={{ color: '#213d77', marginBottom: '20px' }}>Admin Dashboard</h1>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', borderBottom: '2px solid #ddd' }}>
                    {['overview', 'users', 'bookings', 'transactions'].map(tab => (
                        <div
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                padding: '10px 20px',
                                cursor: 'pointer',
                                textTransform: 'capitalize',
                                fontWeight: 'bold',
                                color: activeTab === tab ? '#fb792b' : '#666',
                                borderBottom: activeTab === tab ? '3px solid #fb792b' : '3px solid transparent',
                                marginBottom: '-2px'
                            }}
                        >
                            {tab}
                        </div>
                    ))}
                </div>

                {/* Content */}
                {activeTab === 'overview' && stats && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                        <InfoCard title="Total Users" value={stats.users} icon="👥" />
                        <InfoCard title="Total Bookings" value={stats.bookings} icon="🎫" />
                        <InfoCard title="Total Trains" value={stats.trains} icon="🚆" />
                        <InfoCard title="Total Revenue" value={`₹ ${stats.revenue.toLocaleString()}`} icon="💰" />
                    </div>
                )}

                {activeTab === 'users' && (
                    <div style={tableContainerStyle}>
                        {isLoadingData ? <p>Loading users...</p> : (
                            <table style={tableStyle}>
                                <thead>
                                    <tr style={{ background: '#eee', color: '#333' }}>
                                        <th style={thStyle}>Name</th>
                                        <th style={thStyle}>Email</th>
                                        <th style={thStyle}>Role</th>
                                        <th style={thStyle}>Joined</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(u => (
                                        <tr key={u._id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                            <td style={tdStyle}>{u.name}</td>
                                            <td style={tdStyle}>{u.email}</td>
                                            <td style={tdStyle}>
                                                <span style={{
                                                    padding: '3px 8px',
                                                    borderRadius: '12px',
                                                    background: u.role === 'admin' ? '#dcfce7' : '#e0f2fe',
                                                    color: u.role === 'admin' ? '#166534' : '#075985',
                                                    fontSize: '12px'
                                                }}>
                                                    {u.role.toUpperCase()}
                                                </span>
                                            </td>
                                            <td style={tdStyle}>{new Date(u.createdAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}

                {activeTab === 'bookings' && (
                    <div style={tableContainerStyle}>
                        {isLoadingData ? <p>Loading bookings...</p> : (
                            <table style={tableStyle}>
                                <thead>
                                    <tr style={{ background: '#eee', color: '#333' }}>
                                        <th style={thStyle}>PNR</th>
                                        <th style={thStyle}>User</th>
                                        <th style={thStyle}>Train</th>
                                        <th style={thStyle}>Route</th>
                                        <th style={thStyle}>Date</th>
                                        <th style={thStyle}>Amount</th>
                                        <th style={thStyle}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.map(b => (
                                        <tr key={b._id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                            <td style={tdStyle}><strong>{b.pnr}</strong></td>
                                            <td style={tdStyle}>{b.user?.name || 'N/A'} <br /><small style={{ color: '#888' }}>{b.user?.email}</small></td>
                                            <td style={tdStyle}>{b.train?.name} ({b.train?.number})</td>
                                            <td style={tdStyle}>{b.source?.code} ➝ {b.destination?.code}</td>
                                            <td style={tdStyle}>{new Date(b.journeyDate).toLocaleDateString()}</td>
                                            <td style={tdStyle}>₹{b.totalAmount}</td>
                                            <td style={tdStyle}>
                                                <span style={{
                                                    color: b.status === 'Booked' ? 'green' : 'red',
                                                    fontWeight: 'bold'
                                                }}>
                                                    {b.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}

                {activeTab === 'transactions' && (
                    <div style={tableContainerStyle}>
                        {isLoadingData ? <p>Loading transactions...</p> : (
                            <table style={tableStyle}>
                                <thead>
                                    <tr style={{ background: '#eee', color: '#333' }}>
                                        <th style={thStyle}>Transaction ID</th>
                                        <th style={thStyle}>Booked By</th>
                                        <th style={thStyle}>Date</th>
                                        <th style={thStyle}>Amount</th>
                                        <th style={thStyle}>Payment Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.map(b => (
                                        <tr key={b._id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                            <td style={tdStyle}><small>{b._id}</small></td>
                                            <td style={tdStyle}>{b.user?.name}</td>
                                            <td style={tdStyle}>{new Date(b.createdAt).toLocaleString()}</td>
                                            <td style={tdStyle}><strong style={{ color: '#213d77' }}>₹{b.totalAmount}</strong></td>
                                            <td style={tdStyle}>
                                                <span style={{
                                                    color: b.status === 'Booked' ? 'green' : 'red',
                                                    fontWeight: 'bold'
                                                }}>
                                                    {b.status === 'Booked' ? 'SUCCESS' : 'REFUNDED/FAILED'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const InfoCard = ({ title, value, icon }) => (
    <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div style={{ fontSize: '30px' }}>{icon}</div>
        <div>
            <h3 style={{ margin: 0, fontSize: '14px', color: '#888' }}>{title}</h3>
            <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#333' }}>{value}</p>
        </div>
    </div>
);

const tableContainerStyle = {
    background: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    overflowX: 'auto'
};

const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px'
};

const thStyle = {
    textAlign: 'left',
    padding: '12px 15px',
    borderBottom: '2px solid #ddd',
    fontWeight: '600'
};

const tdStyle = {
    padding: '12px 15px',
    color: '#444'
};

export default AdminDashboard;
