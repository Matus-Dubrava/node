const router = require('express').Router();
const path = require('path');

const rootDir = require('../util/path');
const adminData = require('./admin');

router.get('/', (req, res, next) => {
	const products = adminData.products;
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

module.exports = router;
