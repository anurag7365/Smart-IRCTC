import { useState } from 'react';

const ContactUs = () => {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Thank you for contacting us! We will get back to you soon.');
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <div className="container" style={{ padding: '40px 0' }}>
            <h1 style={{ color: '#213d77', borderBottom: '3px solid #fb792b', display: 'inline-block', paddingBottom: '10px', marginBottom: '30px' }}>
                Contact Us
            </h1>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
                <div className="card">
                    <h2 style={{ color: '#213d77', marginBottom: '20px' }}>Get in Touch</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="irctc-input-group">
                            <label className="irctc-label">Full Name</label>
                            <input type="text" className="irctc-input" value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                        </div>
                        <div className="irctc-input-group">
                            <label className="irctc-label">Email Address</label>
                            <input type="email" className="irctc-input" value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                        </div>
                        <div className="irctc-input-group">
                            <label className="irctc-label">Subject</label>
                            <input type="text" className="irctc-input" value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })} required />
                        </div>
                        <div className="irctc-input-group">
                            <label className="irctc-label">Message</label>
                            <textarea className="irctc-input" rows="5" value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })} required />
                        </div>
                        <button type="submit" className="irctc-btn btn-orange" style={{ width: '100%', padding: '12px' }}>
                            Send Message
                        </button>
                    </form>
                </div>

                <div>
                    <div className="card" style={{ marginBottom: '20px' }}>
                        <h3 style={{ color: '#213d77', marginBottom: '15px' }}>Contact Information</h3>
                        <div style={{ fontSize: '14px', lineHeight: '2.5' }}>
                            <div><strong>📞 Phone:</strong><br />139 (24x7 Helpline)</div>
                            <div><strong>📧 Email:</strong><br />care@irctc.co.in</div>
                            <div><strong>🕐 Working Hours:</strong><br />24/7 Support</div>
                        </div>
                    </div>

                    <div className="card" style={{ background: '#e3f2fd' }}>
                        <h4 style={{ color: '#1976d2', marginBottom: '10px' }}>Quick Support</h4>
                        <p style={{ fontSize: '13px', color: '#555', marginBottom: '15px' }}>
                            For immediate assistance, call our 24/7 helpline at 139
                        </p>
                        <button className="irctc-btn btn-blue" style={{ width: '100%', fontSize: '13px' }}>
                            Live Chat
                        </button>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginTop: '40px' }}>
                <div className="card" style={{ textAlign: 'center', padding: '25px' }}>
                    <div style={{ fontSize: '40px', marginBottom: '10px' }}>📱</div>
                    <h4 style={{ color: '#213d77' }}>Mobile App</h4>
                    <p style={{ fontSize: '13px', color: '#666' }}>Download IRCTC Rail Connect</p>
                </div>
                <div className="card" style={{ textAlign: 'center', padding: '25px' }}>
                    <div style={{ fontSize: '40px', marginBottom: '10px' }}>💬</div>
                    <h4 style={{ color: '#213d77' }}>Live Chat</h4>
                    <p style={{ fontSize: '13px', color: '#666' }}>Chat with our support team</p>
                </div>
                <div className="card" style={{ textAlign: 'center', padding: '25px' }}>
                    <div style={{ fontSize: '40px', marginBottom: '10px' }}>❓</div>
                    <h4 style={{ color: '#213d77' }}>FAQs</h4>
                    <p style={{ fontSize: '13px', color: '#666' }}>Find quick answers</p>
                </div>
                <div className="card" style={{ textAlign: 'center', padding: '25px' }}>
                    <div style={{ fontSize: '40px', marginBottom: '10px' }}>📧</div>
                    <h4 style={{ color: '#213d77' }}>Email Support</h4>
                    <p style={{ fontSize: '13px', color: '#666' }}>Get response within 24hrs</p>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
