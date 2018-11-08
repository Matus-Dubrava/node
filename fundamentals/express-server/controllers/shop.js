const Product = require('../models/product');

exports.getProducts = (req, res) => {
    Product.fetchAll()
        .then(products => {
            res.render('shop/product-list', {
                prods: products,
                path: '/products',
                pageTitle: 'Shop'
            });
        })
        .catch(err => {
            console.error(err);
        });
};

exports.getProduct = (req, res) => {
    const { productId } = req.params;

    Product.findById(productId)
        .then(product => {
            res.render('shop/product-detail', {
                path: '/products',
                pageTitle: product.title,
                product: product
            });
        })
        .catch(err => console.error(err));
};

exports.getIndex = (req, res) => {
    Product.fetchAll()
        .then(products => {
            res.render('shop/index', {
                prods: products,
                path: '/',
                pageTitle: 'All Products'
            });
        })
        .catch(err => {
            console.error(err);
        });
};

exports.getCart = (req, res) => {
    req.user
        .getCart()
        .then(products => {
            res.render('shop/cart', {
                pageTitle: 'Your Cart',
                path: '/cart',
                products
            });
        })
        .catch(err => {
            console.error(err);
        });
};

exports.postCart = (req, res) => {
    const { productId } = req.body;

    Product.findById(productId)
        .then(product => {
            return req.user.addToCart(product);
        })
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => {
            console.error(err);
        });
};

exports.postCartDeleteItem = (req, res) => {
    const { productId } = req.body;

    req.user
        .deleteItemFromCart(productId)
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => {
            console.error(err);
        });
};

exports.getCheckout = (req, res) => {
    res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout'
    });
};

exports.getOrders = (req, res) => {
    req.user
        .getOrders()
        .then(orders => {
            res.render('shop/orders', {
                path: '/orders',
                pageTitle: 'Orders',
                orders
            });
        })
        .catch(err => {
            console.error(err);
        });
};

exports.postOrder = (req, res) => {
    req.user
        .addOrder()
        .then(() => {
            res.redirect('/orders');
        })
        .catch(err => {
            console.error(err);
        });
};
