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

    // Constraint: Seats 1 and 4 are reserved for Handicapped
    const RESERVED_SEAT_NUMBERS = [1, 4];

    // Check if Chart is Prepared (Simulated: If booking is on the same day as journey)
    const isChartPrepared = new Date().toDateString() === new Date(journeyDate).toDateString();

    // Strategy 1: Try to fit whole group in one coach
    for (const coach of coaches) {
        if (remainingPassengers.length === 0) break;

        const allAvailableSeats = coach.seats.filter(seat => !occupiedSeats.has(`${coach._id.toString()}_${seat.number}`));

        // Partition Seats
        const reservedSeats = allAvailableSeats.filter(s => RESERVED_SEAT_NUMBERS.includes(s.number));
        const generalSeats = allAvailableSeats.filter(s => !RESERVED_SEAT_NUMBERS.includes(s.number));

        // Check if coach has enough seats (considering accessibility rules)
        // This is a heuristic check; precise check happens during assignment
        if (allAvailableSeats.length >= remainingPassengers.length) {

            const coachAssignments = [];
            let tempReserved = [...reservedSeats];
            let tempGeneral = [...generalSeats];
            let coachPassengers = [...remainingPassengers];
            let possible = true;

            // Sort passengers: Handicapped first, then Seniors, then Others
            // This ensures handicapped get first dibs on reserved seats
            coachPassengers.sort((a, b) => {
                if (a.isHandicapped && !b.isHandicapped) return -1;
                if (!a.isHandicapped && b.isHandicapped) return 1;
                // Then Seniors
                const isASenior = a.age > 51 || (a.gender === 'Female' && a.age >= 45);
                const isBSenior = b.age > 51 || (b.gender === 'Female' && b.age >= 45);
                if (isASenior && !isBSenior) return -1;
                if (!isASenior && isBSenior) return 1;
                return 0;
            });

            for (const p of coachPassengers) {
                let assignedSeat = null;

                if (p.isHandicapped) {
                    // Try Reserved first, then General
                    if (tempReserved.length > 0) assignedSeat = tempReserved.shift();
                    else if (tempGeneral.length > 0) assignedSeat = tempGeneral.shift();
                } else {
                    const isSenior = p.age > 51 || (p.gender === 'Female' && p.age >= 45);

                    if (isSenior && isChartPrepared) {
                        // Senior & Chart Prepared: Can take General OR Reserved
                        if (tempGeneral.length > 0) assignedSeat = tempGeneral.shift();
                        else if (tempReserved.length > 0) assignedSeat = tempReserved.shift();
                    } else {
                        // General User or Senior (Early): General Only
                        if (tempGeneral.length > 0) assignedSeat = tempGeneral.shift();
                    }
                }

                if (assignedSeat) {
                    coachAssignments.push({ passenger: p, seat: assignedSeat });
                } else {
                    possible = false;
                    break;
                }
            }

            if (possible) {
                // Apply Assignments
                coachAssignments.forEach(assignment => {
                    allocatedPassengers.push({
                        ...assignment.passenger,
                        coachId: coach._id,
                        coachCode: coach.code,
                        seatNumber: assignment.seat.number,
                        berth: assignment.seat.berth,
                        status: 'CNF'
                    });
                    occupiedSeats.add(`${coach._id.toString()}_${assignment.seat.number}`);
                });
                remainingPassengers = [];
                break; // Group allocated
            }
        }
    }

    // Strategy 2: Split across coaches (Same Logic applied per passenger)
    if (remainingPassengers.length > 0) {
        for (const coach of coaches) {
            if (remainingPassengers.length === 0) break;

            const allAvailableSeats = coach.seats.filter(seat => !occupiedSeats.has(`${coach._id.toString()}_${seat.number}`));
            // Re-partition per coach as we iterate
            let tempReserved = allAvailableSeats.filter(s => RESERVED_SEAT_NUMBERS.includes(s.number));
            let tempGeneral = allAvailableSeats.filter(s => !RESERVED_SEAT_NUMBERS.includes(s.number));

            // We must iterate backwards or effectively separate processed passengers, 
            // but `remainingPassengers` is a queue.
            // Let's process head of queue.

            // Optimization: Process passengers one by one against this coach
            const unallocatedInThisCoach = [];

            while (remainingPassengers.length > 0) {
                const p = remainingPassengers[0]; // Peek
                let assignedSeat = null;

                if (p.isHandicapped) {
                    if (tempReserved.length > 0) assignedSeat = tempReserved.shift();
                    else if (tempGeneral.length > 0) assignedSeat = tempGeneral.shift();
                } else {
                    const isSenior = p.age > 51 || (p.gender === 'Female' && p.age >= 45);
                    if (isSenior && isChartPrepared) {
                        if (tempGeneral.length > 0) assignedSeat = tempGeneral.shift();
                        else if (tempReserved.length > 0) assignedSeat = tempReserved.shift();
                    } else {
                        if (tempGeneral.length > 0) assignedSeat = tempGeneral.shift();
                    }
                }

                if (assignedSeat) {
                    allocatedPassengers.push({
                        ...p,
                        coachId: coach._id,
                        coachCode: coach.code,
                        seatNumber: assignedSeat.number,
                        berth: assignedSeat.berth,
                        status: 'CNF'
                    });
                    occupiedSeats.add(`${coach._id.toString()}_${assignedSeat.number}`);
                    remainingPassengers.shift(); // Remove from queue
                } else {
                    // This passenger cannot fit in this coach (e.g. only reserved seats left and they are general)
                    // But maybe subsequent passengers in the group can? 
                    // For "Split", we usually just move to next coach for this passenger.
                    // But strictly, we should try to fit as many as possible.
                    // If we can't fit THIS passenger, we break and try next coach for HIM.
                    break;
                }
            }
        }
    }

    // Strategy 3: Waiting List
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
