const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const csrf = require('csurf');
const stripe = require('stripe')(process.env.STRIPE_PRIVARE_KEY);
const middleware = require('../middleware/index');

const csrfProtection = csrf();
router.use(csrfProtection);

router.get('/', homeController.getHome);

module.exports = router;

