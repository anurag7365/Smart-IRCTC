const Coach = require('../models/Coach');

/**
 * Smart Seat Allocation Logic
 * @param {Array} passengers - List of passengers to allocate seats for
 * @param {String} trainId - ID of the train
 * @param {String} classType - Class selected (e.g., '3A')
 * @returns {Array} - List of passengers with assigned seats
 */
const Booking = require('../models/Booking');

/**
 * Smart Seat Allocation Logic
 * @param {Array} passengers - List of passengers to allocate seats for
 * @param {String} trainId - ID of the train
 * @param {String} classType - Class selected (e.g., '3A')
 * @param {String} journeyDate - Date of journey
 * @returns {Array} - List of passengers with assigned seats
 */
const allocateSeats = async (passengers, trainId, classType, journeyDate) => {
    // 1. Fetch all coaches for this train and class
    const coaches = await Coach.find({ trainId, type: classType }).sort({ code: 1 });

    if (!coaches || coaches.length === 0) {
        throw new Error(`No coaches found for class ${classType}`);
    }

    // 2. Fetch existing bookings for this train, date, and class to find occupied seats
    // We need to parse the date to match the stored format, usually ISO start of day or string equality depending on storage.
    // Assuming simple string or Date object match. 
    // Best practice: match localized date or range. For MVP simpler match:
    const startOfDay = new Date(journeyDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(journeyDate);
    endOfDay.setHours(23, 59, 59, 999);

    const existingBookings = await Booking.find({
        train: trainId,
        journeyDate: { $gte: startOfDay, $lte: endOfDay },
        classType: classType,
        status: 'Booked'
    });

    const occupiedSeats = new Set();
    existingBookings.forEach(b => {
        b.passengers.forEach(p => {
            if (p.status === 'CNF' && p.coachId && p.seatNumber) {
                occupiedSeats.add(`${p.coachId.toString()}_${p.seatNumber}`);
            }
        });
    });

    const allocatedPassengers = [];
    let remainingPassengers = [...passengers];

    // Strategy 1: Try to fit whole group in one coach
    for (const coach of coaches) {
        if (remainingPassengers.length === 0) break;

        // Filter available seats based on Occupied Set, NOT static isBooked
        const availableSeats = coach.seats.filter(seat => !occupiedSeats.has(`${coach._id.toString()}_${seat.number}`));

        if (availableSeats.length >= remainingPassengers.length) {
            // Found a coach that can fit the group!

            // 1. Separate Seniors (Age > 51) and Others
            const seniors = remainingPassengers.filter(p => p.age > 51 || (p.gender === 'Female' && p.age >= 45));
            const others = remainingPassengers.filter(p => !(p.age > 51 || (p.gender === 'Female' && p.age >= 45)));

            // 2. Separate Lower Berths and Others in Available Seats
            const lowerBerths = availableSeats.filter(s => s.berth === 'Lower');
            const otherBerths = availableSeats.filter(s => s.berth !== 'Lower');

            // 3. Allocation Strategy
            // Seniors get Lower berths first
            const seatAssignments = [];

            // Assign Lower to Seniors
            while (seniors.length > 0 && lowerBerths.length > 0) {
                seatAssignments.push({ passenger: seniors.shift(), seat: lowerBerths.shift() });
            }

            // If seniors still left (no lower berths), assign from other berths
            while (seniors.length > 0) {
                const seat = otherBerths.length > 0 ? otherBerths.shift() : lowerBerths.shift();
                seatAssignments.push({ passenger: seniors.shift(), seat: seat });
            }

            // Assign remaining seats to others
            while (others.length > 0) {
                const seat = otherBerths.length > 0 ? otherBerths.shift() : lowerBerths.shift();
                seatAssignments.push({ passenger: others.shift(), seat: seat });
            }

            // 4. Create Allocation Objects
            seatAssignments.forEach(assignment => {
                allocatedPassengers.push({
                    ...assignment.passenger,
                    coachId: coach._id,
                    coachCode: coach.code,
                    seatNumber: assignment.seat.number,
                    berth: assignment.seat.berth,
                    status: 'CNF'
                });
                // Mark seat as occupied in our local set to prevent double booking in same request (though logical split covers it)
                occupiedSeats.add(`${coach._id.toString()}_${assignment.seat.number}`);
            });

            remainingPassengers = [];
        }
    }

    // Strategy 2: Split across coaches if not fit in one
    if (remainingPassengers.length > 0) {
        for (const coach of coaches) {
            if (remainingPassengers.length === 0) break;

            const availableSeats = coach.seats.filter(seat => !occupiedSeats.has(`${coach._id.toString()}_${seat.number}`));

            for (const seat of availableSeats) {
                if (remainingPassengers.length === 0) break;

                const passenger = remainingPassengers.shift();
                allocatedPassengers.push({
                    ...passenger,
                    coachId: coach._id,
                    coachCode: coach.code,
                    seatNumber: seat.number,
                    berth: seat.berth,
                    status: 'CNF'
                });
                occupiedSeats.add(`${coach._id.toString()}_${seat.number}`);
            }
        }
    }

    // Strategy 3: Waiting List (If still remaining)
    if (remainingPassengers.length > 0) {
        remainingPassengers.forEach(p => {
            allocatedPassengers.push({
                ...p,
                status: 'WL',
                coachCode: 'WL',
                seatNumber: 0,
                berth: 'NA'
            });
        });
    }

    return { allocatedPassengers, coaches };
};

module.exports = { allocateSeats };
