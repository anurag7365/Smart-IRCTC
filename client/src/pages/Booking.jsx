import { useState, useEffect, useContext } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import TicketView from '../components/TicketView';

const Booking = () => {
    const { id } = useParams(); // Train ID
    const [booking, setBooking] = useState(null);
    const [searchParams] = useSearchParams();
    const date = searchParams.get('date');
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    // Parse price from URL
    const priceParam = searchParams.get('price');
    const classParam = searchParams.get('class');
    const [price, setPrice] = useState(priceParam ? parseFloat(priceParam) : 0);

    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const [train, setTrain] = useState(null);
    const [passengers, setPassengers] = useState([{ name: '', age: '', gender: 'Male', aadhaar: '', berthPreference: 'No Preference', isHandicapped: false }]);
    const [selectedClass, setSelectedClass] = useState('');

    // Master List State
    const [masterList, setMasterList] = useState([]);
    const [showMasterList, setShowMasterList] = useState(false);

    useEffect(() => {
        const fetchMasterList = async () => {
            if (user && user.token) {
                try {
                    const config = { headers: { Authorization: `Bearer ${user.token}` } };
                    const { data } = await axios.get('http://localhost:5000/api/users/masterlist', config);
                    setMasterList(data);
                } catch (error) { console.error('Error fetching master list', error); }
            }
        };
        fetchMasterList();
    }, [user]);

    // Dynamic Berth Options Helper
    const getBerthOptions = (classType) => {
        const options = ['No Preference'];

        switch (classType) {
            case '1A':
                options.push('Lower', 'Upper', 'Cabin', 'Coupe');
                break;
            case '2A':
                options.push('Lower', 'Upper', 'Side Lower', 'Side Upper');
                break;
            case '3A':
            case '3E':
            case 'SL':
                options.push('Lower', 'Middle', 'Upper', 'Side Lower', 'Side Upper');
                break;
            case 'CC':
            case 'EC':
            case 'EA':
            case '2S':
                options.push('Window', 'Aisle');
                break;
            default:
                options.push('Lower', 'Upper');
        }
        return options;
    };

    // Station Metadata
    const [sourceStation, setSourceStation] = useState(null);
    const [destStation, setDestStation] = useState(null);

    useEffect(() => {
        if (!user) {
            navigate(`/login?redirect=/booking/${id}?date=${date}&from=${from}&to=${to}`);
        }
    }, [user, navigate, id, date, from, to]);

    useEffect(() => {
        if (classParam) setSelectedClass(classParam);
        if (priceParam) setPrice(parseFloat(priceParam));
    }, [classParam, priceParam]);

    useEffect(() => {
        const fetchTrain = async () => {
            try {
                // Fetch ONLY the specific train
                const { data } = await axios.get(`http://localhost:5000/api/trains/${id}`);
                setTrain(data);
                if (data && data.classes.length > 0 && !classParam) setSelectedClass(data.classes[0]);
            } catch (error) {
                console.error(error);
            }
        };
        if (id) fetchTrain();
    }, [id, classParam]);

    // Fetch Station Names
    useEffect(() => {
        const fetchStations = async () => {
            if (from) {
                try {
                    const { data } = await axios.get(`http://localhost:5000/api/stations/${from}`);
                    setSourceStation(data);
                } catch (err) { console.error(err); }
            }
            if (to) {
                try {
                    const { data } = await axios.get(`http://localhost:5000/api/stations/${to}`);
                    setDestStation(data);
                } catch (err) { console.error(err); }
            }
        };
        fetchStations();
    }, [from, to]);

    const handlePassengerChange = (index, field, value) => {
        const newPassengers = [...passengers];
        newPassengers[index][field] = value;
        setPassengers(newPassengers);
    };

    const addPassenger = () => {
        setPassengers([...passengers, { name: '', age: '', gender: 'Male', aadhaar: '', berthPreference: 'No Preference', isHandicapped: false }]);
    };

    const removePassenger = (index) => {
        const newPassengers = passengers.filter((_, i) => i !== index);
        setPassengers(newPassengers);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            alert('Please login to book');
            navigate(`/login?redirect=/booking/${id}?date=${date}&from=${from}&to=${to}`);
            return;
        }

        try {
            const totalFare = price * passengers.length;

            const bookingData = {
                trainId: train._id,
                source: sourceStation ? sourceStation._id : (train.source._id || train.source),
                destination: destStation ? destStation._id : (train.destination._id || train.destination),
                journeyDate: date,
                classType: selectedClass,
                passengers: passengers,
                contactDetails: { mobile: '9999999999', email: user.email },
                totalAmount: totalFare
            };

            // Navigate to Payment Page instead of direct API call
            navigate('/payment', { state: { bookingData } });

        } catch (error) {
            console.error(error);
            alert("Something went wrong");
        }
    };

    if (booking) {
        return (
            <div className="container" style={{ marginTop: '40px' }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <div style={{ width: '60px', height: '60px', background: '#4caf50', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px', margin: '0 auto 10px auto' }}>✓</div>
                    <h2 style={{ color: '#213d77', fontSize: '28px' }}>Booking Confirmation</h2>
                    <p style={{ color: '#666' }}>Your ticket has been successfully booked. An email has been sent to {user.email}.</p>
                </div>
                <TicketView booking={booking} />
                <div style={{ textAlign: 'center', marginTop: '40px', paddingBottom: '40px' }}>
                    <Link to="/" className="irctc-btn btn-blue" style={{ padding: '12px 30px', fontSize: '15px' }}>Book Another Ticket</Link>
                </div>
            </div>
        );
    }

    if (!train) return <div className="container" style={{ marginTop: '100px', textAlign: 'center', color: '#213d77' }}>Loading details...</div>;

    // --- Modern "Tailwind-like" Styling ---
    const modernCard = {
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)', // Tailwind shadow-lg
        padding: '30px',
        border: '1px solid #f3f4f6'
    };

    const inputStyle = {
        width: '100%',
        padding: '10px 15px',
        borderRadius: '8px',
        border: '1px solid #d1d5db',
        outline: 'none',
        transition: 'border-color 0.2s',
        fontSize: '14px'
    };

    const labelStyle = {
        display: 'block',
        fontSize: '13px',
        fontWeight: '600',
        color: '#4b5563', // gray-600
        marginBottom: '6px'
    };

    return (
        <div style={{ background: '#f9fafb', minHeight: '100vh', paddingBottom: '50px' }}> {/* gray-50 */}

            {/* Header Strip */}
            <div style={{ background: 'white', borderBottom: '1px solid #e5e7eb', padding: '15px 0' }}>
                <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <img src="https://pnghdpro.com/wp-content/themes/pnghdpro/download/social-media-and-brands/indian-railways-logo.png" alt="IRCTC" style={{ height: '50px' }} />
                    <div>
                        <h2 style={{ margin: 0, color: '#1f2937', fontSize: '20px' }}>Complete Your Booking</h2> {/* gray-800 */}
                        <div style={{ fontSize: '13px', color: '#6b7280' }}>Journey Details & Passenger Information</div> {/* gray-500 */}
                    </div>
                </div>
            </div>

            <div className="container" style={{ maxWidth: '1100px', margin: '30px auto', display: 'grid', gridTemplateColumns: '7fr 3fr', gap: '30px' }}>

                {/* Left Column: Form */}
                <div>
                    {/* Train Info Card */}
                    <div style={{ ...modernCard, marginBottom: '25px', borderLeft: '5px solid #fb792b' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '22px', color: '#111827' }}>{train.name}</h3>
                                <div style={{ color: '#374151', marginTop: '5px', fontWeight: '500' }}>#{train.number}</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '14px', color: '#6b7280' }}>Journey Date</div>
                                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#fb792b' }}>{new Date(date).toLocaleDateString()}</div>
                            </div>
                        </div>
                        <div style={{ marginTop: '20px', display: 'flex', gap: '40px', padding: '15px', background: '#f3f4f6', borderRadius: '8px' }}>
                            <div>
                                <div style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase' }}>From</div>
                                <div style={{ fontWeight: 'bold' }}>{sourceStation ? `${sourceStation.name} (${sourceStation.code})` : from}</div>
                            </div>
                            <div style={{ fontSize: '20px', color: '#9ca3af' }}>➝</div>
                            <div>
                                <div style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase' }}>To</div>
                                <div style={{ fontWeight: 'bold' }}>{destStation ? `${destStation.name} (${destStation.code})` : to}</div>
                            </div>
                            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ fontSize: '12px', color: '#6b7280' }}>Class</span>
                                <span style={{ background: '#213d77', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>{selectedClass}</span>
                            </div>
                        </div>
                    </div>

                    {/* Passenger Form */}
                    <form onSubmit={handleSubmit}>
                        <div style={modernCard}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h3 style={{ margin: 0, fontSize: '18px', color: '#1f2937' }}>Traveller Details</h3>

                                {/* Master List Dropdown */}
                                {masterList.length > 0 && (
                                    <div style={{ position: 'relative' }}>
                                        <button
                                            type="button"
                                            onClick={() => setShowMasterList(!showMasterList)}
                                            style={{ background: '#e0f2fe', color: '#0284c7', border: '1px solid #bae6fd', padding: '5px 10px', borderRadius: '5px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                                        >
                                            ★ Select Saved Passenger
                                        </button>
                                        {showMasterList && (
                                            <div style={{ position: 'absolute', right: 0, top: '100%', width: '250px', background: 'white', border: '1px solid #ddd', borderRadius: '5px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', zIndex: 10 }}>
                                                {masterList.map((mp, idx) => (
                                                    <div
                                                        key={idx}
                                                        onClick={() => {
                                                            // Find first empty slot or add new
                                                            const emptyIndex = passengers.findIndex(p => !p.name);
                                                            if (emptyIndex !== -1) {
                                                                const newP = [...passengers];
                                                                newP[emptyIndex] = { ...newP[emptyIndex], name: mp.name, age: mp.age, gender: mp.gender, berthPreference: mp.berthPreference || 'No Preference', aadhaar: mp.aadhaar || '' };
                                                                setPassengers(newP);
                                                            } else if (passengers.length < 6) {
                                                                setPassengers([...passengers, { name: mp.name, age: mp.age, gender: mp.gender, berthPreference: mp.berthPreference || 'No Preference', aadhaar: mp.aadhaar || '', isHandicapped: false }]);
                                                            } else {
                                                                alert('Max 6 passengers allowed');
                                                            }
                                                            setShowMasterList(false);
                                                        }}
                                                        style={{ padding: '10px', borderBottom: '1px solid #eee', cursor: 'pointer', fontSize: '13px' }}
                                                        onMouseOver={(e) => e.target.style.background = '#f9fafb'}
                                                        onMouseOut={(e) => e.target.style.background = 'white'}
                                                    >
                                                        <strong>{mp.name}</strong> ({mp.age}, {mp.gender})
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {passengers.map((p, index) => (
                                <div key={index} style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: index !== passengers.length - 1 ? '1px dashed #e5e7eb' : 'none' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                        <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#374151' }}>Passenger {index + 1}</div>
                                        <div style={{ display: 'flex', gap: '15px' }}>
                                            {/* Save to Master List Button */}
                                            {p.name && p.age && (
                                                <button
                                                    type="button"
                                                    onClick={async () => {
                                                        try {
                                                            const token = user.token;
                                                            const config = { headers: { 'Authorization': `Bearer ${token}` } };
                                                            await axios.post('http://localhost:5000/api/users/masterlist', {
                                                                name: p.name, age: p.age, gender: p.gender, berthPreference: p.berthPreference, aadhaar: p.aadhaar
                                                            }, config);
                                                            alert('Passenger Saved to Master List!');
                                                            // Refresh list
                                                            const { data } = await axios.get('http://localhost:5000/api/users/masterlist', config);
                                                            setMasterList(data);
                                                        } catch (err) { alert('Failed to save'); }
                                                    }}
                                                    style={{ color: '#059669', background: 'none', border: 'none', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                                                >
                                                    + SAVE
                                                </button>
                                            )}
                                            {passengers.length > 1 && (
                                                <button type="button" onClick={() => removePassenger(index)} style={{ color: '#ef4444', background: 'none', border: 'none', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>REMOVE</button>
                                            )}
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 0.8fr 1fr 1.2fr 1.5fr', gap: '15px' }}>
                                        <div>
                                            <label style={labelStyle}>Name</label>
                                            <input type="text" style={inputStyle} placeholder="Full Name" value={p.name} onChange={(e) => handlePassengerChange(index, 'name', e.target.value)} required />
                                        </div>
                                        <div>
                                            <label style={labelStyle}>Age</label>
                                            <input type="number" style={inputStyle} placeholder="Age" value={p.age} onChange={(e) => handlePassengerChange(index, 'age', e.target.value)} required />
                                        </div>
                                        <div>
                                            <label style={labelStyle}>Gender</label>
                                            <select style={inputStyle} value={p.gender} onChange={(e) => handlePassengerChange(index, 'gender', e.target.value)}>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Transgender">Transgender</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label style={labelStyle}>Berth Preference</label>
                                            <select style={inputStyle} value={p.berthPreference} onChange={(e) => handlePassengerChange(index, 'berthPreference', e.target.value)}>
                                                {getBerthOptions(selectedClass).map(opt => (
                                                    <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label style={labelStyle}>Aadhaar (Optional)</label>
                                            <input type="text" style={inputStyle} placeholder="12-digit" value={p.aadhaar} onChange={(e) => handlePassengerChange(index, 'aadhaar', e.target.value)} maxLength="12" />
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', marginTop: '25px' }}>
                                            <input
                                                type="checkbox"
                                                checked={p.isHandicapped}
                                                onChange={(e) => handlePassengerChange(index, 'isHandicapped', e.target.checked)}
                                                style={{ width: '18px', height: '18px', marginRight: '8px', cursor: 'pointer' }}
                                            />
                                            <label style={{ fontSize: '13px', color: '#374151', cursor: 'pointer' }}>Handicapped?</label>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {passengers.length < 6 && (
                                <button type="button" onClick={addPassenger} style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '2px dashed #d1d5db',
                                    borderRadius: '8px',
                                    background: '#f9fafb',
                                    color: '#4b5563',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}>
                                    + ADD ANOTHER TRAVELLER
                                </button>
                            )}
                        </div>

                        <div style={{ ...modernCard, marginTop: '25px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937' }}>Total: ₹ {(price * passengers.length + 11.80).toFixed(2)}</div>
                                <div style={{ fontSize: '12px', color: '#6b7280' }}>{passengers.length} Passenger(s) | Includes GST & Fees</div>
                            </div>
                            <button type="submit" style={{
                                background: '#fb792b',
                                color: 'white',
                                border: 'none',
                                padding: '14px 40px',
                                borderRadius: '8px',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                boxShadow: '0 4px 6px -1px rgba(251, 121, 43, 0.4)'
                            }}>
                                PAY & BOOK
                            </button>
                        </div>
                    </form>
                </div>

                {/* Right Column: Summary Widget */}
                <div>
                    <div style={{ ...modernCard, padding: '20px', position: 'sticky', top: '20px' }}>
                        <h4 style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#213d77', borderBottom: '1px solid #e5e7eb', paddingBottom: '10px' }}>Fare Breakdown</h4>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px', color: '#4b5563' }}>
                            <span>Base Fare per adult</span>
                            <span>₹ {price}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px', color: '#4b5563' }}>
                            <span>Passengers</span>
                            <span>x {passengers.length}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px', color: '#4b5563' }}>
                            <span>Convenience Fee</span>
                            <span>₹ 11.80</span>
                        </div>

                        <div style={{ borderTop: '1px dashed #d1d5db', margin: '15px 0' }}></div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: '600', color: '#111827' }}>Total Payable</span>
                            <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#213d77' }}>₹ {(price * passengers.length + 11.80).toFixed(2)}</span>
                        </div>

                        <div style={{ marginTop: '20px', background: '#e0f2fe', padding: '10px', borderRadius: '6px', fontSize: '12px', color: '#0369a1' }}>
                            Free Cancellation enabled for this trip. T&C apply.
                        </div>
                    </div>
                </div>
            </div >
        </div >
    );
};

export default Booking;
