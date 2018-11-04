const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const adminData = require('./routes/admin');
const shopRouter = require('./routes/shop');
const expressHbs = require('express-handlebars');

const app = express();

app.engine(
	'hbs',
	expressHbs({
		layoutsDir: 'views/layouts/',
		defaultLayout: 'main',
		extname: 'hbs'
	})
);
app.set('view engine', 'hbs');
app.set('views', './views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/admin', adminData.routes);
app.use(shopRouter);

app.use((req, res) => {
	res.status(404).render('404', { pageTitle: 'Page Not Found' });
});

app.listen(process.env.PORT || 3000);
