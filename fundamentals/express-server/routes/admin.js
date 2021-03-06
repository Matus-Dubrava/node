const router = require('express').Router();

const {
    getAddProduct,
    postAddProduct,
    getAdminProducts,
    getEditProduct,
    postEditProduct,
    postDeleteProduct
} = require('../controllers/admin');

router.get('/add-product', getAddProduct);

router.post('/add-product', postAddProduct);

router.get('/products', getAdminProducts);

router.get('/edit-product/:productId', getEditProduct);

router.post('/edit-product', postEditProduct);

router.post('/delete-product', postDeleteProduct);

module.exports = router;
