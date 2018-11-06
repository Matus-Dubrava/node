const Product = require('../models/product');
const Cart = require('../models/cart');

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
    Cart.getCart().then(cart => {
        Product.fetchAll().then(products => {
            let productsToDisplay = [];
            let totalPrice = 0;
            if (cart) {
                products.forEach(product => {
                    cart.products.forEach(inCartProd => {
                        if (product.id === inCartProd.id) {
                            const productWithQty = { ...product };
                            productWithQty.qty = inCartProd.qty;
                            productsToDisplay.push(productWithQty);
                        }
                    });
                });

                totalPrice = cart.totalPrice;
            }

            res.render('shop/cart', {
                pageTitle: 'Your Cart',
                path: '/cart',
                products: productsToDisplay,
                totalPrice
            });
        });
    });
};

exports.postCart = (req, res) => {
    const { productId } = req.body;

    Product.findById(productId).then(product => {
        Cart.addProduct(product.id, product.price);
    });

    res.redirect('/cart');
};

exports.postCartDeleteItem = (req, res) => {
    const { productId } = req.body;

    Product.findById(productId).then(product => {
        Cart.removeProduct(productId, product.price);
        res.redirect('/cart');
    });
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
