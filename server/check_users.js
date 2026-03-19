const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

async function check() {
    await mongoose.connect(process.env.MONGODB_URI);
    const users = await User.find({ role: 'student' }).limit(5);
    console.log(JSON.stringify(users, null, 2));
    process.exit(0);
}
check();
