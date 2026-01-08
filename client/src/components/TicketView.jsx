import React from 'react';
import QRCode from 'react-qr-code';

const TicketView = ({ booking }) => {
    if (!booking) return null;

    if (!booking || !booking.train || !booking.source || !booking.destination) return <div style={{ textAlign: 'center', color: 'red' }}>Ticket Data Incomplete. Please check My Bookings.</div>;

    const { pnr, train, source, destination, journeyDate, passengers, totalAmount, classType } = booking;
    // Mock Transaction ID
    const transactionId = "10000" + Math.floor(Math.random() * 9000000000);

    return (
        <div className="ticket-container" style={{
            fontFamily: '"Roboto", sans-serif',
            maxWidth: '850px',
            margin: '20px auto',
            border: '1px solid #999',
            background: 'white',
            color: '#333',
            boxShadow: '0 0 20px rgba(0,0,0,0.15)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <style>
                {`
                @media print {
                    /* Hide everything by default */
                    body * { visibility: hidden; }
                    
                    /* Show ONLY the ticket container and its contents */
                    .ticket-container, .ticket-container * { visibility: visible; }
                    
                    /* Reset body styles for print */
                    body { margin: 0 !important; padding: 0 !important; background: white !important; }
                    
                    /* Reset ticket container position to top of first page */
                    .ticket-container {
                        position: absolute !important;
                        left: 0 !important;
                        right: 0 !important;
                        top: 0 !important;
                        width: 100% !important;
                        max-width: none !important;
                        margin: 0 !important;
                        padding: 10px !important;
                        border: 1px solid #333 !important;
                        box-shadow: none !important;
                        transform: none !important;
                    }
                    
                    /* Hide elements explicitly marked or common layout elements */
                    .no-print, nav, footer, .navbar, .footer, .smart-assist, header, .sidebar, .smart-assist-container { 
                        display: none !important; 
                        height: 0 !important;
                        margin: 0 !important;
                        padding: 0 !important;
                    }

                    main {
                        margin-top: 0 !important;
                        padding-top: 0 !important;
                        min-height: auto !important;
                    }
                    
                    @page {
                        size: portrait;
                        margin: 5mm;
                    }

                    /* Compact table fonts for single page fit */
                    .ticket-container table { font-size: 11px !important; }
                    .ticket-container h2 { font-size: 16px !important; }
                    .ticket-container div { font-size: 12px !important; }
                }
                `}
            </style>
            {/* Watermark */}
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(-30deg)', fontSize: '100px', color: 'rgba(0,0,0,0.03)', fontWeight: 'bold', pointerEvents: 'none', zIndex: 0, whiteSpace: 'nowrap' }}>
                INDIAN RAILWAYS
            </div>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', borderBottom: '2px solid #000' }}>
                <img src="https://pnghdpro.com/wp-content/themes/pnghdpro/download/social-media-and-brands/indian-railways-logo.png" alt="Indian Railways" style={{ height: '60px' }} />
                <h2 style={{ textDecoration: 'underline', fontSize: '18px', margin: 0 }}>Electronic Reservation Slip (ERS)</h2>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#213d77' }}>IRCTC</div>
                </div>
            </div>

            {/* Route Info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', textAlign: 'center', padding: '10px', background: '#eef', borderBottom: '1px solid #000' }}>
                <div>
                    <strong>Booked From</strong>
                    <div>{source.name} ({source.code})</div>
                    <div>Start Date* {new Date(journeyDate).toLocaleDateString()}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ background: '#5b9bd5', color: 'white', padding: '5px 20px', fontWeight: 'bold' }}>Boarding At</div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold' }}>&rarr;</div>
                    <div>{source.name} ({source.code})</div>
                    <div>Departure* {train.route.find(r => r.station === source._id)?.departureTime || "08:00"}</div>
                </div>
                <div>
                    <strong>To</strong>
                    <div>{destination.name} ({destination.code})</div>
                    <div>Arrival* {new Date(journeyDate).toLocaleDateString()}</div>
                </div>
            </div>

            {/* Train / PNR Details */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', borderBottom: '1px solid #000', fontSize: '14px' }}>
                <div style={{ padding: '8px', borderRight: '1px solid #ccc' }}>
                    <strong>PNR</strong>
                    <div style={{ color: '#007bff', fontSize: '16px', fontWeight: 'bold' }}>{pnr}</div>
                    <div>Quota: GENERAL (GN)</div>
                </div>
                <div style={{ padding: '8px', borderRight: '1px solid #ccc' }}>
                    <strong>Train No./Name</strong>
                    <div style={{ color: '#007bff', fontWeight: 'bold' }}>{train.number} / {train.name}</div>
                    <div>Distance: {train.route.reduce((acc, curr) => Math.max(acc, curr.distanceFromSource), 0)} KM</div>
                </div>
                <div style={{ padding: '8px', borderRight: '1px solid #ccc' }}>
                    <strong>Class</strong>
                    <div style={{ color: '#007bff', fontWeight: 'bold' }}>{classType}</div>
                    <div>Booking Date: {new Date().toLocaleDateString()}</div>
                </div>
                <div style={{ padding: '8px' }}>
                    {/* Placeholder for QR Code */}
                    {/* QR Code */}
                    <div style={{ margin: '0 auto', display: 'flex', justifyContent: 'center' }}>
                        <QRCode value={`PNR:${pnr}|TRAIN:${train.number}`} size={80} />
                    </div>
                </div>
            </div>

            {/* Passenger Details */}
            <div style={{ padding: '10px' }}>
                <div style={{ background: '#f0f0f0', fontWeight: 'bold', padding: '5px' }}>Passenger Details</div>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '5px', fontSize: '13px' }}>
                    <thead>
                        <tr style={{ background: '#ddd' }}>
                            <th style={{ padding: '5px', border: '1px solid #999' }}>#</th>
                            <th style={{ padding: '5px', border: '1px solid #999' }}>Name</th>
                            <th style={{ padding: '5px', border: '1px solid #999' }}>Age</th>
                            <th style={{ padding: '5px', border: '1px solid #999' }}>Gender</th>
                            <th style={{ padding: '5px', border: '1px solid #999' }}>Booking Status</th>
                            <th style={{ padding: '5px', border: '1px solid #999' }}>Current Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {passengers.map((p, i) => (
                            <tr key={i}>
                                <td style={{ padding: '5px', border: '1px solid #ccc', textAlign: 'center' }}>{i + 1}</td>
                                <td style={{ padding: '5px', border: '1px solid #ccc' }}>
                                    {p.name}<br />
                                    <span style={{ fontSize: '10px', color: '#666' }}>ADHR: {p.aadhaar}</span>
                                </td>
                                <td style={{ padding: '5px', border: '1px solid #ccc', textAlign: 'center' }}>{p.age}</td>
                                <td style={{ padding: '5px', border: '1px solid #ccc', textAlign: 'center' }}>{p.gender}</td>
                                <td style={{ padding: '5px', border: '1px solid #ccc' }}>CNF/{p.coachCode}/{p.seatNumber}/{p.berth}</td>
                                <td style={{ padding: '5px', border: '1px solid #ccc' }}>CNF/{p.coachCode}/{p.seatNumber}/{p.berth}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Payment Details */}
            <div style={{ padding: '10px', borderTop: '1px solid #000' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Payment Details</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', maxWidth: '400px' }}>
                    <span>Ticket Fare</span>
                    <span>₹ {totalAmount.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', maxWidth: '400px' }}>
                    <span>IRCTC Convenience Fee</span>
                    <span>₹ 11.80</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', maxWidth: '400px', fontWeight: 'bold', borderTop: '1px solid #ccc', marginTop: '5px' }}>
                    <span>Total Fare (all inclusive)</span>
                    <span>₹ {(totalAmount + 11.80).toFixed(2)}</span>
                </div>
            </div>

            <div style={{ padding: '10px', fontSize: '11px', borderTop: '1px solid #000' }}>
                <strong>Transaction ID:</strong> {transactionId}<br />
                * This ticket is booked on a personal User ID. Its sale/purchase is an offence u/s 143 of the Railways Act, 1989.<br />
                * Prescribed original ID proof is required.
            </div>

            {/* Instructions */}
            <div style={{ padding: '10px', fontSize: '11px', borderTop: '1px solid #000' }}>
                <div style={{ fontWeight: 'bold' }}>INSTRUCTIONS:</div>
                <ul style={{ paddingLeft: '20px', margin: '5px 0' }}>
                    <li>Prescribed Valid ID proof is required for travel.</li>
                    <li>Please check your train timings before departure.</li>
                    <li>Passenger should report at least 30 minutes before departure.</li>
                    <li>No refund for confirmed tickets after chart preparation.</li>
                    <li>This ERS is valid when accompanied by original ID proof.</li>
                </ul>
            </div>

            {/* Customer Care */}
            <div style={{ padding: '10px', fontSize: '11px', borderTop: '1px solid #000', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                    <strong>Customer Care:</strong><br />
                    Ph: 14646<br />
                    Email: care@irctc.co.in
                </div>
                <div style={{ textAlign: 'right' }}>
                    <strong>Emergency:</strong><br />
                    GRP/RPF: 182
                </div>
            </div>


            <div style={{ padding: '10px', textAlign: 'center', background: '#eee', borderTop: '1px solid #000' }} className="no-print">
                <button onClick={() => window.print()} className="btn" style={{ background: '#fb792b', color: 'white', padding: '10px 20px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>PRINT ERS</button>
            </div>
        </div >
    );
};

export default TicketView;
