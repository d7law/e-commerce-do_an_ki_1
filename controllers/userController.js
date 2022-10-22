const Product = require('../models/product');
const Order = require('../models/order');
const Cart = require('../models/cart');
const csrf = require('csurf');

class userController {
    //[GET] /user/signup
    getSignup(req, res) {
        var errorMsg = req.flash('error')[0];
        res.render('user/signup', {
            csrfToken: req.csrfToken(),
            errorMsg,
            pageName: 'Sign Up',
        });
    }

    //[POST] /user/signup
    async signup(req, res) {
        try {
            //if there is cart session, save it to the user's cart in db
            if (req.session.cart) {
                const cart = await new Cart(req.session.cart);
                cart.user = req.user._id;
                await cart.save();
            }
            //redirect to the previous URL
            if (req.session.oldUrl) {
                var oldUrl = req.session.oldUrl;
                req.session.oldUrl = null;
                res.redirect(oldUrl);
            } else {
                res.redirect('user/profile');
            }
        } catch (err) {
            console.log(err);
            req.flash('error', err.message);
            return res.redirect('/');
        }
    }

    //[GET] /user/signin
    async getSignin(req, res) {
        var errorMsg = req.flash('error')[0];
        res.render('user/signin', {
            csrfToken: req.csrfToken(),
            errorMsg,
            pageName: 'Sign In',
        });
    }

    //[POST] /user/signin
    async signin(req, res) {
        try {
            let cart = await Cart.findOne({ user: req.user._id });
            if (req.session.cart && !cart) {
                const cart = await new Cart(req.session.cart);
                cart.user = req.user._id;
                await cart.save();
            }
            //if user has a card in db, load it to session
            if (cart) {
                req.session.cart = cart;
            }
            //redirect to old URL before signing in
            if (req.session.oldUrl) {
                var oldUrl = req.session.oldUrl;
                req.session.oldUrl = null;
                res.redirect(oldUrl);
            } else {
                res.redirect('user/profile');
            }
        } catch (err) {
            console.log(err);
            req.flash('error', err.message);
            return res.redirect('/');
        }
    }

    //[GET] /user/profile
    async profile(req, res) {
        const successMsg = req.flash('success')[0];
        const errorMsg = req.flash('error')[0];
        try {
            const allOrders = await Order.find({ user: req.user });
            res.render('user/profile', {
                orders: allOrders,
                errorMsg,
                successMsg,
                pageName: 'User Profile',
            });
        } catch (err) {
            console.log(err);
            return res.redirect('/');
        }
    }

    //[GET] //user/logout
    logout(req, res) {
        req.logout((err) => {
            if (err) {
                return console.log(err);
            } else {
                req.session.cart = null;
                return res.redirect('/');
            }
        });

    }
}

module.exports = new userController();
