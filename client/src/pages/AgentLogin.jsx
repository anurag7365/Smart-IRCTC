import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AgentLogin = () => {
    const [agentId, setAgentId] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Mock agent login
        if (agentId && password) {
            alert('Agent Login Successful (Simulation)');
            navigate('/');
        }
    };

    return (
        <div style={{ background: 'rgba(0,0,0,0.5)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 1000 }}>
            {/* Modal Container */}
            <div style={{ background: 'white', display: 'flex', width: '900px', height: '550px', borderRadius: '4px', overflow: 'hidden' }}>

                {/* Left Side: Image */}
                <div style={{ flex: 1, background: 'url("/vande-bharat.png") center/cover', position: 'relative' }}>
                    <div style={{ position: 'absolute', bottom: '20px', left: '20px', color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                        <h2 style={{ margin: 0 }}>IRCTC Agent</h2>
                        <p style={{ margin: 0 }}>Authorized Partners Portal</p>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div style={{ flex: 1, padding: '40px', display: 'flex', flexDirection: 'column' }}>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                        <h2 style={{ margin: 0, color: '#213d77', borderBottom: '3px solid #fb792b', display: 'inline-block', paddingBottom: '5px' }}>AGENT LOGIN</h2>
                        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>&times;</button>
                    </div>

                    <form onSubmit={handleSubmit} style={{ flex: 1 }}>
                        <div className="irctc-input-group">
                            <input
                                className="irctc-input"
                                type="text"
                                placeholder="Agent ID / User Name"
                                value={agentId}
                                onChange={(e) => setAgentId(e.target.value)}
                                required
                            />
                        </div>
                        <div className="irctc-input-group">
                            <input
                                className="irctc-input"
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {/* Mock Captcha */}
                        <div style={{ background: '#213d77', padding: '10px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white', marginBottom: '20px' }}>
                            <div style={{ fontSize: '24px', letterSpacing: '5px', fontFamily: 'monospace' }}>Xd9#K</div>
                            <span style={{ cursor: 'pointer', fontSize: '20px' }}>&#x21bb;</span>
                        </div>
                        <div className="irctc-input-group">
                            <input className="irctc-input" type="text" placeholder="Enter Captcha" disabled />
                        </div>

                        <button type="submit" className="irctc-btn btn-orange" style={{ width: '100%', padding: '12px' }}>SIGN IN</button>
                    </form>

                    <div style={{ marginTop: '20px', textAlign: 'center' }}>
                        <button onClick={() => navigate('/login')} className="irctc-btn btn-blue" style={{ fontSize: '12px', width: '100%' }}>BACK TO USER LOGIN</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgentLogin;
