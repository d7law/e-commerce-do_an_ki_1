const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const bcrypt = require('bcrypt');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

passport.use(
    'local.signup',
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true,
        },
        async (req, email, password, done) => {
            try {
                const user = await User.findOne({ email: email });
                if (user) {
                    return done(null, false, { message: 'Email already exists' });
                }
                if (password != req.body.password2) {
                    return done(null, false, { message: 'Wrong password' });
                }
                const newUser = await new User({
                    username: req.body.name,
                    email: email,
                    password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null),
                });
                await newUser.save();
                return done(null, newUser);
            } catch (err) {
                console.log(err);
                return done(err);
            }
        },
    ),
);

passport.use(
    'local.signin',
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: false,
        },
        async (email, password, done) => {
            try {
                const user = await User.findOne({ email: email });
                if (!user) {
                    return done(null, false, { message: 'User does not exist' });
                }
                if (!user.validPassword(password)) {
                    return done(null, false, { message: 'Wrong password' });
                }
                return done(null, user);
            } catch (err) {
                console.log(err);
                return done(err);
            }
        },
    ),
);
