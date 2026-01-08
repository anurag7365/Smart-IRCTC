const Coach = require('../models/Coach');

/**
 * Smart Seat Allocation Logic
 * @param {Array} passengers - List of passengers to allocate seats for
 * @param {String} trainId - ID of the train
 * @param {String} classType - Class selected (e.g., '3A')
 * @returns {Array} - List of passengers with assigned seats
 */
const allocateSeats = async (passengers, trainId, classType) => {
    // 1. Fetch all coaches for this train and class
    const coaches = await Coach.find({ trainId, type: classType }).sort({ code: 1 });

    if (!coaches || coaches.length === 0) {
        throw new Error(`No coaches found for class ${classType}`);
    }

    const allocatedPassengers = [];
    let remainingPassengers = [...passengers];

    // Strategy 1: Try to fit whole group in one coach
    for (const coach of coaches) {
        if (remainingPassengers.length === 0) break;

        const availableSeats = coach.seats.filter(seat => !seat.isBooked);

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
                const seat = otherBerths.length > 0 ? otherBerths.shift() : lowerBerths.shift(); // fallback if lower became available somehow
                seatAssignments.push({ passenger: seniors.shift(), seat: seat });
            }

            // Assign remaining seats to others
            while (others.length > 0) {
                // Prefer other berths for young people, save lower for potential future seniors? 
                // For this block allocation, we just use whatever is left to keep group together.
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
                // Mark in-memory coach object
                // We need to find the specific seat object in the original coach.seats array to update it
                const originalSeat = coach.seats.find(s => s.number === assignment.seat.number);
                if (originalSeat) originalSeat.isBooked = true;
            });

            remainingPassengers = [];
        }
    }

    // Strategy 2: Split across coaches if not fit in one
    if (remainingPassengers.length > 0) {
        for (const coach of coaches) {
            if (remainingPassengers.length === 0) break;

            const availableSeats = coach.seats.filter(seat => !seat.isBooked && !allocatedPassengers.some(p => p.coachId === coach._id && p.seatNumber === seat.number));

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
                seat.isBooked = true;
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
