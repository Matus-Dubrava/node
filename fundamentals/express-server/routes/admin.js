const router = require('express').Router();
const path = require('path');

router.get('/add-product', (req, res) => {
	res.sendFile(path.join(__dirname, '..', 'views', 'add-product.html'));
});

router.post('/product', (req, res) => {
	console.log(req.body);
	res.redirect('/');
});

module.exports = router;
