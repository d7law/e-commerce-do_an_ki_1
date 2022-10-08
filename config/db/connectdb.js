const mongoose = require('mongoose');
async function connect() {
    try {
        await mongoose.connect(process.env.DATABASE_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connect DB success');
    } catch (err) {
        console.log('failed to connect db');
    }
}

module.exports = { connect };
