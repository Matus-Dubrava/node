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

    Product.findByPk(productId)
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

exports.postAddProduct = (req, res) => {
    const { title, imageUrl, price, description } = req.body;

    Product.create({ title, imageUrl, price, description })
        .then(result => {
            // console.log(result);
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.error(err);
        });
};

exports.postEditProduct = (req, res) => {
    const { title, imageUrl, price, description, productId } = req.body;

    Product.findByPk(productId)
        .then(product => {
            product.title = title;
            product.imageUrl = imageUrl;
            product.price = price;
            product.description = description;
            return product.save();
        })
        .then(result => {
            console.log('PRODUCT UPDATED!');
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.error(err);
        });
};

exports.getAdminProducts = (req, res) => {
    Product.findAll().then(products => {
        res.render('admin/products', {
            prods: products,
            path: '/admin/products',
            pageTitle: 'Admin Products'
        });
    });
};

exports.postDeleteProduct = (req, res) => {
    const { productId } = req.body;

    Product.findByPk(productId)
        .then(product => {
            return product.destroy();
        })
        .then(result => {
            console.log('PRODUCT DESTROYED!!');
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.error(err);
        });
};
