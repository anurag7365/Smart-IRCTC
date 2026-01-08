import { Link } from 'react-router-dom';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="irctc-footer">
            {/* Social Top Bar */}
            <div className="footer-top-bar">
                <div className="footer-top-container">
                    <span style={{ fontWeight: '500' }}>Get Connected with us on social networks</span>
                    <div className="social-links">
                        <div className="social-icon" style={{ background: '#3b5998' }}>f</div>
                        <div className="social-icon" style={{ background: '#25d366' }}>w</div>
                        <div className="social-icon" style={{ background: '#cd201f' }}>y</div>
                        <div className="social-icon" style={{ background: '#e4405f' }}>i</div>
                        <div className="social-icon" style={{ background: '#0077b5' }}>l</div>
                        <div className="social-icon" style={{ background: '#0088cc' }}>t</div>
                        <div className="social-icon" style={{ background: '#bd081c' }}>p</div>
                        <div className="social-icon" style={{ background: '#2c3e50' }}>t</div>
                        <div className="social-icon" style={{ background: '#f4e542', color: '#333' }}>s</div>
                        <div className="social-icon" style={{ background: '#1da1f2' }}>t</div>
                    </div>
                </div>
            </div>

            {/* Main Footer Links */}
            <div className="footer-main">
                <div className="footer-columns">
                    {/* Column 1 */}
                    <div className="footer-column">
                        <h4>IRCTC Trains</h4>
                        <ul>
                            <li><Link to="/">General Information</Link></li>
                            <li><Link to="/">Important Information</Link></li>
                            <li><Link to="/agent">Agents</Link></li>
                            <li><Link to="/contact">Enquiries</Link></li>
                        </ul>
                    </div>

                    {/* Column 2 */}
                    <div className="footer-column">
                        <h4>How To</h4>
                        <ul>
                            <li><a href="#">IRCTC Official App</a></li>
                            <li><a href="#">Advertise with us</a></li>
                            <li><Link to="/">Refund Rules</Link></li>
                            <li><a href="#">Person With Disability Facilities</a></li>
                        </ul>
                    </div>

                    {/* Column 3 */}
                    <div className="footer-column">
                        <h4>E-Wallet</h4>
                        <ul>
                            <li><Link to="/e-wallet">IRCTC Co-branded Card Benefits</Link></li>
                            <li><a href="#">IRCTC-iPAY Payment Gateway</a></li>
                            <li><a href="#">IRCTC Zone</a></li>
                            <li><a href="#">DMRC Ticket Booking at IRCTC</a></li>
                        </ul>
                    </div>

                    {/* Column 4 */}
                    <div className="footer-column">
                        <h4>For Newly Migrated Agents</h4>
                        <ul>
                            <li><a href="#">Mobile Zone</a></li>
                            <li><a href="#">Policies</a></li>
                            <li><a href="#">Ask Disha ChatBot</a></li>
                            <li><a href="#">About us</a></li>
                        </ul>
                    </div>

                    {/* Column 5 */}
                    <div className="footer-column">
                        <h4>Help & Support</h4>
                        <ul>
                            <li><a href="#">E-Pantry</a></li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Copyright */}
            <div className="footer-bottom">
                <div className="container">
                    <p>Copyright © {currentYear} - All Rights Reserved</p>
                    <p style={{ marginTop: '5px', opacity: 0.7 }}>Designed and Hosted by BEYOND CODE</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
