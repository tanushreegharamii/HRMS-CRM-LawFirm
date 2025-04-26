// generateHash.js
const bcrypt = require('bcrypt');

async function hashPassword() {
    const plainPassword = 'admin123'; // replace with your desired password
    const hashed = await bcrypt.hash(plainPassword, 10);
    console.log("Generated Hash:", hashed);
}

hashPassword();
