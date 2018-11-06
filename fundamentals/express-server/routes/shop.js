const router = require('express').Router();

const {
    getProducts,
    getIndex,
    getCart,
    getCheckout,
    getOrders,
    getProduct,
    postCart,
    postCartDeleteItem,
    postOrder
} = require('../controllers/shop');

router.get('/', getIndex);

router.get('/products', getProducts);

router.get('/cart', getCart);

router.post('/cart', postCart);

router.get('/checkout', getCheckout);

router.get('/orders', getOrders);

router.get('/products/:productId', getProduct);

router.post('/cart-delete-item', postCartDeleteItem);

router.post('/create-order', postOrder);

module.exports = router;
