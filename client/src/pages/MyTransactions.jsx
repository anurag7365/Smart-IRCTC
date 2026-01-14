import React from 'react';
import { useNavigate } from 'react-router-dom';

const MyTransactions = () => {
    const navigate = useNavigate();

    return (
        <div className="container" style={{ padding: '40px 0', minHeight: '60vh', textAlign: 'center' }}>
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>💳</div>
            <h2 style={{ color: '#213d77', marginBottom: '10px' }}>My Transactions</h2>
            <p style={{ color: '#666', marginBottom: '30px' }}>Track your payment history and refund status.</p>

            <div style={{ background: '#f9f9f9', padding: '40px', borderRadius: '12px', border: '1px dashed #ccc', display: 'inline-block', maxWidth: '600px', width: '100%' }}>
                <p style={{ color: '#888', fontStyle: 'italic' }}>No recent transactions found.</p>
                <div style={{ marginTop: '20px' }}>
                    <button onClick={() => navigate('/')} className="irctc-btn btn-blue">Go to Home</button>
                </div>
            </div>
        </div>
    );
};

export default MyTransactions;
