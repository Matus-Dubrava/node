const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
    res.render('add-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        formsCSS: true,
        productCSS: true,
        activeProduct: true
    });
};

exports.postAddProduct = (req, res) => {
    const product = new Product(req.body.title);
    product.save();

    res.redirect('/');
};

exports.getProducts = (req, res) => {
    const result = Product.fetchAll();
    result.then(products => {
        res.render('shop', {
            prods: products,
            docTitle: 'Shop',
            path: '/',
            pageTitle: 'Shop',
            hasProducts: products.length > 0,
            activeShop: true,
            productCSS: true
        });
    });
};
