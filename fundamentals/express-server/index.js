const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const adminData = require('./routes/admin');
const shopRouter = require('./routes/shop');

const app = express();

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/admin', adminData.routes);
app.use(shopRouter);

app.use((req, res) => {
	res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

app.listen(process.env.PORT || 3000);
