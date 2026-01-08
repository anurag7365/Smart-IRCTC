import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        console.log("Submitting registration:", { name, email, password });

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }

        try {
            const res = await register(name, email, password);
            console.log("Registration response:", res);
            if (res.success) {
                alert('Registration successful! Please login to continue.');
                navigate('/login');
            } else {
                setError(res.message);
            }
        } catch (err) {
            console.error("Registration error:", err);
            setError("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container" style={{ padding: '30px 0' }}>
            <div className="register-layout">

                {/* Left: Registration Form */}
                <div className="register-form-sec" style={{ paddingRight: '40px' }}>
                    <h2 style={{ color: '#213d77', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>Create Your IRCTC account</h2>

                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '20px', lineHeight: '1.5' }}>
                        1. Garbage / Junk values in profile may lead to deactivation of IRCTC account.<br />
                        2. Opening Advance Reservation Period(ARP) ticket booking allowed only after verification.
                    </div>

                    {error && <div style={{ color: 'red', border: '1px solid red', padding: '10px', marginBottom: '10px' }}>{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="irctc-input-group">
                            <label className="irctc-label">User Name</label>
                            <input className="irctc-input" type="text" name="name" value={name} onChange={(e) => setName(e.target.value)} required />
                        </div>

                        <div className="irctc-input-group">
                            <label className="irctc-label">Email</label>
                            <input className="irctc-input" type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            <div style={{ background: '#e3f2fd', padding: '5px', fontSize: '11px', color: '#0d47a1', marginTop: '2px' }}>
                                Invalid email ID may lead to deactivation of IRCTC account.
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="irctc-input-group flex-1">
                                <label className="irctc-label">Password</label>
                                <input className="irctc-input" type={showPassword ? "text" : "password"} name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            </div>
                            <div className="irctc-input-group flex-1">
                                <label className="irctc-label">Confirm Password</label>
                                <input className="irctc-input" type={showPassword ? "text" : "password"} name="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                            </div>
                        </div>

                        <div className="irctc-input-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '5px' }}>
                            <input
                                type="checkbox"
                                id="showPassword"
                                checked={showPassword}
                                onChange={() => setShowPassword(!showPassword)}
                                style={{ width: 'auto', margin: 0 }}
                            />
                            <label htmlFor="showPassword" style={{ margin: 0, fontSize: '14px', cursor: 'pointer' }}>Show Password</label>
                        </div>

                        <div className="irctc-input-group">
                            <label className="irctc-label">Mobile</label>
                            <div className="flex">
                                <span style={{ padding: '10px', background: '#ddd', border: '1px solid #ccc', borderRight: 'none' }}>+91 - India</span>
                                <input className="irctc-input" type="text" placeholder="Mobile Number" style={{ flex: 1 }} />
                            </div>
                        </div>

                        <button type="submit" className="irctc-btn btn-orange" disabled={isLoading}>
                            {isLoading ? 'Submitting...' : 'Submit'}
                        </button>
                    </form>
                </div>

                {/* Right: FAQ & Ad */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Ad Placeholder */}
                    <div style={{ background: '#1565c0', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexDirection: 'column', padding: '20px', textAlign: 'center' }}>
                        <h3>CYBERSECURITY</h3>
                        <div>Tip of the day: Use different passwords.</div>
                    </div>

                    {/* FAQ */}
                    <div style={{ background: '#fff8e1', border: '1px solid #ffe0b2', padding: '15px' }}>
                        <h3 style={{ margin: '0 0 15px 0', color: '#4caf50' }}>Help & FAQ</h3>
                        <div className="faq-item">What is the IRCTC Ticketing Website? (+)</div>
                        <div className="faq-item">Why do I need to register on IRCTC? (+)</div>
                        <div className="faq-item">How can I register on IRCTC? (+)</div>
                        <div className="faq-item">Are there any charges for registering on IRCTC? (+)</div>
                        <div className="faq-item">How do I activate my IRCTC account after registration? (+)</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
