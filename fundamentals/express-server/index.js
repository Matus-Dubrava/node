const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const { get404 } = require('./controllers/error');
const adminRoutes = require('./routes/admin');
const shopRouter = require('./routes/shop');
const { mongoConnect } = require('./util/database');

const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
    // User.findByPk(1)
    //     .then(user => {
    //         req.user = user;
    //         next();
    //     })
    //     .catch(err => {
    //         console.error(err);
    //     });
    console.log('request');
    next();
});

app.use('/admin', adminRoutes);
app.use(shopRouter);

app.use(get404);

mongoConnect(() => {
    app.listen(process.env.PORT || 3000);
});
