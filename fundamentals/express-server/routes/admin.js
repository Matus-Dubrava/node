const router = require('express').Router();
const path = require('path');

const rootDir = require('../util/path');

const products = [];

router.get('/add-product', (req, res) => {
	res.render('add-product', {
		pageTitle: 'Add Product',
		path: '/admin/add-product',
		formsCSS: true,
		productCSS: true,
		activeProduct: true
	});
});

router.post('/add-product', (req, res) => {
	products.push({ title: req.body.title });
	res.redirect('/');
});

exports.routes = router;
exports.products = products;
