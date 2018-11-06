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
    req.user
        .getCart()
        .then(cart => {
            return cart.getProducts();
        })
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
    let fetchedCart;
    let newQuantity = 1;

    req.user
        .getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts({ where: { id: productId } });
        })
        .then(products => {
            let product;
            if (products.length) {
                product = products[0];
            }

            if (product) {
                const oldQuantity = product.cartItem.quantity;
                newQuantity = oldQuantity + 1;
            }

            return Product.findByPk(productId);
        })
        .then(product => {
            return fetchedCart.addProduct(product, {
                through: { quantity: newQuantity }
            });
        })
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => {
            console.error(err);
        });
};

exports.postCartDeleteItem = (req, res) => {
    const { productId } = req.body;

    req.user
        .getCart()
        .then(cart => {
            return cart.getProducts({ where: { id: productId } });
        })
        .then(products => {
            const product = products[0];
            return product.cartItem.destroy();
        })
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
    res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Orders'
    });
};
