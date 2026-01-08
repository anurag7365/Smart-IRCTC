const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, 'server', '.env') });

const secret = process.env.JWT_SECRET;
console.log('Secret:', secret);

const id = '659a7a9a8f1b2c3d4e5f6g7h'; // Mocked ObjectId
const token = jwt.sign({ id }, secret, { expiresIn: '30d' });
console.log('Token:', token);

try {
    const decoded = jwt.verify(token, secret);
    console.log('Decoded:', decoded);
    if (decoded.id === id) {
        console.log('SUCCESS: Token verified and ID matches');
    } else {
        console.log('FAILURE: ID mismatch');
    }
} catch (error) {
    console.log('FAILURE:', error.message);
}
