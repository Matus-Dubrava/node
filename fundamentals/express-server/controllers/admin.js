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
    const product = new Product(title, price, description, imageUrl);
    product
        .save()
        .then(result => {
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.error(err);
        });
};

// exports.getEditProduct = (req, res) => {
//     const { productId } = req.params;
//     const editMode = req.query.edit;

//     if (!editMode) {
//         return res.redirect('/');
//     }

//     req.user
//         .getProducts({ where: { id: productId } })
//         .then(products => {
//             const product = products[0];
//             if (!product) {
//                 return res.redirect('/');
//             }

//             res.render('admin/edit-product', {
//                 pageTitle: 'Edit Product',
//                 path: '/admin/edit-product',
//                 editing: editMode,
//                 product
//             });
//         })
//         .catch(err => {
//             console.error(err);
//         });
// };

// exports.postEditProduct = (req, res) => {
//     const { title, imageUrl, price, description, productId } = req.body;

//     Product.findByPk(productId)
//         .then(product => {
//             product.title = title;
//             product.imageUrl = imageUrl;
//             product.price = price;
//             product.description = description;
//             return product.save();
//         })
//         .then(result => {
//             console.log('PRODUCT UPDATED!');
//             res.redirect('/admin/products');
//         })
//         .catch(err => {
//             console.error(err);
//         });
// };

// exports.getAdminProducts = (req, res) => {
//     req.user
//         .getProducts()
//         .then(products => {
//             res.render('admin/products', {
//                 prods: products,
//                 path: '/admin/products',
//                 pageTitle: 'Admin Products'
//             });
//         })
//         .catch(err => {
//             console.error(err);
//         });
// };

// exports.postDeleteProduct = (req, res) => {
//     const { productId } = req.body;

//     Product.findByPk(productId)
//         .then(product => {
//             return product.destroy();
//         })
//         .then(result => {
//             console.log('PRODUCT DESTROYED!!');
//             res.redirect('/admin/products');
//         })
//         .catch(err => {
//             console.error(err);
//         });
// };
