var moment = require('moment');
const Product = require('../models/product');
const Category = require('../models/category');


class productController {
    //[GET] /product/
    async getAllProducts(req, res) {
        const successMsg = req.flash('success')[0];
        const errorMsg = req.flash('error')[0];
        const perPage = 8;
        let page = parseInt(req.query.page) || 1;
        try {
            const products = await Product.find({})
                .sort('-createdAt')
                .skip(perPage * page - perPage)
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

    //[GET] /:slug
    async getSlug(req, res) {
        const successMsg = req.flash('success')[0];
        const errorMsg = req.flash('error')[0];
        const perPage = 8;
        let page = parseInt(req.query.page) || 1;
        try {
            const foundCategory = await Category.findOne({ slug: req.params.slug });
            const allProducts = await Product.find({ category: foundCategory.id })
                .sort('-createdAt')
                .skip(perPage * page - perPage)
                .limit(perPage)
                .populate('category');
            const count = await Product.count({ category: foundCategory.id });

            res.render('shop/index', {
                pageName: foundCategory.title,
                currentCategory: foundCategory,
                products: allProducts,
                successMsg,
                errorMsg,
                current: page,
                breadcrumbs: req.breadcrumbs,
                home: '/products/' + req.params.slug.toString() + '/?',
                page: Math.ceil(count / perPage),
            });
        } catch (e) {
            console.log(e);
            return res.redirect('/');
        }
    }

    //[GET] /:slug/:id
    async getIdBySLug(req, res) {
        const successMsg = req.flash('success')[0];
        const errorMsg = req.flash('error')[0];
        try {
            const product = await Product.findById(req.params.id)
                .populate('category');
            res.render('shop/product', {
                pageName: product.title,
                product,
                successMsg,
                errorMsg,
                moment: moment,
            });
        } catch (err) {
            console.log(err);
            res.redirect('/');
        }
    }
}

module.exports = new productController();
