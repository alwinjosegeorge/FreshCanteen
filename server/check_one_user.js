const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

async function check() {
    await mongoose.connect(process.env.MONGODB_URI);
    const user = await User.findOne({ admissionNumber: /24CS044/i });
    console.log(JSON.stringify(user, null, 2));
    process.exit(0);
}
check();
