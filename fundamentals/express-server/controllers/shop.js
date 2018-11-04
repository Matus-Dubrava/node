const Product = require('../models/product');

exports.getProducts = (req, res) => {
    const result = Product.fetchAll();
    result.then(products => {
        res.render('shop/product-list', {
            prods: products,
            path: '/products',
            pageTitle: 'Shop'
        });
    });
};

exports.getProduct = (req, res) => {
    const { productId } = req.params;

    Product.findById(productId).then(product => {
        res.render('shop/product-detail', {
            path: '/products',
            pageTitle: product.title,
            product
        });
    });
};

exports.getIndex = (req, res) => {
    const result = Product.fetchAll();
    result.then(products => {
        res.render('shop/index', {
            prods: products,
            path: '/',
            pageTitle: 'All Products'
        });
    });
};

exports.getCart = (req, res) => {
    res.render('shop/cart', {
        pageTitle: 'Your Cart',
        path: '/cart'
    });
};

exports.postCart = (req, res) => {
    const { productId } = req.body;

    Product.findById(productId).then(product => {
        console.log(product);
    });

    res.redirect('/cart');
};

exports.getCheckout = (req, res) => {
    res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout'
    });
};

exports.getOrders = (req, res) => {
    res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Orders'
    });
};
