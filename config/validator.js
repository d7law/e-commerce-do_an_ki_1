const { check, validationResult } = require('express-validator');

const userSignUpValidationRules = () => {
    return [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Invalid email').not().isEmpty().isEmail(),
        check('password', 'Please enter a password with 6 or more characters').not().isEmpty().isLength({ min: 6 }),
    ];
};

const userSignInValidationRules = () => {
    return [
        check('email', 'Invalid email').not().isEmpty().isEmail(),
        check('password', 'Invalid password').not().isEmpty().isLength({ min: 6 }),
    ];
};

const userContactUsValidationRules = () => {
    return [
        check('name', 'Please enter a name').not().isEmpty(),
        check('email', 'Please enter a valid email address').not().isEmpty().isEmail(),
        check('message', 'Please enter a message').not().isEmpty(),
    ];
};

const validateSignUp = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        var msgs = [];
        errors.array().forEach((err) => {
            msgs.push(err.msg);
        });
        req.flash('error', msgs);
        return res.redirect('/user/signup');
    }
    next();
};

const validateSignIn = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        var msgs = [];
        errors.array().forEach((err) => {
            msgs.push(err.msg);
        });
        req.flash('error', msgs);
        return res.redirect('/user/signin');
    }
    next();
};

const validateContactUs = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        var messages = [];
        errors.array().forEach((error) => {
            messages.push(error.msg);
        });
        console.log(messages);
        req.flash('error', messages);
        return res.redirect('/pages/contact-us');
    }
    next();
};

module.exports = {
    userSignUpValidationRules,
    userSignInValidationRules,
    userContactUsValidationRules,
    validateSignUp,
    validateSignIn,
    validateContactUs,
};
