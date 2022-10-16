const Product = require('../models/product');
const Cart = require('../models/cart');
const Order = require('../models/order');
const Category = require('../models/category');
const cart = require('../models/cart');

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

    //[GET] /shopping-cart
    async getCart(req, res) {
        try {
            //find the cart in db
            let cart_user;
            if (req.user) {
                cart_user = await Cart.findOne({ user: req.user._id });
            }
            //user logged and has a cart-> load user's cart from db
            if (req.user && cart.user) {
                req.session.cart = cart_user;
                res.render('shop/shopping-cart', {
                    cart: cart_user,
                    pageName: 'Giỏ hàng',
                    products: await productsFromCart(req.session.cart),
                });
            }
        } catch (err) {
            console.log(err);
            res.redirect('/');
        }
    }

    //[GET] /add-to-cart/:id
    async addToCart(req, res) {
        const productId = req.params.id;
        try {
            let user_cart;
            if (req.user) {
                user_cart = await Cart.findOne({ user: req.user._id });
            }
            let cart;
            if ((req.user && !user_cart && req.session.cart) || (!req.user && req.session.cart)) {
                cart = await new Cart(req.session.cart);
            } else if (!req.user || !user_cart) {
                cart = new Cart({});
            } else {
                cart = user_cart;
            }

            //add product to the cart
            const product = await Product.findById(productId);
            const itemIndex = cart.items.findIndex((p) => {
                p.productId == productId;
            });
            if (itemIndex > -1) {
                //if products exists in the cart, update the quantity
                cart.items[itemIndex].qty++;
                cart.items[itemIndex].price = cart.items[itemIndex].qty * product.price;
                cart.totalQty++;
                cart.totalCost += product.price;
            } else {
                //if products dont exists in cart, find it in db to get price and add new item
                cart.items.push({
                    productId: productId,
                    qty: 1,
                    price: product.price,
                    title: product.title,
                    productCode: product.productCode,
                });
                cart.totalQty++;
                cart.totalCost += product.price;
            }

            //if isLog, store the UID and save the cart
            if (req.user) {
                cart.user = req.user._id;
                await cart.save();
            }
            req.session.cart = cart;
            req.flash('success', 'Thêm sản phẩm vào Giỏ hàng thành công');
            res.redirect('req.header.referer');
        } catch (err) {
            console.log(err);
            res.redirect('/');
        }
    }

    //[GET] /reduce/:id reduce one item from Cart
    async reduceFromCart(req, res) {
        // if a user is logged in, reduce from the user's cart and save
        // else reduce from the session's cart
        const productId = req.params.id;
        let cart;
        try {
            if (req.user) {
                cart = await Cart.findOne({ user: req.user._id });
            } else if (req.session.cart) {
                cart = await new Cart(req.session.cart);
            }
            //find the item with product Id
            let itemIndex = cart.items.findIndex((p) => p.productId == productId);
            if (itemIndex > -1) {
                const product = await Product.findById(productId);
                cart.items[itemIndex].qty--;
                cart.items[itemIndex].price -= product.price;
                cart.totalQty--;
                cart.totalConst -= product.price;
                //if count = 0 => remove it
                if (cart.items[itemIndex] <= 0) {
                    await cart.items.remove({ _id: cart.items[itemIndex]._id });
                }
                req.session.cart = cart;
                //save cart if user is log
                if (req.user) {
                    await cart.save();
                }
                //del if qty = 0
                if (cart.totalQty <= 0) {
                    req.session.cart = null;
                    await Cart.findByIdAndRemove(cart._id);
                }
            }
            res.redirect(req.header.referer);
        } catch (err) {
            console.log(err);
            res.redirect('/');
        }
    }

    //[GET] /remove-all/:id remove all single product from cart
    async removeAllFromCart(req, res) {
        const productId = req.params.id;
        let cart;
        try {
            if(req.user){
                cart = await findOne({user: req.user._id})
            } else if(req.session.cart){
                cart = await new Cart(req.session.cart);
            }
            let itemIndex = cart.items.findIndex((p)=>p.productId == productId);
            if(itemIndex>-1){
                cart.totalQty -=cart.items[itemIndex].qty;
                cart.totalCost -=cart.items[index].price;
                await cart.items.remove({_id: cart.items[itemIndex]._id});
            }
            req.session.cart = cart;
            //save cart if user is log
            if(req.user){
                await cart.save();
            }
            if(cart.totalQty <=0){
                req.session.cart =null;
                await Cart.findByIdAndRemove(cart._id);
            }
            res.redirect(res.header.referer);
        } catch (err) {
            console.log(err);
            res.redirect('/');
        }
    }
}

// create products array to store the info of each product in the cart
async function productsFromCart(cart) {
    let products = [];
    for (var item of cart.items) {
        let foundProduct = (await Product.findById(item.productId).populate('category')).toObject();
        foundProduct['qty'] = item.qty;
        foundProduct['totalPrice'] = item.price;
        products.push(foundProduct);
    }
    return products;
}

module.exports = new homeController();
