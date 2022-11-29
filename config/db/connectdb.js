const mongoose = require('mongoose');
const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI_LOCAL;
        await mongoose
            .connect(uri, {
                useNewUrlParser: true,
                //useCreateIndex: true,
                useUnifiedTopology: true,
            })
            .catch((err) => console.log(err));
        const connection = mongoose.connection;
        console.log(uri);
        console.log('Connect DB success');
    } catch (err) {
        console.log('failed to connect db');
    }
};

module.exports = connectDB;
