const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res) => {
    Product.findAll()
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
    Product.findAll()
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
    Cart.getCart().then(cart => {
        Product.fetchAll()
            .then(([products]) => {
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
            })
            .catch(err => {
                console.error(err);
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
