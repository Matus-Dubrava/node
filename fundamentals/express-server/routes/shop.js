const router = require('express').Router();

const { getProducts } = require('../controllers/products');

router.get('/', getProducts);

module.exports = router;
