const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Train = require('./src/models/Train');
const Coach = require('./src/models/Coach');

dotenv.config();

const populateCoaches = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const trains = await Train.find({});
        console.log(`Checking ${trains.length} trains for coaches...`);

        let updatedCount = 0;
        let skippedCount = 0;

        for (const train of trains) {
            const coachCount = await Coach.countDocuments({ trainId: train._id });

            if (coachCount > 0) {
                skippedCount++;
                continue;
            }

            // Create default coaches based on train classes
            const coachesToCreate = [];
            const classes = train.classes && train.classes.length > 0 ? train.classes : ['SL', '3A', '2A'];

            classes.forEach(cls => {
                // Assume 2 coaches per class for coverage
                for (let i = 1; i <= 2; i++) {
                    // Generate ~72 seats for SL, 64 for 3A, 48 for 2A, etc.
                    let seatCount = 72;
                    if (cls === '3A') seatCount = 64;
                    if (cls === '2A') seatCount = 48;
                    if (cls === '1A') seatCount = 24;
                    if (cls === 'CC') seatCount = 70;

                    const seats = Array.from({ length: seatCount }, (_, index) => ({
                        number: index + 1,
                        berth: cls === 'SL' ? 'Lower' : 'Window', // Valid enum values
                        isBooked: false
                    }));

                    coachesToCreate.push({
                        trainId: train._id,
                        code: `${cls}-${i}`,
                        type: cls,
                        seats: seats
                    });
                }
            });

            if (coachesToCreate.length > 0) {
                await Coach.insertMany(coachesToCreate);
                updatedCount++;
            }

            if (updatedCount % 100 === 0) process.stdout.write('.');
        }

        console.log(`\nProcess Complete!`);
        console.log(`Updated (Populated): ${updatedCount} trains`);
        console.log(`Skipped (Already had coaches): ${skippedCount} trains`);

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

populateCoaches();
