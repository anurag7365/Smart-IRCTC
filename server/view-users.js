const mongoose = require('mongoose');
const User = require('./src/models/User');
const dotenv = require('dotenv');

dotenv.config();

const viewUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('\n--- SMART IRCTC DATABASE USERS ---\n');

        const users = await User.find({}).sort({ createdAt: -1 });

        if (users.length === 0) {
            console.log("No users found in the database.");
        } else {
            console.table(users.map(user => ({
                Name: user.name,
                Email: user.email,
                Role: user.role,
                Joined: new Date(user.createdAt).toLocaleString()
            })));
        }

        console.log('\n----------------------------------\n');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

viewUsers();
