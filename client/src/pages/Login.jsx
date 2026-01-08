import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        console.log("Submitting login:", { email });

        try {
            const res = await login(email, password);
            console.log("Login response:", res);
            if (res.success) {
                navigate('/');
            } else {
                setError(res.message);
            }
        } catch (err) {
            console.error("Login component error:", err);
            setError("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ background: 'rgba(0,0,0,0.5)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 1000 }}>
            {/* Modal Container */}
            <div style={{ background: 'white', display: 'flex', width: '900px', height: '550px', borderRadius: '4px', overflow: 'hidden' }}>

                {/* Left Side: Train Image */}
                <div style={{ flex: 1, background: 'url("/vande-bharat.png") center/cover', position: 'relative' }}>
                    <div style={{ position: 'absolute', bottom: '0', left: '0', width: '100%', padding: '20px', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}>
                        <h2 style={{ color: 'white', margin: 0 }}>Indian Railways</h2>
                        <p style={{ color: '#ddd', margin: 0 }}>Safety | Security | Punctuality</p>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div style={{ flex: 1, padding: '40px', display: 'flex', flexDirection: 'column' }}>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                        <h2 style={{ margin: 0, color: '#213d77', borderBottom: '3px solid #fb792b', display: 'inline-block', paddingBottom: '5px' }}>LOGIN</h2>
                        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>&times;</button>
                    </div>

                    {error && <div style={{ color: 'red', fontSize: '12px', marginBottom: '10px' }}>{error}</div>}

                    <form onSubmit={handleSubmit} style={{ flex: 1 }}>
                        <div className="irctc-input-group">
                            <input
                                className="irctc-input"
                                type="text"
                                name="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="irctc-input-group">
                            <input
                                className="irctc-input"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div style={{ marginBottom: '20px', fontSize: '13px' }}>
                            <label style={{ cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={showPassword}
                                    onChange={() => setShowPassword(!showPassword)}
                                    style={{ marginRight: '5px' }}
                                />
                                Show Password
                            </label>
                        </div>

                        {/* Mock Captcha - Removed temporarily for ease of access as it was non-functional */}
                        {/* <div style={{ background: '#213d77', padding: '10px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white', marginBottom: '20px' }}>
                            <div style={{ fontSize: '24px', letterSpacing: '5px', fontFamily: 'monospace' }}>G6NQ=V</div>
                            <span style={{ cursor: 'pointer', fontSize: '20px' }}>&#x21bb;</span>
                        </div>
                        <div className="irctc-input-group">
                            <input className="irctc-input" type="text" placeholder="Enter Captcha" disabled />
                        </div> */}


                        <button type="submit" className="irctc-btn btn-orange" style={{ width: '100%', padding: '12px' }} disabled={isLoading}>
                            {isLoading ? 'SIGNING IN...' : 'SIGN IN'}
                        </button>
                    </form>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                        <Link to="/register" className="irctc-btn btn-blue" style={{ flex: 1, textAlign: 'center', background: '#213d77', color: 'white', fontSize: '12px' }}>REGISTER</Link>
                        <button className="irctc-btn btn-blue" style={{ flex: 1, fontSize: '12px' }}>AGENT LOGIN</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
