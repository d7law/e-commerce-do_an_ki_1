const Product = require('../models/product');
const Cart = require('../models/cart');
const Order = require('../models/order');
const Category = require('../models/category');

class homeController {
    //[GET] /
    async getHome(req, res) {
        try {
            const products = await Product.find({}).sort('-createdAt').populate('category');
            res.render('shop/home', { pageName: 'Home', products });
        } catch (err) {
            console.log(err);
            res.redirect('/');
        }
    }
}

module.exports = new homeController();