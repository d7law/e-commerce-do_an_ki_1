const express = require('express');
const csrf = require('csurf');
const nodemailer = require('nodemailer');
const router = express.Router();
const { userContactUsValidationRules, validateContactUs } = require('../config/validator');
const csrfProtection = csrf();
router.use(csrfProtection);

router.get('/contact-us', (req, res) => {
    const successMsg = req.flash('success')[0];
    const errorMsg = req.flash('error')[0];
    res.render('pages/contact-us', {
        pageName: 'Contact Us',
        csrfToken: req.csrfToken(),
        successMsg,
        errorMsg,
    });
});
router.post('/contact-us', [userContactUsValidationRules(), validateContactUs], (req, res) => {
    const smtpTrans = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.GMAIL_EMAIL || 'caonhanqd@gmail.com',
            pass: process.env.GMAIL_PASSWORD || 'hykln123',
        },
        tls: {
            rejectUnauthorized: false,
        },
    });
    const mailOpts = {
        from: req.body.email,
        to: process.env.GMAIL_EMAIL,
        subject: `Enquiry from ${req.body.name}`,
        html: `
            <div>
            <h2 style='color: #478ba2; text-align:center;'>Client's name: ${req.body.name}</h2>
            <h3 style='color: #478ba2;'>Client's email: (${req.body.email})<h3>
            </div>
            <h3 style='color: #478ba2;'>Client's message: </h3>
            <div style='font-size: 30px'>
                ${req.body.message}
            </div>
      `,
    };
    smtpTrans.sendMail(mailOpts, (error, response) => {
        if (error) {
            req.flash('error', 'Có lỗi, vui lòng kiểm tra lại đường truyền!');
            return res.redirect('pages/contact-us', { pageName: 'Contact us' });
        } else {
            req.flash('success', 'Gửi email thành công');
            return res.redirect('pages/contact-us', { pageName: 'Contact us' });
        }
    });
});
router.get('/about-us', (req, res) => {
    res.render('pages/about-us', { pageName: 'About Us' });
});
router.get('/careers', (req, res) => {
    res.render('pages/careers', {
        pageName: 'Careers',
    });
});
router.get('/shipping-policy', (req, res) => {
    res.render('pages/shipping-policy', {
        pageName: 'Shipping Policy',
    });
});

module.exports = router;
