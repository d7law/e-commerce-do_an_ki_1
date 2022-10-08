var moment = require('moment');
const Product = require('../models/product');
const Catagory = require('../models/category');

class productController {
    //[GET] /product/
    async getAllProducts(req, res) {
        const successMsg = req.flash('success')[0];
        const errorMsg = req.flash('error')[0];
        const perPage = 8;
        let page = parseInt(req.query.page) || 1;
        try {
            const products = await Product.find({})
                .sort.skip(perPage * page - parePage)
                .limit(perPage)
                .populate('category');

            const count = await Product.count();

            res.render('shop/index', {
                pageName: 'All Products',
                products,
                successMsg,
                errorMsg,
                current: page,
                breadcrumbs: null,
                home: '/products/?',
                pages: Math.ceil(count / page),
            });
        } catch (err) {
            console.log(err);
            res.redirect('/');
        }
    }

    //[GET] /search
    async search(req, res) {
        const perPage = 8;
        let page = parseInt(req.query.page) || 1;
        const successMsg = req.flash('success')[0];
        const errorMsg = req.flash('error')[0];

        try {
            const products = await Product.find({
                title: { $regex: req.query.search, $options: 'i' },
            })
                .sort('-createdAt')
                .skip(perPage * page - perPage)
                .limit(perPage)
                .populate('category')
                .exec();
            const count = await Product.count({
                title: { $regex: req.query.search, $options: 'i' },
            });
            res.render('shop/index', {
                pageName: 'Search Results',
                products,
                successMsg,
                errorMsg,
                current: page,
                breadcrumbs: null,
                home: '/products/search?search=' + req.query.search + '&',
                pages: Math.ceil(count / perPage),
            });
        } catch (error) {
            console.log(error);
            res.redirect('/');
        }
    }
}

module.exports = new productController();
