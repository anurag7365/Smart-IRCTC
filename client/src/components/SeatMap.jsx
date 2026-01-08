import React from 'react';

const CoachSeatMap = ({ coachCode, seats, allocatedSeats = [] }) => {
    // allocatedSeats: array of seat numbers that are highlighted/booked by current user in this session

    return (
        <div className="card" style={{ overflowX: 'auto' }}>
            <h4>Coach: {coachCode}</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '10px', minWidth: '600px' }}>
                {seats.map((seat) => {
                    const isBooked = seat.isBooked;
                    const isAllocated = allocatedSeats.includes(seat.number);

                    let bg = '#fff';
                    if (isBooked) bg = '#e0e0e0'; // Grey for booked
                    if (isAllocated) bg = '#4caf50'; // Green for just allocated to user

                    return (
                        <div key={seat.number} style={{
                            border: '1px solid #ccc',
                            padding: '10px',
                            textAlign: 'center',
                            background: bg,
                            borderRadius: '4px',
                            position: 'relative'
                        }}>
                            <div style={{ fontSize: '12px', fontWeight: 'bold' }}>{seat.number}</div>
                            <div style={{ fontSize: '10px' }}>{seat.berth}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CoachSeatMap;
