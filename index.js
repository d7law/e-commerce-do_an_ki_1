const express = require('express');
const app = express();
const dotenv = require('dotenv');
const db = require('./config/db/connectdb');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoose = require('mongoose');
var MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const adminRouter = require('./routes/admin');

dotenv.config();
db.connect();
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRouter);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({ mongoUrl: process.env.DATABASE_URI }),
        //set session expired is 24h
        cookie: { maxAge: 60 * 1000 * 60 * 24 },
    }),
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

//router config
const productsRouter = require('./routes/product.route');
app.use('/products', productsRouter);

app.get('/', (req, res) => {
    res.send('hello world');
});
app.listen(3000, () => {
    console.log('app is running');
});
