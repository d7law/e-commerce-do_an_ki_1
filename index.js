const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const db = require('./config/db/connectdb').connect();
const path = require('path');
const passport = require('passport');
const createError = require('http-errors');
const errorHandler = require('./middleware');

const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoose = require('mongoose');
var MongoStore = require('connect-mongo');
const Category = require('./models/category');
const flash = require('connect-flash');
const adminRouter = require('./routes/admin');

//config passport
require('./config/passport');
// ejs view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/admin', adminRouter);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
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

//global variables across routes
app.use(async (req, res, next) => {
    try {
        res.locals.login = req.isAuthenticated();
        res.locals.session = req.session;
        res.locals.currentUser = req.user;
        const categories = await Category.find({}).sort({ title: 1 }).exec();
        res.locals.categories = categories;
        next();
    } catch (err) {
        console.log(err);
        res.redirect('/');
    }
});

//add breadcrumbs
get_breadcrumbs = (url) => {
    var rtn = [{ name: 'Home', url: '/' }],
        acc = '', //accumulative url
        arr = url.substring(1).split('/');

    for (i = 0; i < arr.length; i++) {
        acc = i != arr.length - 1 ? acc + '/' + arr[i] : null;
        rtn[i + 1] = {
            name: arr[i].charAt(0).toUpperCase() + arr[i].slice(1),
            url: acc,
        };
    }
    return rtn;
};
app.use((req, res, next) => {
    req.breadcrumbs = get_breadcrumbs(req.originalUrl);
    next();
});

//router config
const usersRouter = require('./routes/user.route');
const productsRouter = require('./routes/product.route');
const pagesRouter = require('./routes/pages.route');
const indexRouter = require('./routes/index');
app.use('/user', usersRouter);
app.use('/products', productsRouter);
app.use('/pages', pagesRouter)
app.use('/', indexRouter);

//catch 404 and send to error handler
app.use((req, res, next) => {
    next(createError(404));
});
//error handler
app.use(errorHandler.errorHandler);

app.listen(process.env.PORT, () => {
    console.log('app is running');
});

module.exports = app;
