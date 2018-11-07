const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false
    });
};

exports.postAddProduct = (req, res) => {
    const { title, imageUrl, price, description } = req.body;
    const product = new Product(
        title,
        price,
        description,
        imageUrl,
        null,
        req.user._id
    );
    product
        .save()
        .then(result => {
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.error(err);
        });
};

exports.getEditProduct = (req, res) => {
    const { productId } = req.params;
    const editMode = req.query.edit;

    if (!editMode) {
        return res.redirect('/');
    }

    Product.findById(productId)
        .then(product => {
            if (!product) {
                return res.redirect('/');
            }

            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/edit-product',
                editing: editMode,
                product
            });
        })
        .catch(err => {
            console.error(err);
        });
};

exports.postEditProduct = (req, res) => {
    const { title, imageUrl, price, description, productId } = req.body;

    const product = new Product(title, price, description, imageUrl, productId);
    product
        .save()
        .then(result => {
            console.log('PRODUCT UPDATED!');
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.error(err);
        });
};

exports.getAdminProducts = (req, res) => {
    Product.fetchAll()
        .then(products => {
            res.render('admin/products', {
                prods: products,
                path: '/admin/products',
                pageTitle: 'Admin Products'
            });
        })
        .catch(err => {
            console.error(err);
        });
};

exports.postDeleteProduct = (req, res) => {
    const { productId } = req.body;

    Product.deleteById(productId)
        .then(() => {
            console.log('PRODUCT DESTROYED!!');
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.error(err);
        });
};
