const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false
    });
};

exports.getEditProduct = (req, res) => {
    const { productId } = req.params;
    const editMode = req.query.edit;

    if (!editMode) {
        return res.redirect('/');
    }

    Product.findById(productId).then(product => {
        if (!product) {
            return res.redirect('/');
        }

        res.render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            editing: editMode,
            product
        });
    });
};

exports.postAddProduct = (req, res) => {
    const { title, imageUrl, price, description } = req.body;
    const product = new Product(null, title, imageUrl, description, price);

    product
        .save()
        .then(() => {
            res.redirect('/');
        })
        .catch(err => {
            console.error(err);
        });
};

exports.postEditProduct = (req, res) => {
    const { title, imageUrl, price, description, productId } = req.body;
    const product = new Product(productId, title, imageUrl, description, price);
    product.save();

    res.redirect('/admin/products');
};

exports.getAdminProducts = (req, res) => {
    const result = Product.fetchAll();
    result.then(products => {
        res.render('admin/products', {
            prods: products,
            path: '/admin/products',
            pageTitle: 'Admin Products'
        });
    });
};

exports.postDeleteProduct = (req, res) => {
    const { productId } = req.body;

    Product.deleteById(productId);
    res.redirect('/admin/products');
};
