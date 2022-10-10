const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const middleware = require('../middleware/index');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const {
    userSignUpValidationRules,
    userSignInValidationRules,
    userContactUsValidationRules,
    validateSignUp,
    validateSignIn,
    validateContactUs,
} = require('../config/validator');
const csrf = require('csurf');
const csurfProtection = csrf();

router.use(csurfProtection);
router.get('/signup', middleware.isNotLoggedIn, userController.getSignup);
router.post(
    '/signup',
    [
        middleware.isNotLoggedIn,
        userSignUpValidationRules(),
        validateSignUp,
        passport.authenticate('local.signup', {
            successRedirect: '/user/profile',
            failureRedirect: '/user/signup',
            failureFlash: true,
        }),
    ],
    userController.signup,
);
router.get('/signin', middleware.isNotLoggedIn, userController.getSignin);
router.post(
    '/signin',
    [
        middleware.isNotLoggedIn,
        userSignInValidationRules(),
        validateSignIn,
        passport.authenticate('local.signin', {
            failureRedirect: '/user/signin',
            failureFlash: true,
        }),
    ],
    userController.signin,
);
router.get('/profile', middleware.isLoggedIn, userController.profile);
router.get('/logout', middleware.isLoggedIn, userController.logout);
router.get('/', middleware.isNotLoggedIn, userController.getSignup);

module.exports = router;
