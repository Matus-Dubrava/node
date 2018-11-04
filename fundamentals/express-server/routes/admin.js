const router = require('express').Router();

const {
    getAddProduct,
    postAddProduct,
    getAdminProducts
} = require('../controllers/admin');

router.get('/add-product', getAddProduct);

router.post('/add-product', postAddProduct);

router.get('/products', getAdminProducts);

module.exports = router;
