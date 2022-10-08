const express = require('express');
const app = express();
const dotenv = require('dotenv');
const db = require('./config/db/connectdb');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const adminRouter = require('./routes/admin');

dotenv.config();
db.connect();
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRouter);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(
//     session({
//         secret: process.env.SESSION_SECRET,
//         resave: false,
//         saveUninitialized: false,
//         store: new MongoStore({
//             mongooseConnection: mongoose.connection,
//         }),
//         //session expires after 3 hours
//         cookie: { maxAge: 60 * 1000 * 60 * 3 },
//     }),
// );
app.get('/', (req, res) => {
    res.send('hello world');
});
app.listen(3000, () => {
    console.log('app is running');
    console.log(process.env.ADMIN_PASSWORD);
});
