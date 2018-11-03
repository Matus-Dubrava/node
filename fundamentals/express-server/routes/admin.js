const router = require('express').Router();
const path = require('path');

const rootDir = require('../util/path');

router.get('/add-product', (req, res) => {
	res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
});

router.post('/product', (req, res) => {
	console.log(req.body);
	res.redirect('/');
});

module.exports = router;
