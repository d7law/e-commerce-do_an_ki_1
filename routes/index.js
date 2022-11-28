const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const csrf = require('csurf');
const stripe = require('stripe')(process.env.STRIPE_PRIVARE_KEY);
const middleware = require('../middleware/index');

const csrfProtection = csrf();
router.use(csrfProtection);

router.get('/', homeController.getHome);
router.get('/shopping-cart', homeController.getCart);
router.get('/add-to-cart/:id', homeController.addToCart);
router.get('/reduce/:id', homeController.reduceFromCart);
router.get('/remove-all/:id', homeController.removeAllFromCart);
router.get('/checkout', middleware.isLoggedIn, homeController.checkOut);

module.exports = router;
