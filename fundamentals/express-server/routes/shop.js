const router = require('express').Router();

const {
    getProducts,
    getIndex,
    getCart,
    getCheckout,
    getOrders,
    getProduct,
    postCart
} = require('../controllers/shop');

router.get('/', getIndex);

router.get('/products', getProducts);

router.get('/cart', getCart);

router.post('/cart', postCart);

router.get('/checkout', getCheckout);

router.get('/orders', getOrders);

router.get('/products/:productId', getProduct);

module.exports = router;
